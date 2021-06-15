import { applyDecorators } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import * as validator from 'class-validator';
import { IApiInt, IApiString } from './decorators.interfaces';

export const IsString = ({ minLength, example }: IApiString) =>
  applyDecorators(
    ApiProperty({ type: 'string', example: example }),
    validator.IsString(),
    validator.MinLength(minLength),
  );

export const IsFile = () =>
  applyDecorators(ApiProperty({ type: 'string', format: 'binary' }));

export const IsOptionalFile = () =>
  applyDecorators(ApiPropertyOptional({ type: 'string', format: 'binary' }));

export const IsInt = ({ example }: IApiInt) =>
  applyDecorators(
    ApiProperty({ type: 'number', example: example }),
    validator.IsInt(),
  );

export const IsDate = () =>
  applyDecorators(
    ApiProperty({
      type: 'string',
      format: 'date-time',
      example: '2021-03-18T11:52:46.529Z',
    }),
    validator.IsDateString({ strict: false }),
  );

export const IsNumber = ({ example }: IApiInt) =>
  applyDecorators(
    ApiProperty({ type: 'number', example: example }),
    validator.IsNumber(),
  );

export const IsOptionalInt = ({ example }: IApiInt) =>
  applyDecorators(
    ApiProperty({ type: 'number', example: example }),
    validator.IsOptional(),
    validator.IsNumber(),
  );

export const IsOptionalNumber = ({ example }: IApiInt) =>
  applyDecorators(
    ApiProperty({ type: 'number', example: example }),
    validator.IsOptional(),
    validator.IsNumber(),
  );

export const IsOptionalDate = () =>
  applyDecorators(
    ApiPropertyOptional({
      type: 'string',
      format: 'date-time',
      example: '2021-03-18T11:52:46.529Z',
    }),
    validator.IsOptional(),
    validator.IsDateString(),
  );

export const IsOptionalString = ({ minLength, example }: IApiString) =>
  applyDecorators(
    ApiPropertyOptional({ type: 'string', example: example }),
    validator.IsOptional(),
    validator.IsString(),
    validator.MinLength(minLength),
  );
