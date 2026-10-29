import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';

import {
  HydratedDocument,
  Types,
} from 'mongoose';

export type SosEventDocument =
  HydratedDocument<SosEvent>;

export enum SosEventStatus {
  TRIGGERED = 'triggered',
  ACKNOWLEDGED = 'acknowledged',
  RESOLVED = 'resolved',
  CANCELLED = 'cancelled',
}

export enum SosTriggeredByRole {
  SENIOR = 'senior',
  FAMILY = 'family',
  COMPANION = 'companion',
  ADMIN = 'admin',
}

export enum SosEventType {
  EMERGENCY = 'emergency',
  MEDICAL = 'medical',
  SAFETY = 'safety',
  FALL = 'fall',
  OTHER = 'other',
}

@Schema({
  timestamps: true,
  collection: 'sos_events',
})
export class SosEvent {
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
  triggeredById!: Types.ObjectId;

  @Prop({
    required: true,
    enum: Object.values(
      SosTriggeredByRole,
    ),
  })
  triggeredByRole!: SosTriggeredByRole;

  @Prop({
    required: true,
    enum: Object.values(
      SosEventType,
    ),
  })
  type!: SosEventType;

  @Prop({
    maxlength: 1000,
    trim: true,
    default: '',
  })
  message!: string;

  @Prop({
    type: Number,
    min: -90,
    max: 90,
  })
  latitude?: number;

  @Prop({
    type: Number,
    min: -180,
    max: 180,
  })
  longitude?: number;

  @Prop({
    trim: true,
    maxlength: 200,
  })
  locationLabel?: string;

  @Prop({
    required: true,
    enum: Object.values(
      SosEventStatus,
    ),
    default:
      SosEventStatus.TRIGGERED,
    index: true,
  })
  status!: SosEventStatus;

  @Prop()
  acknowledgedAt?: Date;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
  })
  acknowledgedById?: Types.ObjectId;

  @Prop()
  resolvedAt?: Date;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
  })
  resolvedById?: Types.ObjectId;

  @Prop({
    maxlength: 1000,
    trim: true,
  })
  resolutionNote?: string;
}

export const SosEventSchema =
  SchemaFactory.createForClass(
    SosEvent,
  );

SosEventSchema.index({
  seniorId: 1,
  createdAt: -1,
});

SosEventSchema.index({
  status: 1,
  createdAt: -1,
});

SosEventSchema.index({
  triggeredById: 1,
  createdAt: -1,
});