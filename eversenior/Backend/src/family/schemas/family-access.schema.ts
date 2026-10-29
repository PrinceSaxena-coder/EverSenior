import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';

import {
  HydratedDocument,
  Types,
} from 'mongoose';

export type FamilyAccessDocument =
  HydratedDocument<FamilyAccess>;

export enum FamilyAccessStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  REVOKED = 'revoked',
}

export enum FamilyPermission {
  VIEW_PROFILE = 'view_profile',
  VIEW_RELATIONSHIP = 'view_relationship',
  VIEW_BOOKINGS = 'view_bookings',
  VIEW_PAYMENTS = 'view_payments',
  SAFETY_ALERTS = 'safety_alerts',
}

@Schema({
  timestamps: true,
  collection: 'family_access',
})
export class FamilyAccess {
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
  familyUserId!: Types.ObjectId;

  @Prop({
    required: true,
    trim: true,
    maxlength: 50,
  })
  relationship!: string;

  @Prop({
    type: [String],
    enum: Object.values(FamilyPermission),
    default: [
      FamilyPermission.VIEW_PROFILE,
      FamilyPermission.VIEW_RELATIONSHIP,
      FamilyPermission.VIEW_BOOKINGS,
      FamilyPermission.SAFETY_ALERTS,
    ],
  })
  permissions!: FamilyPermission[];

  @Prop({
    required: true,
    enum: Object.values(FamilyAccessStatus),
    default: FamilyAccessStatus.PENDING,
    index: true,
  })
  status!: FamilyAccessStatus;

  @Prop()
  acceptedAt?: Date;

  @Prop()
  revokedAt?: Date;
}

export const FamilyAccessSchema =
  SchemaFactory.createForClass(FamilyAccess);

FamilyAccessSchema.index(
  {
    seniorId: 1,
    familyUserId: 1,
  },
  {
    unique: true,
  },
);