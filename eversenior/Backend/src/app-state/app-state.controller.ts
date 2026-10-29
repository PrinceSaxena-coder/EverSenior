import { Body, Controller, Delete, Get, Param, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthUser, CurrentUser } from '../auth/decorators/current-user.decorator';
import { AppStateService } from './app-state.service';

@Controller('app-state')
@UseGuards(JwtAuthGuard)
export class AppStateController {
  constructor(private readonly appState: AppStateService) {}

  @Get('me')
  getMine(@CurrentUser() user: AuthUser) {
    return this.appState.get(user);
  }

  @Put('me')
  updateMine(@CurrentUser() user: AuthUser, @Body() body: { data: Record<string, unknown> }) {
    return this.appState.update(user, body?.data);
  }

  @Delete('me/:key')
  removeKey(@CurrentUser() user: AuthUser, @Param('key') key: string) {
    return this.appState.remove(user, key);
  }
}
