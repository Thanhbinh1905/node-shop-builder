import { IsOptional, IsNumber, Min } from 'class-validator';

export class UpdateInventoryDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  quantity?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  reserved_quantity?: number;
}
