import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';

import { ProfilesService } from './profiles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import {
  AuthUser,
  CurrentUser,
} from '../auth/decorators/current-user.decorator';

import { UpdateSeniorProfileDto } from './dto/update-senior-profile.dto';
import { UpdateCompanionProfileDto } from './dto/update-companion-profile.dto';

@Controller('profiles')
@UseGuards(JwtAuthGuard)
export class ProfilesController {
  constructor(
    private readonly profilesService: ProfilesService,
  ) {}

  @Get('me')
  async getMyProfile(
    @CurrentUser() user: AuthUser,
  ) {
    return this.profilesService.getMyProfile(user);
  }

  @Put('me/senior')
  async updateSeniorProfile(
    @CurrentUser() user: AuthUser,
    @Body() dto: UpdateSeniorProfileDto,
  ) {
    return this.profilesService.updateSeniorProfile(
      user,
      dto,
    );
  }

  @Put('me/companion')
  async updateCompanionProfile(
    @CurrentUser() user: AuthUser,
    @Body() dto: UpdateCompanionProfileDto,
  ) {
    return this.profilesService.updateCompanionProfile(
      user,
      dto,
    );
  }

  @Get('senior/:userId')
  async getSeniorProfile(
    @CurrentUser() requester: AuthUser,
    @Param('userId') userId: string,
  ) {
    return this.profilesService.getSeniorProfile(
      userId,
      requester,
    );
  }

  @Get('companion/:userId')
  async getCompanionProfile(
    @CurrentUser() requester: AuthUser,
    @Param('userId') userId: string,
  ) {
    return this.profilesService.getCompanionProfile(
      userId,
      requester,
    );
  }
}