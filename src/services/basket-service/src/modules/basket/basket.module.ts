import { Module } from '@nestjs/common';
import { BasketController } from './controller/basket.controller';
import { BasketService } from './service/basket.service';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaProducerService } from './service/producer.service';
import { BasketConsumerController } from './messaging/consumer.controller';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_BASKET_CLIENT',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: configService.get<string>('KAFKA_CLIENT_ID') || 'basket-service',
              brokers: (configService.get<string>('KAFKA_BROKERS') || 'localhost:9092').split(','),
            },
            consumer: {
              groupId: configService.get<string>('KAFKA_GROUP_ID') || 'basket-group',
            },
          },
        }),
      },
    ]),
  ],
  providers: [
    BasketService,
    {
      provide: 'REDIS',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const url = configService.get<string>('REDIS_URL') || 'redis://localhost:6379';
        return new Redis(url);
      },
    },
    KafkaProducerService
  ],
  controllers: [BasketController, BasketConsumerController],
  exports: [BasketService, KafkaProducerService],
})
export class BasketModule {}
