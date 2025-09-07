import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory } from './entity/inventory.entity';
import { InventoryLog } from './entity/inventory_log.entity';
import { ProductVariantReplica } from './entity/product_variants_replica.entity';
import { InventoryService } from './service/inventory.service';
import { InventoryConsumerController } from './messaging/consumer.controller';
import { InventoryController } from './controller/inventory.controller';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      Inventory,
      InventoryLog,
      ProductVariantReplica,
    ]),
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_INVENTORY_CLIENT',
        imports: [ConfigModule],
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
  controllers: [InventoryController, InventoryConsumerController],
  providers: [
    InventoryService,
    {
      provide: 'REDIS',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const url = configService.get<string>('REDIS_URL') || 'redis://localhost:6379';
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const Redis = require('ioredis');
        return new Redis(url);
      },
    },
  ],
  exports: [InventoryService],
})
export class InventoryModule {}
