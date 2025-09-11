import { IsArray, IsUUID, IsInt, Min } from 'class-validator';

export class CheckoutItemDto {
  @IsUUID()
  product_variant_id: string;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class CheckoutDto {
  @IsArray()
  items: CheckoutItemDto[];
}
