import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  User,
  UserDocument,
  UserRole,
} from '../users/user.schema';

import {
  SeniorProfile,
  SeniorProfileDocument,
} from './schemas/senior-profile.schema';

import {
  CompanionProfile,
  CompanionProfileDocument,
} from './schemas/companion-profile.schema';

import { UpdateSeniorProfileDto } from './dto/update-senior-profile.dto';
import { UpdateCompanionProfileDto } from './dto/update-companion-profile.dto';
import { AuthUser } from '../auth/decorators/current-user.decorator';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectModel(User.name)
    private readonly users: Model<UserDocument>,

    @InjectModel(SeniorProfile.name)
    private readonly seniorProfiles: Model<SeniorProfileDocument>,

    @InjectModel(CompanionProfile.name)
    private readonly companionProfiles: Model<CompanionProfileDocument>,
  ) {}

  async getMyProfile(user: AuthUser) {
    if (!Types.ObjectId.isValid(user.id)) {
      throw new NotFoundException('User not found');
    }

    const userId = new Types.ObjectId(user.id);

    if (user.role === UserRole.SENIOR) {
      const profile = await this.seniorProfiles
        .findOne({ userId })
        .lean();

      return {
        type: 'senior',
        profile,
      };
    }

    if (user.role === UserRole.COMPANION) {
      const profile = await this.companionProfiles
        .findOne({ userId })
        .lean();

      return {
        type: 'companion',
        profile,
      };
    }

    throw new ForbiddenException(
      'This account does not have a personal profile',
    );
  }

  async updateSeniorProfile(
    user: AuthUser,
    dto: UpdateSeniorProfileDto,
  ) {
    this.ensureRole(user, UserRole.SENIOR);

    if (!Types.ObjectId.isValid(user.id)) {
      throw new NotFoundException('User not found');
    }

    const userId = new Types.ObjectId(user.id);

    const profile = await this.seniorProfiles.findOneAndUpdate(
      { userId },
      {
        $set: dto,
        $setOnInsert: { userId },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      },
    );

    return {
      type: 'senior',
      profile,
    };
  }

  async updateCompanionProfile(
    user: AuthUser,
    dto: UpdateCompanionProfileDto,
  ) {
    this.ensureRole(user, UserRole.COMPANION);

    if (!Types.ObjectId.isValid(user.id)) {
      throw new NotFoundException('User not found');
    }

    const userId = new Types.ObjectId(user.id);

    const profile = await this.companionProfiles.findOneAndUpdate(
      { userId },
      {
        $set: dto,
        $setOnInsert: { userId },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      },
    );

    return {
      type: 'companion',
      profile,
    };
  }

  async getSeniorProfile(
    userId: string,
    requester: AuthUser,
  ) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new NotFoundException('Senior profile not found');
    }

    if (
      requester.role !== UserRole.SENIOR ||
      requester.id !== userId
    ) {
      throw new ForbiddenException(
        'You are not authorized to view this senior profile',
      );
    }

    const profile = await this.seniorProfiles
      .findOne({
        userId: new Types.ObjectId(userId),
      })
      .lean();

    if (!profile) {
      throw new NotFoundException('Senior profile not found');
    }

    return {
      type: 'senior',
      profile,
    };
  }

  async getCompanionProfile(
    userId: string,
    requester: AuthUser,
  ) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new NotFoundException('Companion profile not found');
    }

    if (
      requester.role !== UserRole.SENIOR &&
      requester.role !== UserRole.COMPANION
    ) {
      throw new ForbiddenException(
        'You are not authorized to view this companion profile',
      );
    }

    const profile = await this.companionProfiles
      .findOne({
        userId: new Types.ObjectId(userId),
      })
      .lean();

    if (!profile) {
      throw new NotFoundException('Companion profile not found');
    }

    return {
      type: 'companion',
      profile,
    };
  }

  private ensureRole(
    user: AuthUser,
    expectedRole: UserRole,
  ) {
    if (user.role !== expectedRole) {
      throw new ForbiddenException(
        `Only ${expectedRole} accounts can manage this profile`,
      );
    }
  }
}