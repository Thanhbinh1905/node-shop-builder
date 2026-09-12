import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, KafkaContext, Payload } from '@nestjs/microservices';
import { TOPICS } from '../../../config/kafka.config';
import { BasketService } from '../service/basket.service';

@Controller()
export class BasketConsumerController {
  constructor(private readonly basketService: BasketService) {}

  @EventPattern(TOPICS.INVENTORY_RESERVE_FAILED)
  async handleReserveFailed(@Payload() message: any, @Ctx() context: KafkaContext) {
    await this.basketService.processReserveFailed(message);
  }

  @EventPattern(TOPICS.INVENTORY_RESERVED)
  async handleReserved(@Payload() message: any, @Ctx() context: KafkaContext) {
    await this.basketService.processReserved(message);
  } 
}
