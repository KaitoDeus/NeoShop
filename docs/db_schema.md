# Thiết kế Lược đồ Cơ sở dữ liệu: NeoShop

Vì chúng ta đang sử dụng **Kiến trúc Microservices**, mỗi dịch vụ sẽ có lược đồ cơ sở dữ liệu riêng để đảm bảo tính liên kết lỏng lẻo (loose coupling). Chúng ta sẽ sử dụng **PostgreSQL** làm cơ sở dữ liệu quan hệ chính.

## 1. Dịch vụ Người dùng/Xác thực (Cơ sở dữ liệu: `neoshop_user`)

```mermaid
erDiagram
    USERS {
      uuid id PK "ID định danh người dùng"
      string username "Tên đăng nhập"
      string email "Địa chỉ email"
      string password_hash "Mật khẩu đã mã hóa"
      string full_name "Họ và tên"
      string role "Vai trò: ADMIN, USER"
      timestamp created_at "Ngày tạo"
      timestamp updated_at "Ngày cập nhật"
    }
    REFRESH_TOKENS {
      uuid id PK "ID Token"
      uuid user_id FK "Liên kết đến USERS"
      string token "Refresh Token"
      timestamp expiry "Ngày hết hạn"
    }
    USERS ||--o{ REFRESH_TOKENS : has
```

## 2. Dịch vụ Sản phẩm (Cơ sở dữ liệu: `neoshop_catalog`)

```mermaid
erDiagram
    CATEGORIES {
      uuid id PK "ID danh mục"
      string name "Tên danh mục"
      string slug "Chuỗi định danh cho URL"
      uuid parent_id FK "ID danh mục cha"
      string icon_url "Đường dẫn biểu tượng"
    }
    PRODUCTS {
      uuid id PK "ID sản phẩm"
      string title "Tiêu đề sản phẩm"
      string description "Mô tả sản phẩm"
      decimal price "Giá gốc"
      decimal sale_price "Giá khuyến mãi"
      uuid category_id FK "Liên kết đến CATEGORIES"
      integer stock_quantity "Số lượng tồn kho"
      string status "Trạng thái: ACTIVE, INACTIVE"
      timestamp created_at "Ngày tạo"
    }
    PRODUCT_IMAGES {
      uuid id PK "ID hình ảnh"
      uuid product_id FK "Liên kết đến PRODUCTS"
      string url "Đường dẫn hình ảnh"
      boolean is_primary "Ảnh chính"
    }
    DIGITAL_KEYS {
      uuid id PK "ID khóa"
      uuid product_id FK "Liên kết đến PRODUCTS"
      string license_key "Khóa bản quyền"
      boolean is_used "Đã sử dụng"
      uuid order_id "Tham chiếu đến Dịch vụ Đơn hàng"
    }
    CATEGORIES ||--o{ PRODUCTS : contains
    PRODUCTS ||--o{ PRODUCT_IMAGES : has
    PRODUCTS ||--o{ DIGITAL_KEYS : has
```

## 3. Dịch vụ Đơn hàng (Cơ sở dữ liệu: `neoshop_order`)

```mermaid
erDiagram
    ORDERS {
      uuid id PK "ID đơn hàng"
      uuid user_id "Tham chiếu đến Dịch vụ Người dùng"
      decimal total_amount "Tổng tiền"
      string status "Trạng thái: PENDING, PAID, SHIPPED, COMPLETED, CANCELLED"
      string payment_method "Phương thức thanh toán"
      string shipping_address "Địa chỉ giao hàng"
      timestamp order_date "Ngày đặt hàng"
    }
    ORDER_ITEMS {
      uuid id PK "ID mục hàng"
      uuid order_id FK "Liên kết đến ORDERS"
      uuid product_id "Tham chiếu đến Dịch vụ Sản phẩm"
      integer quantity "Số lượng"
      decimal unit_price "Đơn giá"
    }
    ORDERS ||--o{ ORDER_ITEMS : contains
```

## 4. Dịch vụ Phân tích (Cơ sở dữ liệu: `neoshop_analytics`)

_Lưu ý: Cơ sở dữ liệu này được tối ưu hóa cho các truy vấn đọc nhiều và tổng hợp dữ liệu._

```mermaid
erDiagram
    DAILY_REVENUE {
      date report_date PK "Ngày báo cáo"
      decimal revenue "Doanh thu"
      integer order_count "Số lượng đơn hàng"
    }
    POPULAR_PRODUCTS {
      uuid product_id PK "ID sản phẩm"
      string product_name "Tên sản phẩm"
      integer total_sold "Tổng số lượng đã bán"
    }
```

---

## 5. Chiến lược Caching (Redis)

- **Chi tiết sản phẩm**: Khóa: `product:{id}`, thời hạn (TTL): 1 Giờ.
- **Cây danh mục**: Khóa: `categories:tree`, thời hạn (TTL): 24 Giờ (Xóa khi có thay đổi).
- **Phiên người dùng/Vai trò**: Khóa: `user:session:{token}`, thời hạn (TTL): 7 Ngày.
- **Bộ đếm tồn kho**: Khóa: `stock:{product_id}`, để kiểm tra tồn kho nhanh trước khi cập nhật DB.
