import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { InventoryLog } from "./inventory_log.entity";
import { ProductVariantReplica } from "./product_variants_replica.entity";

@Entity('inventory')
export class Inventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { nullable: true })
  variant_id: string;

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

  @ManyToOne(() => ProductVariantReplica, (productVariant) => productVariant.inventories, {
      onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'product_variant_id' })
  productVariant: ProductVariantReplica;
  
  @OneToMany(() => InventoryLog, (inventoryLog) => inventoryLog.inventory)
  logs: InventoryLog[]
}