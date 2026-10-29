import {
  IsEnum,
  IsMilitaryTime,
  IsNotEmpty,
  IsString,
} from 'class-validator';

import { AvailabilityDay } from '../schemas/availability.schema';

export class CreateAvailabilityDto {
  @IsEnum(AvailabilityDay)
  day!: AvailabilityDay;

  @IsString()
  @IsNotEmpty()
  @IsMilitaryTime()
  startTime!: string;

  @IsString()
  @IsNotEmpty()
  @IsMilitaryTime()
  endTime!: string;
}