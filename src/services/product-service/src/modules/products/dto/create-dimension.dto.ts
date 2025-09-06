import { IsString, IsNotEmpty } from 'class-validator';

export class CreateDimensionDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
