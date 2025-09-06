import { Repository } from 'typeorm';
import { Product, ProductVariant, VariantDimension, VariantDimensionValue, ProductVariantValue } from './product.entity';
import { QueryProductDto } from './dto/query-product.dto';
export declare class ProductService {
    private readonly productRepo;
    private readonly variantRepo;
    private readonly dimensionRepo;
    private readonly dimensionValueRepo;
    private readonly variantValueRepo;
    constructor(productRepo: Repository<Product>, variantRepo: Repository<ProductVariant>, dimensionRepo: Repository<VariantDimension>, dimensionValueRepo: Repository<VariantDimensionValue>, variantValueRepo: Repository<ProductVariantValue>);
    createProduct(data: Partial<Product>): Promise<Product>;
    findAllProducts(query: QueryProductDto): Promise<{
        data: Product[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOneProduct(id: string): Promise<Product>;
    updateProduct(id: string, data: Partial<Product>): Promise<Product>;
    removeProduct(id: string): Promise<void>;
    createVariant(productId: string, data: {
        sku: string;
        price: number;
        stock?: number;
        dimensionValueIds?: string[];
    }): Promise<ProductVariant>;
    findVariant(id: string): Promise<ProductVariant>;
    updateVariant(id: string, data: Partial<ProductVariant>): Promise<ProductVariant>;
    removeVariant(id: string): Promise<void>;
    createDimension(name: string): Promise<VariantDimension>;
    addDimensionValue(dimensionId: string, value: string): Promise<VariantDimensionValue>;
    getDimensions(): Promise<VariantDimension[]>;
    getProductsByCategory(categoryId: string): Promise<Product[]>;
    getProductsByBrand(brand: string): Promise<Product[]>;
    searchProducts(searchTerm: string): Promise<Product[]>;
    updateVariantStock(variantId: string, stock: number): Promise<ProductVariant>;
    getLowStockVariants(threshold?: number): Promise<ProductVariant[]>;
    removeDimensionValue(id: string): Promise<void>;
}
