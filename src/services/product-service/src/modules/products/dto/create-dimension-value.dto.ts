import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateDimensionValueDto {
  @IsString()
  @IsNotEmpty()
  value: string;

  @IsUUID()
  @IsNotEmpty()
  dimensionId: string;
}
