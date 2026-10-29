import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type SeniorProfileDocument =
  HydratedDocument<SeniorProfile>;

@Schema({
  timestamps: true,
  collection: 'senior_profiles',
})
export class SeniorProfile {
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
    max: 120,
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
  lifestylePreferences!: string[];

  @Prop({
    type: [String],
    default: [],
  })
  companionshipNeeds!: string[];

  @Prop({
    type: [String],
    default: [],
  })
  preferredCompanionTraits!: string[];

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
}

export const SeniorProfileSchema =
  SchemaFactory.createForClass(SeniorProfile);