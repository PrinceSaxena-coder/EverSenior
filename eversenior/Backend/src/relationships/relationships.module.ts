import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  Relationship,
  RelationshipSchema,
} from './schemas/relationship.schema';

import {
  User,
  UserSchema,
} from '../users/user.schema';

import {
  SeniorProfile,
  SeniorProfileSchema,
} from '../profiles/schemas/senior-profile.schema';

import {
  CompanionProfile,
  CompanionProfileSchema,
} from '../profiles/schemas/companion-profile.schema';

import { RelationshipsService } from './relationships.service';
import { RelationshipsController } from './relationships.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Relationship.name,
        schema: RelationshipSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: SeniorProfile.name,
        schema: SeniorProfileSchema,
      },
      {
        name: CompanionProfile.name,
        schema: CompanionProfileSchema,
      },
    ]),
  ],

  controllers: [
    RelationshipsController,
  ],

  providers: [
    RelationshipsService,
  ],
})
export class RelationshipsModule {}