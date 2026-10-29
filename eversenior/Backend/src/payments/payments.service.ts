
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';

import {
  Payment,
  PaymentDocument,
  PaymentGateway,
  PaymentStatus,
} from './schemas/payment.schema';

import {
  Booking,
  BookingDocument,
  BookingStatus,
} from '../bookings/schemas/booking.schema';

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

import { AuthUser } from '../auth/decorators/current-user.decorator';
import { AuditService } from '../common/audit/audit.service';

@Injectable()
export class PaymentsService {
  private readonly razorpay: Razorpay;

  constructor(
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<PaymentDocument>,

    @InjectModel(Booking.name)
    private readonly bookingModel: Model<BookingDocument>,

    @InjectModel(Relationship.name)
    private readonly relationshipModel: Model<RelationshipDocument>,

    @InjectModel(FamilyAccess.name)
    private readonly familyAccessModel: Model<FamilyAccessDocument>,

    private readonly auditService: AuditService,

    private readonly configService: ConfigService,
  ) {
    this.razorpay = new Razorpay({
      key_id: this.configService.getOrThrow<string>(
        'RAZORPAY_KEY_ID',
      ),
      key_secret: this.configService.getOrThrow<string>(
        'RAZORPAY_KEY_SECRET',
      ),
    });
  }

  async createPayment(
    user: AuthUser,
    bookingId: string,
    requestId: string,
  ) {
    if (!Types.ObjectId.isValid(bookingId)) {
      throw new BadRequestException('Invalid booking ID');
    }

    const booking = await this.bookingModel.findById(bookingId);

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (
      booking.status !== BookingStatus.REQUESTED &&
      booking.status !== BookingStatus.CONFIRMED
    ) {
      throw new BadRequestException(
        'Payment can only be created for requested or confirmed bookings',
      );
    }

    const relationship = await this.relationshipModel.findById(
      booking.relationshipId,
    );

    if (!relationship) {
      throw new NotFoundException('Relationship not found');
    }

    if (relationship.status !== RelationshipStatus.ESTABLISHED) {
      throw new BadRequestException(
        'Payment is only allowed for established relationships',
      );
    }

    await this.assertCanPay(user, booking);

    // Never accept the payment amount from the frontend.
    // Use the price saved on the booking by the backend.
    const amount = booking.price;

    if (!Number.isFinite(amount) || amount <= 0) {
      throw new BadRequestException(
        'The booking has an invalid price',
      );
    }

    const amountInPaise = Math.round(amount * 100);

    if (!Number.isSafeInteger(amountInPaise)) {
      throw new BadRequestException(
        'The booking price is outside the supported payment range',
      );
    }

    // The payment schema permits only one payment document per booking.
    // Reuse an existing unpaid document when a user retries checkout.
    let payment = await this.paymentModel.findOne({
      bookingId: booking._id,
    });

    if (payment?.status === PaymentStatus.PAID) {
      throw new BadRequestException(
        'This booking has already been paid for',
      );
    }

    if (payment && payment.amount !== amount) {
      throw new BadRequestException(
        'The saved payment amount does not match the booking price',
      );
    }

    // Reuse an existing pending order so the user can reopen Checkout.
    if (
      payment &&
      payment.status === PaymentStatus.PENDING &&
      payment.gatewayOrderId
    ) {
      return {
        ...this.toResponse(payment),
        razorpay: {
          keyId: this.configService.getOrThrow<string>(
            'RAZORPAY_KEY_ID',
          ),
          orderId: payment.gatewayOrderId,
          amount: amountInPaise,
          currency: 'INR',
        },
      };
    }

    // Create a new Razorpay order for a first attempt or a retry
    // after a previously failed payment.
    const razorpayOrder = await this.razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `booking_${booking.id}`,
      notes: {
        bookingId: booking.id,
        seniorId: booking.seniorId.toString(),
        companionId: booking.companionId.toString(),
      },
    });

    if (!payment) {
      payment = await this.paymentModel.create({
        bookingId: booking._id,
        seniorId: booking.seniorId,
        companionId: booking.companionId,
        amount,
        currency: 'INR',
        status: PaymentStatus.PENDING,
        gateway: PaymentGateway.RAZORPAY,
        gatewayOrderId: razorpayOrder.id,
      });
    } else {
      payment.amount = amount;
      payment.currency = 'INR';
      payment.status = PaymentStatus.PENDING;
      payment.gateway = PaymentGateway.RAZORPAY;
      payment.gatewayOrderId = razorpayOrder.id;

      // Clear details from any previous failed attempt.
      payment.gatewayPaymentId = undefined;
      payment.gatewaySignature = undefined;
      payment.paidAt = undefined;
      payment.failureReason = undefined;

      await payment.save();
    }

    await this.auditService.record({
      action: 'payment.order_created',
      actorId: user.id,
      actorRole: user.role,
      requestId,
      resourceType: 'payment',
      resourceId: payment.id,
      metadata: {
        bookingId: booking.id,
        amount,
        amountInPaise,
        currency: 'INR',
        gateway: PaymentGateway.RAZORPAY,
        gatewayOrderId: razorpayOrder.id,
      },
    });

    return {
      ...this.toResponse(payment),
      razorpay: {
        keyId: this.configService.getOrThrow<string>(
          'RAZORPAY_KEY_ID',
        ),
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },
    };
  }

  async verifyPayment(
    user: AuthUser,
    paymentId: string,
    razorpayPaymentId: string,
    razorpayOrderId: string,
    razorpaySignature: string,
    requestId: string,
  ) {
    if (!Types.ObjectId.isValid(paymentId)) {
      throw new BadRequestException('Invalid payment ID');
    }

    const payment = await this.paymentModel.findById(paymentId);

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    await this.assertCanVerifyPayment(user, payment);

    // Idempotent response for a repeated successful verification.
    if (
      payment.status === PaymentStatus.PAID &&
      payment.gatewayPaymentId === razorpayPaymentId &&
      payment.gatewayOrderId === razorpayOrderId
    ) {
      return this.toResponse(payment);
    }

    if (payment.status === PaymentStatus.PAID) {
      throw new BadRequestException(
        'Payment is already marked as paid',
      );
    }

    if (!payment.gatewayOrderId) {
      throw new BadRequestException(
        'Razorpay order ID is missing for this payment',
      );
    }

    if (payment.gatewayOrderId !== razorpayOrderId) {
      throw new BadRequestException(
        'Razorpay order ID does not match this payment',
      );
    }

    const keySecret = this.configService.getOrThrow<string>(
      'RAZORPAY_KEY_SECRET',
    );

    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest();

    let receivedSignature: Buffer;

    try {
      receivedSignature = Buffer.from(
        razorpaySignature,
        'hex',
      );
    } catch {
      throw new BadRequestException(
        'Invalid Razorpay payment signature',
      );
    }

    if (
      receivedSignature.length !== expectedSignature.length ||
      !crypto.timingSafeEqual(
        expectedSignature,
        receivedSignature,
      )
    ) {
      await this.auditService.record({
        action: 'payment.verification_failed',
        actorId: user.id,
        actorRole: user.role,
        requestId,
        resourceType: 'payment',
        resourceId: payment.id,
        metadata: {
          gateway: PaymentGateway.RAZORPAY,
          gatewayOrderId: razorpayOrderId,
        },
      });

      throw new BadRequestException(
        'Invalid Razorpay payment signature',
      );
    }

    // Confirm the payment with Razorpay before marking it as paid.
    // A valid signature alone does not establish that the payment
    // has reached the captured state.
    const gatewayPayment = await this.razorpay.payments.fetch(
      razorpayPaymentId,
    );

    if (gatewayPayment.order_id !== razorpayOrderId) {
      throw new BadRequestException(
        'The Razorpay payment does not belong to this order',
      );
    }

    if (gatewayPayment.status !== 'captured') {
      throw new BadRequestException(
        'Razorpay has not confirmed that this payment was captured',
      );
    }

    if (
      gatewayPayment.amount !== Math.round(payment.amount * 100) ||
      gatewayPayment.currency !== payment.currency
    ) {
      throw new BadRequestException(
        'The captured payment amount or currency does not match the booking',
      );
    }

    payment.status = PaymentStatus.PAID;
    payment.gatewayPaymentId = razorpayPaymentId;
    payment.gatewaySignature = razorpaySignature;
    payment.paidAt = new Date();

    await payment.save();

    await this.auditService.record({
      action: 'payment.verified',
      actorId: user.id,
      actorRole: user.role,
      requestId,
      resourceType: 'payment',
      resourceId: payment.id,
      metadata: {
        bookingId: payment.bookingId.toString(),
        gateway: PaymentGateway.RAZORPAY,
        gatewayOrderId: razorpayOrderId,
        gatewayPaymentId: razorpayPaymentId,
      },
    });

    return this.toResponse(payment);
  }

  async getMyPayments(user: AuthUser) {
    let payments: PaymentDocument[];

    if (user.role === 'senior') {
      payments = await this.paymentModel
        .find({
          seniorId: this.toObjectId(user.id),
        })
        .sort({ createdAt: -1 });
    } else if (user.role === 'companion') {
      payments = await this.paymentModel
        .find({
          companionId: this.toObjectId(user.id),
        })
        .sort({ createdAt: -1 });
    } else if (user.role === 'family') {
      const accesses = await this.familyAccessModel.find({
        familyUserId: this.toObjectId(user.id),
        status: FamilyAccessStatus.ACTIVE,
        permissions: FamilyPermission.VIEW_PAYMENTS,
      });

      const seniorIds = accesses.map(
        (access) => access.seniorId,
      );

      payments = await this.paymentModel
        .find({
          seniorId: { $in: seniorIds },
        })
        .sort({ createdAt: -1 });
    } else {
      throw new ForbiddenException(
        'You are not allowed to view payments',
      );
    }

    return {
      payments: payments.map((payment) =>
        this.toResponse(payment),
      ),
    };
  }

  private async assertCanPay(
    user: AuthUser,
    booking: BookingDocument,
  ) {
    if (user.role === 'senior') {
      if (booking.seniorId.toString() !== user.id) {
        throw new ForbiddenException(
          'You can only pay for your own bookings',
        );
      }

      return;
    }

    if (user.role === 'family') {
      const access = await this.familyAccessModel.findOne({
        seniorId: booking.seniorId,
        familyUserId: this.toObjectId(user.id),
        status: FamilyAccessStatus.ACTIVE,
        permissions: FamilyPermission.VIEW_PAYMENTS,
      });

      if (!access) {
        throw new ForbiddenException(
          'You do not have payment permission for this senior',
        );
      }

      return;
    }

    throw new ForbiddenException(
      'Only seniors or authorized family members can make payments',
    );
  }

  private async assertCanVerifyPayment(
    user: AuthUser,
    payment: PaymentDocument,
  ) {
    if (user.role === 'senior') {
      if (payment.seniorId.toString() !== user.id) {
        throw new ForbiddenException(
          'You can only verify your own payments',
        );
      }

      return;
    }

    if (user.role === 'family') {
      const access = await this.familyAccessModel.findOne({
        seniorId: payment.seniorId,
        familyUserId: this.toObjectId(user.id),
        status: FamilyAccessStatus.ACTIVE,
        permissions: FamilyPermission.VIEW_PAYMENTS,
      });

      if (!access) {
        throw new ForbiddenException(
          'You do not have payment permission for this senior',
        );
      }

      return;
    }

    throw new ForbiddenException(
      'Only seniors or authorized family members can verify payments',
    );
  }

  private toObjectId(value: string) {
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException('Invalid user ID');
    }

    return new Types.ObjectId(value);
  }

  private toResponse(payment: PaymentDocument) {
    return {
      id: payment.id,
      bookingId: payment.bookingId.toString(),
      seniorId: payment.seniorId.toString(),
      companionId: payment.companionId.toString(),
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      gateway: payment.gateway,
      gatewayOrderId: payment.gatewayOrderId,
      gatewayPaymentId: payment.gatewayPaymentId,
      paidAt: payment.paidAt,
      refundedAt: payment.refundedAt,
      refundedAmount: payment.refundedAmount,
      failureReason: payment.failureReason,
    };
  }
}
