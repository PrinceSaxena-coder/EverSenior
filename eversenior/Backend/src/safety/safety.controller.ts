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

import {
  SosService,
} from './sos.service';

import {
  JwtAuthGuard,
} from '../auth/guards/jwt-auth.guard';

import {
  AuthUser,
  CurrentUser,
} from '../auth/decorators/current-user.decorator';

import {
  CreateSosDto,
} from './dto/create-sos.dto';

import {
  ResolveSosDto,
} from './dto/resolve-sos.dto';

@Controller('safety')
@UseGuards(JwtAuthGuard)
export class SafetyController {
  constructor(
    private readonly sosService: SosService,
  ) {}

  @Post(
    'seniors/:seniorId/sos',
  )
  async createSos(
    @CurrentUser()
    user: AuthUser,

    @Param('seniorId')
    seniorId: string,

    @Body()
    dto: CreateSosDto,

    @Req()
    request: Request & {
      requestId?: string;
    },
  ) {
    return this.sosService.createSos(
      user,
      seniorId,
      dto,
      request.requestId ??
        'unknown',
    );
  }

  @Get(
    'seniors/:seniorId/sos',
  )
  async getSosForSenior(
    @CurrentUser()
    user: AuthUser,

    @Param('seniorId')
    seniorId: string,
  ) {
    return this.sosService.getSosForSenior(
      user,
      seniorId,
    );
  }

  @Get(
    'seniors/:seniorId/sos/active',
  )
  async getActiveSos(
    @CurrentUser()
    user: AuthUser,

    @Param('seniorId')
    seniorId: string,
  ) {
    return this.sosService.getActiveSos(
      user,
      seniorId,
    );
  }

  @Patch(
    'sos/:id/acknowledge',
  )
  async acknowledgeSos(
    @CurrentUser()
    user: AuthUser,

    @Param('id')
    sosId: string,

    @Req()
    request: Request & {
      requestId?: string;
    },
  ) {
    return this.sosService.acknowledgeSos(
      user,
      sosId,
      request.requestId ??
        'unknown',
    );
  }

  @Patch(
    'sos/:id/resolve',
  )
  async resolveSos(
    @CurrentUser()
    user: AuthUser,

    @Param('id')
    sosId: string,

    @Body()
    dto: ResolveSosDto,

    @Req()
    request: Request & {
      requestId?: string;
    },
  ) {
    return this.sosService.resolveSos(
      user,
      sosId,
      dto,
      request.requestId ??
        'unknown',
    );
  }
}