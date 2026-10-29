import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CompanionProfileDocument =
  HydratedDocument<CompanionProfile>;

@Schema({
  timestamps: true,
  collection: 'companion_profiles',
})
export class CompanionProfile {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true,
  })
  userId!: Types.ObjectId;

  @Prop({
    required: true,
    min: 18,
    max: 100,
  })
  age!: number;

  @Prop({
    required: true,
    trim: true,
  })
  gender!: string;

  @Prop({
    required: true,
    trim: true,
  })
  city!: string;

  @Prop({
    type: [String],
    default: [],
  })
  languages!: string[];

  @Prop({
    type: [String],
    default: [],
  })
  interests!: string[];

  @Prop({
    type: [String],
    default: [],
  })
  hobbies!: string[];

  @Prop({
    type: [String],
    default: [],
  })
  personalityTraits!: string[];

  @Prop({
    type: [String],
    default: [],
  })
  availability!: string[];

  @Prop({
    maxlength: 1000,
    trim: true,
    default: '',
  })
  bio!: string;

  @Prop({
    type: [String],
    default: [],
  })
  experience!: string[];

  @Prop({
    default: false,
    index: true,
  })
  isVerified!: boolean;
}

export const CompanionProfileSchema =
  SchemaFactory.createForClass(CompanionProfile);