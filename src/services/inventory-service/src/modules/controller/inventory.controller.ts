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
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { InventoryService } from '../service/inventory.service';
import { CreateInventoryDto } from '../dto/create-inventory.dto';
import { UpdateInventoryDto } from '../dto/update-inventory.dto';
import { AdjustInventoryDto } from '../dto/adjust-inventory.dto';
import { ReserveInventoryDto } from '../dto/reserve-inventory.dto';
import { UnreserveInventoryDto } from '../dto/unreserve-inventory.dto';
import { InventoryResponseDto, InventoryLogResponseDto } from '../dto/inventory-response.dto';

@Controller('inventory')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('health')
  @HttpCode(HttpStatus.OK)
  async health(): Promise<{ status: string }> {
    return { status: 'ok' };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createInventory(@Body() createInventoryDto: CreateInventoryDto): Promise<InventoryResponseDto> {
    return this.inventoryService.createInventory(createInventoryDto);
  }

  @Get()
  async findAllInventories(): Promise<InventoryResponseDto[]> {
    return this.inventoryService.findAllInventories();
  }

  @Get(':id')
  async findInventoryById(@Param('id') id: string): Promise<InventoryResponseDto> {
    return this.inventoryService.findInventoryById(id);
  }

  @Get('variant/:variantId')
  async findInventoryByVariantId(@Param('variantId') variantId: string): Promise<InventoryResponseDto> {
    return this.inventoryService.findInventoryByVariantId(variantId);
  }

  @Put(':id')
  async updateInventory(
    @Param('id') id: string,
    @Body() updateInventoryDto: UpdateInventoryDto
  ): Promise<InventoryResponseDto> {
    return this.inventoryService.updateInventory(id, updateInventoryDto);
  }

  @Post('adjust')
  @HttpCode(HttpStatus.OK)
  async adjustInventory(@Body() adjustInventoryDto: AdjustInventoryDto): Promise<InventoryResponseDto> {
    return this.inventoryService.adjustInventory(adjustInventoryDto);
  }

  @Post('reserve')
  @HttpCode(HttpStatus.OK)
  async reserveInventory(@Body() reserveInventoryDto: ReserveInventoryDto): Promise<InventoryResponseDto> {
    return this.inventoryService.reserveInventory(reserveInventoryDto);
  }

  @Post('unreserve')
  @HttpCode(HttpStatus.OK)
  async unreserveInventory(@Body() unreserveInventoryDto: UnreserveInventoryDto): Promise<InventoryResponseDto> {
    return this.inventoryService.unreserveInventory(unreserveInventoryDto);
  }

  @Get(':id/logs')
  async getInventoryLogs(@Param('id') id: string): Promise<InventoryLogResponseDto[]> {
    return this.inventoryService.getInventoryLogs(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteInventory(@Param('id') id: string): Promise<void> {
    return this.inventoryService.deleteInventory(id);
  }
}
