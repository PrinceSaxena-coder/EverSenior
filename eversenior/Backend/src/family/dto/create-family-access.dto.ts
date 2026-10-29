import {
  IsEmail,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateFamilyAccessDto {
  @IsEmail()
  familyEmail!: string;

  @IsString()
  @MaxLength(50)
  relationship!: string;
}