import { Injectable, NotFoundException, BadRequestException, Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { TOPICS } from '../../../config/kafka.config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindManyOptions, LessThan } from 'typeorm';
import { Product, ProductVariant, VariantDimension, VariantDimensionValue, ProductVariantValue, Category } from '../entity/product.entity';
import { QueryProductDto } from '../dto/query-product.dto';

@Injectable()
export class ProductService implements OnModuleInit {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectRepository(ProductVariant)
    private readonly variantRepo: Repository<ProductVariant>,

    @InjectRepository(VariantDimension)
    private readonly dimensionRepo: Repository<VariantDimension>,

    @InjectRepository(VariantDimensionValue)
    private readonly dimensionValueRepo: Repository<VariantDimensionValue>,

    @InjectRepository(ProductVariantValue)
    private readonly variantValueRepo: Repository<ProductVariantValue>,

    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,

    @Inject('KAFKA_PRODUCT_CLIENT')
    private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
  }
  // =============================
  // Category CRUD
  // =============================

  async createCategory(data: Partial<Category>): Promise<Category> {
    const category = this.categoryRepo.create(data)
    return this.categoryRepo.save(category)
  }

  async removeCategory(id: string): Promise<void> {
    await this.categoryRepo.delete(id)
  }

  // =============================
  // Product CRUD
  // =============================
  async createProduct(data: Partial<Product>): Promise<Product> {
    const product = this.productRepo.create(data);
    return this.productRepo.save(product);
  }

  async findAllProducts(query: QueryProductDto): Promise<{
    data: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { page = 1, limit = 10, search, brand, category_id, sortBy = 'created_at', sortOrder = 'DESC' } = query;
    
    const where: any = {};
    
    if (search) {
      where.name = Like(`%${search}%`);
    }
    
    if (brand) {
      where.brand = brand;
    }
    
    if (category_id) {
      where.category_id = category_id;
    }

    const findOptions: FindManyOptions<Product> = {
      where,
      relations: ['variants', 'variants.variantValues', 'variants.variantValues.dimension_value'],
      order: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    };

    const [data, total] = await this.productRepo.findAndCount(findOptions);
    
    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOneProduct(id: string): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['variants', 'variants.variantValues'],
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    await this.productRepo.update(id, data);
    return this.findOneProduct(id);
  }

  async removeProduct(id: string): Promise<void> {
    await this.productRepo.delete(id);
  }

  // =============================
  // Variant CRUD
  // =============================
  async createVariant(
    productId: string,
    data: { sku: string; price: number; stock?: number; dimensionValueIds?: string[] },
  ): Promise<ProductVariant> {
    const product = await this.findOneProduct(productId);

    // Check if SKU already exists
    const existingVariant = await this.variantRepo.findOne({ where: { sku: data.sku } });
    if (existingVariant) {
      throw new BadRequestException('SKU already exists');
    }

    // Validate dimension values if provided
    if (data.dimensionValueIds && data.dimensionValueIds.length > 0) {
      const dimensionValues = await this.dimensionValueRepo.findByIds(data.dimensionValueIds);
      if (dimensionValues.length !== data.dimensionValueIds.length) {
        throw new BadRequestException('Some dimension values are invalid');
      }
    }

    // Create variant
    const variant = this.variantRepo.create({
      product,
      sku: data.sku,
      price: data.price,
    });
    const savedVariant = await this.variantRepo.save(variant);

    // Attach dimension values
    if (data.dimensionValueIds && data.dimensionValueIds.length > 0) {
      const pvValues = data.dimensionValueIds.map((valueId) =>
        this.variantValueRepo.create({
          variant: savedVariant,
          dimension_value: { id: valueId } as VariantDimensionValue,
        }),
      );
      await this.variantValueRepo.save(pvValues);
    }

    const fullVariant = await this.findVariant(savedVariant.id);

    // Emit Kafka event for inventory-service
    await this.kafkaClient.emit(TOPICS.PRODUCT_VARIANT_CREATED, {
      key: fullVariant.id,
      value: {
        variant_id: fullVariant.id,
        product_id: fullVariant.product_id,
        merchant_id: fullVariant.product.merchant_id,
        sku: fullVariant.sku,
        price: fullVariant.price,
        created_at: fullVariant.created_at,
      },
    });

    return fullVariant;
  }

  async findVariant(id: string): Promise<ProductVariant> {
    const variant = await this.variantRepo.findOne({
      where: { id },
      relations: ['product', 'variantValues', 'variantValues.dimension_value'],
    });
    if (!variant) throw new NotFoundException('Variant not found');
    return variant;
  }

  async updateVariant(
    id: string,
    data: Partial<ProductVariant>,
  ): Promise<ProductVariant> {
    await this.variantRepo.update(id, data);
    return this.findVariant(id);
  }

  async removeVariant(id: string): Promise<void> {
    await this.variantRepo.delete(id);
  }

  // =============================
  // Dimension & Values
  // =============================
  async createDimension(name: string): Promise<VariantDimension> {
    const dim = this.dimensionRepo.create({ name });
    return this.dimensionRepo.save(dim);
  }

  async addDimensionValue(
    dimensionId: string,
    value: string,
  ): Promise<VariantDimensionValue> {
    const dim = await this.dimensionRepo.findOne({ where: { id: dimensionId } });
    if (!dim) throw new NotFoundException('Dimension not found');

    const dimValue = this.dimensionValueRepo.create({ dimension: dim, value });
    return this.dimensionValueRepo.save(dimValue);
  }

  async getDimensions(): Promise<VariantDimension[]> {
    return this.dimensionRepo.find({ relations: ['values'] });
  }

  // =============================
  // Additional Utility Methods
  // =============================
  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    return this.productRepo.find({
      where: { category_id: categoryId },
      relations: ['variants', 'variants.variantValues'],
    });
  }

  async getProductsByBrand(brand: string): Promise<Product[]> {
    return this.productRepo.find({
      where: { brand },
      relations: ['variants', 'variants.variantValues'],
    });
  }

  async searchProducts(searchTerm: string): Promise<Product[]> {
    return this.productRepo.find({
      where: [
        { name: Like(`%${searchTerm}%`) },
        { description: Like(`%${searchTerm}%`) },
        { brand: Like(`%${searchTerm}%`) },
      ],
      relations: ['variants', 'variants.variantValues'],
    });
  }

  // Inventory stock is managed by inventory-service via replicas and logs

  async removeDimensionValue(id: string): Promise<void> {
    const result = await this.dimensionValueRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Dimension value not found');
    }
  }
}
