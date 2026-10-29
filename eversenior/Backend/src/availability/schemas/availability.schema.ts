import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AvailabilityDocument = HydratedDocument<Availability>;

export enum AvailabilityDay {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday',
}

@Schema({
  timestamps: true,
  collection: 'companion_availability',
})
export class Availability {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  companionId!: Types.ObjectId;

  @Prop({
    required: true,
    enum: Object.values(AvailabilityDay),
  })
  day!: AvailabilityDay;

  @Prop({
    required: true,
    trim: true,
  })
  startTime!: string;

  @Prop({
    required: true,
    trim: true,
  })
  endTime!: string;

  @Prop({
    default: true,
  })
  isActive!: boolean;
}

export const AvailabilitySchema =
  SchemaFactory.createForClass(Availability);

AvailabilitySchema.index({
  companionId: 1,
  day: 1,
  startTime: 1,
  endTime: 1,
});