import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('product_variants_replica')
export class ProductVariantReplica {
  @PrimaryGeneratedColumn('uuid')
  variant_id : string;

  @Column('uuid')
  product_id: string;

  @Column('uuid')
  product_variant_id: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}

// TODO: References