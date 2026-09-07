# Swastik Backend API Documentation

Welcome to the **Swastik Backend API Documentation**. This guide contains complete reference information for Frontend Developers building the Customer Storefront and Admin Management Dashboard.

---

## 🌐 Base URLs

* **Production URL**: `https://swastik-backend.onrender.com`
* **Local Development URL**: `http://127.0.0.1:8000`

---

## 🔑 Authentication Header

Protected endpoints require the standard Django REST Framework `Authorization` header:

```http
Authorization: Token <your_token_key>
Content-Type: application/json
```

---

## 🔐 1. Authentication APIs

### 1.1 Dedicated Admin Login
Use this separate endpoint for logging into the **Admin Portal**. It validates user credentials and verifies that `is_staff` or `is_superuser` is `True`.

* **Endpoint**: `POST /api/auth/admin/login/`
* **Access**: Public
* **Request Body**:
  ```json
  {
    "email": "Swastikartisanbakehouse@gmail.com",
    "password": "ASHISH.kc1999"
  }
  ```
* **Response `200 OK`**:
  ```json
  {
    "token": "47a9b0c1d2e3f4a5b6c7d8e9f0123456789abcde",
    "user": {
      "id": 1,
      "name": "Swastik Artisan Bakehouse Admin",
      "email": "Swastikartisanbakehouse@gmail.com",
      "mobile_number": "9999999999",
      "whatsapp_number": "9999999999",
      "addresses": [],
      "is_staff": true,
      "is_superuser": true,
      "is_admin": true,
      "created_at": "2026-09-01T00:00:00Z"
    }
  }
  ```
* **Response `403 Forbidden`** *(If regular customer credentials are sent)*:
  ```json
  {
    "detail": "Access denied. Only admin users can log in here."
  }
  ```

---

### 1.2 Customer Login
For customer storefront authentication.

* **Endpoint**: `POST /api/auth/login/`
* **Access**: Public
* **Request Body**:
  ```json
  {
    "email": "customer@swastik.com",
    "password": "CustomerPass123"
  }
  ```
* **Response `200 OK`**:
  ```json
  {
    "token": "88b9a0c1d2e3f4a5b6c7d8e9f0123456789abcde",
    "user": {
      "id": 2,
      "name": "John Customer",
      "email": "customer@swastik.com",
      "mobile_number": "9876543210",
      "whatsapp_number": "9876543210",
      "addresses": [
        {
          "type": "Home",
          "address_line1": "Flat 402, Sunshine Apartments",
          "city": "Jaipur",
          "pincode": "302001",
          "is_default": true
        }
      ],
      "is_staff": false,
      "is_superuser": false,
      "is_admin": false,
      "created_at": "2026-09-01T00:00:00Z"
    }
  }
  ```

---

### 1.3 Customer Registration
Registers new customer accounts. *(Note: Admin accounts can be created manually via Django Admin Panel `/admin-panel/` or via Admin API).*

* **Endpoint**: `POST /api/auth/register/`
* **Access**: Public
* **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "Password123",
    "mobile_number": "9812345678",
    "whatsapp_number": "9812345678"
  }
  ```

---

### 1.4 Admin Register (API)
Allows an existing logged-in Admin to create an additional Admin account.

* **Endpoint**: `POST /api/auth/admin/register/`
* **Access**: Admin Token Required (`Authorization: Token <admin_token>`)
* **Request Body**:
  ```json
  {
    "name": "Store Manager Admin",
    "email": "manager@swastik.com",
    "password": "ManagerPass123",
    "mobile_number": "9988776655",
    "whatsapp_number": "9988776655"
  }
  ```

---

### 1.5 Get Profile
Retrieves the logged-in user profile.

* **Endpoint**: `GET /api/auth/me/`
* **Access**: Authenticated User (`Authorization: Token <token>`)

---

### 1.6 Logout
Invalidates the active token.

* **Endpoint**: `POST /api/auth/logout/`
* **Access**: Authenticated User (`Authorization: Token <token>`)

---

## 📁 2. Categories APIs

### 2.1 Public Categories List
* **Endpoint**: `GET /api/categories/`
* **Access**: Public
* **Response `200 OK`**:
  ```json
  [
    {
      "id": 1,
      "name": "Bakery",
      "sector": "BAKERY",
      "description": "Freshly baked breads, artisanal cakes, cookies, pastries, and savory bakes.",
      "image": null,
      "is_active": true,
      "metadata": {
        "supports_preorder": true,
        "supports_customization": true,
        "popular_subcategories": ["Breads", "Cakes", "Pastries", "Cookies", "Muffins & Bakes"]
      },
      "created_at": "2026-09-01T00:00:00Z"
    }
  ]
  ```

---

### 2.2 Admin List All Categories
Lists all categories including inactive ones.

* **Endpoint**: `GET /api/admin/categories/`
* **Access**: Admin Token Required

---

### 2.3 Admin Create Category
* **Endpoint**: `POST /api/admin/categories/`
* **Access**: Admin Token Required
* **Request Body**:
  ```json
  {
    "name": "Artisanal Beverages",
    "sector": "CONFECTIONERY",
    "description": "Fresh organic cold-pressed juices and specialty beverages.",
    "is_active": true,
    "metadata": {
      "temperature_sensitive": true
    }
  }
  ```

---

### 2.4 Admin Update / Delete Category
* **Endpoint**: `GET / PATCH / DELETE /api/admin/categories/:id/`
* **Access**: Admin Token Required

---

## 🛒 3. Products APIs

### 3.1 Public Products List & Filtering
Lists active available products with extensive filtering options.

* **Endpoint**: `GET /api/products/`
* **Access**: Public
* **Query Parameters**:
  * `?sector=BAKERY` | `DAIRY` | `SWEETS` | `CONFECTIONERY`
  * `?category_id=1`
  * `?sku=SW-BAK-001`
  * `?in_stock=true` | `false`
  * `?subcategory=Breads`
  * `?search=Chocolate` (Searches name, description, SKU, brand, subcategory)

* **Response `200 OK`**:
  ```json
  [
    {
      "id": 1,
      "sku": "SW-BAK-001",
      "name": "Whole Wheat Milk Bread",
      "category": 1,
      "category_name": "Bakery",
      "category_sector": "BAKERY",
      "subcategory_name": "Breads",
      "description": "Freshly baked soft whole wheat loaf rich in fiber and milk goodness.",
      "price": "40.00",
      "discount_price": "36.00",
      "tax_percentage": "5.00",
      "unit": "400 g",
      "stock_quantity": 150,
      "is_available": true,
      "is_active": true,
      "image": null,
      "brand": "Swastik Bakery",
      "tags": ["fresh", "daily-essential", "whole-wheat"],
      "attributes": {
        "shelf_life_days": 3,
        "eggless": true,
        "storage": "Cool dry place"
      },
      "created_at": "2026-09-01T00:00:00Z"
    }
  ]
  ```

---

### 3.2 Get Product Detail
* **Endpoint**: `GET /api/products/:id/`
* **Access**: Public

---

### 3.3 List Products by Category ID
* **Endpoint**: `GET /api/categories/:category_id/products/`
* **Access**: Public

---

### 3.4 Admin List All Products
Lists all products including out-of-stock and inactive ones.

* **Endpoint**: `GET /api/admin/products/`
* **Access**: Admin Token Required

---

### 3.5 Admin Create Product
Creates a new product with rich tags, attributes, and pricing.

* **Endpoint**: `POST /api/admin/products/`
* **Access**: Admin Token Required
* **Request Body**:
  ```json
  {
    "sku": "SW-BAK-014",
    "name": "Pistachio Croissant",
    "category": 1,
    "subcategory_name": "Pastries",
    "description": "Golden butter croissant filled with creamy pistachio cream.",
    "price": "160.00",
    "discount_price": "145.00",
    "tax_percentage": "18.00",
    "unit": "2 Pcs",
    "stock_quantity": 40,
    "is_available": true,
    "is_active": true,
    "brand": "Swastik Bakery",
    "tags": ["pistachio", "croissant", "gourmet"],
    "attributes": {
      "contains_nuts": true,
      "shelf_life_days": 2
    }
  }
  ```

---

### 3.6 Admin Update Product
Updates existing product details, stock, or prices.

* **Endpoint**: `PATCH /api/admin/products/:id/` (or `PUT`)
* **Access**: Admin Token Required
* **Request Body**:
  ```json
  {
    "price": "150.00",
    "discount_price": "135.00",
    "stock_quantity": 100,
    "is_available": true
  }
  ```

---

### 3.7 Admin Delete Product
Deletes a product entry.

* **Endpoint**: `DELETE /api/admin/products/:id/`
* **Access**: Admin Token Required

---

## 🟢 4. Health Check

* **Endpoint**: `GET /` or `GET /health/`
* **Access**: Public
* **Response `200 OK`**:
  ```json
  {
    "status": "online",
    "message": "Swastik Backend API is running successfully."
  }
  ```
