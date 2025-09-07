import { IsInt, IsNotEmpty, IsString, IsUUID, Min } from "class-validator";

export class AddItemDTO {
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  product_variant_id: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  qty: number;
}