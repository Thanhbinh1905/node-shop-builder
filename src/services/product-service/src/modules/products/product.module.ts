import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductController } from './controller/product.controller';
import { DimensionController } from './controller/dimension.controller';
import { CategoryController } from './controller/category.controller';
import { ProductService } from './service/product.service';
import { Product, ProductVariant, VariantDimension, VariantDimensionValue, ProductVariantValue, Category } from './entity/product.entity'
import { TypeOrmModule } from '@nestjs/typeorm';
import { KafkaProducerService } from './service/producer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductVariant,
      VariantDimension,
      VariantDimensionValue,
      ProductVariantValue,
      Category
    ]),
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_PRODUCT_CLIENT',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: configService.get<string>('KAFKA_CLIENT_ID') || 'product-service',
              brokers: (configService.get<string>('KAFKA_BROKERS') || 'localhost:9092').split(','),
            },
            producerOnlyMode: true,
            // consumer: {
            //   groupId: 'product-service-consumer', // mỗi service nên có group riêng
            // },
          },
        }),
      },
    ]),
  ],
  controllers: [ProductController, DimensionController, CategoryController],
  providers: [ProductService, KafkaProducerService],
  exports: [ProductService, KafkaProducerService],
})
export class ProductModule {}
