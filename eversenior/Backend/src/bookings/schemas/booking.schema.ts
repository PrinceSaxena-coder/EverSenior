
import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';

import {
  HydratedDocument,
  Types,
} from 'mongoose';

import { BookingServiceType } from '../dto/create-booking.dto';

export type BookingDocument = HydratedDocument<Booking>;

export enum BookingStatus {
  REQUESTED = 'requested',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export enum BookedByRole {
  SENIOR = 'senior',
  FAMILY = 'family',
}

@Schema({
  timestamps: true,
  collection: 'bookings',
})
export class Booking {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  seniorId!: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  companionId!: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Relationship',
    required: true,
    index: true,
  })
  relationshipId!: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  bookedById!: Types.ObjectId;

  @Prop({
    required: true,
    enum: Object.values(BookedByRole),
  })
  bookedByRole!: BookedByRole;

  @Prop({
    required: true,
  })
  date!: Date;

  @Prop({
    required: true,
  })
  startTime!: string;

  @Prop({
    required: true,
  })
  endTime!: string;

  @Prop({
    required: true,
    min: 15,
    max: 720,
  })
  durationMinutes!: number;

  @Prop({
    required: true,
    enum: Object.values(BookingServiceType),
  })
  serviceType!: BookingServiceType;

  @Prop({
    required: true,
    min: 0,
  })
  price!: number;

  @Prop({
    required: true,
    enum: Object.values(BookingStatus),
    default: BookingStatus.REQUESTED,
    index: true,
  })
  status!: BookingStatus;

  @Prop({
    maxlength: 1000,
    trim: true,
    default: '',
  })
  notes!: string;

  @Prop()
  confirmedAt?: Date;

  @Prop()
  cancelledAt?: Date;

  @Prop()
  completedAt?: Date;
}

export const BookingSchema =
  SchemaFactory.createForClass(Booking);

BookingSchema.index({
  seniorId: 1,
  date: 1,
});

BookingSchema.index({
  companionId: 1,
  date: 1,
});

BookingSchema.index({
  relationshipId: 1,
  date: 1,
});
