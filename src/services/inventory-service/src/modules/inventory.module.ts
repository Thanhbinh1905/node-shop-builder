import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory } from './entity/inventory.entity';
import { InventoryLog } from './entity/inventory_log.entity';
import { ProductVariantReplica } from './entity/product_variants_replica.entity';
import { InventoryService } from './service/service.service';
import { InventoryController } from './controller/controller.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Inventory,
      InventoryLog,
      ProductVariantReplica,
    ]),
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}
