import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import {
  Model,
  Types,
} from 'mongoose';

import {
  Booking,
  BookingDocument,
  BookingStatus,
  BookedByRole,
} from './schemas/booking.schema';

import {
  Relationship,
  RelationshipDocument,
  RelationshipStatus,
} from '../relationships/schemas/relationship.schema';

import {
  FamilyAccess,
  FamilyAccessDocument,
  FamilyPermission,
  FamilyAccessStatus,
} from '../family/schemas/family-access.schema';

import {
  User,
  UserDocument,
} from '../users/user.schema';

import {
  CompanionProfile,
  CompanionProfileDocument,
} from '../profiles/schemas/companion-profile.schema';

import {
  AuthUser,
} from '../auth/decorators/current-user.decorator';

import {
  CreateBookingDto,
} from './dto/create-booking.dto';

import {
  AuditService,
} from '../common/audit/audit.service';

import {
  AvailabilityService,
} from '../availability/availability.service';

import {
  calculateBookingPrice,
} from './booking-pricing';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name)
    private readonly bookingModel: Model<BookingDocument>,

    @InjectModel(Relationship.name)
    private readonly relationshipModel: Model<RelationshipDocument>,

    @InjectModel(FamilyAccess.name)
    private readonly familyAccessModel: Model<FamilyAccessDocument>,

    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,

    @InjectModel(CompanionProfile.name)
    private readonly companionProfileModel: Model<CompanionProfileDocument>,

    private readonly auditService: AuditService,

    private readonly availabilityService: AvailabilityService,
  ) {}

  async createBooking(
    user: AuthUser,
    dto: CreateBookingDto,
    requestId: string,
  ) {
    this.assertCanCreateBooking(user);

    if (!Types.ObjectId.isValid(dto.relationshipId)) {
      throw new BadRequestException('Invalid relationship ID');
    }

    const relationshipId = this.toObjectId(dto.relationshipId);

    const relationship = await this.relationshipModel.findById(
      relationshipId,
    );

    if (!relationship) {
      throw new NotFoundException('Relationship not found');
    }

    if (relationship.status !== RelationshipStatus.ESTABLISHED) {
      throw new BadRequestException(
        'Bookings are only allowed for established relationships',
      );
    }

    const seniorId = relationship.seniorId;
    const companionId = relationship.companionId;

    let bookedByRole: BookedByRole;

    if (user.role === 'senior') {
      if (seniorId.toString() !== user.id) {
        throw new ForbiddenException(
          'You can only create bookings for yourself',
        );
      }

      bookedByRole = BookedByRole.SENIOR;
    } else {
      const familyAccess = await this.familyAccessModel.findOne({
        seniorId,
        familyUserId: this.toObjectId(user.id),
        status: FamilyAccessStatus.ACTIVE,
        permissions: FamilyPermission.VIEW_BOOKINGS,
      });

      if (!familyAccess) {
        throw new ForbiddenException(
          'You do not have permission to create bookings for this senior',
        );
      }

      bookedByRole = BookedByRole.FAMILY;
    }

    const bookingDate = this.parseDate(dto.date);

    const calculatedDuration = this.calculateDurationMinutes(
      dto.startTime,
      dto.endTime,
    );

    if (calculatedDuration !== dto.durationMinutes) {
      throw new BadRequestException(
        'Duration does not match start and end time',
      );
    }

    const isAvailable =
      await this.availabilityService.isCompanionAvailable(
        companionId.toString(),
        bookingDate,
        dto.startTime,
        dto.endTime,
      );

    if (!isAvailable) {
      throw new BadRequestException(
        'Companion is not available during the requested time',
      );
    }

    const overlappingBooking = await this.findOverlappingBooking(
      companionId,
      bookingDate,
      dto.startTime,
      dto.endTime,
    );

    if (overlappingBooking) {
      throw new BadRequestException(
        'Companion already has a booking during the requested time',
      );
    }

    const price = calculateBookingPrice(
      dto.serviceType,
      dto.durationMinutes,
    );

    const booking = await this.bookingModel.create({
      seniorId,
      companionId,
      relationshipId,
      bookedById: this.toObjectId(user.id),
      bookedByRole,
      date: bookingDate,
      startTime: dto.startTime,
      endTime: dto.endTime,
      durationMinutes: dto.durationMinutes,
      serviceType: dto.serviceType,
      price,
      status: BookingStatus.REQUESTED,
      notes: dto.notes ?? '',
    });

    await this.auditService.record({
      action: 'booking.created',
      actorId: user.id,
      actorRole: user.role,
      requestId,
      resourceType: 'booking',
      resourceId: booking.id,
      metadata: {
        seniorId: seniorId.toString(),
        companionId: companionId.toString(),
        relationshipId: relationshipId.toString(),
        date: dto.date,
        startTime: dto.startTime,
        endTime: dto.endTime,
        durationMinutes: dto.durationMinutes,
        serviceType: dto.serviceType,
        price,
        bookedByRole,
      },
    });

    return this.toResponse(booking);
  }

  async getMyBookings(user: AuthUser) {
    const bookings = await this.getBookingsForUser(user);

    const responses = await Promise.all(
      bookings.map((booking) => this.toResponse(booking)),
    );

    return { bookings: responses };
  }

  async confirmBooking(
    user: AuthUser,
    bookingId: string,
    requestId: string,
  ) {
    if (user.role !== 'companion') {
      throw new ForbiddenException(
        'Only companions can confirm bookings',
      );
    }

    const booking = await this.findBooking(bookingId);

    if (booking.companionId.toString() !== user.id) {
      throw new ForbiddenException(
        'You can only confirm your own bookings',
      );
    }

    if (booking.status !== BookingStatus.REQUESTED) {
      throw new BadRequestException(
        'Only requested bookings can be confirmed',
      );
    }

    booking.status = BookingStatus.CONFIRMED;
    booking.confirmedAt = new Date();

    await booking.save();

    await this.auditService.record({
      action: 'booking.confirmed',
      actorId: user.id,
      actorRole: user.role,
      requestId,
      resourceType: 'booking',
      resourceId: booking.id,
    });

    return this.toResponse(booking);
  }

  async cancelBooking(
    user: AuthUser,
    bookingId: string,
    requestId: string,
  ) {
    const booking = await this.findBooking(bookingId);

    await this.assertCanModifyBooking(user, booking);

    if (
      booking.status !== BookingStatus.REQUESTED &&
      booking.status !== BookingStatus.CONFIRMED
    ) {
      throw new BadRequestException(
        'Only requested or confirmed bookings can be cancelled',
      );
    }

    booking.status = BookingStatus.CANCELLED;
    booking.cancelledAt = new Date();

    await booking.save();

    await this.auditService.record({
      action: 'booking.cancelled',
      actorId: user.id,
      actorRole: user.role,
      requestId,
      resourceType: 'booking',
      resourceId: booking.id,
    });

    return this.toResponse(booking);
  }

  async completeBooking(
    user: AuthUser,
    bookingId: string,
    requestId: string,
  ) {
    if (user.role !== 'companion') {
      throw new ForbiddenException(
        'Only companions can complete bookings',
      );
    }

    const booking = await this.findBooking(bookingId);

    if (booking.companionId.toString() !== user.id) {
      throw new ForbiddenException(
        'You can only complete your own bookings',
      );
    }

    if (booking.status !== BookingStatus.CONFIRMED) {
      throw new BadRequestException(
        'Only confirmed bookings can be completed',
      );
    }

    booking.status = BookingStatus.COMPLETED;
    booking.completedAt = new Date();

    await booking.save();

    await this.auditService.record({
      action: 'booking.completed',
      actorId: user.id,
      actorRole: user.role,
      requestId,
      resourceType: 'booking',
      resourceId: booking.id,
    });

    return this.toResponse(booking);
  }

  private async getBookingsForUser(user: AuthUser) {
    if (user.role === 'senior') {
      return this.bookingModel
        .find({ seniorId: this.toObjectId(user.id) })
        .sort({ date: -1, startTime: -1 });
    }

    if (user.role === 'companion') {
      return this.bookingModel
        .find({ companionId: this.toObjectId(user.id) })
        .sort({ date: -1, startTime: -1 });
    }

    if (user.role === 'family') {
      const accesses = await this.familyAccessModel.find({
        familyUserId: this.toObjectId(user.id),
        status: FamilyAccessStatus.ACTIVE,
        permissions: FamilyPermission.VIEW_BOOKINGS,
      });

      const seniorIds = accesses.map((access) => access.seniorId);

      return this.bookingModel
        .find({ seniorId: { $in: seniorIds } })
        .sort({ date: -1, startTime: -1 });
    }

    if (user.role === 'admin') {
      return this.bookingModel
        .find()
        .sort({ date: -1, startTime: -1 });
    }

    throw new ForbiddenException(
      'You are not allowed to view bookings',
    );
  }

  private async findOverlappingBooking(
    companionId: Types.ObjectId,
    date: Date,
    startTime: string,
    endTime: string,
  ) {
    return this.bookingModel.findOne({
      companionId,
      date,
      status: {
        $in: [
          BookingStatus.REQUESTED,
          BookingStatus.CONFIRMED,
        ],
      },
      startTime: { $lt: endTime },
      endTime: { $gt: startTime },
    });
  }

  private async assertCanModifyBooking(
    user: AuthUser,
    booking: BookingDocument,
  ) {
    if (user.role === 'admin') {
      return;
    }

    if (
      user.role === 'senior' &&
      booking.seniorId.toString() === user.id
    ) {
      return;
    }

    if (
      user.role === 'companion' &&
      booking.companionId.toString() === user.id
    ) {
      return;
    }

    if (user.role === 'family') {
      const access = await this.familyAccessModel.findOne({
        seniorId: booking.seniorId,
        familyUserId: this.toObjectId(user.id),
        status: FamilyAccessStatus.ACTIVE,
        permissions: FamilyPermission.VIEW_BOOKINGS,
      });

      if (access) {
        return;
      }
    }

    throw new ForbiddenException(
      'You are not allowed to modify this booking',
    );
  }

  private assertCanCreateBooking(user: AuthUser) {
    if (user.role !== 'senior' && user.role !== 'family') {
      throw new ForbiddenException(
        'Only seniors or authorized family members can create bookings',
      );
    }
  }

  private async findBooking(bookingId: string) {
    if (!Types.ObjectId.isValid(bookingId)) {
      throw new BadRequestException('Invalid booking ID');
    }

    const booking = await this.bookingModel.findById(bookingId);

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  private parseDate(value: string) {
    const date = new Date(`${value}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException('Invalid booking date');
    }

    return date;
  }

  private calculateDurationMinutes(
    startTime: string,
    endTime: string,
  ) {
    const start = this.timeToMinutes(startTime);
    const end = this.timeToMinutes(endTime);

    if (end <= start) {
      throw new BadRequestException(
        'End time must be after start time',
      );
    }

    const duration = end - start;

    if (duration < 15 || duration > 720) {
      throw new BadRequestException(
        'Booking duration must be between 15 and 720 minutes',
      );
    }

    return duration;
  }

  private timeToMinutes(value: string) {
    const [hours, minutes] = value.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private toObjectId(value: string) {
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException('Invalid ID');
    }

    return new Types.ObjectId(value);
  }

  private async toResponse(booking: BookingDocument) {
    const companionId = booking.companionId.toString();

    const [user, profile] = await Promise.all([
      this.userModel
        .findById(booking.companionId)
        .select('name')
        .lean(),

      this.companionProfileModel
        .findOne({ userId: booking.companionId })
        .select(
          'age gender city languages interests hobbies personalityTraits availability bio experience isVerified',
        )
        .lean(),
    ]);

    return {
      id: booking.id,
      seniorId: booking.seniorId.toString(),

      // Keep the original field for frontend compatibility.
      companionId,

      // Companion details for the frontend.
      companion: {
        id: companionId,
        name: user?.name ?? 'Companion',
        age: profile?.age ?? null,
        gender: profile?.gender ?? null,
        city: profile?.city ?? null,
        languages: profile?.languages ?? [],
        interests: profile?.interests ?? [],
        hobbies: profile?.hobbies ?? [],
        personalityTraits: profile?.personalityTraits ?? [],
        availability: profile?.availability ?? [],
        bio: profile?.bio ?? '',
        experience: profile?.experience ?? [],
        isVerified: profile?.isVerified ?? false,
        photoUrl: null,
      },

      relationshipId: booking.relationshipId.toString(),
      bookedById: booking.bookedById.toString(),
      bookedByRole: booking.bookedByRole,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
      durationMinutes: booking.durationMinutes,
      serviceType: booking.serviceType,
      price: booking.price,
      status: booking.status,
      notes: booking.notes,
      confirmedAt: booking.confirmedAt,
      cancelledAt: booking.cancelledAt,
      completedAt: booking.completedAt,
    };
  }
}