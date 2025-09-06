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
exports.DimensionController = void 0;
const common_1 = require("@nestjs/common");
const product_service_1 = require("./product.service");
const create_dimension_dto_1 = require("./dto/create-dimension.dto");
const create_dimension_value_dto_1 = require("./dto/create-dimension-value.dto");
let DimensionController = class DimensionController {
    productService;
    constructor(productService) {
        this.productService = productService;
    }
    async createDimension(createDimensionDto) {
        return this.productService.createDimension(createDimensionDto.name);
    }
    async getDimensions() {
        return this.productService.getDimensions();
    }
    async addDimensionValue(createDimensionValueDto) {
        return this.productService.addDimensionValue(createDimensionValueDto.dimensionId, createDimensionValueDto.value);
    }
    async removeDimensionValue(id) {
        return this.productService.removeDimensionValue(id);
    }
};
exports.DimensionController = DimensionController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_dimension_dto_1.CreateDimensionDto]),
    __metadata("design:returntype", Promise)
], DimensionController.prototype, "createDimension", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DimensionController.prototype, "getDimensions", null);
__decorate([
    (0, common_1.Post)('values'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_dimension_value_dto_1.CreateDimensionValueDto]),
    __metadata("design:returntype", Promise)
], DimensionController.prototype, "addDimensionValue", null);
__decorate([
    (0, common_1.Delete)('values/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DimensionController.prototype, "removeDimensionValue", null);
exports.DimensionController = DimensionController = __decorate([
    (0, common_1.Controller)('dimensions'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __metadata("design:paramtypes", [product_service_1.ProductService])
], DimensionController);
//# sourceMappingURL=dimension.controller.js.map