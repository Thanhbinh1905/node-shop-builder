import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';

export const TOPICS = {
  // ================= INVENTORY =================
  INVENTORY_ADJUSTED: 'inventory.adjusted', // số lượng tồn thay đổi (Basket update trạng thái out-of-stock)
  INVENTORY_RESERVED: 'inventory.reserved', // khi order reserve stock (Basket có thể lock lại item)
  INVENTORY_RESERVE_FAILED: 'inventory.reserved.fail',

  // ================= BASKET =================
  BASKET_CHECKEDOUT: 'basket.checkedout', // khi user checkout giỏ (Order service consume)
  BASKET_CLEARED: 'basket.cleared', // khi user xóa giỏ hoặc sau khi checkout thành công
  BASKET_ITEM_ADDED: 'basket.item.added', // khi user thêm sản phẩm
  BASKET_ITEM_REMOVED: 'basket.item.removed', // khi user xóa sản phẩm

  // ================= PRODUCT =================
  PRODUCT_UPDATED: 'product.updated', // cập nhật thông tin sản phẩm (Basket consume để sync lại tên, giá)
  PRODUCT_DELETED: 'product.deleted', // sản phẩm bị xóa (Basket remove item liên quan)
  PRODUCT_VARIANT_CREATED: 'product.variant.created', // biến thể mới (Basket/Inventory consume)
  PRODUCT_VARIANT_DELETED: 'product.variant.deleted', // biến thể bị xóa (Basket/Inventory consume)

  // ================= DISCOUNT =================
  PROMOTION_APPLIED: 'promotion.applied', // áp dụng khuyến mãi vào basket
  PROMOTION_EXPIRED: 'promotion.expired', // khuyến mãi hết hạn

  // ================= USER =================
  USER_DELETED: 'user.deleted', // Basket clear giỏ liên quan đến user
  USER_SUSPENDED: 'user.suspended', // Basket lock checkout

  // ================= PAYMENT =================
  PAYMENT_SUCCESS: 'payment.success', // thanh toán thành công → Basket clear
  PAYMENT_FAILED: 'payment.failed', // thanh toán fail → Basket unlock checkout

  ORDER_CREATE_REQUEST: 'order.create.request'
} as const;

export type TopicName = typeof TOPICS[keyof typeof TOPICS];
