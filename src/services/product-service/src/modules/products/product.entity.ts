import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/* =============================
   Category
============================= */
@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  merchant_id: string; // reference merchant service

  @Column({ type: 'varchar', length: 100 })
  name: string;


  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}

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

  @Column({ type: 'uuid', nullable: true })
  merchant_id: string; // reference merchant service

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

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

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @OneToMany(() => ProductVariantValue, (pvValue) => pvValue.variant)
  variantValues: ProductVariantValue[];
}

// =============================
// Product Variant Values (mapping table)
// =============================
@Entity('product_variant_values')
export class ProductVariantValue {
  @PrimaryColumn('uuid')
  variant_id: string;

  @PrimaryColumn('uuid')
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