import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { Request } from 'express';

import { AuthService } from './auth.service';

import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

import {
  AuthUser,
  CurrentUser,
} from './decorators/current-user.decorator';

import { JwtAuthGuard } from './guards/jwt-auth.guard';

interface RequestWithId extends Request {
  requestId?: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  async signup(
    @Body() dto: SignupDto,
    @Req() req: RequestWithId,
  ) {
    return this.authService.signup(
      dto,
      req.requestId ?? 'unknown',
    );
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Req() req: RequestWithId,
  ) {
    return this.authService.login(
      dto,
      req.requestId ?? 'unknown',
    );
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(
    @CurrentUser() user: AuthUser,
  ) {
    return this.authService.me(user);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(
    @CurrentUser() user: AuthUser,
    @Req() req: RequestWithId,
  ) {
    return this.authService.logout(
      user,
      req.requestId ?? 'unknown',
    );
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @CurrentUser() user: AuthUser,
    @Body() dto: ChangePasswordDto,
    @Req() req: RequestWithId,
  ) {
    return this.authService.changePassword(
      user,
      dto,
      req.requestId ?? 'unknown',
    );
  }
}