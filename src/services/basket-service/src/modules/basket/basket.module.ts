import { Module } from '@nestjs/common';
import { BasketController } from './controller/basket.controller';
import { BasketService } from './service/basket.service';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Module({
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
