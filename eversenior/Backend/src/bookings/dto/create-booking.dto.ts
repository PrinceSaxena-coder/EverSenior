
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsMongoId,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export enum BookingServiceType {
  SOCIAL = 'social',
  OUTING = 'outing',
  HOBBIES = 'hobbies',
  SUPPORT = 'support',
  TECH = 'tech',
  TRAVEL = 'travel',
}

export class CreateBookingDto {
  @IsMongoId()
  relationshipId!: string;

  @IsEnum(BookingServiceType)
  serviceType!: BookingServiceType;

  @IsDateString()
  date!: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'startTime must be in HH:mm format',
  })
  startTime!: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'endTime must be in HH:mm format',
  })
  endTime!: string;

  @IsInt()
  @Min(15)
  @Max(720)
  durationMinutes!: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
