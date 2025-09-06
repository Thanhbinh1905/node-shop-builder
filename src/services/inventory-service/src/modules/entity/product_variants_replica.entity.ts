import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Inventory } from "./inventory.entity";

@Entity('product_variants_replica')
export class ProductVariantReplica {
  @PrimaryGeneratedColumn('uuid')
  variant_id : string;

  @Column('uuid')
  product_id: string;

  @Column('uuid')
  merchant_id: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @OneToMany(() => Inventory, (inventory) => inventory.productVariant)
  inventories: Inventory[];
}