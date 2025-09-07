import { IsNotEmpty, IsString, IsUUID, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { InventoryChangeType } from '../entity/inventory_log.entity';

export class AdjustInventoryDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  inventory_id: string;

  @IsNotEmpty()
  @IsNumber()
  change: number;

  @IsNotEmpty()
  @IsEnum(InventoryChangeType)
  type: InventoryChangeType;

  @IsOptional()
  @IsString()
  @IsUUID()
  reference_id?: string;
}
