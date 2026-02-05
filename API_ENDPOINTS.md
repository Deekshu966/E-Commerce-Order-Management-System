# E-Commerce Order Management System - API Reference

**Base URL:** `http://localhost:8080/api`

---

## 🔐 Authentication

### Login
```
POST /api/auth/login
```
**Request:**
```json
{
  "username": "john_doe",
  "password": "password123"
}
```
**Response:**
```json
{
  "userId": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "USER",
  "token": "jwt-token-here"
}
```

---

### Register
```
POST /api/auth/register
```
**Request:**
```json
{
  "username": "newuser",
  "password": "password123",
  "email": "newuser@example.com",
  "firstName": "New",
  "lastName": "User"
}
```

---

## 📦 Products

### Get All Products
```
GET /api/products
```
**Response:**
```json
[
  {
    "productId": 1,
    "name": "Wireless Headphones",
    "description": "High-quality wireless headphones",
    "price": 79.99,
    "stock": 50,
    "image": "/assets/images/products/headphones.jpg",
    "category": "Electronics"
  }
]
```

---

### Get Product by ID
```
GET /api/products/{id}
```
**Example:** `GET /api/products/1`

---

### Search Products
```
GET /api/products/search?q={query}
```
**Example:** `GET /api/products/search?q=headphones`

---

## 🛒 Orders

### Create Order
```
POST /api/orders
```
**Request:**
```json
{
  "userId": 1,
  "items": [
    {
      "productId": 1,
      "quantity": 2
    },
    {
      "productId": 3,
      "quantity": 1
    }
  ],
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "address": "123 Main Street",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  }
}
```
**Response:**
```json
{
  "orderId": 1,
  "userId": 1,
  "customerName": "john_doe",
  "status": "PLACED",
  "totalAmount": 175.97,
  "taxAmount": 13.01,
  "orderDate": "2026-02-05T10:30:00",
  "items": [
    {
      "orderItemId": 1,
      "productId": 1,
      "productName": "Wireless Headphones",
      "productImage": "/assets/images/products/headphones.jpg",
      "quantity": 2,
      "unitPrice": 79.99,
      "subtotal": 159.98
    }
  ],
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "address": "123 Main Street",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  }
}
```

---

### Get Order by ID
```
GET /api/orders/{id}
```
**Example:** `GET /api/orders/1`

---

### Get Orders by User ID
```
GET /api/orders/user/{userId}
```
**Example:** `GET /api/orders/user/1`

---

### Cancel Order
```
PUT /api/orders/{id}/cancel
```
**Example:** `PUT /api/orders/1/cancel`

---

## 💳 Payments

### Process Payment
```
POST /api/payments
```
**Request:**
```json
{
  "orderId": 1,
  "cardNumber": "4111111111111111",
  "expiryDate": "12/28",
  "cvv": "123"
}
```
**Response:**
```json
{
  "paymentId": 1,
  "orderId": 1,
  "amount": 175.97,
  "status": "COMPLETED",
  "transactionId": "TXN-A1B2C3D4",
  "paymentMethod": "CREDIT_CARD",
  "cardLastFour": "1111",
  "paymentDate": "2026-02-05T10:35:00"
}
```

---

### Get Payment by Order ID
```
GET /api/payments/order/{orderId}
```
**Example:** `GET /api/payments/order/1`

---

### Refund Payment
```
POST /api/payments/{paymentId}/refund
```
**Example:** `POST /api/payments/1/refund`

---

## 🛡️ Admin APIs

### Get Dashboard Statistics
```
GET /api/admin/dashboard/stats
```
**Response:**
```json
{
  "totalOrders": 25,
  "totalUsers": 10,
  "placedOrders": 5,
  "processingOrders": 8,
  "shippedOrders": 7,
  "deliveredOrders": 3,
  "cancelledOrders": 2
}
```

---

### Get All Orders (Admin)
```
GET /api/admin/orders
```
**Response:** Array of all orders with full details

---

### Get Orders by Status
```
GET /api/admin/orders/status/{status}
```
**Example:** `GET /api/admin/orders/status/SHIPPED`

**Valid Status Values:**
- `PLACED`
- `PROCESSING`
- `SHIPPED`
- `DELIVERED`
- `CANCELLED`

---

### Get Order Details (Admin)
```
GET /api/admin/orders/{orderId}
```
**Example:** `GET /api/admin/orders/1`

---

### Update Order Status
```
PUT /api/admin/orders/{orderId}/status
```
**Request:**
```json
{
  "status": "SHIPPED"
}
```

---

### Get All Users
```
GET /api/admin/users
```
**Response:**
```json
[
  {
    "userId": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "123-456-7890",
    "address": "123 Main St",
    "role": "USER"
  }
]
```

---

## 👤 User APIs

### Get User by ID
```
GET /api/users/{id}
```
**Example:** `GET /api/users/1`

---

### Update User Profile
```
PUT /api/users/{id}
```
**Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.updated@example.com",
  "phone": "123-456-7890",
  "address": "456 New Street"
}
```

---

## 📊 Order Status Flow

```
PLACED → PROCESSING → SHIPPED → DELIVERED
                ↓
            CANCELLED
```

| Status | Description |
|--------|-------------|
| PLACED | Order created, awaiting payment |
| PROCESSING | Payment received, preparing order |
| SHIPPED | Order shipped, in transit |
| DELIVERED | Order delivered to customer |
| CANCELLED | Order cancelled |

---

## 🔑 Test Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin123 |
| User | john_doe | password123 |
| User | jane_smith | password123 |

---

## 🧪 Quick Test URLs

Open these in your browser to test:

```
http://localhost:8080/api/products
http://localhost:8080/api/products/1
http://localhost:8080/api/admin/dashboard/stats
http://localhost:8080/api/admin/orders
http://localhost:8080/api/admin/users
```

---

## ⚠️ Error Responses

### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Validation failed",
  "details": ["Field 'email' is required"]
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid credentials"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Order not found with id: 999"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

---

## 📝 Headers Required

For all POST/PUT requests:
```
Content-Type: application/json
```

---

## 🌐 CORS Allowed Origins

```
http://localhost:4200
http://localhost:4201
```
