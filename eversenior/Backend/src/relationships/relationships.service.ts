import {
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
  User,
  UserDocument,
  UserRole,
} from '../users/user.schema';

import {
  SeniorProfile,
  SeniorProfileDocument,
} from '../profiles/schemas/senior-profile.schema';

import {
  CompanionProfile,
  CompanionProfileDocument,
} from '../profiles/schemas/companion-profile.schema';

import {
  Relationship,
  RelationshipDocument,
  RelationshipStatus,
} from './schemas/relationship.schema';

import {
  AuthUser,
} from '../auth/decorators/current-user.decorator';

import {
  CreateIntroductionDto,
} from './dto/create-introduction.dto';

import {
  RespondIntroductionDto,
} from './dto/respond-introduction.dto';

import {
  CreateFeedbackDto,
} from './dto/create-feedback.dto';

@Injectable()
export class RelationshipsService {
  constructor(
    @InjectModel(Relationship.name)
    private readonly relationships: Model<RelationshipDocument>,

    @InjectModel(User.name)
    private readonly users: Model<UserDocument>,

    @InjectModel(SeniorProfile.name)
    private readonly seniorProfiles: Model<SeniorProfileDocument>,

    @InjectModel(CompanionProfile.name)
    private readonly companionProfiles: Model<CompanionProfileDocument>,
  ) {}

  // ============================================================
  // GET MY RELATIONSHIPS
  // ============================================================

  async getMyRelationships(
    user: AuthUser,
  ) {
    const userObjectId =
      new Types.ObjectId(user.id);

    const relationships =
      await this.relationships
        .find({
          $or: [
            {
              seniorId: userObjectId,
            },
            {
              companionId: userObjectId,
            },
          ],
        })
        .sort({
          createdAt: -1,
        })
        .lean();

    return {
      total:
        relationships.length,

      relationships,
    };
  }

  // ============================================================
  // CREATE INTRODUCTION
  // ============================================================

  async createIntroduction(
    user: AuthUser,
    dto: CreateIntroductionDto,
  ) {
    this.ensureSenior(user);

    if (
      !Types.ObjectId.isValid(
        dto.companionId,
      )
    ) {
      throw new NotFoundException(
        'Companion not found',
      );
    }

    const seniorObjectId =
      new Types.ObjectId(user.id);

    const companionObjectId =
      new Types.ObjectId(
        dto.companionId,
      );

    const companion =
      await this.companionProfiles
        .findOne({
          userId:
            companionObjectId,

          isVerified: true,
        })
        .lean();

    if (!companion) {
      throw new NotFoundException(
        'Verified companion not found',
      );
    }

    const existingRelationship =
      await this.relationships.findOne({
        seniorId:
          seniorObjectId,

        companionId:
          companionObjectId,
      });

    if (existingRelationship) {
      throw new ConflictException(
        'A relationship already exists between this senior and companion',
      );
    }

    const senior =
      await this.seniorProfiles
        .findOne({
          userId:
            seniorObjectId,
        })
        .lean();

    if (!senior) {
      throw new NotFoundException(
        'Please complete your senior profile before requesting an introduction',
      );
    }

    const match =
      this.calculateMatchSnapshot(
        senior,
        companion,
      );

    const relationship =
      await this.relationships.create({
        seniorId:
          seniorObjectId,

        companionId:
          companionObjectId,

        status:
          RelationshipStatus.INTRODUCTION_REQUESTED,

        matchScore:
          match.matchScore,

        matchReasons:
          match.matchReasons,

        introductionRequestedAt:
          new Date(),
      });

    return {
      message:
        'Introduction request created successfully',

      relationship: {
        id: String(
          relationship._id,
        ),

        seniorId:
          String(
            relationship.seniorId,
          ),

        companionId:
          String(
            relationship.companionId,
          ),

        status:
          relationship.status,

        matchScore:
          relationship.matchScore,

        matchReasons:
          relationship.matchReasons,

        introductionRequestedAt:
          relationship.introductionRequestedAt,
      },
    };
  }

  // ============================================================
  // RESPOND TO INTRODUCTION
  // ============================================================

  async respondToIntroduction(
    user: AuthUser,
    relationshipId: string,
    dto: RespondIntroductionDto,
  ) {
    if (
      user.role !==
      UserRole.COMPANION
    ) {
      throw new ForbiddenException(
        'Only companions can respond to introduction requests',
      );
    }

    if (
      !Types.ObjectId.isValid(
        relationshipId,
      )
    ) {
      throw new NotFoundException(
        'Relationship not found',
      );
    }

    const companionObjectId =
      new Types.ObjectId(
        user.id,
      );

    const relationshipObjectId =
      new Types.ObjectId(
        relationshipId,
      );

    const relationship =
      await this.relationships.findOne({
        _id:
          relationshipObjectId,

        companionId:
          companionObjectId,
      });

    if (!relationship) {
      throw new NotFoundException(
        'Relationship not found',
      );
    }

    if (
      relationship.status !==
      RelationshipStatus.INTRODUCTION_REQUESTED
    ) {
      throw new ConflictException(
        'This introduction request has already been processed',
      );
    }

    relationship.introductionRespondedAt =
      new Date();

    if (
      dto.decision ===
      'accept'
    ) {
      relationship.status =
        RelationshipStatus.INTRODUCTION_ACCEPTED;
    } else {
      relationship.status =
        RelationshipStatus.INTRODUCTION_REJECTED;
    }

    await relationship.save();

    return {
      message:
        dto.decision ===
        'accept'
          ? 'Introduction request accepted'
          : 'Introduction request rejected',

      relationship: {
        id: String(
          relationship._id,
        ),

        seniorId:
          String(
            relationship.seniorId,
          ),

        companionId:
          String(
            relationship.companionId,
          ),

        status:
          relationship.status,

        matchScore:
          relationship.matchScore,

        matchReasons:
          relationship.matchReasons,

        introductionRequestedAt:
          relationship.introductionRequestedAt,

        introductionRespondedAt:
          relationship.introductionRespondedAt,
      },
    };
  }

  // ============================================================
  // START TRIAL
  // ============================================================

  async startTrial(
    user: AuthUser,
    relationshipId: string,
  ) {
    if (
      user.role !==
        UserRole.SENIOR &&
      user.role !==
        UserRole.COMPANION
    ) {
      throw new ForbiddenException(
        'Only seniors or companions can start a trial',
      );
    }

    if (
      !Types.ObjectId.isValid(
        relationshipId,
      )
    ) {
      throw new NotFoundException(
        'Relationship not found',
      );
    }

    const userObjectId =
      new Types.ObjectId(
        user.id,
      );

    const relationshipObjectId =
      new Types.ObjectId(
        relationshipId,
      );

    const relationship =
      await this.relationships.findOne({
        _id:
          relationshipObjectId,

        $or: [
          {
            seniorId:
              userObjectId,
          },
          {
            companionId:
              userObjectId,
          },
        ],
      });

    if (!relationship) {
      throw new NotFoundException(
        'Relationship not found',
      );
    }

    if (
      relationship.status !==
      RelationshipStatus.INTRODUCTION_ACCEPTED
    ) {
      throw new ConflictException(
        'Trial can only be started after the introduction has been accepted',
      );
    }

    relationship.status =
      RelationshipStatus.TRIAL;

    relationship.trialStartedAt =
      new Date();

    await relationship.save();

    return {
      message:
        'Trial started successfully',

      relationship: {
        id: String(
          relationship._id,
        ),

        seniorId:
          String(
            relationship.seniorId,
          ),

        companionId:
          String(
            relationship.companionId,
          ),

        status:
          relationship.status,

        matchScore:
          relationship.matchScore,

        matchReasons:
          relationship.matchReasons,

        introductionRequestedAt:
          relationship.introductionRequestedAt,

        introductionRespondedAt:
          relationship.introductionRespondedAt,

        trialStartedAt:
          relationship.trialStartedAt,
      },
    };
  }

  // ============================================================
  // COMPLETE TRIAL
  // ============================================================

  async completeTrial(
    user: AuthUser,
    relationshipId: string,
  ) {
    if (
      user.role !==
        UserRole.SENIOR &&
      user.role !==
        UserRole.COMPANION
    ) {
      throw new ForbiddenException(
        'Only seniors or companions can complete a trial',
      );
    }

    if (
      !Types.ObjectId.isValid(
        relationshipId,
      )
    ) {
      throw new NotFoundException(
        'Relationship not found',
      );
    }

    const userObjectId =
      new Types.ObjectId(
        user.id,
      );

    const relationshipObjectId =
      new Types.ObjectId(
        relationshipId,
      );

    const relationship =
      await this.relationships.findOne({
        _id:
          relationshipObjectId,

        $or: [
          {
            seniorId:
              userObjectId,
          },
          {
            companionId:
              userObjectId,
          },
        ],
      });

    if (!relationship) {
      throw new NotFoundException(
        'Relationship not found',
      );
    }

    if (
      relationship.status !==
      RelationshipStatus.TRIAL
    ) {
      throw new ConflictException(
        'Trial can only be completed when the relationship is in trial status',
      );
    }

    relationship.status =
      RelationshipStatus.FEEDBACK_PENDING;

    relationship.trialCompletedAt =
      new Date();

    await relationship.save();

    return {
      message:
        'Trial completed successfully',

      relationship: {
        id: String(
          relationship._id,
        ),

        seniorId:
          String(
            relationship.seniorId,
          ),

        companionId:
          String(
            relationship.companionId,
          ),

        status:
          relationship.status,

        matchScore:
          relationship.matchScore,

        matchReasons:
          relationship.matchReasons,

        introductionRequestedAt:
          relationship.introductionRequestedAt,

        introductionRespondedAt:
          relationship.introductionRespondedAt,

        trialStartedAt:
          relationship.trialStartedAt,

        trialCompletedAt:
          relationship.trialCompletedAt,
      },
    };
  }

  // ============================================================
  // SUBMIT FEEDBACK
  // ============================================================

  async submitFeedback(
    user: AuthUser,
    relationshipId: string,
    dto: CreateFeedbackDto,
  ) {
    if (
      user.role !==
        UserRole.SENIOR &&
      user.role !==
        UserRole.COMPANION
    ) {
      throw new ForbiddenException(
        'Only seniors or companions can submit feedback',
      );
    }

    if (
      !Types.ObjectId.isValid(
        relationshipId,
      )
    ) {
      throw new NotFoundException(
        'Relationship not found',
      );
    }

    const userObjectId =
      new Types.ObjectId(
        user.id,
      );

    const relationshipObjectId =
      new Types.ObjectId(
        relationshipId,
      );

    const relationship =
      await this.relationships.findOne({
        _id:
          relationshipObjectId,

        $or: [
          {
            seniorId:
              userObjectId,
          },
          {
            companionId:
              userObjectId,
          },
        ],
      });

    if (!relationship) {
      throw new NotFoundException(
        'Relationship not found',
      );
    }

    if (
      relationship.status !==
      RelationshipStatus.FEEDBACK_PENDING
    ) {
      throw new ConflictException(
        'Feedback can only be submitted after the trial is completed',
      );
    }

    const isSenior =
      String(
        relationship.seniorId,
      ) === user.id;

    const isCompanion =
      String(
        relationship.companionId,
      ) === user.id;

    if (!isSenior && !isCompanion) {
      throw new ForbiddenException(
        'You are not part of this relationship',
      );
    }

    // ----------------------------------------------------------
    // SENIOR FEEDBACK
    // ----------------------------------------------------------

    if (isSenior) {
      if (
        relationship.seniorFeedback
          ?.submitted
      ) {
        throw new ConflictException(
          'Senior feedback has already been submitted',
        );
      }

      relationship.seniorFeedback = {
        submitted: true,

        rating:
          dto.rating,

        comment:
          dto.comment,

        wouldContinue:
          dto.wouldContinue,

        submittedAt:
          new Date(),
      };
    }

    // ----------------------------------------------------------
    // COMPANION FEEDBACK
    // ----------------------------------------------------------

    if (isCompanion) {
      if (
        relationship.companionFeedback
          ?.submitted
      ) {
        throw new ConflictException(
          'Companion feedback has already been submitted',
        );
      }

      relationship.companionFeedback = {
        submitted: true,

        rating:
          dto.rating,

        comment:
          dto.comment,

        wouldContinue:
          dto.wouldContinue,

        submittedAt:
          new Date(),
      };
    }

    // ----------------------------------------------------------
    // CHECK BOTH FEEDBACKS
    // ----------------------------------------------------------

    const seniorSubmitted =
      relationship.seniorFeedback
        ?.submitted === true;

    const companionSubmitted =
      relationship.companionFeedback
        ?.submitted === true;

    if (
      seniorSubmitted &&
      companionSubmitted
    ) {
      const seniorWantsContinue =
        relationship
          .seniorFeedback
          ?.wouldContinue === true;

      const companionWantsContinue =
        relationship
          .companionFeedback
          ?.wouldContinue === true;

      // --------------------------------------------------------
      // BOTH WANT TO CONTINUE
      // --------------------------------------------------------

      if (
        seniorWantsContinue &&
        companionWantsContinue
      ) {
        relationship.status =
          RelationshipStatus.ESTABLISHED;

        relationship.establishedAt =
          new Date();
      }

      // --------------------------------------------------------
      // ONE OR BOTH DO NOT WANT TO CONTINUE
      // --------------------------------------------------------

      else {
        relationship.status =
          RelationshipStatus.REMATCH_REQUESTED;

        relationship.rematchRequestedAt =
          new Date();
      }
    }

    await relationship.save();

    return {
      message:
        'Feedback submitted successfully',

      relationship: {
        id: String(
          relationship._id,
        ),

        seniorId:
          String(
            relationship.seniorId,
          ),

        companionId:
          String(
            relationship.companionId,
          ),

        status:
          relationship.status,

        matchScore:
          relationship.matchScore,

        matchReasons:
          relationship.matchReasons,

        trialStartedAt:
          relationship.trialStartedAt,

        trialCompletedAt:
          relationship.trialCompletedAt,

        seniorFeedback:
          relationship.seniorFeedback,

        companionFeedback:
          relationship.companionFeedback,

        establishedAt:
          relationship.establishedAt,

        rematchRequestedAt:
          relationship.rematchRequestedAt,
      },
    };
  }

  // ============================================================
  // MATCH SNAPSHOT
  // ============================================================

  private calculateMatchSnapshot(
    senior: any,
    companion: any,
  ) {
    const reasons: string[] = [];

    const interests =
      this.calculateArrayMatch(
        senior.interests,
        companion.interests,
      );

    if (
      interests.matches.length > 0
    ) {
      reasons.push(
        `Both enjoy ${this.formatList(
          interests.matches,
        )}`,
      );
    }

    const personality =
      this.calculateArrayMatch(
        senior.preferredCompanionTraits,
        companion.personalityTraits,
      );

    if (
      personality.matches.length > 0
    ) {
      reasons.push(
        `Companion is ${this.formatList(
          personality.matches,
        )}`,
      );
    }

    const hobbies =
      this.calculateArrayMatch(
        senior.hobbies,
        companion.hobbies,
      );

    if (
      hobbies.matches.length > 0
    ) {
      reasons.push(
        `Both enjoy ${this.formatList(
          hobbies.matches,
        )}`,
      );
    }

    const needs =
      this.calculateNeedsExperienceMatch(
        senior.companionshipNeeds,
        companion.experience,
      );

    if (
      needs.matches.length > 0
    ) {
      reasons.push(
        `Companion has experience with ${this.formatList(
          needs.matches,
        )}`,
      );
    }

    const languages =
      this.calculateArrayMatch(
        senior.languages,
        companion.languages,
      );

    if (
      languages.matches.length > 0
    ) {
      reasons.push(
        `Both speak ${this.formatList(
          languages.matches,
        )}`,
      );
    }

    const availability =
      this.calculateArrayMatch(
        senior.availability,
        companion.availability,
      );

    if (
      availability.matches.length > 0
    ) {
      reasons.push(
        `Both are available ${this.formatList(
          availability.matches,
        )}`,
      );
    }

    const seniorCity =
      this.normalize(
        senior.city,
      );

    const companionCity =
      this.normalize(
        companion.city,
      );

    const sameCity =
      seniorCity !== '' &&
      companionCity !== '' &&
      seniorCity ===
        companionCity;

    if (sameCity) {
      reasons.push(
        `Both are based in ${companion.city}`,
      );
    }

    const score =
      interests.score * 25 +
      personality.score * 20 +
      hobbies.score * 15 +
      needs.score * 15 +
      languages.score * 10 +
      availability.score * 10 +
      (sameCity ? 1 : 0) * 5;

    return {
      matchScore:
        Math.round(score),

      matchReasons:
        reasons,
    };
  }

  // ============================================================
  // ARRAY MATCH
  // ============================================================

  private calculateArrayMatch(
    first: string[] = [],
    second: string[] = [],
  ) {
    const firstValues =
      Array.isArray(first)
        ? first
        : [];

    const secondValues =
      Array.isArray(second)
        ? second
        : [];

    const firstNormalized =
      firstValues.map(
        (value) =>
          this.normalize(value),
      );

    const matches =
      secondValues.filter(
        (value) =>
          firstNormalized.includes(
            this.normalize(value),
          ),
      );

    const uniqueMatches = [
      ...new Set(matches),
    ];

    const score =
      firstValues.length === 0
        ? 0
        : uniqueMatches.length /
          firstValues.length;

    return {
      score:
        Math.min(
          score,
          1,
        ),

      matches:
        uniqueMatches,
    };
  }

  // ============================================================
  // NEEDS / EXPERIENCE MATCH
  // ============================================================

  private calculateNeedsExperienceMatch(
    needs: string[] = [],
    experience: string[] = [],
  ) {
    const needValues =
      Array.isArray(needs)
        ? needs
        : [];

    const experienceValues =
      Array.isArray(experience)
        ? experience
        : [];

    const matches: string[] = [];

    for (
      const need of needValues
    ) {
      const normalizedNeed =
        this.normalize(
          need,
        );

      for (
        const item of experienceValues
      ) {
        const normalizedExperience =
          this.normalize(
            item,
          );

        if (
          this.areSemanticallyRelated(
            normalizedNeed,
            normalizedExperience,
          )
        ) {
          matches.push(
            item,
          );

          break;
        }
      }
    }

    const uniqueMatches = [
      ...new Set(matches),
    ];

    const score =
      needValues.length === 0
        ? 0
        : uniqueMatches.length /
          needValues.length;

    return {
      score:
        Math.min(
          score,
          1,
        ),

      matches:
        uniqueMatches,
    };
  }

  // ============================================================
  // SEMANTIC KEYWORD MATCHING
  // ============================================================

  private areSemanticallyRelated(
    need: string,
    experience: string,
  ) {
    if (
      need.includes(
        experience,
      ) ||
      experience.includes(
        need,
      )
    ) {
      return true;
    }

    const keywordGroups = [
      [
        'walk',
        'walking',
        'walks',
        'outdoor',
        'outdoors',
      ],

      [
        'conversation',
        'conversations',
        'talk',
        'talking',
        'social',
        'communication',
      ],

      [
        'companionship',
        'companion',
        'company',
        'support',
      ],

      [
        'hobby',
        'hobbies',
        'interest',
        'interests',
      ],

      [
        'music',
        'singing',
        'songs',
      ],

      [
        'reading',
        'books',
        'book',
      ],

      [
        'gardening',
        'garden',
        'plants',
      ],

      [
        'travel',
        'travelling',
        'traveling',
        'trip',
        'trips',
      ],
    ];

    for (
      const group of keywordGroups
    ) {
      const needHasKeyword =
        group.some(
          (keyword) =>
            need.includes(
              keyword,
            ),
        );

      const experienceHasKeyword =
        group.some(
          (keyword) =>
            experience.includes(
              keyword,
            ),
        );

      if (
        needHasKeyword &&
        experienceHasKeyword
      ) {
        return true;
      }
    }

    return false;
  }

  // ============================================================
  // NORMALIZE
  // ============================================================

  private normalize(
    value?: string,
  ) {
    return (
      value ?? ''
    )
      .trim()
      .toLowerCase();
  }

  // ============================================================
  // FORMAT LIST
  // ============================================================

  private formatList(
    values: string[],
  ) {
    return values.join(
      ', ',
    );
  }

  // ============================================================
  // ROLE CHECK
  // ============================================================

  private ensureSenior(
    user: AuthUser,
  ) {
    if (
      user.role !==
      UserRole.SENIOR
    ) {
      throw new ForbiddenException(
        'Only senior accounts can request introductions',
      );
    }
  }
}