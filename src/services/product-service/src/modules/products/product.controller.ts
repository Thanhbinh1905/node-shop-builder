import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { QueryProductDto } from './dto/query-product.dto';

@Controller('products')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // =============================
  // Product CRUD
  // =============================
  @Post()
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productService.createProduct(createProductDto);
  }

  @Get()
  async findAllProducts(@Query() query: QueryProductDto) {
    return this.productService.findAllProducts(query);
  }

  @Get(':id')
  async findOneProduct(@Param('id') id: string) {
    return this.productService.findOneProduct(id);
  }

  @Put(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeProduct(@Param('id') id: string) {
    return this.productService.removeProduct(id);
  }

  // =============================
  // Product Variants
  // =============================
  @Post(':productId/variants')
  async createVariant(
    @Param('productId') productId: string,
    @Body() createVariantDto: CreateVariantDto,
  ) {
    return this.productService.createVariant(productId, createVariantDto);
  }

  @Get(':productId/variants/:variantId')
  async findVariant(@Param('variantId') variantId: string) {
    return this.productService.findVariant(variantId);
  }

  @Put(':productId/variants/:variantId')
  async updateVariant(
    @Param('variantId') variantId: string,
    @Body() updateVariantDto: UpdateVariantDto,
  ) {
    return this.productService.updateVariant(variantId, updateVariantDto);
  }

  @Delete(':productId/variants/:variantId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeVariant(@Param('variantId') variantId: string) {
    return this.productService.removeVariant(variantId);
  }

}
