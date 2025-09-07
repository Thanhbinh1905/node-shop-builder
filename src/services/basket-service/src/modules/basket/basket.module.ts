import { Module } from '@nestjs/common';
import { BasketController } from './controller/basket.controller';
import { BasketService } from './service/basket.service';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_INVENTORY_CLIENT',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: configService.get<string>('KAFKA_CLIENT_ID') || 'inventory-service',
              brokers: (configService.get<string>('KAFKA_BROKERS') || 'localhost:9092').split(','),
            },
            consumer: {
              groupId: configService.get<string>('KAFKA_GROUP_ID') || 'inventory-group',
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
  ],
  controllers: [BasketController],
  exports: [BasketService],
})
export class BasketModule {}
