# Tiến trình Phát triển Dự án NeoShop (Project Progress & Roadmap)

Tài liệu này ghi lại các bước đã thực hiện và kế hoạch tiếp theo cho dự án NeoShop.

---

## 📅 Giai đoạn 1: Thiết lập Hệ thống & Hạ tầng (Hoàn thành)

### 1. Phân tích & Thiết kế hệ thống (System Design)

- [x] Phác thảo kiến trúc Monolithic.
- [x] Thiết kế lược đồ Database (Dòng dữ liệu lớn).
- [x] Thiết kế hợp đồng API (API Contracts).

### 2. Thiết lập hạ tầng (Infrastructure as Code)

- [x] Cấu hình Docker Compose với:
  - **Backend**: Spring Boot Monolith.
  - **Frontend**: React + Nginx.

### 3. Xử lý Dữ liệu lớn (Big Data Preparation)

- [x] Viết script khởi tạo DB với **100.000 dòng dữ liệu** thực tế (Scale-down ready).

---

## 🏗️ Giai đoạn 2: Phát triển Backend (Đang thực hiện)

### 4. Dịch vụ Monolith (Neoshop Backend)

- [x] **Core Framework**: Spring Boot 3.x + JDK 21.
- [x] **Database**: Kết nối PostgreSQL, JPA.
- [x] **Docs**: Tích hợp Swagger / OpenAPI 3.
- [x] **Security**:
  - [x] Tích hợp Spring Security & JWT.
  - [x] Phân quyền Role-based Access Control (RBAC).

---

## 🚀 Giai đoạn 3: Nghiệp vụ & Tích hợp (Hoàn thành)

### 5. Nghiệp vụ Chính

- [x] Module Sản phẩm (Catalog).
- [x] Module Đơn hàng (Order).

### 6. Tích hợp Frontend (UI/UX)

- [x] Tích hợp Frontend vào Docker (Nginx).
- [x] Kết nối React vào Backend.

---

## 🛠️ Giai đoạn 4: Quản lý Nâng cao & Vận hành (Đang thực hiện)

### 7. Quản lý Kho & Khóa kỹ thuật số

- [x] Hệ thống quản lý Khóa sản phẩm (Product Keys).
- [x] Tự động cấp phát khóa khi thanh toán thành công.

### 8. Thống kê & Phân tích (Analytics)

- [x] API Thống kê doanh thu, đơn hàng, người dùng.
- [x] Tích hợp biểu đồ Dashboard Admin.

### 9. Thanh toán & Bảo mật Nâng cao

- [x] Tích hợp Mock Payment Gateway.
- [x] Hệ thống mã giảm giá (Coupons/Vouchers).

---

## 🧪 Giai đoạn 5: Kiểm thử Tự động (Chuẩn bị)

### 10. Unit Testing (JUnit 5 + Mockito)

- [x] Khởi tạo cấu trúc thư mục `src/test/java`.
- [x] **AuthServiceTest**: Kiểm thử logic đăng nhập & phân quyền.
- [x] **ProductServiceTest**: Kiểm thử danh mục & tìm kiếm.
- [x] **OrderServiceTest**: Kiểm thử tạo đơn hàng & gán Key tự động.

### 11. Integration Testing

- [x] Thiết lập Testcontainers cho PostgreSQL.
- [x] Kiểm thử luồng API End-to-End.

---

## 🔗 Giai đoạn 6: Tích hợp Frontend ↔ Backend Toàn diện

### 12. Kết nối API Thực cho User-Facing Pages

- [x] Trang **Danh mục sản phẩm** (`/category`) gọi `GET /api/products` thực.
- [x] Trang **Chi tiết sản phẩm** (`/product/:id`) gọi `GET /api/products/{id}` thực.
- [x] Trang **Giỏ hàng** (`/cart`) đồng bộ state với Backend (persist) (Hiện dùng LocalStorage).
- [x] Trang **Thanh toán** (`/checkout`) gọi `POST /api/orders` + `POST /api/payments/process`.
- [x] Tích hợp ô nhập **mã giảm giá** tại Checkout → gọi `POST /api/coupons/validate`.

### 13. Hệ thống Auth Frontend Hoàn chỉnh

- [x] Luồng **Đăng ký** (Register) kết nối API `POST /api/auth/register`.
- [x] Luồng **Đăng nhập** (Login) lưu JWT → `AuthContext`.
- [x] **Trang cá nhân** (`/profile`): Xem lịch sử đơn hàng, thông tin tài khoản.
- [x] **Hiển thị Product Keys** sau thanh toán thành công (trang xác nhận đơn hàng).

### 14. Admin Panel — Quản lý Coupon & Payment

- [ ] Trang **Admin Coupons** (`/admin/coupons`): CRUD mã giảm giá.
- [ ] Trang **Admin Dashboard**: Hiển thị thống kê Payment (thành công / thất bại).

---

## 🔒 Giai đoạn 7: Tối ưu & Bảo mật

### 15. Performance & Caching

- [ ] Tối ưu SQL queries bằng JPQL/Native Query cho `StatisticsService`.
- [ ] Thêm **phân trang** (Pagination) cho tất cả danh sách API.
- [ ] Lazy loading hình ảnh sản phẩm trên Frontend.

### 16. Bảo mật Nâng cao

- [x] Thêm **Rate Limiting** cho API Authentication (Simple In-Memory).
- [x] Cấu hình **CORS** chặt chẽ (chỉ cho phép domain Frontend).
- [x] Thêm **Input Validation** (@Valid) cho tất cả Request DTOs.
- [x] Global **Exception Handler** (`@ControllerAdvice`) trả về lỗi chuẩn hóa.

### 17. CI/CD Pipeline

- [ ] Thiết lập **GitHub Actions** cho Build + Test tự động.
- [ ] Auto-deploy lên môi trường staging khi merge vào `main`.

---

## 🌐 Giai đoạn 8: Production & Monitoring

### 18. Deploy Production

- [ ] Deploy **Frontend** lên Vercel / Netlify.
- [ ] Deploy **Backend** lên Railway / Render.
- [ ] Cấu hình **Supabase PostgreSQL** cho production database.
- [ ] Thiết lập **Custom Domain** + SSL.

### 19. Monitoring & Logging

- [ ] Tích hợp **Structured Logging** (JSON format).
- [ ] Health check endpoint cho uptime monitoring.
- [ ] Thiết lập **Error Tracking** (Sentry hoặc tương đương).

---

## 🛠️ Trạng thái Vận hành (Local Environment)

| Thành phần      | Port | Trạng thái          |
| :-------------- | :--- | :------------------ |
| **Frontend**    | 3000 | 🟢 Running (Docker) |
| **Backend API** | 8080 | 🟢 Running (Docker) |

---

_Cập nhật lần cuối: 2026-02-13_
