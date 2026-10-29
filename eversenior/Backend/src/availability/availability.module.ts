import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  Availability,
  AvailabilitySchema,
} from './schemas/availability.schema';

import { AvailabilityService } from './availability.service';
import { AvailabilityController } from './availability.controller';

import { AuditModule } from '../common/audit/audit.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Availability.name,
        schema: AvailabilitySchema,
      },
    ]),
    AuditModule,
  ],
  controllers: [
    AvailabilityController,
  ],
  providers: [
    AvailabilityService,
  ],
  exports: [
    AvailabilityService,
  ],
})
export class AvailabilityModule {}