import { IsNotEmpty, IsString, IsUUID, IsNumber, Min, IsOptional } from 'class-validator';

export class ReserveInventoryDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  inventory_id: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsString()
  @IsUUID()
  reference_id?: string;
}
