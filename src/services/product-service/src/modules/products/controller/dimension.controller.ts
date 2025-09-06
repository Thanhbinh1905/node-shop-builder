import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { ProductService } from '../service/product.service';
import { CreateDimensionDto } from '../dto/create-dimension.dto';
import { CreateDimensionValueDto } from '../dto/create-dimension-value.dto';

@Controller('dimensions')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class DimensionController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async createDimension(@Body() createDimensionDto: CreateDimensionDto) {
    return this.productService.createDimension(createDimensionDto.name);
  }

  @Get()
  async getDimensions() {
    return this.productService.getDimensions();
  }

  @Post('values')
  async addDimensionValue(@Body() createDimensionValueDto: CreateDimensionValueDto) {
    return this.productService.addDimensionValue(
      createDimensionValueDto.dimensionId,
      createDimensionValueDto.value,
    );
  }

  @Delete('values/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeDimensionValue(@Param('id') id: string) {
    return this.productService.removeDimensionValue(id);
  }
}
