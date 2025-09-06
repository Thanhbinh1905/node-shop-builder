import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory } from '../entity/inventory.entity';
import { InventoryLog, InventoryChangeType } from '../entity/inventory_log.entity';
import { ProductVariantReplica } from '../entity/product_variants_replica.entity';
import { CreateInventoryDto } from '../dto/create-inventory.dto';
import { UpdateInventoryDto } from '../dto/update-inventory.dto';
import { AdjustInventoryDto } from '../dto/adjust-inventory.dto';
import { ReserveInventoryDto } from '../dto/reserve-inventory.dto';
import { UnreserveInventoryDto } from '../dto/unreserve-inventory.dto';
import { InventoryResponseDto, InventoryLogResponseDto } from '../dto/inventory-response.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    @InjectRepository(InventoryLog)
    private readonly inventoryLogRepository: Repository<InventoryLog>,
    @InjectRepository(ProductVariantReplica)
    private readonly productVariantRepository: Repository<ProductVariantReplica>,
  ) {}

  async createInventory(createInventoryDto: CreateInventoryDto): Promise<InventoryResponseDto> {
    // Check if product variant exists
    const productVariant = await this.productVariantRepository.findOne({
      where: { variant_id: createInventoryDto.product_variant_id }
    });

    if (!productVariant) {
      throw new NotFoundException('Product variant not found');
    }

    // Check if inventory already exists for this variant
    const existingInventory = await this.inventoryRepository.findOne({
      where: { product_variant_id: createInventoryDto.product_variant_id }
    });

    if (existingInventory) {
      throw new BadRequestException('Inventory already exists for this product variant');
    }

    const inventory = this.inventoryRepository.create({
      product_variant_id: createInventoryDto.product_variant_id,
      quantity: createInventoryDto.quantity || 0,
      reserved_quantity: createInventoryDto.reserved_quantity || 0,
    });

    const savedInventory = await this.inventoryRepository.save(inventory);
    return this.mapToResponseDto(savedInventory);
  }

  async findAllInventories(): Promise<InventoryResponseDto[]> {
    const inventories = await this.inventoryRepository.find({
      relations: ['productVariant'],
      order: { created_at: 'DESC' }
    });

    return inventories.map(inventory => this.mapToResponseDto(inventory));
  }

  async findInventoryById(id: string): Promise<InventoryResponseDto> {
    const inventory = await this.inventoryRepository.findOne({
      where: { id },
      relations: ['productVariant']
    });

    if (!inventory) {
      throw new NotFoundException('Inventory not found');
    }

    return this.mapToResponseDto(inventory);
  }

  async findInventoryByVariantId(variantId: string): Promise<InventoryResponseDto> {
    const inventory = await this.inventoryRepository.findOne({
      where: { product_variant_id: variantId },
      relations: ['productVariant']
    });

    if (!inventory) {
      throw new NotFoundException('Inventory not found for this product variant');
    }

    return this.mapToResponseDto(inventory);
  }

  async updateInventory(id: string, updateInventoryDto: UpdateInventoryDto): Promise<InventoryResponseDto> {
    const inventory = await this.inventoryRepository.findOne({
      where: { id }
    });

    if (!inventory) {
      throw new NotFoundException('Inventory not found');
    }

    // Validate that reserved quantity doesn't exceed total quantity
    if (updateInventoryDto.quantity !== undefined && 
        updateInventoryDto.reserved_quantity !== undefined &&
        updateInventoryDto.reserved_quantity > updateInventoryDto.quantity) {
      throw new BadRequestException('Reserved quantity cannot exceed total quantity');
    }

    if (updateInventoryDto.quantity !== undefined) {
      inventory.quantity = updateInventoryDto.quantity;
    }

    if (updateInventoryDto.reserved_quantity !== undefined) {
      inventory.reserved_quantity = updateInventoryDto.reserved_quantity;
    }

    const updatedInventory = await this.inventoryRepository.save(inventory);
    return this.mapToResponseDto(updatedInventory);
  }

  async adjustInventory(adjustInventoryDto: AdjustInventoryDto): Promise<InventoryResponseDto> {
    const inventory = await this.inventoryRepository.findOne({
      where: { id: adjustInventoryDto.inventory_id }
    });

    if (!inventory) {
      throw new NotFoundException('Inventory not found');
    }

    const newQuantity = inventory.quantity + adjustInventoryDto.change;

    if (newQuantity < 0) {
      throw new BadRequestException('Insufficient inventory quantity');
    }

    // Check if reserved quantity would exceed total quantity
    if (inventory.reserved_quantity > newQuantity) {
      throw new BadRequestException('Reserved quantity cannot exceed total quantity');
    }

    inventory.quantity = newQuantity;

    // Create inventory log
    const inventoryLog = this.inventoryLogRepository.create({
      inventory_id: inventory.id,
      change: adjustInventoryDto.change,
      type: adjustInventoryDto.type,
      reference_id: adjustInventoryDto.reference_id,
    });

    await this.inventoryLogRepository.save(inventoryLog);
    const updatedInventory = await this.inventoryRepository.save(inventory);

    return this.mapToResponseDto(updatedInventory);
  }

  async reserveInventory(reserveInventoryDto: ReserveInventoryDto): Promise<InventoryResponseDto> {
    const inventory = await this.inventoryRepository.findOne({
      where: { id: reserveInventoryDto.inventory_id }
    });

    if (!inventory) {
      throw new NotFoundException('Inventory not found');
    }

    const availableQuantity = inventory.quantity - inventory.reserved_quantity;

    if (availableQuantity < reserveInventoryDto.quantity) {
      throw new BadRequestException('Insufficient available inventory');
    }

    inventory.reserved_quantity += reserveInventoryDto.quantity;

    // Create inventory log
    const inventoryLog = this.inventoryLogRepository.create({
      inventory_id: inventory.id,
      change: -reserveInventoryDto.quantity, // Negative change for reservation
      type: InventoryChangeType.ORDER,
      reference_id: reserveInventoryDto.reference_id,
    });

    await this.inventoryLogRepository.save(inventoryLog);
    const updatedInventory = await this.inventoryRepository.save(inventory);

    return this.mapToResponseDto(updatedInventory);
  }

  async unreserveInventory(unreserveInventoryDto: UnreserveInventoryDto): Promise<InventoryResponseDto> {
    const inventory = await this.inventoryRepository.findOne({
      where: { id: unreserveInventoryDto.inventory_id }
    });

    if (!inventory) {
      throw new NotFoundException('Inventory not found');
    }

    if (inventory.reserved_quantity < unreserveInventoryDto.quantity) {
      throw new BadRequestException('Cannot unreserve more than currently reserved');
    }

    inventory.reserved_quantity -= unreserveInventoryDto.quantity;

    // Create inventory log
    const inventoryLog = this.inventoryLogRepository.create({
      inventory_id: inventory.id,
      change: unreserveInventoryDto.quantity, // Positive change for unreservation
      type: InventoryChangeType.ORDER,
      reference_id: unreserveInventoryDto.reference_id,
    });

    await this.inventoryLogRepository.save(inventoryLog);
    const updatedInventory = await this.inventoryRepository.save(inventory);

    return this.mapToResponseDto(updatedInventory);
  }

  async getInventoryLogs(inventoryId: string): Promise<InventoryLogResponseDto[]> {
    const logs = await this.inventoryLogRepository.find({
      where: { inventory_id: inventoryId },
      order: { created_at: 'DESC' }
    });

    return logs.map(log => ({
      id: log.id,
      inventory_id: log.inventory_id,
      change: log.change,
      type: log.type,
      reference_id: log.reference_id,
      created_at: log.created_at,
    }));
  }

  async deleteInventory(id: string): Promise<void> {
    const inventory = await this.inventoryRepository.findOne({
      where: { id }
    });

    if (!inventory) {
      throw new NotFoundException('Inventory not found');
    }

    if (inventory.reserved_quantity > 0) {
      throw new BadRequestException('Cannot delete inventory with reserved quantity');
    }

    await this.inventoryRepository.remove(inventory);
  }

  private mapToResponseDto(inventory: Inventory): InventoryResponseDto {
    return {
      id: inventory.id,
      variant_id: inventory.variant_id,
      product_variant_id: inventory.product_variant_id,
      quantity: inventory.quantity,
      reserved_quantity: inventory.reserved_quantity,
      available_quantity: inventory.quantity - inventory.reserved_quantity,
      created_at: inventory.created_at,
      updated_at: inventory.updated_at,
    };
  }
}
