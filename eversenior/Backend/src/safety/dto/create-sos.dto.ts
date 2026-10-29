import {
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import {
  SosEventType,
} from '../schemas/sos-event.schema';

export class CreateSosDto {
  @IsEnum(SosEventType)
  type!: SosEventType;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  message?: string;

  @IsOptional()
  @IsLatitude()
  latitude?: number;

  @IsOptional()
  @IsLongitude()
  longitude?: number;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  locationLabel?: string;
}