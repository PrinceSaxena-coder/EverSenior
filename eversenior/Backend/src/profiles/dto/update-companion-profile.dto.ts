import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateCompanionProfileDto {
  @IsOptional()
  @IsInt()
  @Min(18)
  @Max(100)
  age?: number;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  interests?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  hobbies?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  personalityTraits?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  availability?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  bio?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  experience?: string[];
}