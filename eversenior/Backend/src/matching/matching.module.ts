import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';

import { MatchingController } from './matching.controller';
import { MatchingService } from './matching.service';

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

import {
  FamilyAccess,
  FamilyAccessSchema,
} from '../family/schemas/family-access.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
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
      {
        name: FamilyAccess.name,
        schema: FamilyAccessSchema,
      },
    ]),
  ],
  controllers: [MatchingController],
  providers: [MatchingService],
})
export class MatchingModule {}