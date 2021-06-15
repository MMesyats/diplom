import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional } from 'class-validator';
import { IsString } from 'src/decorators/decorators.dto';
import { IUserData } from 'src/user/user.interfaces';
import { IsOptionalString } from '../decorators/decorators.dto';

export class CreateNoteFormDTO {
  @IsString({ minLength: 1, example: 'COVID TEST' })
  name: string;

  @ApiProperty({
    type: 'object[]',
    example: [
      {
        label: 'Результат',
        type: 'select',
        options: ['Положительный', 'Негативный'],
      },
    ],
  })
  @IsArray()
  schema: {
    label: string;
    type: 'number' | 'text' | 'select' | 'image';
    options?: string[];
  }[];
}

export class CreateNoteDTO {
  @IsString({ minLength: 1, example: 'COVID TEST' })
  name: string;

  @ApiProperty({
    type: 'object[]',
    example: [
      {
        label: 'Результат',
        value: 'Положительный',
      },
    ],
  })
  @IsOptional()
  @IsArray()
  fields: {
    label: string;
    value: string | number;
  }[];

  @ApiProperty({ type: 'string[]', example: ['tag'] })
  @IsArray()
  tags: string[];

  @IsString({ example: '609bef38eed54b6ce3208efb', minLength: 1 })
  form: string;

  userData: IUserData;
}

export class CreateNotePatientDTO extends CreateNoteDTO {
  @IsString({ example: '609bdb94ff14bd6027c3a078' })
  patientId;
}

export class GetNotesDTO {
  @IsOptionalString({ minLength: 0, example: 'tag1;tag2' })
  tags: string;

  @IsOptionalString({ minLength: 0, example: 'created_at' })
  orderField: string;

  @IsOptionalString({ example: '1' })
  orderType: number;
}

export class GetPatientNotesDTO extends GetNotesDTO {
  @IsString({ example: '609bdb94ff14bd6027c3a078' })
  patient_id: string;
}
