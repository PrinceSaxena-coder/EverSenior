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

import { FamilyService } from './family.service';

import {
  AuthUser,
  CurrentUser,
} from '../auth/decorators/current-user.decorator';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import {
  CreateFamilyAccessDto,
} from './dto/create-family-access.dto';

import {
  UpdateFamilyPermissionsDto,
} from './dto/update-family-permissions.dto';

@Controller('family')
@UseGuards(JwtAuthGuard)
export class FamilyController {
  constructor(
    private readonly familyService: FamilyService,
  ) {}

  @Post('access')
  async createAccess(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateFamilyAccessDto,
    @Req()
    request: Request & {
      requestId?: string;
    },
  ) {
    return this.familyService.createAccess(
      user,
      dto,
      request.requestId ?? 'unknown',
    );
  }

  @Get('access')
  async getMyAccess(
    @CurrentUser() user: AuthUser,
  ) {
    return this.familyService.getMyAccess(
      user,
    );
  }

  @Patch('access/:id/respond')
  async respondToAccess(
    @CurrentUser() user: AuthUser,
    @Param('id') accessId: string,
    @Body()
    body: {
      accepted: boolean;
    },
    @Req()
    request: Request & {
      requestId?: string;
    },
  ) {
    return this.familyService.respondToAccess(
      user,
      accessId,
      body.accepted,
      request.requestId ?? 'unknown',
    );
  }

  @Patch('access/:id/revoke')
  async revokeAccess(
    @CurrentUser() user: AuthUser,
    @Param('id') accessId: string,
    @Req()
    request: Request & {
      requestId?: string;
    },
  ) {
    return this.familyService.revokeAccess(
      user,
      accessId,
      request.requestId ?? 'unknown',
    );
  }

  @Patch('access/:id/permissions')
  async updatePermissions(
    @CurrentUser() user: AuthUser,
    @Param('id') accessId: string,
    @Body()
    dto: UpdateFamilyPermissionsDto,
    @Req()
    request: Request & {
      requestId?: string;
    },
  ) {
    return this.familyService.updatePermissions(
      user,
      accessId,
      dto,
      request.requestId ?? 'unknown',
    );
  }

  @Get('seniors/:seniorId/profile')
  async getSeniorProfile(
    @CurrentUser() user: AuthUser,
    @Param('seniorId') seniorId: string,
  ) {
    return this.familyService.getSeniorProfileForFamily(
      user,
      seniorId,
    );
  }

  @Get('seniors/:seniorId/relationship')
  async getSeniorRelationship(
    @CurrentUser() user: AuthUser,
    @Param('seniorId') seniorId: string,
  ) {
    return this.familyService.getSeniorRelationshipForFamily(
      user,
      seniorId,
    );
  }
}