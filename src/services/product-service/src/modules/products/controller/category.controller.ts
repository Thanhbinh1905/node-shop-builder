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
import { ProductService } from '../service/product.service';
import { CreateCategoryDTO } from '../dto/create-category.dto';

@Controller('categories')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class CategoryController {
  constructor(private readonly productService: ProductService) {}
  // =============================
  // Category CRUD
  // =============================
  @Post()
  async createCategory(@Body() createCategoryDTO: CreateCategoryDTO) {
    return this.productService.createCategory(createCategoryDTO)
  }
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeCategory(@Param('id') id: string) {
    return this.productService.removeCategory(id);
  }
}
