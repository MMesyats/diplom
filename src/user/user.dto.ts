import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsJWT, IsOptional } from 'class-validator';
import {
  IsOptionalDate,
  IsOptionalString,
  IsString,
} from 'src/decorators/decorators.dto';
import {
  IsDate,
  IsNumber,
  IsOptionalNumber,
} from '../decorators/decorators.dto';
import { IUserData } from './user.interfaces';
import { bloodType, bloodTypesArray } from './user.schema';

export class CreateUserDTO {
  @IsString({ minLength: 2, example: 'Ivan' })
  name: string;

  @IsString({ minLength: 2, example: 'Ivanov' })
  surname: string;

  @IsString({ minLength: 2, example: 'Ivanvoich' })
  lastname: string;

  @IsString({ minLength: 2, example: 'Kyiv' })
  city: string;
  @IsDate()
  birthdayDate: Date;

  @IsNumber({ minLength: 2, example: '170' })
  height: number;

  @IsNumber({ minLength: 2, example: '75' })
  weight: number;

  @ApiProperty({ enum: bloodTypesArray, required: true })
  @IsIn(bloodTypesArray)
  bloodType: bloodType;

  userData: IUserData;
}

export class UpdateUserDTO {
  @IsOptionalString({ minLength: 2, example: 'Ivan' })
  name: string;

  @IsOptionalString({ minLength: 2, example: 'Ivanov' })
  surname?: string;

  @IsOptionalString({ minLength: 2, example: 'Ivanvoich' })
  lastname?: string;

  @IsOptionalString({ minLength: 2, example: 'Kyiv' })
  city?: string;

  @IsOptionalDate()
  birthdayDate?: Date;

  @IsOptionalNumber({ minLength: 2, example: '170' })
  height?: number;

  @IsOptionalNumber({ minLength: 2, example: '75' })
  weight?: number;

  @ApiProperty({ enum: bloodTypesArray })
  @IsOptional()
  @IsIn(bloodTypesArray)
  bloodType?: bloodType;

  userData: IUserData;
}

export class GivePermissionDTO {
  @ApiProperty()
  @IsJWT()
  permissionToken: string;

  userData: IUserData;
}
