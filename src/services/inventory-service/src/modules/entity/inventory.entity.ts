import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Warehouse } from "./warehouse.entity";
import { InventoryLog } from "./inventory_log.entity";

@Entity('inventory')
export class Inventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { nullable: true })
  warehouse_id: string;

  @Column('uuid')
  product_variant_id: string;

  @Column({type: 'bigint', default: 0})
  quantity: number;

  @Column({type: 'bigint', default: 0})
  reserved_quantity: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.inventories, {
      onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @OneToMany(() => InventoryLog, (inventoryLog) => inventoryLog.inventory)
  logs: InventoryLog[]
}