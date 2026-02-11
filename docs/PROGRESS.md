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
  - **PostgreSQL 17**: Cơ sở dữ liệu chính.
  - **Redis**: Caching.
  - **Apache Kafka**: Xử lý sự kiện (Event-driven).
  - **Prometheus & Grafana**: Giám sát.

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

### 5. Khả năng quan sát (Observability)

- [x] Tích hợp Spring Actuator và Micrometer Prometheus.
- [x] Cấu hình Prometheus scraper.

---

## 🚀 Giai đoạn 3: Nghiệp vụ & Tích hợp (Hoàn thành)

### 6. Nghiệp vụ Chính

- [x] Module Sản phẩm (Catalog).
- [x] Module Đơn hàng (Order).
- [x] Caching với Redis.
- [x] Thông báo Event-driven với Kafka.

### 7. Tích hợp Frontend (UI/UX)

- [x] Tích hợp Frontend vào Docker (Nginx).
- [x] Kết nối React vào Backend.
- [x] Tối ưu hóa hiệu suất (Caching).

---

## 🛠️ Giai đoạn 4: Quản lý Nâng cao & Vận hành (Đang thực hiện)

### 8. Quản lý Kho & Khóa kỹ thuật số

- [x] Hệ thống quản lý Khóa sản phẩm (Product Keys).
- [x] Tự động cấp phát khóa khi thanh toán thành công.

### 9. Thống kê & Phân tích (Analytics)

- [x] API Thống kê doanh thu, đơn hàng, người dùng.
- [ ] Tích hợp biểu đồ Dashboard Admin.

### 10. Thanh toán & Bảo mật Nâng cao

- [ ] Tích hợp Mock Payment Gateway.
- [ ] Hệ thống mã giảm giá (Coupons/Vouchers).

---

## 🧪 Giai đoạn 5: Kiểm thử Tự động (Chuẩn bị)

### 11. Unit Testing (JUnit 5 + Mockito)

- [x] Khởi tạo cấu trúc thư mục `src/test/java`.
- [x] **AuthServiceTest**: Kiểm thử logic đăng nhập & phân quyền.
- [x] **ProductServiceTest**: Kiểm thử danh mục & tìm kiếm.
- [x] **OrderServiceTest**: Kiểm thử tạo đơn hàng & gán Key tự động.

### 12. Integration Testing

- [ ] Thiết lập Testcontainers cho PostgreSQL & Kafka.
- [ ] Kiểm thử luồng API End-to-End.

---

## 🛠️ Trạng thái Vận hành (Local Environment)

| Thành phần      | Port | Trạng thái          |
| :-------------- | :--- | :------------------ |
| **Frontend**    | 80   | 🟢 Running (Docker) |
| **Backend API** | 8080 | 🟢 Running (Docker) |
| **PostgreSQL**  | 5432 | 🟢 Running (Docker) |
| **Prometheus**  | 9090 | 🟢 Running (Docker) |
| **Grafana**     | 3000 | 🟢 Running (Docker) |

---

_Cập nhật lần cuối: 2026-02-10_
