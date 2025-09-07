import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductController } from './controller/product.controller';
import { DimensionController } from './controller/dimension.controller';
import { CategoryController } from './controller/category.controller';
import { ProductService } from './service/product.service';
import { Product, ProductVariant, VariantDimension, VariantDimensionValue, ProductVariantValue, Category } from './entity/product.entity'
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule,
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
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: configService.get<string>('KAFKA_CLIENT_ID') || 'product-service',
              brokers: (configService.get<string>('KAFKA_BROKERS') || 'localhost:9092').split(','),
            },
            producerOnlyMode: true,
          },
        }),
      },
    ]),
  ],
  controllers: [ProductController, DimensionController, CategoryController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
