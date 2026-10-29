import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

import { UserRole } from '../../users/user.schema';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{10}$/, {
    message: 'Phone number must contain exactly 10 digits',
  })
  phone!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsEnum(UserRole, {
    message: 'Role must be senior, family, or companion',
  })
  role!: UserRole;
}