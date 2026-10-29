
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

import { AuditService } from '../common/audit/audit.service';

import {
  User,
  UserDocument,
  UserRole,
} from '../users/user.schema';

import { AuthUser } from './decorators/current-user.decorator';

import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

const BCRYPT_ROUNDS = 12;

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly users: Model<UserDocument>,

    private readonly jwt: JwtService,

    private readonly config: ConfigService,

    private readonly audit: AuditService,
  ) {}

  async signup(
    dto: SignupDto,
    requestId: string,
  ) {
    const email = dto.email.trim().toLowerCase();

    // Normalize Indian mobile numbers.
    let phone = dto.phone.replace(/\D/g, '');

    if (phone.length === 12 && phone.startsWith('91')) {
      phone = phone.slice(2);
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      throw new ConflictException(
        'Enter a valid 10-digit Indian mobile number',
      );
    }

    // Admin accounts must not be created through public signup.
    if (dto.role === UserRole.ADMIN) {
      throw new ConflictException(
        'Admin accounts cannot be created through signup',
      );
    }

    // Check email uniqueness.
    const existingEmail = await this.users.exists({
      email,
    });

    if (existingEmail) {
      throw new ConflictException(
        'An account with this email already exists',
      );
    }

    // Check phone uniqueness.
    const existingPhone = await this.users.exists({
      phone,
    });

    if (existingPhone) {
      throw new ConflictException(
        'An account with this phone number already exists',
      );
    }

    const passwordHash = await bcrypt.hash(
      dto.password,
      BCRYPT_ROUNDS,
    );

    let user: UserDocument;

    try {
      user = await this.users.create({
        name: dto.name.trim(),
        email,
        phone,
        role: dto.role,
        passwordHash,
        tokenVersion: 0,
        isActive: true,
      });
    } catch (error) {
      // MongoDB duplicate-key protection.
      // This also handles simultaneous signup requests.
      if (
        (error as { code?: number }).code === 11000
      ) {
        const keyPattern = (
          error as {
            keyPattern?: Record<string, number>;
          }
        ).keyPattern;

        if (keyPattern?.phone) {
          throw new ConflictException(
            'An account with this phone number already exists',
          );
        }

        if (keyPattern?.email) {
          throw new ConflictException(
            'An account with this email already exists',
          );
        }

        throw new ConflictException(
          'An account with this email or phone number already exists',
        );
      }

      throw error;
    }

    const authUser = this.toAuthUser(user);

    const accessToken = await this.issueToken(user);

    await this.audit.record({
      action: 'auth.signup',
      requestId,
      actorId: authUser.id,
      actorRole: authUser.role,
      resourceType: 'user',
      resourceId: authUser.id,
    });

    return {
      user: authUser,
      accessToken,
    };
  }

  async login(
    dto: LoginDto,
    requestId: string,
  ) {
    const email = dto.email.trim().toLowerCase();

    const user = await this.users
      .findOne({ email })
      .select('+passwordHash');

    if (
      !user ||
      !user.isActive ||
      !(await bcrypt.compare(
        dto.password,
        user.passwordHash,
      ))
    ) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    const authUser = this.toAuthUser(user);

    const accessToken = await this.issueToken(user);

    await this.audit.record({
      action: 'auth.login',
      requestId,
      actorId: authUser.id,
      actorRole: authUser.role,
      resourceType: 'user',
      resourceId: authUser.id,
    });

    return {
      user: authUser,
      accessToken,
    };
  }

  async me(user: AuthUser) {
    return {
      user,
    };
  }

  async logout(
    user: AuthUser,
    requestId: string,
  ) {
    await this.users.updateOne(
      {
        _id: user.id,
      },
      {
        $inc: {
          tokenVersion: 1,
        },
      },
    );

    await this.audit.record({
      action: 'auth.logout',
      requestId,
      actorId: user.id,
      actorRole: user.role,
      resourceType: 'user',
      resourceId: user.id,
    });

    return {
      success: true,
    };
  }

  async changePassword(
    user: AuthUser,
    dto: ChangePasswordDto,
    requestId: string,
  ) {
    const account = await this.users
      .findById(user.id)
      .select('+passwordHash');

    if (!account || !account.isActive) {
      throw new UnauthorizedException(
        'Account is not available',
      );
    }

    const currentMatches = await bcrypt.compare(
      dto.currentPassword,
      account.passwordHash,
    );

    if (!currentMatches) {
      throw new UnauthorizedException(
        'Current password is incorrect',
      );
    }

    if (dto.currentPassword === dto.newPassword) {
      throw new ConflictException(
        'New password must be different from current password',
      );
    }

    account.passwordHash = await bcrypt.hash(
      dto.newPassword,
      BCRYPT_ROUNDS,
    );

    account.tokenVersion += 1;

    await account.save();

    await this.audit.record({
      action: 'auth.password_changed',
      requestId,
      actorId: user.id,
      actorRole: user.role,
      resourceType: 'user',
      resourceId: user.id,
    });

    return {
      success: true,
      message:
        'Password changed. Please sign in again.',
    };
  }

  private async issueToken(
    user: UserDocument,
  ) {
    const payload = {
      sub: String(user._id),
      email: user.email,
      role: user.role,
      tokenVersion: user.tokenVersion,
    };

    return this.jwt.signAsync(payload);
  }

  private toAuthUser(
    user: UserDocument,
  ): AuthUser {
    return {
      id: String(user._id),
      email: user.email,
      role: user.role,
      name: user.name,
    };
  }
}
