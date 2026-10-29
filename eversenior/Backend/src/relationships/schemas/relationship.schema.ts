import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';

import {
  HydratedDocument,
  Types,
} from 'mongoose';

export type RelationshipDocument =
  HydratedDocument<Relationship>;

export enum RelationshipStatus {
  INTRODUCTION_REQUESTED =
    'introduction_requested',

  INTRODUCTION_ACCEPTED =
    'introduction_accepted',

  INTRODUCTION_REJECTED =
    'introduction_rejected',

  TRIAL =
    'trial',

  FEEDBACK_PENDING =
    'feedback_pending',

  ESTABLISHED =
    'established',

  REMATCH_REQUESTED =
    'rematch_requested',

  REMATCHED =
    'rematched',
}

@Schema({
  timestamps: true,
  collection: 'relationships',
})
export class Relationship {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  seniorId!: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  companionId!: Types.ObjectId;

  @Prop({
    required: true,
    enum: Object.values(
      RelationshipStatus,
    ),
    default:
      RelationshipStatus.INTRODUCTION_REQUESTED,
    index: true,
  })
  status!: RelationshipStatus;

  @Prop({
    required: true,
    min: 0,
    max: 100,
  })
  matchScore!: number;

  @Prop({
    type: [String],
    default: [],
  })
  matchReasons!: string[];

  @Prop()
  introductionRequestedAt?: Date;

  @Prop()
  introductionRespondedAt?: Date;

  @Prop()
  trialStartedAt?: Date;

  @Prop()
  trialCompletedAt?: Date;

  // ============================================================
  // SENIOR FEEDBACK
  // ============================================================

  @Prop({
    type: {
      submitted: {
        type: Boolean,
        default: false,
      },

      rating: {
        type: Number,
        min: 1,
        max: 5,
      },

      comment: {
        type: String,
        maxlength: 1000,
        trim: true,
      },

      wouldContinue: {
        type: Boolean,
      },

      submittedAt: {
        type: Date,
      },
    },

    _id: false,
  })
  seniorFeedback?: {
    submitted: boolean;
    rating?: number;
    comment?: string;
    wouldContinue?: boolean;
    submittedAt?: Date;
  };

  // ============================================================
  // COMPANION FEEDBACK
  // ============================================================

  @Prop({
    type: {
      submitted: {
        type: Boolean,
        default: false,
      },

      rating: {
        type: Number,
        min: 1,
        max: 5,
      },

      comment: {
        type: String,
        maxlength: 1000,
        trim: true,
      },

      wouldContinue: {
        type: Boolean,
      },

      submittedAt: {
        type: Date,
      },
    },

    _id: false,
  })
  companionFeedback?: {
    submitted: boolean;
    rating?: number;
    comment?: string;
    wouldContinue?: boolean;
    submittedAt?: Date;
  };

  @Prop()
  establishedAt?: Date;

  @Prop()
  rematchRequestedAt?: Date;
}

export const RelationshipSchema =
  SchemaFactory.createForClass(
    Relationship,
  );