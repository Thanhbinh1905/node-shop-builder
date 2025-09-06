import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

// =============================
// Product
// =============================
@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  brand: string;

  @Column({ type: 'uuid', nullable: true })
  category_id: string;

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  updated_at: Date;

  @OneToMany(() => ProductVariant, (variant) => variant.product)
  variants: ProductVariant[];
}



// =============================
// Variant Dimensions
// =============================
@Entity('variant_dimensions')
export class VariantDimension {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(
    () => VariantDimensionValue,
    (dimensionValue) => dimensionValue.dimension,
  )
  values: VariantDimensionValue[];
}

// =============================
// Variant Dimension Values
// =============================
@Entity('variant_dimension_values')
export class VariantDimensionValue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  dimension_id: string;

  @ManyToOne(() => VariantDimension, (dimension) => dimension.values, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'dimension_id' })
  dimension: VariantDimension;

  @Column()
  value: string;

  @OneToMany(
    () => ProductVariantValue,
    (pvValue) => pvValue.dimension_value,
  )
  variantValues: ProductVariantValue[];
}

// =============================
// Product Variants
// =============================
@Entity('product_variants')
export class ProductVariant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  product_id: string;

  @ManyToOne(() => Product, (product) => product.variants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ unique: true })
  sku: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  updated_at: Date;

  @OneToMany(() => ProductVariantValue, (pvValue) => pvValue.variant)
  variantValues: ProductVariantValue[];
}

// =============================
// Product Variant Values (mapping table)
// =============================
@Entity('product_variant_values')
export class ProductVariantValue {
  @Column('uuid', { primary: true })
  variant_id: string;

  @Column('uuid', { primary: true })
  dimension_value_id: string;

  @ManyToOne(() => ProductVariant, (variant) => variant.variantValues, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'variant_id' })
  variant: ProductVariant;

  @ManyToOne(
    () => VariantDimensionValue,
    (dimensionValue) => dimensionValue.variantValues,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'dimension_value_id' })
  dimension_value: VariantDimensionValue;
}
