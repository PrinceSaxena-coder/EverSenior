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
  Availability,
  AvailabilityDocument,
} from './schemas/availability.schema';

import { CreateAvailabilityDto } from './dto/create-availability.dto';

import {
  AuthUser,
} from '../auth/decorators/current-user.decorator';

import { AuditService } from '../common/audit/audit.service';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectModel(Availability.name)
    private readonly availabilityModel: Model<AvailabilityDocument>,

    private readonly auditService: AuditService,
  ) {}

  async createAvailability(
    user: AuthUser,
    dto: CreateAvailabilityDto,
    requestId: string,
  ) {
    this.assertCompanion(user);

    this.validateTimeRange(
      dto.startTime,
      dto.endTime,
    );

    const companionId =
      this.toObjectId(user.id);

    const existing =
      await this.availabilityModel.findOne({
        companionId,
        day: dto.day,
        startTime: dto.startTime,
        endTime: dto.endTime,
      });

    if (existing) {
      throw new BadRequestException(
        'This availability slot already exists',
      );
    }

    const overlapping =
      await this.availabilityModel.findOne({
        companionId,
        day: dto.day,
        isActive: true,
        startTime: {
          $lt: dto.endTime,
        },
        endTime: {
          $gt: dto.startTime,
        },
      });

    if (overlapping) {
      throw new BadRequestException(
        'This availability slot overlaps an existing slot',
      );
    }

    const availability =
      await this.availabilityModel.create({
        companionId,
        day: dto.day,
        startTime: dto.startTime,
        endTime: dto.endTime,
        isActive: true,
      });

    await this.auditService.record({
      action: 'availability.created',
      actorId: user.id,
      requestId,
      metadata: {
        availabilityId: availability.id,
        day: dto.day,
        startTime: dto.startTime,
        endTime: dto.endTime,
      },
    });

    return this.toResponse(availability);
  }

  async getMyAvailability(
    user: AuthUser,
  ) {
    this.assertCompanion(user);

    const companionId =
      this.toObjectId(user.id);

    const availability =
      await this.availabilityModel
        .find({
          companionId,
        })
        .sort({
          day: 1,
          startTime: 1,
        });

    return {
      availability:
        availability.map(
          (slot) => this.toResponse(slot),
        ),
    };
  }

  async getCompanionAvailability(
    user: AuthUser,
    companionId: string,
  ) {
    if (!Types.ObjectId.isValid(companionId)) {
      throw new BadRequestException(
        'Invalid companion ID',
      );
    }

    const targetCompanionId =
      this.toObjectId(companionId);

    const availability =
      await this.availabilityModel
        .find({
          companionId: targetCompanionId,
          isActive: true,
        })
        .sort({
          day: 1,
          startTime: 1,
        });

    return {
      companionId,
      availability:
        availability.map(
          (slot) => this.toResponse(slot),
        ),
    };
  }

  async deactivateAvailability(
    user: AuthUser,
    availabilityId: string,
    requestId: string,
  ) {
    this.assertCompanion(user);

    const availability =
      await this.findAvailability(
        availabilityId,
      );

    if (
      availability.companionId.toString() !==
      user.id
    ) {
      throw new ForbiddenException(
        'You can only modify your own availability',
      );
    }

    availability.isActive = false;

    await availability.save();

    await this.auditService.record({
      action: 'availability.deactivated',
      actorId: user.id,
      requestId,
      metadata: {
        availabilityId,
      },
    });

    return this.toResponse(availability);
  }

  /**
   * Checks whether a companion is available
   * for the complete requested booking time.
   *
   * Example:
   * Availability: Monday 10:00 - 12:00
   *
   * Booking: 10:30 - 11:30 -> true
   * Booking: 11:30 - 12:30 -> false
   * Booking: 09:00 - 10:30 -> false
   */
  async isCompanionAvailable(
    companionId: string,
    date: Date,
    startTime: string,
    endTime: string,
  ): Promise<boolean> {
    if (!Types.ObjectId.isValid(companionId)) {
      throw new BadRequestException(
        'Invalid companion ID',
      );
    }

    this.validateTimeRange(
      startTime,
      endTime,
    );

    const dayNames = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ] as const;

    const day =
      dayNames[date.getDay()];

    const companionObjectId =
      this.toObjectId(companionId);

    const availability =
      await this.availabilityModel.findOne({
        companionId:
          companionObjectId,
        day,
        isActive: true,
        startTime: {
          $lte: startTime,
        },
        endTime: {
          $gte: endTime,
        },
      });

    return !!availability;
  }

  private async findAvailability(
    availabilityId: string,
  ) {
    if (
      !Types.ObjectId.isValid(
        availabilityId,
      )
    ) {
      throw new BadRequestException(
        'Invalid availability ID',
      );
    }

    const availability =
      await this.availabilityModel.findById(
        availabilityId,
      );

    if (!availability) {
      throw new NotFoundException(
        'Availability slot not found',
      );
    }

    return availability;
  }

  private assertCompanion(
    user: AuthUser,
  ) {
    if (user.role !== 'companion') {
      throw new ForbiddenException(
        'Only companions can manage availability',
      );
    }
  }

  private validateTimeRange(
    startTime: string,
    endTime: string,
  ) {
    const start =
      this.timeToMinutes(startTime);

    const end =
      this.timeToMinutes(endTime);

    if (end <= start) {
      throw new BadRequestException(
        'End time must be after start time',
      );
    }
  }

  private timeToMinutes(
    value: string,
  ) {
    const [hours, minutes] =
      value.split(':').map(Number);

    return (
      hours * 60 +
      minutes
    );
  }

  private toObjectId(
    value: string,
  ) {
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException(
        'Invalid user ID',
      );
    }

    return new Types.ObjectId(value);
  }

  private toResponse(
    availability: AvailabilityDocument,
  ) {
    return {
      id: availability.id,
      companionId:
        availability.companionId.toString(),
      day: availability.day,
      startTime:
        availability.startTime,
      endTime:
        availability.endTime,
      isActive:
        availability.isActive,
    };
  }
}