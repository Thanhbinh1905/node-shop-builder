# Inventory Service API Documentation

## Overview
The Inventory Service provides comprehensive inventory management functionality including CRUD operations, inventory adjustments, reservations, and detailed logging.

## Base URL
```
http://localhost:3000/inventory
```

## Endpoints

### 1. Create Inventory
**POST** `/inventory`

Creates a new inventory record for a product variant.

**Request Body:**
```json
{
  "product_variant_id": "uuid",
  "quantity": 100,
  "reserved_quantity": 0
}
```

**Response:**
```json
{
  "id": "uuid",
  "variant_id": "uuid",
  "product_variant_id": "uuid",
  "quantity": 100,
  "reserved_quantity": 0,
  "available_quantity": 100,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

### 2. Get All Inventories
**GET** `/inventory`

Retrieves all inventory records.

**Response:**
```json
[
  {
    "id": "uuid",
    "variant_id": "uuid",
    "product_variant_id": "uuid",
    "quantity": 100,
    "reserved_quantity": 10,
    "available_quantity": 90,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

### 3. Get Inventory by ID
**GET** `/inventory/:id`

Retrieves a specific inventory record by ID.

**Response:**
```json
{
  "id": "uuid",
  "variant_id": "uuid",
  "product_variant_id": "uuid",
  "quantity": 100,
  "reserved_quantity": 10,
  "available_quantity": 90,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

### 4. Get Inventory by Variant ID
**GET** `/inventory/variant/:variantId`

Retrieves inventory record by product variant ID.

**Response:**
```json
{
  "id": "uuid",
  "variant_id": "uuid",
  "product_variant_id": "uuid",
  "quantity": 100,
  "reserved_quantity": 10,
  "available_quantity": 90,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

### 5. Update Inventory
**PUT** `/inventory/:id`

Updates an existing inventory record.

**Request Body:**
```json
{
  "quantity": 150,
  "reserved_quantity": 20
}
```

**Response:**
```json
{
  "id": "uuid",
  "variant_id": "uuid",
  "product_variant_id": "uuid",
  "quantity": 150,
  "reserved_quantity": 20,
  "available_quantity": 130,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

### 6. Adjust Inventory
**POST** `/inventory/adjust`

Adjusts inventory quantity with logging.

**Request Body:**
```json
{
  "inventory_id": "uuid",
  "change": 50,
  "type": "restock",
  "reference_id": "uuid"
}
```

**Types:**
- `restock`: Adding inventory
- `order`: Order-related changes
- `adjustment`: Manual adjustments

**Response:**
```json
{
  "id": "uuid",
  "variant_id": "uuid",
  "product_variant_id": "uuid",
  "quantity": 200,
  "reserved_quantity": 20,
  "available_quantity": 180,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

### 7. Reserve Inventory
**POST** `/inventory/reserve`

Reserves inventory for an order.

**Request Body:**
```json
{
  "inventory_id": "uuid",
  "quantity": 5,
  "reference_id": "order-uuid"
}
```

**Response:**
```json
{
  "id": "uuid",
  "variant_id": "uuid",
  "product_variant_id": "uuid",
  "quantity": 200,
  "reserved_quantity": 25,
  "available_quantity": 175,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

### 8. Unreserve Inventory
**POST** `/inventory/unreserve`

Releases reserved inventory.

**Request Body:**
```json
{
  "inventory_id": "uuid",
  "quantity": 5,
  "reference_id": "order-uuid"
}
```

**Response:**
```json
{
  "id": "uuid",
  "variant_id": "uuid",
  "product_variant_id": "uuid",
  "quantity": 200,
  "reserved_quantity": 20,
  "available_quantity": 180,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

### 9. Get Inventory Logs
**GET** `/inventory/:id/logs`

Retrieves all logs for a specific inventory.

**Response:**
```json
[
  {
    "id": "uuid",
    "inventory_id": "uuid",
    "change": 50,
    "type": "restock",
    "reference_id": "uuid",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

### 10. Delete Inventory
**DELETE** `/inventory/:id`

Deletes an inventory record (only if no reserved quantity).

**Response:** `204 No Content`

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Inventory not found",
  "error": "Not Found"
}
```

### 409 Conflict
```json
{
  "statusCode": 409,
  "message": "Inventory already exists for this product variant",
  "error": "Conflict"
}
```

## Business Rules

1. **Inventory Creation**: Only one inventory record per product variant
2. **Quantity Validation**: Reserved quantity cannot exceed total quantity
3. **Reservation**: Cannot reserve more than available quantity
4. **Adjustment**: Cannot adjust to negative quantity
5. **Deletion**: Cannot delete inventory with reserved quantity
6. **Logging**: All quantity changes are logged with type and reference

## Database Schema

### Inventory Table
- `id`: UUID (Primary Key)
- `variant_id`: UUID (Nullable)
- `product_variant_id`: UUID (Foreign Key)
- `quantity`: BigInt (Total quantity)
- `reserved_quantity`: BigInt (Reserved quantity)
- `created_at`: Timestamp
- `updated_at`: Timestamp

### Inventory Logs Table
- `id`: UUID (Primary Key)
- `inventory_id`: UUID (Foreign Key)
- `change`: BigInt (Quantity change)
- `type`: Enum (restock, order, adjustment)
- `reference_id`: UUID (Nullable, for order/adjustment references)
- `created_at`: Timestamp

### Product Variants Replica Table
- `variant_id`: UUID (Primary Key)
- `product_id`: UUID
- `merchant_id`: UUID
- `created_at`: Timestamp
