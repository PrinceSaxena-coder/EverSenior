import {
  IsMongoId,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateIntroductionDto {
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  companionId!: string;
}