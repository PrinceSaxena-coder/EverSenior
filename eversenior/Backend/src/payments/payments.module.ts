import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Payment, PaymentSchema } from './schemas/payment.schema';
import { Booking, BookingSchema } from '../bookings/schemas/booking.schema';
import {
  Relationship,
  RelationshipSchema,
} from '../relationships/schemas/relationship.schema';
import {
  FamilyAccess,
  FamilyAccessSchema,
} from '../family/schemas/family-access.schema';

import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';

import { AuditModule } from '../common/audit/audit.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Payment.name,
        schema: PaymentSchema,
      },
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
    ]),
    AuditModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}