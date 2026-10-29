
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { Request } from 'express';

import { PaymentsService } from './payments.service';

import { CreatePaymentDto } from './dto/create-payment.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import {
  CurrentUser,
  AuthUser,
} from '../auth/decorators/current-user.decorator';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
  ) {}

  // Create a Razorpay order for an existing booking.
  // The backend will determine the amount from the booking.
  @Post()
  async createPayment(
    @CurrentUser() user: AuthUser,
    @Body() body: CreatePaymentDto,
    @Req() request: Request & { requestId?: string },
  ) {
    return this.paymentsService.createPayment(
      user,
      body.bookingId,
      request.requestId ?? '',
    );
  }

  // Verify the payment response returned by Razorpay Checkout.
  @Post('verify')
  async verifyPayment(
    @CurrentUser() user: AuthUser,
    @Body() body: VerifyPaymentDto,
    @Req() request: Request & { requestId?: string },
  ) {
    return this.paymentsService.verifyPayment(
      user,
      body.paymentId,
      body.razorpayPaymentId,
      body.razorpayOrderId,
      body.razorpaySignature,
      request.requestId ?? '',
    );
  }

  // Get payments visible to the currently authenticated user.
  @Get()
  async getMyPayments(
    @CurrentUser() user: AuthUser,
  ) {
    return this.paymentsService.getMyPayments(user);
  }
}
