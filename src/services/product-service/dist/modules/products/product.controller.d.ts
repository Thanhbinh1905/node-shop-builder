import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { QueryProductDto } from './dto/query-product.dto';
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    createProduct(createProductDto: CreateProductDto): Promise<import("./product.entity").Product>;
    findAllProducts(query: QueryProductDto): Promise<{
        data: import("./product.entity").Product[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOneProduct(id: string): Promise<import("./product.entity").Product>;
    updateProduct(id: string, updateProductDto: UpdateProductDto): Promise<import("./product.entity").Product>;
    removeProduct(id: string): Promise<void>;
    createVariant(productId: string, createVariantDto: CreateVariantDto): Promise<import("./product.entity").ProductVariant>;
    findVariant(variantId: string): Promise<import("./product.entity").ProductVariant>;
    updateVariant(variantId: string, updateVariantDto: UpdateVariantDto): Promise<import("./product.entity").ProductVariant>;
    removeVariant(variantId: string): Promise<void>;
}
