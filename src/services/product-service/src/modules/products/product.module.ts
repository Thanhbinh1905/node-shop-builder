import { Module } from '@nestjs/common';
import { ProductController } from './controller/product.controller';
import { DimensionController } from './controller/dimension.controller';
import { CategoryController } from './controller/category.controller';
import { ProductService } from './service/product.service';
import { Product, ProductVariant, VariantDimension, VariantDimensionValue, ProductVariantValue, Category } from './entity/product.entity'
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
  controllers: [ProductController, DimensionController, CategoryController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
