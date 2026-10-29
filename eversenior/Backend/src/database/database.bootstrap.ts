import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { MigrationService } from './migration.service';

@Injectable()
export class DatabaseBootstrap implements OnApplicationBootstrap {
  constructor(private readonly database: DatabaseService, private readonly migrations: MigrationService) {}

  async onApplicationBootstrap() {
    if (!this.database.isConnected()) throw new Error('MongoDB is not connected');
    await this.migrations.run();
  }
}
