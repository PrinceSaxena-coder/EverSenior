
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';

import { Request } from 'express';

import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import {
  CurrentUser,
  AuthUser,
} from '../auth/decorators/current-user.decorator';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(
    private readonly bookingsService: BookingsService,
  ) {}

  @Post()
  async createBooking(
    @CurrentUser() user: AuthUser,
    @Body() body: CreateBookingDto,
    @Req() request: Request & { requestId?: string },
  ) {
    return this.bookingsService.createBooking(
      user,
      body,
      request.requestId ?? '',
    );
  }

  @Get()
  async getMyBookings(
    @CurrentUser() user: AuthUser,
  ) {
    return this.bookingsService.getMyBookings(user);
  }

  @Post(':id/confirm')
  async confirmBooking(
    @CurrentUser() user: AuthUser,
    @Param('id') bookingId: string,
    @Req() request: Request & { requestId?: string },
  ) {
    return this.bookingsService.confirmBooking(
      user,
      bookingId,
      request.requestId ?? '',
    );
  }

  @Post(':id/cancel')
  async cancelBooking(
    @CurrentUser() user: AuthUser,
    @Param('id') bookingId: string,
    @Req() request: Request & { requestId?: string },
  ) {
    return this.bookingsService.cancelBooking(
      user,
      bookingId,
      request.requestId ?? '',
    );
  }

  @Post(':id/complete')
  async completeBooking(
    @CurrentUser() user: AuthUser,
    @Param('id') bookingId: string,
    @Req() request: Request & { requestId?: string },
  ) {
    return this.bookingsService.completeBooking(
      user,
      bookingId,
      request.requestId ?? '',
    );
  }
}
