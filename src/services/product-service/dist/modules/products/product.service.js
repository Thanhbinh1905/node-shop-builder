"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("./product.entity");
let ProductService = class ProductService {
    productRepo;
    variantRepo;
    dimensionRepo;
    dimensionValueRepo;
    variantValueRepo;
    constructor(productRepo, variantRepo, dimensionRepo, dimensionValueRepo, variantValueRepo) {
        this.productRepo = productRepo;
        this.variantRepo = variantRepo;
        this.dimensionRepo = dimensionRepo;
        this.dimensionValueRepo = dimensionValueRepo;
        this.variantValueRepo = variantValueRepo;
    }
    async createProduct(data) {
        const product = this.productRepo.create(data);
        return this.productRepo.save(product);
    }
    async findAllProducts(query) {
        const { page = 1, limit = 10, search, brand, category_id, sortBy = 'created_at', sortOrder = 'DESC' } = query;
        const where = {};
        if (search) {
            where.name = (0, typeorm_2.Like)(`%${search}%`);
        }
        if (brand) {
            where.brand = brand;
        }
        if (category_id) {
            where.category_id = category_id;
        }
        const findOptions = {
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
    async findOneProduct(id) {
        const product = await this.productRepo.findOne({
            where: { id },
            relations: ['variants', 'variants.variantValues'],
        });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return product;
    }
    async updateProduct(id, data) {
        await this.productRepo.update(id, data);
        return this.findOneProduct(id);
    }
    async removeProduct(id) {
        await this.productRepo.delete(id);
    }
    async createVariant(productId, data) {
        const product = await this.findOneProduct(productId);
        const existingVariant = await this.variantRepo.findOne({ where: { sku: data.sku } });
        if (existingVariant) {
            throw new common_1.BadRequestException('SKU already exists');
        }
        if (data.dimensionValueIds && data.dimensionValueIds.length > 0) {
            const dimensionValues = await this.dimensionValueRepo.findByIds(data.dimensionValueIds);
            if (dimensionValues.length !== data.dimensionValueIds.length) {
                throw new common_1.BadRequestException('Some dimension values are invalid');
            }
        }
        const variant = this.variantRepo.create({
            product,
            sku: data.sku,
            price: data.price,
            stock: data.stock || 0,
        });
        const savedVariant = await this.variantRepo.save(variant);
        if (data.dimensionValueIds && data.dimensionValueIds.length > 0) {
            const pvValues = data.dimensionValueIds.map((valueId) => this.variantValueRepo.create({
                variant: savedVariant,
                dimension_value: { id: valueId },
            }));
            await this.variantValueRepo.save(pvValues);
        }
        return this.findVariant(savedVariant.id);
    }
    async findVariant(id) {
        const variant = await this.variantRepo.findOne({
            where: { id },
            relations: ['variantValues', 'variantValues.dimension_value'],
        });
        if (!variant)
            throw new common_1.NotFoundException('Variant not found');
        return variant;
    }
    async updateVariant(id, data) {
        await this.variantRepo.update(id, data);
        return this.findVariant(id);
    }
    async removeVariant(id) {
        await this.variantRepo.delete(id);
    }
    async createDimension(name) {
        const dim = this.dimensionRepo.create({ name });
        return this.dimensionRepo.save(dim);
    }
    async addDimensionValue(dimensionId, value) {
        const dim = await this.dimensionRepo.findOne({ where: { id: dimensionId } });
        if (!dim)
            throw new common_1.NotFoundException('Dimension not found');
        const dimValue = this.dimensionValueRepo.create({ dimension: dim, value });
        return this.dimensionValueRepo.save(dimValue);
    }
    async getDimensions() {
        return this.dimensionRepo.find({ relations: ['values'] });
    }
    async getProductsByCategory(categoryId) {
        return this.productRepo.find({
            where: { category_id: categoryId },
            relations: ['variants', 'variants.variantValues'],
        });
    }
    async getProductsByBrand(brand) {
        return this.productRepo.find({
            where: { brand },
            relations: ['variants', 'variants.variantValues'],
        });
    }
    async searchProducts(searchTerm) {
        return this.productRepo.find({
            where: [
                { name: (0, typeorm_2.Like)(`%${searchTerm}%`) },
                { description: (0, typeorm_2.Like)(`%${searchTerm}%`) },
                { brand: (0, typeorm_2.Like)(`%${searchTerm}%`) },
            ],
            relations: ['variants', 'variants.variantValues'],
        });
    }
    async updateVariantStock(variantId, stock) {
        await this.variantRepo.update(variantId, { stock });
        return this.findVariant(variantId);
    }
    async getLowStockVariants(threshold = 10) {
        return this.variantRepo.find({
            where: { stock: (0, typeorm_2.LessThan)(threshold) },
            relations: ['product', 'variantValues', 'variantValues.dimension_value'],
        });
    }
    async removeDimensionValue(id) {
        const result = await this.dimensionValueRepo.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException('Dimension value not found');
        }
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.ProductVariant)),
    __param(2, (0, typeorm_1.InjectRepository)(product_entity_1.VariantDimension)),
    __param(3, (0, typeorm_1.InjectRepository)(product_entity_1.VariantDimensionValue)),
    __param(4, (0, typeorm_1.InjectRepository)(product_entity_1.ProductVariantValue)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ProductService);
//# sourceMappingURL=product.service.js.map