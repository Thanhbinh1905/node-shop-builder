import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import Redis from 'ioredis';
import { KafkaProducerService } from './producer.service';
import { CheckoutDto, CheckoutItemDto } from '../dto/checkout.dto';
import { TOPICS } from 'src/config/kafka.config';
import { v4 as uuidv4 } from 'uuid';

export interface BasketItem {
  product_variant_id: string;
  quantity: number;
  locked?: boolean;       // khi reserved success
  unavailable?: boolean;  // khi reserve fail
}

export const CACHE_TTL = {
  BASKET: 60 * 60 * 24 * 7, // 7 days
};

@Injectable()
export class BasketService {
  constructor(
    @Inject('REDIS') private readonly redis: Redis,
    private readonly kafkaProducer: KafkaProducerService,
  ) {}

  private getKey(userID: string) {
    return `basket:${userID}`;
  }

  async processReserved(value: {
    userID: string;
    items: { product_variant_id: string; quantity: number }[];
    correlationId?: string;
  }) {
    const { userID, items } = value;

    const key = this.getKey(userID);
    const map = await this.redis.hgetall(key);
    if (!map || Object.keys(map).length === 0) return;

    // Mark reserved items in hash
    for (const item of items) {
      const raw = await this.redis.hget(key, item.product_variant_id);
      if (!raw) continue;
      const parsed: BasketItem = JSON.parse(raw);
      parsed.locked = true;
      parsed.unavailable = false;
      await this.redis.hset(key, item.product_variant_id, JSON.stringify(parsed));
    }

    // Recompute allLocked
    const allValues = await this.redis.hgetall(key);
    const allItems: BasketItem[] = Object.values(allValues).map((v) => JSON.parse(v));
    const allLocked = allItems.every((i) => i.locked || i.unavailable);
    if (allLocked) {
      await this.kafkaProducer.emit(TOPICS.ORDER_CREATE_REQUEST, { userID, items: allItems });
    }

    console.log("reserve thanh cong")
  }

  async processReserveFailed(value: {
    userID: string;
    items: { product_variant_id: string; requested: number; available: number }[];
    correlationId?: string;
    reason?: string;
  }) {
    const { userID, items } = value;

    const key = this.getKey(userID);
    const map = await this.redis.hgetall(key);
    if (!map || Object.keys(map).length === 0) return;

    // Mark unavailable in hash
    for (const item of items) {
      const raw = await this.redis.hget(key, item.product_variant_id);
      if (!raw) continue;
      const parsed: BasketItem = JSON.parse(raw);
      parsed.unavailable = true;
      parsed.locked = false;
      await this.redis.hset(key, item.product_variant_id, JSON.stringify(parsed));
    }

    console.log("reserve failed")
  }

async checkout(userID: string, input: CheckoutDto) {
  if (!input?.items?.length) {
    throw new BadRequestException("No items to checkout");
  }

  // Step 1: load basket từ Redis
  const basketKey = this.getKey(userID);
  const data = await this.redis.hgetall(basketKey);
  const basketItems: BasketItem[] = Object.values(data).map((v) => JSON.parse(v));
  if (!basketItems.length) {
    throw new Error("Basket not found");
  }

  // Step 2: map input vào basket
  const items = input.items.reduce<(BasketItem & { quantity: number })[]>((acc, inputItem) => {
    const basketItem = basketItems.find(
      (b) => b.product_variant_id === inputItem.product_variant_id,
    );
    if (basketItem) {
      acc.push({ ...basketItem, quantity: inputItem.quantity });
    }
    return acc;
  }, []);


  // Step 3: emit event
  await this.kafkaProducer.emit(TOPICS.BASKET_CHECKEDOUT, {
    key: userID,
    value: {
      userID,
      items: items.map(({ product_variant_id, quantity }) => ({
        product_variant_id,
        quantity,
      })),
      correlationId: uuidv4(),
    },
  });

  return { status: "pending", items };
}



  async addItem(user_id: string, item: BasketItem) {
    const key = this.getKey(user_id);
    await this.redis.hset(key, item.product_variant_id, JSON.stringify(item));
    await this.redis.expire(key, CACHE_TTL.BASKET); // TTL 7 ngày
  }

  async getBasket(user_id: string): Promise<BasketItem[]> {
    const key = this.getKey(user_id);
    const data = await this.redis.hgetall(key);
    return Object.values(data).map((v) => JSON.parse(v));
  }

  async updateQuantity(userId: string, product_variant_id: string, quantity: number) {
    const key = this.getKey(userId);
    const item = await this.redis.hget(key, product_variant_id);
    if (!item) return null;

    const parsed: BasketItem = JSON.parse(item);
    parsed.quantity = quantity;

    await this.redis.hset(key, product_variant_id, JSON.stringify(parsed));
    return parsed;
  }

  async removeItem(userId: string, product_variant_id: string) {
    const key = this.getKey(userId);
    await this.redis.hdel(key, product_variant_id);
  }

  async clearBasket(userId: string) {
    const key = this.getKey(userId);
    await this.redis.del(key);
  }
}
