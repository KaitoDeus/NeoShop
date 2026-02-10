# Hợp đồng API RESTful: NeoShop

Tất cả các API đều sử dụng tiền tố `/api/v1` và trả về dữ liệu định dạng JSON.

## 1. Xác thực & Người dùng (Authentication & User)

Cung cấp các API liên quan đến bảo mật và quản lý tài khoản.

### Đăng nhập (Login)

- **Endpoint**: `POST /api/v1/auth/login`
- **Body**:
  ```json
  { "username": "admin", "password": "password" }
  ```
- **Response (200 OK)**:
  ```json
  { "token": "jwt_string", "username": "admin", "role": "ADMIN" }
  ```

### Danh sách người dùng (Admin)

- **Endpoint**: `GET /api/v1/auth/users`
- **Params**: `page`, `size`
- **Security**: Bearer JWT (Role: ADMIN)

---

## 2. Quản lý Sản phẩm (Product Catalog)

_Dự kiến triển khai trong các giai đoạn tiếp theo._

### Lấy danh sách sản phẩm

- **Endpoint**: `GET /api/v1/products`
- **Params**: `category`, `search`, `sort`
- **Response**: Trạng thái 200 kèm danh sách sản phẩm phân trang.

---

## 3. Quản lý Đơn hàng (Orders)

_Dự kiến triển khai trong các giai đoạn tiếp theo._

### Tạo đơn hàng mới

- **Endpoint**: `POST /api/v1/orders`
- **Security**: Bearer JWT
- **Body**: Danh sách ProductID và số lượng.

---

## 4. Quản trị & Thống kê (Dashboard)

### Lấy thống kê tổng quan

- **Endpoint**: `GET /api/v1/admin/stats/summary`
- **Security**: Bearer JWT (Role: ADMIN)
- **Response**: Doanh thu, số đơn hàng, tăng trưởng người dùng.

## 5. Cấu trúc Phản hồi Chung (Common Wrapper)

Mọi lỗi sẽ được trả về theo cấu trúc:

```json
{
  "timestamp": "2024-02-10T...",
  "status": 401,
  "error": "Unauthorized",
  "message": "Chi tiết thông báo lỗi",
  "path": "/api/v1/..."
}
```
