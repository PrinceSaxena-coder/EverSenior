import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { DatabaseProvidersModule } from '../database/database.providers.module';

@Module({
  imports: [DatabaseProvidersModule],
  controllers: [HealthController],
})
export class HealthModule {}
