export const TOPICS = {
  PRODUCT_VARIANT_CREATED: 'product.variant.created',
  BASKET_CHECKEDOUT: 'basket.checkedout',
  INVENTORY_RESERVED: 'inventory.reserved', // khi order reserve stock (Basket có thể lock lại item)
  INVENTORY_RESERVE_FAILED: 'inventory.reserved.fail',
} as const;

export type TopicName = typeof TOPICS[keyof typeof TOPICS];
