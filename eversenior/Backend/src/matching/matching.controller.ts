import {
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';

import { MatchingService } from './matching.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import {
  AuthUser,
  CurrentUser,
} from '../auth/decorators/current-user.decorator';

@Controller('matching')
@UseGuards(JwtAuthGuard)
export class MatchingController {
  constructor(
    private readonly matchingService: MatchingService,
  ) {}

  @Get('companions')
  async getCompanionMatches(
    @CurrentUser() user: AuthUser,
  ) {
    return this.matchingService.getCompanionMatches(user);
  }

  // Family members may request matches only for a senior who has
  // explicitly granted them active profile-view permission.
  @Get('family/:seniorId/companions')
  async getFamilyCompanionMatches(
    @CurrentUser() user: AuthUser,
    @Param('seniorId') seniorId: string,
  ) {
    return this.matchingService.getCompanionMatchesForFamily(
      user,
      seniorId,
    );
  }
}