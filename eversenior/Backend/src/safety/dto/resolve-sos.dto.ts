import {
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class ResolveSosDto {
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  resolutionNote?: string;
}