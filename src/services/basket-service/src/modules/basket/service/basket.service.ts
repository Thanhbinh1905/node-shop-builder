import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';

export interface BasketItem {
  product_variant_id: string;
  qty: number;
}

export const CACHE_TTL = {
  BASKET: 60 * 60 * 24 * 7, // 1 hour
};

@Injectable()
export class BasketService {
  constructor(@Inject('REDIS') private readonly redis: Redis) {}

  private getKey(userID: string) {
    return `basket:${userID}`;
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

  async updateQuantity(userId: string, product_variant_id: string, qty: number) {
    const key = this.getKey(userId);
    const item = await this.redis.hget(key, product_variant_id);
    if (!item) return null;

    const parsed: BasketItem = JSON.parse(item);
    parsed.qty = qty;

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
