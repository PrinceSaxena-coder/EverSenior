import {
  IsIn,
  IsString,
} from 'class-validator';

export class RespondIntroductionDto {
  @IsString()
  @IsIn(['accept', 'reject'])
  decision!: 'accept' | 'reject';
}