# Hợp đồng API: NeoShop

Tài liệu này định nghĩa các điểm cuối (endpoints) REST API được cung cấp bởi các microservices cho ứng dụng frontend.

## 1. Dịch vụ Sản phẩm (Product Service) (`BASE_URL/api/v1/products`)

### Lấy tất cả sản phẩm (Storefront)

- **Phương thức**: `GET /`
- **Tham số truy vấn (Query Params)**: `category` (tùy chọn), `search` (tùy chọn), `page`, `size`.
- **Phản hồi**: `200 OK`

```json
{
  "content": [
    {
      "id": "uuid",
      "title": "Tên sản phẩm",
      "price": 99.9,
      "salePrice": 79.9,
      "thumbnail": "url",
      "category": { "id": "uuid", "name": "Tên danh mục" }
    }
  ],
  "totalPages": 5
}
```

### Lấy chi tiết sản phẩm

- **Phương thức**: `GET /{id}`
- **Phản hồi**: `200 OK` (Đối tượng sản phẩm đầy đủ bao gồm mô tả và bộ sưu tập hình ảnh).

---

## 2. Dịch vụ Đơn hàng (Order Service) (`BASE_URL/api/v1/orders`)

### Tạo đơn hàng (Checkout)

- **Phương thức**: `POST /`
- **Xác thực (Auth)**: Bắt buộc (User)
- **Nội dung yêu cầu (Request Body)**:

```json
{
  "items": [{ "productId": "uuid", "quantity": 1 }],
  "shippingAddress": "...",
  "paymentMethod": "COD"
}
```

- **Phản hồi**: `201 Created`

```json
{
  "orderId": "uuid",
  "status": "PENDING",
  "totalAmount": 150.0
}
```

---

## 3. Dịch vụ Xác thực (Auth Service) (`BASE_URL/api/v1/auth`)

### Đăng nhập

- **Phương thức**: `POST /login`
- **Nội dung yêu cầu (Request Body)**: `{ "email": "...", "password": "..." }`
- **Phản hồi**: `200 OK`

```json
{
  "accessToken": "jwt_token",
  "refreshToken": "refresh_token",
  "user": { "id": "uuid", "email": "...", "role": "ADMIN" }
}
```

---

## 4. Dịch vụ Admin (`BASE_URL/api/v1/admin/*`)

### Lấy thống kê Dashboard

- **Phương thức**: `GET /stats/summary`
- **Xác thực (Auth)**: Bắt buộc (Admin)
- **Phản hồi**:

```json
{
  "totalRevenue": 15000000,
  "totalOrders": 120,
  "topProducts": [...]
}
```

### Quản lý khóa kỹ thuật số (Digital Keys)

- **Phương thức**: `POST /keys/import`
- **Xác thực (Auth)**: Bắt buộc (Admin)
- **Nội dung yêu cầu (Request Body)**: `{ "productId": "uuid", "keys": ["KEY-1", "KEY-2"] }`
