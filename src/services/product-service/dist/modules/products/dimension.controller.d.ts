import { ProductService } from './product.service';
import { CreateDimensionDto } from './dto/create-dimension.dto';
import { CreateDimensionValueDto } from './dto/create-dimension-value.dto';
export declare class DimensionController {
    private readonly productService;
    constructor(productService: ProductService);
    createDimension(createDimensionDto: CreateDimensionDto): Promise<import("./product.entity").VariantDimension>;
    getDimensions(): Promise<import("./product.entity").VariantDimension[]>;
    addDimensionValue(createDimensionValueDto: CreateDimensionValueDto): Promise<import("./product.entity").VariantDimensionValue>;
    removeDimensionValue(id: string): Promise<void>;
}
