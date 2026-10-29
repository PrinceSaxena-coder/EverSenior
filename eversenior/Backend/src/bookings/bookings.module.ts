
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  Booking,
  BookingSchema,
} from './schemas/booking.schema';

import {
  Relationship,
  RelationshipSchema,
} from '../relationships/schemas/relationship.schema';

import {
  FamilyAccess,
  FamilyAccessSchema,
} from '../family/schemas/family-access.schema';

import {
  User,
  UserSchema,
} from '../users/user.schema';

import {
  CompanionProfile,
  CompanionProfileSchema,
} from '../profiles/schemas/companion-profile.schema';

import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';

import { AuditModule } from '../common/audit/audit.module';
import { AvailabilityModule } from '../availability/availability.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Booking.name,
        schema: BookingSchema,
      },
      {
        name: Relationship.name,
        schema: RelationshipSchema,
      },
      {
        name: FamilyAccess.name,
        schema: FamilyAccessSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: CompanionProfile.name,
        schema: CompanionProfileSchema,
      },
    ]),
    AuditModule,
    AvailabilityModule,
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
