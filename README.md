# 🛒 E-Commerce Order Management System

A full-stack e-commerce application built with **Angular 18** and **Spring Boot 3**, featuring user authentication, product catalog, shopping cart, order management, and payment processing.

![Angular](https://img.shields.io/badge/Angular-18-red?style=flat-square&logo=angular)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-green?style=flat-square&logo=spring)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?style=flat-square&logo=mysql)
![Docker](https://img.shields.io/badge/Docker-Ready-blue?style=flat-square&logo=docker)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Running the Application](#-running-the-application)
- [Docker Deployment](#-docker-deployment)
- [API Endpoints](#-api-endpoints)
- [Screenshots](#-screenshots)
- [Database Schema](#-database-schema)
---

## ✨ Features

### 👤 User Features
- ✅ User Registration & Login
- ✅ Browse Product Catalog
- ✅ Search Products
- ✅ Add to Cart / Remove from Cart
- ✅ Checkout Process
- ✅ Payment Processing (Card Payment)
- ✅ Order History
- ✅ Order Tracking

### 👨‍💼 Admin Features
- ✅ Admin Dashboard
- ✅ View All Orders
- ✅ Update Order Status
- ✅ View Statistics (Total Orders, Users, Products)

### 🔒 Security Features
- ✅ BCrypt Password Encryption
- ✅ Form Validation (Frontend & Backend)
- ✅ CORS Configuration
- ✅ Input Sanitization

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Angular | 18 | Frontend Framework |
| TypeScript | 5.x | Programming Language |
| Bootstrap | 5.3 | CSS Framework |
| RxJS | 7.x | Reactive Programming |
| Angular Router | 18 | Navigation |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Spring Boot | 3.2 | Backend Framework |
| Java | 17 | Programming Language |
| Spring Data JPA | 3.2 | Database ORM |
| Hibernate | 6.x | JPA Implementation |
| Lombok | 1.18 | Boilerplate Reduction |
| BCrypt | - | Password Encryption |

### Database
| Technology | Version | Purpose |
|------------|---------|---------|
| MySQL | 8.0 | Relational Database |

### DevOps
| Technology | Purpose |
|------------|---------|
| Docker | Containerization |
| Docker Compose | Multi-container Orchestration |
| Nginx | Frontend Web Server |

---

## 📁 Project Structure

```
ecommerce-order-management/
│
├── ecommerce-frontend/              # Angular Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/          # UI Components
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   ├── home/
│   │   │   │   ├── products/
│   │   │   │   ├── cart/
│   │   │   │   ├── checkout/
│   │   │   │   ├── payment/
│   │   │   │   ├── user-dashboard/
│   │   │   │   └── admin-dashboard/
│   │   │   ├── services/            # API Services
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── product.service.ts
│   │   │   │   ├── cart.service.ts
│   │   │   │   ├── order.service.ts
│   │   │   │   └── payment.service.ts
│   │   │   └── models/              # TypeScript Interfaces
│   │   ├── assets/                  # Static Assets
│   │   └── environments/            # Environment Config
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── order-management/                # Spring Boot Backend
│   └── order-management/
│       ├── src/main/java/com/ecommerce/order/
│       │   ├── config/              # Configuration Classes
│       │   │   ├── CorsConfig.java
│       │   │   ├── PasswordEncoderConfig.java
│       │   │   └── DataInitializer.java
│       │   ├── controller/          # REST Controllers
│       │   │   ├── AuthController.java
│       │   │   ├── ProductController.java
│       │   │   ├── OrderController.java
│       │   │   ├── PaymentController.java
│       │   │   └── AdminController.java
│       │   ├── service/             # Business Logic
│       │   ├── repository/          # Data Access Layer
│       │   ├── entity/              # JPA Entities
│       │   ├── dto/                 # Data Transfer Objects
│       │   ├── enums/               # Enumerations
│       │   └── exception/           # Custom Exceptions
│       ├── src/main/resources/
│       │   └── application.properties
│       ├── Dockerfile
│       └── pom.xml
│
├── docker-compose.yml               # Docker Compose Config
└── README.md                        # This File
```

---

## 📌 Prerequisites

Before running this project, ensure you have:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Angular CLI** (v18) - `npm install -g @angular/cli`
- **Java JDK** (v17 or higher) - [Download](https://adoptium.net/)
- **Maven** (v3.8+) - [Download](https://maven.apache.org/)
- **MySQL** (v8.0) - [Download](https://dev.mysql.com/downloads/)
- **Docker** (Optional) - [Download](https://www.docker.com/)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ecommerce-order-management.git
cd ecommerce-order-management
```

### 2. Setup Database

```sql
-- Create database in MySQL
CREATE DATABASE ecommercedb;
```

### 3. Configure Backend

Update database credentials in:
```properties
# order-management/order-management/src/main/resources/application.properties

spring.datasource.url=jdbc:mysql://localhost:3306/ecommercedb
spring.datasource.username=root
spring.datasource.password=your_password
```

### 4. Install Frontend Dependencies

```bash
cd ecommerce-frontend
npm install
```

---

## ▶️ Running the Application

### Start Backend

```bash
cd order-management/order-management
./mvnw spring-boot:run
```
Backend runs on: `http://localhost:8080`

### Start Frontend

```bash
cd ecommerce-frontend
ng serve --port 4200
```
Frontend runs on: `http://localhost:4200`

---

## 🐳 Docker Deployment

### Quick Start with Docker

```bash
# Build Backend JAR
cd order-management/order-management
./mvnw clean package -DskipTests

# Build Frontend
cd ecommerce-frontend
npm install
ng build --configuration=production

# Start all containers
docker-compose up --build -d
```

### Access Application

| Service | URL |
|---------|-----|
| Frontend | http://localhost |
| Backend API | http://localhost:8080/api |
| MySQL | localhost:3307 |

### Docker Commands

```bash
# Start containers
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs -f

# Rebuild
docker-compose up --build -d
```

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/register` | User registration |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/{id}` | Get product by ID |
| GET | `/api/products/search?q=` | Search products |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Create new order |
| GET | `/api/orders/{id}` | Get order by ID |
| GET | `/api/orders/user/{userId}` | Get user's orders |

### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments` | Process payment |
| GET | `/api/payments/order/{orderId}` | Get payment by order |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Get dashboard stats |
| GET | `/api/admin/orders` | Get all orders |
| PUT | `/api/admin/orders/{id}/status` | Update order status |


---

## 🗄️ Database Schema

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   users     │     │   orders    │     │  products   │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ user_id PK  │◄───┐│ order_id PK │     │ product_id  │
│ username    │    ││ user_id FK  │     │ name        │
│ password    │    ││ total_amount│     │ description │
│ email       │    ││ status      │     │ price       │
│ first_name  │    ││ order_date  │     │ stock_qty   │
│ last_name   │    │└─────────────┘     │ image_url   │
│ role        │    │       │            │ category    │
└─────────────┘    │       │            └─────────────┘
                   │       ▼                   │
                   │┌─────────────┐            │
                   ││ order_items │            │
                   │├─────────────┤            │
                   ││ item_id PK  │            │
                   ││ order_id FK │◄───────────┘
                   ││ product_id  │
                   ││ quantity    │
                   ││ price       │
                   │└─────────────┘
                   │       │
                   │       ▼
                   │┌─────────────┐
                   ││  payments   │
                   │├─────────────┤
                   ││ payment_id  │
                   └│ order_id FK │
                    │ amount      │
                    │ status      │
                    │ method      │
                    │ card_last_4 │
                    └─────────────┘
