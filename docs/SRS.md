# Tài liệu Đặc tả Yêu cầu Phần mềm (SRS) - NeoShop

## 1. Giới thiệu (Introduction)

NeoShop là một hệ thống thương mại điện tử hiện đại, cung cấp trải nghiệm mua sắm mượt mà cho khách hàng và bộ công cụ quản lý mạnh mẽ cho quản trị viên. Hệ thống được xây dựng theo kiến trúc **Monolith hiện đại**, tập trung vào tính hiệu năng, bảo mật và khả năng mở rộng dễ dàng.

## 2. Các yêu cầu chức năng (Functional Requirements)

### 2.1. Cửa hàng (Storefront)

- **Xác thực người dùng**: Đăng ký, đăng nhập và quản lý phiên làm việc bằng JWT.
- **Duyệt sản phẩm**: Xem danh sách sản phẩm theo danh mục, tìm kiếm và xem chi tiết sản phẩm.
- **Quản lý giỏ hàng**: Thêm, sửa, xóa sản phẩm trong giỏ hàng.
- **Thanh toán (Checkout)**: Quy trình đặt hàng, nhập thông tin giao hàng và chọn phương thức thanh toán.

### 2.2. Trang Quản trị (Admin Dashboard)

- **Thống kê kinh doanh**: Biểu đồ doanh thu, số lượng đơn hàng và người dùng mới.
- **Quản lý sản phẩm**: CRUD sản phẩm, quản lý tồn kho và hình ảnh.
- **Quản lý đơn hàng**: Theo dõi và cập nhật trạng thái đơn hàng.
- **Quản lý người dùng**: Xem danh sách và quản lý quyền hạn người dùng.

## 3. Kiến trúc Hệ thống (System Architecture)

### 3.1. Mô hình kết nối Frontend - Backend

Hệ thống sử dụng mô hình **Decoupled Architecture**:

- **Frontend**: React 19 (Vite) - Ứng dụng Single Page Application (SPA).
- **Backend**: Spring Boot 3 - RESTful API Monolith.
- **Giao thức**: Giao tiếp thông qua các Endpoint RESTful bằng định dạng JSON.
- **Bảo mật**: Stateless Authentication sử dụng Bearer JWT Token.

### 3.2. Cấu trúc Backend 5 Tầng (5-Layer Pattern)

1.  **Config**: Cấu hình hệ thống (Security, Swagger, JPA).
2.  **Controller**: Tiếp nhận request, kiểm tra validation và điều hướng.
3.  **Service**: Xử lý logic nghiệp vụ chính (Business Logic).
4.  **Repository**: Giao tiếp với cơ sở dữ liệu (Spring Data JPA).
5.  **Model**: Định nghĩa cấu trúc dữ liệu (Entities, DTOs).

## 4. Các yêu cầu phi chức năng (Non-functional Requirements)

- **Hiệu năng**: Tải trang nhanh, phản hồi API trong < 200ms.
- **Bảo mật**: Mã hóa mật khẩu (BCrypt), phân quyền truy cập (RBAC).
- **Tính khả dụng**: Giao diện Responsive (Mobile-first).
- **Khả năng mở rộng**: Codebase sạch, dễ dàng chuyển đổi sang Microservices nếu cần.

## 5. Công nghệ sử dụng (Technology Stack)

- **Backend**: Java 21, Spring Boot 3, Spring Security, PostgreSQL 17.
- **Frontend**: React 19, Vite, Recharts, React Router v7.
- **Infrastucture**: Docker, Redis (Caching), Kafka (Async Task), Prometheus & Grafana (Monitoring).
