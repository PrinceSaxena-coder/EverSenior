import {
  Module,
} from '@nestjs/common';

import {
  MongooseModule,
} from '@nestjs/mongoose';

import {
  SosEvent,
  SosEventSchema,
} from './schemas/sos-event.schema';

import {
  FamilyAccess,
  FamilyAccessSchema,
} from '../family/schemas/family-access.schema';

import {
  Relationship,
  RelationshipSchema,
} from '../relationships/schemas/relationship.schema';

import {
  SosService,
} from './sos.service';

import {
  SafetyController,
} from './safety.controller';

import {
  AuditModule,
} from '../common/audit/audit.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SosEvent.name,
        schema: SosEventSchema,
      },
      {
        name: FamilyAccess.name,
        schema: FamilyAccessSchema,
      },
      {
        name: Relationship.name,
        schema: RelationshipSchema,
      },
    ]),

    AuditModule,
  ],

  controllers: [
    SafetyController,
  ],

  providers: [
    SosService,
  ],

  exports: [
    SosService,
  ],
})
export class SafetyModule {}