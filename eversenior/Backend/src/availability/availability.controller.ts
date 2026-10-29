import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { Request } from 'express';

import { AvailabilityService } from './availability.service';
import { CreateAvailabilityDto } from './dto/create-availability.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import {
  AuthUser,
  CurrentUser,
} from '../auth/decorators/current-user.decorator';

@Controller('availability')
@UseGuards(JwtAuthGuard)
export class AvailabilityController {
  constructor(
    private readonly availabilityService: AvailabilityService,
  ) {}

  @Post()
  async createAvailability(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateAvailabilityDto,
    @Req() request: Request & {
      requestId?: string;
    },
  ) {
    return this.availabilityService.createAvailability(
      user,
      dto,
      request.requestId ?? 'unknown',
    );
  }

  @Get('me')
  async getMyAvailability(
    @CurrentUser() user: AuthUser,
  ) {
    return this.availabilityService.getMyAvailability(
      user,
    );
  }

  @Get('companions/:companionId')
  async getCompanionAvailability(
    @CurrentUser() user: AuthUser,
    @Param('companionId') companionId: string,
  ) {
    return this.availabilityService.getCompanionAvailability(
      user,
      companionId,
    );
  }

  @Patch(':id/deactivate')
  async deactivateAvailability(
    @CurrentUser() user: AuthUser,
    @Param('id') availabilityId: string,
    @Req() request: Request & {
      requestId?: string;
    },
  ) {
    return this.availabilityService.deactivateAvailability(
      user,
      availabilityId,
      request.requestId ?? 'unknown',
    );
  }
}