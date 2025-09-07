import { IsString, IsNumber, IsArray, IsUUID, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class CreateVariantDto {
  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  dimensionValueIds?: string[];
}
