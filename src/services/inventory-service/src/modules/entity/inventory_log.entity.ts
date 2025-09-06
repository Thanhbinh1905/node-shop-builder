import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Inventory } from "./inventory.entity";

export enum InventoryChangeType {
  RESTOCK = 'restock',
  ORDER = 'order',
  ADJUSTMENT = 'adjustment',
}

@Entity('inventory_logs')
export class InventoryLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { nullable: true })
  inventory_id: string;

  @Column({type: 'bigint'})
  change: number;

  @Column({
    type: 'enum',
    enum: InventoryChangeType,
  })
  type: InventoryChangeType;

  @Column({type: 'uuid', nullable: true})
  reference_id: string; /*-- liên kết với order id hay adjustment id*/

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @ManyToOne(() => Inventory, (inventory) => inventory.logs, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'inventory_id' })
  inventory: Inventory;
}