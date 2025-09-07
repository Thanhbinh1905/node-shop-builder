export class InventoryResponseDto {
  id: string;
  variant_id?: string;
  product_variant_id: string;
  quantity: number;
  reserved_quantity: number;
  available_quantity: number;
  created_at: Date;
  updated_at: Date;
}

export class InventoryLogResponseDto {
  id: string;
  inventory_id: string;
  change: number;
  type: string;
  reference_id?: string;
  created_at: Date;
}
