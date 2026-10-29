import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';

import { AppConfigModule } from './config/config.module';
import { DatabaseProvidersModule } from './database/database.providers.module';
import { AuditModule } from './common/audit/audit.module';
import { HealthModule } from './health/health.module';
import { RequestIdMiddleware } from './common/request-id/request-id.middleware';

import { AuthModule } from './auth/auth.module';
import { ProfilesModule } from './profiles/profiles.module';
import { MatchingModule } from './matching/matching.module';
import { RelationshipsModule } from './relationships/relationships.module';
import { FamilyModule } from './family/family.module';
import { BookingsModule } from './bookings/bookings.module';
import { PaymentsModule } from './payments/payments.module';
import { SafetyModule } from './safety/safety.module';
import { AvailabilityModule } from './availability/availability.module';
import { AppStateModule } from './app-state/app-state.module';

@Module({
  imports: [
    AppConfigModule,
    DatabaseProvidersModule,
    AuditModule,
    HealthModule,

    AuthModule,
    ProfilesModule,
    MatchingModule,
    RelationshipsModule,
    FamilyModule,
    BookingsModule,
    PaymentsModule,
    SafetyModule,
    AvailabilityModule,
    AppStateModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestIdMiddleware)
      .forRoutes({
        path: '{*path}',
        method: RequestMethod.ALL,
      });
  }
}