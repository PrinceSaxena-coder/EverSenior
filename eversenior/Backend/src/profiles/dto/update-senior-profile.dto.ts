import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateSeniorProfileDto {
  @IsOptional()
  @IsInt()
  @Min(18)
  @Max(120)
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
  lifestylePreferences?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  companionshipNeeds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferredCompanionTraits?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  availability?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  bio?: string;
}