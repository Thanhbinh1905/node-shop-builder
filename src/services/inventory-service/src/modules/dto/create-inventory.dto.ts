import { IsNotEmpty, IsString, IsUUID, IsOptional, IsNumber, Min } from 'class-validator';

export class CreateInventoryDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  product_variant_id: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  quantity?: number = 0;

  @IsOptional()
  @IsNumber()
  @Min(0)
  reserved_quantity?: number = 0;
}
