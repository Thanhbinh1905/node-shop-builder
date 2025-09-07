# Product Service API Documentation

## Overview
This is a NestJS-based microservice for managing products, variants, and dimensions in an e-commerce system.

## Features
- Product CRUD operations
- Product variant management with dimensions
- Search and filtering capabilities
- Pagination support
- Input validation
- Error handling

## API Endpoints

### Category

#### Create Category
```
POST /categories
Content-Type: application/json

{
  "name": "Product Name",
  "merchant_id": uuid
}
```

#### Delete Category
```
DELETE /categories/:id
```

### Products

#### Create Product
```
POST /products
Content-Type: application/json

{
  "name": "Product Name",
  "description": "Product Description",
  "brand": "Brand Name",
  "category_id": "uuid"
}
```



#### Get All Products
```
GET /products?page=1&limit=10&search=keyword&brand=brand&category_id=uuid&sortBy=created_at&sortOrder=DESC
```

#### Get Product by ID
```
GET /products/:id
```

#### Update Product
```
PUT /products/:id
Content-Type: application/json

{
  "name": "Updated Name",
  "description": "Updated Description"
}
```

#### Delete Product
```
DELETE /products/:id
```

### Product Variants

#### Create Variant
```
POST /products/:productId/variants
Content-Type: application/json

{
  "sku": "SKU-001",
  "price": 99.99,
  "dimensionValueIds": ["uuid1", "uuid2"]
}
```

#### Get Variant
```
GET /products/:productId/variants/:variantId
```

#### Update Variant
```
PUT /products/:productId/variants/:variantId
Content-Type: application/json

{
  "price": 89.99,
}
```

#### Delete Variant
```
DELETE /products/:productId/variants/:variantId
```

### Dimensions

#### Create Dimension
```
POST /dimensions
Content-Type: application/json

{
  "name": "Color"
}
```

#### Get All Dimensions
```
GET /dimensions
```

#### Add Dimension Value
```
POST /dimensions/values
Content-Type: application/json

{
  "dimensionId": "uuid",
  "value": "Red"
}
```

#### Delete Dimension Value
```
DELETE /dimensions/values/:id
```

## Response Format

All successful responses follow this format:
```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

Error responses:
```json
{
  "statusCode": 400,
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/products",
  "method": "POST",
  "message": "Validation failed"
}
```

## Database Schema

### Products
- id (UUID, Primary Key)
- name (String)
- description (String, Optional)
- brand (String, Optional)
- category_id (UUID, Optional)
- created_at (Timestamp)
- updated_at (Timestamp)

### Product Variants
- id (UUID, Primary Key)
- product_id (UUID, Foreign Key)
- sku (String, Unique)
- price (Decimal)
- stock (Integer)
- created_at (Timestamp)
- updated_at (Timestamp)

### Variant Dimensions
- id (UUID, Primary Key)
- name (String)

### Variant Dimension Values
- id (UUID, Primary Key)
- dimension_id (UUID, Foreign Key)
- value (String)

### Product Variant Values (Mapping Table)
- variant_id (UUID, Composite Primary Key)
- dimension_value_id (UUID, Composite Primary Key)

## Running the Service

1. Install dependencies:
```bash
npm install
```

2. Start the service:
```bash
npm run start:dev
```

The service will run on port 3000 by default.

## Environment Variables

- `PORT`: Service port (default: 3000)
- Database connection is configured in `app.module.ts`
