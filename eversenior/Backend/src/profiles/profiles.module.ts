import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  User,
  UserSchema,
} from '../users/user.schema';

import {
  SeniorProfile,
  SeniorProfileSchema,
} from './schemas/senior-profile.schema';

import {
  CompanionProfile,
  CompanionProfileSchema,
} from './schemas/companion-profile.schema';

import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';

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
    ]),
  ],

  controllers: [
    ProfilesController,
  ],

  providers: [
    ProfilesService,
  ],

  exports: [
    ProfilesService,
  ],
})
export class ProfilesModule {}