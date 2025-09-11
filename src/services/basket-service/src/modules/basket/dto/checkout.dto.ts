import { Type } from 'class-transformer';
import { IsArray, IsUUID, IsInt, Min, ValidateNested } from 'class-validator';

export class CheckoutItemDto {
  @IsUUID()
  product_variant_id: string;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class CheckoutDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CheckoutItemDto)
  items: CheckoutItemDto[];
}
