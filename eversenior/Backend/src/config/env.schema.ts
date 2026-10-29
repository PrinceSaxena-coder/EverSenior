import { plainToInstance } from 'class-transformer';
import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min, validateSync } from 'class-validator';

class EnvironmentVariables {
  @IsIn(['development', 'test', 'production'])
  NODE_ENV!: string;

  @IsInt()
  @Min(1)
  @Max(65535)
  PORT!: number;

  @IsString()
  @IsNotEmpty()
  API_PREFIX!: string;

  @IsString()
  @IsNotEmpty()
  MONGODB_URI!: string;

  @IsString()
  @IsNotEmpty()
  CORS_ORIGIN!: string;

  @IsOptional()
  @IsString()
  LOG_LEVEL?: string;
}

export function validateEnvironment(config: Record<string, unknown>) {
  const values = plainToInstance(EnvironmentVariables, {
    NODE_ENV: config.NODE_ENV ?? 'development',
    PORT: Number(config.PORT ?? 3000),
    API_PREFIX: config.API_PREFIX ?? 'v1',
    MONGODB_URI: config.MONGODB_URI,
    CORS_ORIGIN: config.CORS_ORIGIN ?? 'http://localhost:5173',
    LOG_LEVEL: config.LOG_LEVEL ?? 'info',
  });

  const errors = validateSync(values, { skipMissingProperties: false });
  if (errors.length > 0) {
    throw new Error(`Invalid environment configuration: ${errors.map((e) => Object.values(e.constraints ?? {}).join(', ')).join('; ')}`);
  }
  return values;
}
