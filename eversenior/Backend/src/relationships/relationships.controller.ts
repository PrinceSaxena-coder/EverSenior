import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { RelationshipsService } from './relationships.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import {
  AuthUser,
  CurrentUser,
} from '../auth/decorators/current-user.decorator';

import { CreateIntroductionDto } from './dto/create-introduction.dto';

import { RespondIntroductionDto } from './dto/respond-introduction.dto';

import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Controller('relationships')
@UseGuards(JwtAuthGuard)
export class RelationshipsController {
  constructor(
    private readonly relationshipsService: RelationshipsService,
  ) {}

  // ============================================================
  // GET RELATIONSHIPS
  // ============================================================

  @Get()
  async getMyRelationships(
    @CurrentUser() user: AuthUser,
  ) {
    return this.relationshipsService.getMyRelationships(
      user,
    );
  }

  // ============================================================
  // CREATE INTRODUCTION
  // ============================================================

  @Post('introduction')
  async createIntroduction(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateIntroductionDto,
  ) {
    return this.relationshipsService.createIntroduction(
      user,
      dto,
    );
  }

  // ============================================================
  // RESPOND TO INTRODUCTION
  // ============================================================

  @Patch(':id/respond')
  async respondToIntroduction(
    @CurrentUser() user: AuthUser,
    @Param('id') relationshipId: string,
    @Body() dto: RespondIntroductionDto,
  ) {
    return this.relationshipsService.respondToIntroduction(
      user,
      relationshipId,
      dto,
    );
  }

  // ============================================================
  // START TRIAL
  // ============================================================

  @Patch(':id/trial/start')
  async startTrial(
    @CurrentUser() user: AuthUser,
    @Param('id') relationshipId: string,
  ) {
    return this.relationshipsService.startTrial(
      user,
      relationshipId,
    );
  }

  // ============================================================
  // COMPLETE TRIAL
  // ============================================================

  @Patch(':id/trial/complete')
  async completeTrial(
    @CurrentUser() user: AuthUser,
    @Param('id') relationshipId: string,
  ) {
    return this.relationshipsService.completeTrial(
      user,
      relationshipId,
    );
  }

  // ============================================================
  // SUBMIT FEEDBACK
  // ============================================================

  @Post(':id/feedback')
  async submitFeedback(
    @CurrentUser() user: AuthUser,
    @Param('id') relationshipId: string,
    @Body() dto: CreateFeedbackDto,
  ) {
    return this.relationshipsService.submitFeedback(
      user,
      relationshipId,
      dto,
    );
  }
}