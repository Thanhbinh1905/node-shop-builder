import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';

export const TOPICS = {
  PRODUCT_VARIANT_CREATED: 'product.variant.created',
} as const;

export type TopicName = typeof TOPICS[keyof typeof TOPICS];
