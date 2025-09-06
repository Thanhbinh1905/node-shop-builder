export declare class Product {
    id: string;
    name: string;
    description: string;
    brand: string;
    category_id: string;
    created_at: Date;
    updated_at: Date;
    variants: ProductVariant[];
}
export declare class VariantDimension {
    id: string;
    name: string;
    values: VariantDimensionValue[];
}
export declare class VariantDimensionValue {
    id: string;
    dimension_id: string;
    dimension: VariantDimension;
    value: string;
    variantValues: ProductVariantValue[];
}
export declare class ProductVariant {
    id: string;
    product_id: string;
    product: Product;
    sku: string;
    price: number;
    stock: number;
    created_at: Date;
    updated_at: Date;
    variantValues: ProductVariantValue[];
}
export declare class ProductVariantValue {
    variant_id: string;
    dimension_value_id: string;
    variant: ProductVariant;
    dimension_value: VariantDimensionValue;
}
