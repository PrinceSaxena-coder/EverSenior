import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  FamilyAccess,
  FamilyAccessSchema,
} from './schemas/family-access.schema';

import {
  User,
  UserSchema,
} from '../users/user.schema';

import {
  SeniorProfile,
  SeniorProfileSchema,
} from '../profiles/schemas/senior-profile.schema';

import {
  Relationship,
  RelationshipSchema,
} from '../relationships/schemas/relationship.schema';

import {
  CompanionProfile,
  CompanionProfileSchema,
} from '../profiles/schemas/companion-profile.schema';

import { FamilyService } from './family.service';
import { FamilyController } from './family.controller';

import { AuditModule } from '../common/audit/audit.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: FamilyAccess.name,
        schema: FamilyAccessSchema,
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
        name: Relationship.name,
        schema: RelationshipSchema,
      },
      {
        name: CompanionProfile.name,
        schema: CompanionProfileSchema,
      },
    ]),

    AuditModule,
  ],

  controllers: [
    FamilyController,
  ],

  providers: [
    FamilyService,
  ],
})
export class FamilyModule {}