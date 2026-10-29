import { Module } from '@nestjs/common';
import { DatabaseModule } from './database.module';
import { DatabaseService } from './database.service';
import { DatabaseBootstrap } from './database.bootstrap';
import { MigrationService } from './migration.service';

@Module({
  imports: [DatabaseModule],
  providers: [DatabaseService, MigrationService, DatabaseBootstrap],
  exports: [DatabaseService],
})
export class DatabaseProvidersModule {}
