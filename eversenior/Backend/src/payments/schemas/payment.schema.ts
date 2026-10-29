import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';

import {
  HydratedDocument,
  Types,
} from 'mongoose';

export type PaymentDocument =
  HydratedDocument<Payment>;

export enum PaymentStatus {
  CREATED = 'created',
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded',
}

export enum PaymentGateway {
  RAZORPAY = 'razorpay',
}

@Schema({
  timestamps: true,
  collection: 'payments',
})
export class Payment {
  @Prop({
    type: Types.ObjectId,
    ref: 'Booking',
    required: true,
    unique: true,
    index: true,
  })
  bookingId!: Types.ObjectId;

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
    required: true,
    min: 0,
  })
  amount!: number;

  @Prop({
    required: true,
    default: 'INR',
    uppercase: true,
  })
  currency!: string;

  @Prop({
    required: true,
    enum: Object.values(PaymentStatus),
    default: PaymentStatus.CREATED,
    index: true,
  })
  status!: PaymentStatus;

  @Prop({
    required: true,
    enum: Object.values(PaymentGateway),
    default: PaymentGateway.RAZORPAY,
  })
  gateway!: PaymentGateway;

  @Prop({
    trim: true,
    sparse: true,
    index: true,
  })
  gatewayOrderId?: string;

  @Prop({
    trim: true,
    sparse: true,
    index: true,
  })
  gatewayPaymentId?: string;

  @Prop({
    trim: true,
    sparse: true,
  })
  gatewaySignature?: string;

  @Prop()
  paidAt?: Date;

  @Prop()
  refundedAt?: Date;

  @Prop({
    min: 0,
  })
  refundedAmount?: number;

  @Prop({
    maxlength: 1000,
    trim: true,
  })
  failureReason?: string;
}

export const PaymentSchema =
  SchemaFactory.createForClass(Payment);

PaymentSchema.index({
  seniorId: 1,
  createdAt: -1,
});

PaymentSchema.index({
  companionId: 1,
  createdAt: -1,
});

PaymentSchema.index({
  status: 1,
  createdAt: -1,
});