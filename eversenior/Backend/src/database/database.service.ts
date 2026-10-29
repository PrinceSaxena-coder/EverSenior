import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async onModuleInit() {
    await this.connection.asPromise();
    await this.ensureIndexes();
  }

  async onModuleDestroy() {
    await this.connection.close();
  }

  isConnected() {
    return this.connection.readyState === 1;
  }

  async ping() {
    return this.connection.db?.command({ ping: 1 });
  }

  private async ensureIndexes() {
    if (!this.connection.db) return;
    await this.connection.db.collection('schema_migrations').createIndex({ version: 1 }, { unique: true });
    await this.connection.db.collection('audit_logs').createIndex({ createdAt: -1 });
    await this.connection.db.collection('audit_logs').createIndex({ actorId: 1, createdAt: -1 });
  }
}
