import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { DimensionController } from './dimension.controller';
import { ProductService } from './product.service';
import { Product, ProductVariant, VariantDimension, VariantDimensionValue, ProductVariantValue, Category } from './product.entity'
import { TypeOrmModule } from '@nestjs/typeorm';

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
  ],
  controllers: [ProductController, DimensionController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
