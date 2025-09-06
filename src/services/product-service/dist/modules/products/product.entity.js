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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductVariantValue = exports.ProductVariant = exports.VariantDimensionValue = exports.VariantDimension = exports.Product = exports.Category = void 0;
const typeorm_1 = require("typeorm");
let Category = class Category {
    id;
    merchant_id;
    name;
    created_at;
    updated_at;
    products;
};
exports.Category = Category;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Category.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Category.prototype, "merchant_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Category.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Category.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Category.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Product, (product) => product.category),
    __metadata("design:type", Array)
], Category.prototype, "products", void 0);
exports.Category = Category = __decorate([
    (0, typeorm_1.Entity)('categories')
], Category);
let Product = class Product {
    id;
    name;
    description;
    brand;
    category_id;
    merchant_id;
    created_at;
    updated_at;
    category;
    variants;
};
exports.Product = Product;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Product.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Product.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "brand", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "category_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "merchant_id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Product.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Product.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Category, (category) => category.products, {
        onDelete: 'SET NULL',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'category_id' }),
    __metadata("design:type", Category)
], Product.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ProductVariant, (variant) => variant.product),
    __metadata("design:type", Array)
], Product.prototype, "variants", void 0);
exports.Product = Product = __decorate([
    (0, typeorm_1.Entity)('products')
], Product);
let VariantDimension = class VariantDimension {
    id;
    name;
    values;
};
exports.VariantDimension = VariantDimension;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], VariantDimension.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], VariantDimension.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => VariantDimensionValue, (dimensionValue) => dimensionValue.dimension),
    __metadata("design:type", Array)
], VariantDimension.prototype, "values", void 0);
exports.VariantDimension = VariantDimension = __decorate([
    (0, typeorm_1.Entity)('variant_dimensions')
], VariantDimension);
let VariantDimensionValue = class VariantDimensionValue {
    id;
    dimension_id;
    dimension;
    value;
    variantValues;
};
exports.VariantDimensionValue = VariantDimensionValue;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], VariantDimensionValue.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], VariantDimensionValue.prototype, "dimension_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => VariantDimension, (dimension) => dimension.values, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'dimension_id' }),
    __metadata("design:type", VariantDimension)
], VariantDimensionValue.prototype, "dimension", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], VariantDimensionValue.prototype, "value", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ProductVariantValue, (pvValue) => pvValue.dimension_value),
    __metadata("design:type", Array)
], VariantDimensionValue.prototype, "variantValues", void 0);
exports.VariantDimensionValue = VariantDimensionValue = __decorate([
    (0, typeorm_1.Entity)('variant_dimension_values')
], VariantDimensionValue);
let ProductVariant = class ProductVariant {
    id;
    product_id;
    product;
    sku;
    price;
    stock;
    created_at;
    updated_at;
    variantValues;
};
exports.ProductVariant = ProductVariant;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ProductVariant.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], ProductVariant.prototype, "product_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Product, (product) => product.variants, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", Product)
], ProductVariant.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], ProductVariant.prototype, "sku", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2 }),
    __metadata("design:type", Number)
], ProductVariant.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], ProductVariant.prototype, "stock", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], ProductVariant.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], ProductVariant.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ProductVariantValue, (pvValue) => pvValue.variant),
    __metadata("design:type", Array)
], ProductVariant.prototype, "variantValues", void 0);
exports.ProductVariant = ProductVariant = __decorate([
    (0, typeorm_1.Entity)('product_variants')
], ProductVariant);
let ProductVariantValue = class ProductVariantValue {
    variant_id;
    dimension_value_id;
    variant;
    dimension_value;
};
exports.ProductVariantValue = ProductVariantValue;
__decorate([
    (0, typeorm_1.PrimaryColumn)('uuid'),
    __metadata("design:type", String)
], ProductVariantValue.prototype, "variant_id", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)('uuid'),
    __metadata("design:type", String)
], ProductVariantValue.prototype, "dimension_value_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ProductVariant, (variant) => variant.variantValues, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'variant_id' }),
    __metadata("design:type", ProductVariant)
], ProductVariantValue.prototype, "variant", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => VariantDimensionValue, (dimensionValue) => dimensionValue.variantValues, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'dimension_value_id' }),
    __metadata("design:type", VariantDimensionValue)
], ProductVariantValue.prototype, "dimension_value", void 0);
exports.ProductVariantValue = ProductVariantValue = __decorate([
    (0, typeorm_1.Entity)('product_variant_values')
], ProductVariantValue);
//# sourceMappingURL=product.entity.js.map