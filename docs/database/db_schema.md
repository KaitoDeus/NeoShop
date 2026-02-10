# Thiết kế Cơ sở dữ liệu: NeoShop

Hệ thống sử dụng một cơ sở dữ liệu **PostgreSQL** duy nhất (`neoshop`) với các bảng được tổ chức theo module chức năng.

## 1. Lược đồ tổng thể (Unified Schema)

```mermaid
erDiagram
    %% Module Authentication
    USERS {
      uuid id PK
      string username
      string email
      string password_hash
      string full_name
      string role
      timestamp created_at
      timestamp updated_at
    }

    %% Module Catalog
    CATEGORIES {
      uuid id PK
      string name
      string slug
      uuid parent_id FK
      string icon_url
    }
    PRODUCTS {
      uuid id PK
      string title
      string description
      decimal price
      decimal sale_price
      uuid category_id FK
      integer stock_quantity
      string status
      timestamp created_at
    }
    PRODUCT_IMAGES {
      uuid id PK
      uuid product_id FK
      string url
      boolean is_primary
    }

    %% Module Orders
    ORDERS {
      uuid id PK
      uuid user_id FK
      decimal total_amount
      string status
      string payment_method
      string shipping_address
      timestamp order_date
    }
    ORDER_ITEMS {
      uuid id PK
      uuid order_id FK
      uuid product_id FK
      integer quantity
      decimal unit_price
    }

    USERS ||--o{ ORDERS : places
    CATEGORIES ||--o{ PRODUCTS : contains
    PRODUCTS ||--o{ PRODUCT_IMAGES : has
    PRODUCTS ||--o{ ORDER_ITEMS : included_in
    ORDERS ||--o{ ORDER_ITEMS : contains
```

## 2. Giải thích các Module

- **Authentication**: Lưu trữ thông tin định danh và phân quyền. Mật khẩu luôn được băm bằng thuật toán BCrypt.
- **Catalog**: Quản lý cây danh mục đa cấp và thông số sản phẩm. Hình ảnh được lưu trữ dưới dạng URL (trỏ đến S3 hoặc CDN).
- **Orders**: Lưu vết toàn bộ giao dịch. `ORDER_ITEMS` lưu `unit_price` tại thời điểm mua để tránh sai sót khi giá sản phẩm thay đổi sau này.

## 3. Quản lý Trạng thái (Enums)

- **User Role**: `ADMIN`, `USER`.
- **Product Status**: `ACTIVE` (Hiển thị), `INACTIVE` (Ẩn).
- **Order Status**: `PENDING` (Chờ xử lý), `PAID` (Đã thanh toán), `SHIPPED` (Đang giao), `COMPLETED` (Hoàn thành), `CANCELLED` (Đã hủy).
