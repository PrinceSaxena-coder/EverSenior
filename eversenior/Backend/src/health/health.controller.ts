import { Controller, Get } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Controller('health')
export class HealthController {
  constructor(private readonly database: DatabaseService) {}

  @Get()
  health() {
    return { status: 'ok', service: 'eversenior-backend' };
  }

  @Get('ready')
  async readiness() {
    const database = this.database.isConnected();
    if (database) await this.database.ping();
    return { status: database ? 'ready' : 'not_ready', database };
  }
}
