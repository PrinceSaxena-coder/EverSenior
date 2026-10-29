import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectModel } from '@nestjs/mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Model } from 'mongoose';

import {
  User,
  UserDocument,
  UserRole,
} from '../users/user.schema';

import { AuthUser } from './decorators/current-user.decorator';

interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  tokenVersion: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,

    @InjectModel(User.name)
    private readonly users: Model<UserDocument>,
  ) {
    super({
      jwtFromRequest:
        ExtractJwt.fromAuthHeaderAsBearerToken(),

      ignoreExpiration: false,

      secretOrKey:
        config.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(
    payload: JwtPayload,
  ): Promise<AuthUser> {
    const user = await this.users.findById(
      payload.sub,
    );

    if (!user || !user.isActive) {
      throw new UnauthorizedException(
        'Account is not available',
      );
    }

    if (
      user.tokenVersion !==
      payload.tokenVersion
    ) {
      throw new UnauthorizedException(
        'Token is no longer valid',
      );
    }

    return {
      id: String(user._id),
      email: user.email,
      role: user.role,
      name: user.name,
    };
  }
}