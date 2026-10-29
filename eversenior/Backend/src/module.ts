import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/errors/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const config = app.get(ConfigService);
  const prefix = config.getOrThrow<string>('API_PREFIX');
  const port = config.getOrThrow<number>('PORT');
  const corsOrigin = config.getOrThrow<string>('CORS_ORIGIN');

  app.setGlobalPrefix(prefix);
  app.use(helmet());
  app.enableCors({ origin: corsOrigin.split(',').map((value) => value.trim()), credentials: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableShutdownHooks();

  await app.listen(port);
}

bootstrap();
