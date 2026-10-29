
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { User, UserDocument, UserRole } from '../users/user.schema';
import {
  SeniorProfile,
  SeniorProfileDocument,
} from '../profiles/schemas/senior-profile.schema';
import {
  CompanionProfile,
  CompanionProfileDocument,
} from '../profiles/schemas/companion-profile.schema';
import { AuthUser } from '../auth/decorators/current-user.decorator';
import {
  FamilyAccess,
  FamilyAccessDocument,
  FamilyAccessStatus,
  FamilyPermission,
} from '../family/schemas/family-access.schema';

type SeniorMatchingProfile = {
  userId: Types.ObjectId;
  city?: string;
  languages?: string[];
  interests?: string[];
  hobbies?: string[];
  personalityTraits?: string[];
  lifestylePreferences?: string[];
  companionshipNeeds?: string[];
  preferredCompanionTraits?: string[];
  availability?: string[];
};

type CompanionMatch = {
  companionId: string;
  name: string;
  age: number;
  gender: string;
  city: string;
  languages: string[];
  interests: string[];
  hobbies: string[];
  personalityTraits: string[];
  availability: string[];
  bio: string;
  experience: string[];
  isVerified: boolean;
  score: number;
  matchReasons: string[];
};

@Injectable()
export class MatchingService {
  constructor(
    @InjectModel(User.name)
    private readonly users: Model<UserDocument>,

    @InjectModel(SeniorProfile.name)
    private readonly seniorProfiles: Model<SeniorProfileDocument>,

    @InjectModel(CompanionProfile.name)
    private readonly companionProfiles: Model<CompanionProfileDocument>,

    @InjectModel(FamilyAccess.name)
    private readonly familyAccess: Model<FamilyAccessDocument>,
  ) {}

  async getCompanionMatches(user: AuthUser) {
    this.ensureSenior(user);

    if (!Types.ObjectId.isValid(user.id)) {
      throw new NotFoundException('Invalid user ID');
    }

    // Convert the string ID into MongoDB ObjectId.
    // This matches the userId type stored in senior_profiles.
    const senior = await this.seniorProfiles
      .findOne({
        userId: new Types.ObjectId(user.id),
      })
      .lean();

    if (!senior) {
      throw new NotFoundException(
        'Please complete your senior profile before finding companions',
      );
    }

    const companions = await this.companionProfiles
      .find({ isVerified: true })
      .lean();

    const companionUsers = await this.users
      .find({ _id: { $in: companions.map((item) => item.userId) } })
      .select('name')
      .lean();
    const namesById = new Map(
      companionUsers.map((item) => [String(item._id), item.name]),
    );

    const matches: CompanionMatch[] = companions.map((companion) => {
      const result = this.calculateMatchScore(
        senior as unknown as SeniorMatchingProfile,
        companion,
      );

      return {
        companionId: companion.userId.toString(),
        name: namesById.get(companion.userId.toString()) ?? 'Companion',
        age: companion.age,
        gender: companion.gender,
        city: companion.city,
        languages: companion.languages ?? [],
        interests: companion.interests ?? [],
        hobbies: companion.hobbies ?? [],
        personalityTraits: companion.personalityTraits ?? [],
        availability: companion.availability ?? [],
        bio: companion.bio ?? '',
        experience: companion.experience ?? [],
        isVerified: companion.isVerified,
        score: result.score,
        matchReasons: result.reasons,
      };
    });

    matches.sort((a, b) => b.score - a.score);

    return {
      seniorId: user.id,
      totalMatches: matches.length,
      matches,
    };
  }

  async getCompanionMatchesForFamily(
    user: AuthUser,
    seniorId: string,
  ) {
    if (user.role !== UserRole.FAMILY) {
      throw new ForbiddenException(
        'Only family members can request matches for a senior',
      );
    }

    if (!Types.ObjectId.isValid(user.id) || !Types.ObjectId.isValid(seniorId)) {
      throw new NotFoundException('Invalid user ID');
    }

    const seniorObjectId = new Types.ObjectId(seniorId);
    const access = await this.familyAccess.findOne({
      seniorId: seniorObjectId,
      familyUserId: new Types.ObjectId(user.id),
      status: FamilyAccessStatus.ACTIVE,
      permissions: { $in: [FamilyPermission.VIEW_PROFILE] },
    });

    if (!access) {
      throw new ForbiddenException(
        'You do not have active permission to view matches for this senior',
      );
    }

    const senior = await this.seniorProfiles
      .findOne({ userId: seniorObjectId })
      .lean();

    if (!senior) {
      throw new NotFoundException('Senior profile not found');
    }

    const companions = await this.companionProfiles
      .find({ isVerified: true })
      .lean();

    const companionUsers = await this.users
      .find({ _id: { $in: companions.map((item) => item.userId) } })
      .select('name')
      .lean();
    const namesById = new Map(
      companionUsers.map((item) => [String(item._id), item.name]),
    );

    const matches: CompanionMatch[] = companions.map((companion) => {
      const result = this.calculateMatchScore(
        senior as unknown as SeniorMatchingProfile,
        companion,
      );

      return {
        companionId: companion.userId.toString(),
        name: namesById.get(companion.userId.toString()) ?? 'Companion',
        age: companion.age,
        gender: companion.gender,
        city: companion.city,
        languages: companion.languages ?? [],
        interests: companion.interests ?? [],
        hobbies: companion.hobbies ?? [],
        personalityTraits: companion.personalityTraits ?? [],
        availability: companion.availability ?? [],
        bio: companion.bio ?? '',
        experience: companion.experience ?? [],
        isVerified: companion.isVerified,
        score: result.score,
        matchReasons: result.reasons,
      };
    });

    matches.sort((a, b) => b.score - a.score);

    return {
      seniorId,
      totalMatches: matches.length,
      matches,
    };
  }

  private ensureSenior(user: AuthUser): void {
    if (user.role !== UserRole.SENIOR) {
      throw new ForbiddenException(
        'Only senior users can find companion matches',
      );
    }
  }

  private calculateMatchScore(
    senior: SeniorMatchingProfile,
    companion: {
      city: string;
      languages?: string[];
      interests?: string[];
      hobbies?: string[];
      personalityTraits?: string[];
      availability?: string[];
    },
  ): { score: number; reasons: string[] } {
    let score = 0;
    const reasons: string[] = [];

    const seniorCity = this.normalize(senior.city);
    const companionCity = this.normalize(companion.city);

    if (seniorCity && companionCity && seniorCity === companionCity) {
      score += 30;
      reasons.push('Lives in the same city');
    }

    const sharedLanguages = this.getSharedItems(
      senior.languages,
      companion.languages,
    );

    if (sharedLanguages.length > 0) {
      score += Math.min(sharedLanguages.length * 10, 20);
      reasons.push(`Shared languages: ${sharedLanguages.join(', ')}`);
    }

    const seniorInterests = [
      ...(senior.interests ?? []),
      ...(senior.hobbies ?? []),
    ];

    const companionInterests = [
      ...(companion.interests ?? []),
      ...(companion.hobbies ?? []),
    ];

    const sharedInterests = this.getSharedItems(
      seniorInterests,
      companionInterests,
    );

    if (sharedInterests.length > 0) {
      score += Math.min(sharedInterests.length * 5, 25);
      reasons.push(`Shared interests: ${sharedInterests.join(', ')}`);
    }

    const sharedTraits = this.getSharedItems(
      senior.preferredCompanionTraits,
      companion.personalityTraits,
    );

    if (sharedTraits.length > 0) {
      score += Math.min(sharedTraits.length * 5, 15);
      reasons.push(`Preferred traits: ${sharedTraits.join(', ')}`);
    }

    const sharedAvailability = this.getSharedItems(
      senior.availability,
      companion.availability,
    );

    if (sharedAvailability.length > 0) {
      score += Math.min(sharedAvailability.length * 5, 10);
      reasons.push(
        `Matching availability: ${sharedAvailability.join(', ')}`,
      );
    }

    if (reasons.length === 0) {
      reasons.push('Verified companion available for consideration');
    }

    return {
      score: Math.min(score, 100),
      reasons,
    };
  }

  private getSharedItems(
    first: string[] = [],
    second: string[] = [],
  ): string[] {
    const normalizedSecond = new Set(
      second.map((item) => this.normalize(item)).filter(Boolean),
    );

    return [...new Set(first)].filter((item) =>
      normalizedSecond.has(this.normalize(item)),
    );
  }

  private normalize(value?: string): string {
    return (value ?? '').trim().toLowerCase();
  }
}