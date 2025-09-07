"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModule = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const config_1 = require("@nestjs/config");
const product_controller_1 = require("./controller/product.controller");
const dimension_controller_1 = require("./controller/dimension.controller");
const category_controller_1 = require("./controller/category.controller");
const product_service_1 = require("./service/product.service");
const product_entity_1 = require("./entity/product.entity");
const typeorm_1 = require("@nestjs/typeorm");
let ProductModule = class ProductModule {
};
exports.ProductModule = ProductModule;
exports.ProductModule = ProductModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            typeorm_1.TypeOrmModule.forFeature([
                product_entity_1.Product,
                product_entity_1.ProductVariant,
                product_entity_1.VariantDimension,
                product_entity_1.VariantDimensionValue,
                product_entity_1.ProductVariantValue,
                product_entity_1.Category
            ]),
            microservices_1.ClientsModule.registerAsync([
                {
                    name: 'KAFKA_PRODUCT_CLIENT',
                    imports: [config_1.ConfigModule],
                    inject: [config_1.ConfigService],
                    useFactory: (configService) => ({
                        transport: microservices_1.Transport.KAFKA,
                        options: {
                            client: {
                                clientId: configService.get('KAFKA_CLIENT_ID') || 'product-service',
                                brokers: (configService.get('KAFKA_BROKERS') || 'localhost:9092').split(','),
                            },
                            producerOnlyMode: true,
                        },
                    }),
                },
            ]),
        ],
        controllers: [product_controller_1.ProductController, dimension_controller_1.DimensionController, category_controller_1.CategoryController],
        providers: [product_service_1.ProductService],
        exports: [product_service_1.ProductService],
    })
], ProductModule);
//# sourceMappingURL=product.module.js.map