# Tiến trình Phát triển Dự án NeoShop (Project Progress & Roadmap)

Tài liệu này ghi lại các bước đã thực hiện và kế hoạch tiếp theo cho dự án NeoShop, đảm bảo tính minh bạch và theo sát thiết kế hệ thống.

---

## 📅 Giai đoạn 1: Thiết lập Hệ thống & Hạ tầng (Hoàn thành)

### 1. Phân tích & Thiết kế hệ thống (System Design)

- [x] Phác thảo kiến trúc Microservices tổng thể.
- [x] Thiết kế lược đồ Database (Dòng dữ liệu lớn).
- [x] Lập kế hoạch Scalability, Load Balancing và Monitoring.
- [x] Thiết kế hợp đồng API (API Contracts) giữa Frontend và Backend.

### 2. Thiết lập hạ tầng (Infrastructure as Code)

- [x] Cấu hình Docker Compose với:
  - **PostgreSQL 17**: Cơ sở dữ liệu chính.
  - **Redis**: Caching và Rate Limiting.
  - **Apache Kafka (Confluent)**: Xử lý sự kiện (Event-driven).
  - **Prometheus & Grafana**: Giám sát và biểu đồ hiệu năng.
- [x] Tái cấu trúc thư mục dự án theo chuẩn Microservices (Tách biệt code và hạ tầng).

### 3. Xử lý Dữ liệu lớn (Big Data Preparation)

- [x] Viết script khởi tạo DB với **3 triệu dòng dữ liệu** thực tế:
  - 1 triệu Users (Distinct).
  - 1 triệu Categories.
  - 1 triệu Products.
- [x] Tối ưu hóa việc khởi tạo database thông qua Docker Volume.

---

## 🏗️ Giai đoạn 2: Phát triển Microservices Cốt lõi (Đang thực hiện)

### 4. Xây dựng dịch vụ nền tảng (Foundation Services)

- [x] **Registry Service (Eureka)**: Quản lý danh bạ các service, cho phép tự động khám phá (Service Discovery).
- [x] **Auth Service**:
  - [x] Cấu hình Spring Boot 3.x + JDK 21.
  - [x] Kết nối PostgreSQL, JPA chuẩn hóa Entity.
  - [x] Tích hợp Swagger / OpenAPI 3 để test API.
  - [x] Docker hóa dịch vụ (Multi-stage build).
- [x] **Gateway Service**:
  - [x] Định tuyến tập trung (Centralized Routing).
  - [x] Áp dụng Rate Limiting (Giới hạn tốc độ) bằng Redis.
  - [x] Xử lý CORS và Authentication tập trung.

### 5. Khả năng quan sát (Observability)

- [x] Tích hợp Spring Actuator và Micrometer Prometheus.
- [x] Cấu hình Prometheus tự động thu thập (Scrape) metrics từ các container.
- [ ] Cấu hình Dashboard Grafana chuẩn hóa cho Microservices.

---

## 🚀 Giai đoạn 3: Nghiệp vụ & Tích hợp (Sắp tới)

### 6. Catalog & Order Services

- [ ] Xây dựng dịch vụ Sản phẩm (Catalog) xử lý tìm kiếm trên 1 triệu bản ghi.
- [ ] Áp dụng Redis Caching cho danh mục và sản phẩm phổ biến.
- [ ] Xây dựng dịch vụ Đơn hàng thực hiện luồng thanh toán cơ bản.

### 7. Tích hợp Frontend (UI/UX)

- [ ] Kết nối React vào Gateway.
- [ ] Thay thế dữ liệu Mock bằng dữ liệu thật từ Backend.
- [ ] Tối ưu hóa hiệu suất load trang danh sách sản phẩm lớn.

---

## 🛠️ Trạng thái Vận hành (Local Environment)

| Thành phần          | Port | Trạng thái          |
| :------------------ | :--- | :------------------ |
| **Frontend**        | 5173 | 🟢 Running          |
| **Gateway Service** | 8080 | 🟢 Running (Docker) |
| **Eureka Registry** | 8761 | 🟢 Running (Docker) |
| **Auth Service**    | 8081 | 🟢 Running (Docker) |
| **PostgreSQL**      | 5432 | 🟢 Running (Docker) |
| **Prometheus**      | 9090 | 🟢 Running (Docker) |
| **Grafana**         | 3000 | 🟢 Running (Docker) |

---

_Cập nhật lần cuối: 2026-02-10 02:08_
