import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import {
  Model,
  Types,
} from 'mongoose';

import {
  FamilyAccess,
  FamilyAccessDocument,
  FamilyAccessStatus,
  FamilyPermission,
} from './schemas/family-access.schema';

import {
  User,
  UserDocument,
  UserRole,
} from '../users/user.schema';

import {
  SeniorProfile,
  SeniorProfileDocument,
} from '../profiles/schemas/senior-profile.schema';

import {
  Relationship,
  RelationshipDocument,
  RelationshipStatus,
} from '../relationships/schemas/relationship.schema';

import {
  CompanionProfile,
  CompanionProfileDocument,
} from '../profiles/schemas/companion-profile.schema';

import {
  AuthUser,
} from '../auth/decorators/current-user.decorator';

import {
  AuditService,
} from '../common/audit/audit.service';

import {
  CreateFamilyAccessDto,
} from './dto/create-family-access.dto';

import {
  UpdateFamilyPermissionsDto,
} from './dto/update-family-permissions.dto';

@Injectable()
export class FamilyService {
  constructor(
    @InjectModel(FamilyAccess.name)
    private readonly familyAccess: Model<FamilyAccessDocument>,

    @InjectModel(User.name)
    private readonly users: Model<UserDocument>,

    @InjectModel(SeniorProfile.name)
    private readonly seniorProfiles: Model<SeniorProfileDocument>,

    @InjectModel(Relationship.name)
    private readonly relationships: Model<RelationshipDocument>,

    @InjectModel(CompanionProfile.name)
    private readonly companionProfiles: Model<CompanionProfileDocument>,

    private readonly audit: AuditService,
  ) {}

  async createAccess(
    user: AuthUser,
    dto: CreateFamilyAccessDto,
    requestId: string,
  ) {
    if (user.role !== UserRole.SENIOR) {
      throw new ForbiddenException(
        'Only a senior can authorize a family member',
      );
    }

    const familyEmail =
      dto.familyEmail.trim().toLowerCase();

    const familyUser =
      await this.users.findOne({
        email: familyEmail,
        role: UserRole.FAMILY,
        isActive: true,
      });

    if (!familyUser) {
      throw new NotFoundException(
        'Active family account not found with this email',
      );
    }

    const existing =
      await this.familyAccess.findOne({
        seniorId:
          new Types.ObjectId(user.id),
        familyUserId:
          familyUser._id,
      });

    if (existing) {
      if (
        existing.status ===
        FamilyAccessStatus.ACTIVE
      ) {
        throw new ConflictException(
          'This family member already has active access',
        );
      }

      if (
        existing.status ===
        FamilyAccessStatus.PENDING
      ) {
        throw new ConflictException(
          'This family member already has a pending access request',
        );
      }

      existing.status =
        FamilyAccessStatus.PENDING;

      existing.relationship =
        dto.relationship.trim();

      existing.permissions = [
        FamilyPermission.VIEW_PROFILE,
        FamilyPermission.VIEW_RELATIONSHIP,
        FamilyPermission.VIEW_BOOKINGS,
        FamilyPermission.SAFETY_ALERTS,
      ];

      existing.revokedAt = undefined;
      existing.acceptedAt = undefined;

      await existing.save();

      await this.audit.record({
        action:
          'family.access.re_requested',
        requestId,
        actorId: user.id,
        actorRole: user.role,
        resourceType: 'family_access',
        resourceId:
          String(existing._id),
      });

      return this.toResponse(existing);
    }

    const access =
      await this.familyAccess.create({
        seniorId:
          new Types.ObjectId(user.id),

        familyUserId:
          familyUser._id,

        relationship:
          dto.relationship.trim(),

        permissions: [
          FamilyPermission.VIEW_PROFILE,
          FamilyPermission.VIEW_RELATIONSHIP,
          FamilyPermission.VIEW_BOOKINGS,
          FamilyPermission.SAFETY_ALERTS,
        ],

        status:
          FamilyAccessStatus.PENDING,
      });

    await this.audit.record({
      action:
        'family.access.created',
      requestId,
      actorId: user.id,
      actorRole: user.role,
      resourceType: 'family_access',
      resourceId:
        String(access._id),
    });

    return this.toResponse(access);
  }

  async getMyAccess(
    user: AuthUser,
  ) {
    if (
      user.role === UserRole.SENIOR
    ) {
      const accesses =
        await this.familyAccess
          .find({
            seniorId:
              new Types.ObjectId(
                user.id,
              ),
          })
          .sort({
            createdAt: -1,
          });

      return {
        accesses:
          accesses.map(
            (access) =>
              this.toResponse(access),
          ),
      };
    }

    if (
      user.role === UserRole.FAMILY
    ) {
      const accesses =
        await this.familyAccess
          .find({
            familyUserId:
              new Types.ObjectId(
                user.id,
              ),
          })
          .sort({
            createdAt: -1,
          });

      return {
        accesses:
          accesses.map(
            (access) =>
              this.toResponse(access),
          ),
      };
    }

    throw new ForbiddenException(
      'Only seniors and family members can access family authorization records',
    );
  }

  async respondToAccess(
    user: AuthUser,
    accessId: string,
    accepted: boolean,
    requestId: string,
  ) {
    if (
      user.role !== UserRole.FAMILY
    ) {
      throw new ForbiddenException(
        'Only the family member can respond to this access request',
      );
    }

    const objectId =
      this.toObjectId(
        accessId,
        'Invalid family access ID',
      );

    const access =
      await this.familyAccess.findById(
        objectId,
      );

    if (!access) {
      throw new NotFoundException(
        'Family access not found',
      );
    }

    if (
      String(
        access.familyUserId,
      ) !== user.id
    ) {
      throw new ForbiddenException(
        'You cannot respond to this access request',
      );
    }

    if (
      access.status !==
      FamilyAccessStatus.PENDING
    ) {
      throw new BadRequestException(
        'Only pending access requests can be responded to',
      );
    }

    if (accepted) {
      access.status =
        FamilyAccessStatus.ACTIVE;

      access.acceptedAt =
        new Date();
    } else {
      access.status =
        FamilyAccessStatus.REVOKED;

      access.revokedAt =
        new Date();
    }

    await access.save();

    await this.audit.record({
      action: accepted
        ? 'family.access.accepted'
        : 'family.access.rejected',
      requestId,
      actorId: user.id,
      actorRole: user.role,
      resourceType: 'family_access',
      resourceId:
        String(access._id),
    });

    return this.toResponse(access);
  }

  async revokeAccess(
    user: AuthUser,
    accessId: string,
    requestId: string,
  ) {
    if (
      user.role !== UserRole.SENIOR
    ) {
      throw new ForbiddenException(
        'Only the senior can revoke family access',
      );
    }

    const objectId =
      this.toObjectId(
        accessId,
        'Invalid family access ID',
      );

    const access =
      await this.familyAccess.findById(
        objectId,
      );

    if (!access) {
      throw new NotFoundException(
        'Family access not found',
      );
    }

    if (
      String(
        access.seniorId,
      ) !== user.id
    ) {
      throw new ForbiddenException(
        'You cannot revoke this family access',
      );
    }

    if (
      access.status ===
      FamilyAccessStatus.REVOKED
    ) {
      throw new BadRequestException(
        'Family access is already revoked',
      );
    }

    access.status =
      FamilyAccessStatus.REVOKED;

    access.revokedAt =
      new Date();

    await access.save();

    await this.audit.record({
      action:
        'family.access.revoked',
      requestId,
      actorId: user.id,
      actorRole: user.role,
      resourceType: 'family_access',
      resourceId:
        String(access._id),
    });

    return this.toResponse(access);
  }

  async updatePermissions(
    user: AuthUser,
    accessId: string,
    dto: UpdateFamilyPermissionsDto,
    requestId: string,
  ) {
    if (
      user.role !== UserRole.SENIOR
    ) {
      throw new ForbiddenException(
        'Only the senior can update family permissions',
      );
    }

    const objectId =
      this.toObjectId(
        accessId,
        'Invalid family access ID',
      );

    const access =
      await this.familyAccess.findById(
        objectId,
      );

    if (!access) {
      throw new NotFoundException(
        'Family access not found',
      );
    }

    if (
      String(
        access.seniorId,
      ) !== user.id
    ) {
      throw new ForbiddenException(
        'You cannot modify this family access',
      );
    }

    if (
      access.status ===
      FamilyAccessStatus.REVOKED
    ) {
      throw new BadRequestException(
        'Cannot update permissions for revoked family access',
      );
    }

    const uniquePermissions = [
      ...new Set(dto.permissions),
    ];

    access.permissions =
      uniquePermissions;

    await access.save();

    await this.audit.record({
      action:
        'family.permissions_updated',
      requestId,
      actorId: user.id,
      actorRole: user.role,
      resourceType: 'family_access',
      resourceId:
        String(access._id),
    });

    return this.toResponse(access);
  }

  async getSeniorProfileForFamily(
    user: AuthUser,
    seniorId: string,
  ) {
    if (
      user.role !== UserRole.FAMILY
    ) {
      throw new ForbiddenException(
        'Only family members can access senior family views',
      );
    }

    const seniorObjectId =
      this.toObjectId(
        seniorId,
        'Invalid senior ID',
      );

    const access =
      await this.getActiveAccess(
        seniorObjectId,
        user.id,
        FamilyPermission.VIEW_PROFILE,
      );

    if (!access) {
      throw new ForbiddenException(
        'You are not authorized to view this senior profile',
      );
    }

    const profile =
      await this.seniorProfiles.findOne({
        userId:
          seniorObjectId,
      });

    if (!profile) {
      throw new NotFoundException(
        'Senior profile not found',
      );
    }

    const senior =
      await this.users.findById(
        seniorObjectId,
      );

    if (!senior) {
      throw new NotFoundException(
        'Senior account not found',
      );
    }

    return {
      senior: {
        id: String(
          senior._id,
        ),
        name:
          senior.name,
        email:
          senior.email,
        phone:
          senior.phone,
      },

      profile: {
        age:
          profile.age,
        gender:
          profile.gender,
        city:
          profile.city,
        languages:
          profile.languages,
        interests:
          profile.interests,
        hobbies:
          profile.hobbies,
        personalityTraits:
          profile.personalityTraits,
        lifestylePreferences:
          profile.lifestylePreferences,
        companionshipNeeds:
          profile.companionshipNeeds,
        preferredCompanionTraits:
          profile.preferredCompanionTraits,
        availability:
          profile.availability,
        bio:
          profile.bio,
      },
    };
  }

  async getSeniorRelationshipForFamily(
    user: AuthUser,
    seniorId: string,
  ) {
    if (
      user.role !== UserRole.FAMILY
    ) {
      throw new ForbiddenException(
        'Only family members can access senior relationship information',
      );
    }

    const seniorObjectId =
      this.toObjectId(
        seniorId,
        'Invalid senior ID',
      );

    const access =
      await this.getActiveAccess(
        seniorObjectId,
        user.id,
        FamilyPermission.VIEW_RELATIONSHIP,
      );

    if (!access) {
      throw new ForbiddenException(
        'You are not authorized to view this senior relationship',
      );
    }

    const relationship =
      await this.relationships
        .findOne({
          seniorId:
            seniorObjectId,
          status:
            RelationshipStatus.ESTABLISHED,
        })
        .sort({
          establishedAt: -1,
        });

    if (!relationship) {
      return {
        relationship: null,
      };
    }

    const companion =
      await this.users.findById(
        relationship.companionId,
      );

    const companionProfile =
      await this.companionProfiles.findOne({
        userId:
          relationship.companionId,
      });

    return {
      relationship: {
        id: String(
          relationship._id,
        ),
        status:
          relationship.status,
        matchScore:
          relationship.matchScore,
        matchReasons:
          relationship.matchReasons,
        establishedAt:
          relationship.establishedAt,
      },

      companion: companion
        ? {
            id: String(
              companion._id,
            ),
            name:
              companion.name,
            email:
              companion.email,
            phone:
              companion.phone,

            profile:
              companionProfile
                ? {
                    age:
                      companionProfile.age,
                    gender:
                      companionProfile.gender,
                    city:
                      companionProfile.city,
                    languages:
                      companionProfile.languages,
                    interests:
                      companionProfile.interests,
                    hobbies:
                      companionProfile.hobbies,
                    personalityTraits:
                      companionProfile.personalityTraits,
                    availability:
                      companionProfile.availability,
                    bio:
                      companionProfile.bio,
                    experience:
                      companionProfile.experience,
                    isVerified:
                      companionProfile.isVerified,
                  }
                : null,
          }
        : null,
    };
  }

  private async getActiveAccess(
    seniorId: Types.ObjectId,
    familyUserId: string,
    permission: FamilyPermission,
  ) {
    return this.familyAccess.findOne({
      seniorId,
      familyUserId:
        new Types.ObjectId(
          familyUserId,
        ),
      status:
        FamilyAccessStatus.ACTIVE,
      permissions: {
        $in: [permission],
      },
    });
  }

  private toResponse(
    access: FamilyAccessDocument,
  ) {
    return {
      access: {
        id: String(
          access._id,
        ),
        seniorId: String(
          access.seniorId,
        ),
        familyUserId:
          String(
            access.familyUserId,
          ),
        relationship:
          access.relationship,
        permissions:
          access.permissions,
        status:
          access.status,
        acceptedAt:
          access.acceptedAt,
        revokedAt:
          access.revokedAt,
      },
    };
  }

  private toObjectId(
    value: string,
    message: string,
  ) {
    if (
      !Types.ObjectId.isValid(
        value,
      )
    ) {
      throw new BadRequestException(
        message,
      );
    }

    return new Types.ObjectId(
      value,
    );
  }
}