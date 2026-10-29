import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class MigrationService {
  private readonly logger = new Logger(MigrationService.name);

  constructor(@InjectConnection() private readonly connection: Connection) {}

  async run() {
    const db = this.connection.db;
    if (!db) throw new Error('MongoDB connection is not ready');

    const migrations = db.collection('schema_migrations');
    const applied = await migrations.find({}, { projection: { version: 1 } }).toArray();
    const appliedVersions = new Set(applied.map((m) => m.version));

    const pending = [
      { version: 1, name: 'foundation' },
    ].filter((m) => !appliedVersions.has(m.version));

    for (const migration of pending) {
      await migrations.insertOne({
        version: migration.version,
        name: migration.name,
        appliedAt: new Date(),
      });
      this.logger.log(`Applied migration ${migration.version}: ${migration.name}`);
    }
  }
}
