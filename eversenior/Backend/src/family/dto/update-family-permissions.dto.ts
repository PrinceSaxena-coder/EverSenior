import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
} from 'class-validator';

import {
  FamilyPermission,
} from '../schemas/family-access.schema';

export class UpdateFamilyPermissionsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(FamilyPermission, {
    each: true,
  })
  permissions!: FamilyPermission[];
}