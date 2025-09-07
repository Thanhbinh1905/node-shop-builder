import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, KafkaContext, Payload } from '@nestjs/microservices';
import { TOPICS } from '../../config/kafka.config';
import { InventoryService } from '../service/inventory.service';

@Controller()
export class InventoryConsumerController {
  constructor(private readonly inventoryService: InventoryService) {}

  @EventPattern(TOPICS.PRODUCT_VARIANT_CREATED)
  async handleVariantCreated(@Payload() message: any, @Ctx() context: KafkaContext) {
    const value = message?.value ?? message;
    await this.inventoryService.processVariantCreated(value);
  }
}