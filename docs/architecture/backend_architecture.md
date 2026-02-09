# Thiết kế Kiến trúc Backend: NeoShop (Microservices)

## 1. Tổng quan

Thiết kế này đề xuất một **Kiến trúc Microservices** mạnh mẽ và có khả năng mở rộng bằng cách sử dụng **Java Spring Boot**. Mục tiêu là hỗ trợ lượng lưu lượng truy cập lớn, xử lý bất đồng bộ và các luồng dữ liệu phức tạp theo yêu cầu.

## 2. Ngôn ngữ và Công nghệ

- **Framework chính**: Java 21 + Spring Boot 3.x
- **Khám phá dịch vụ (Service Discovery)**: Spring Cloud Netflix Eureka (hoặc Native trong Kubernetes)
- **API Gateway**: Spring Cloud Gateway
- **Môi giới tin nhắn (Message Broker)**: Apache Kafka (Giao tiếp theo hướng sự kiện)
- **Bộ nhớ đệm (Caching)**: Redis (Phiên làm việc, Dữ liệu nóng)
- **Luồng dữ liệu/Tích hợp**: Apache NiFi
- **Cơ sở dữ liệu**: PostgreSQL (Mô hình mỗi dịch vụ một cơ sở dữ liệu riêng)
- **Bảo mật**: OAuth2 / OIDC (Keycloak hoặc Dịch vụ xác thực riêng biệt) / JWT

## 3. Sơ đồ Kiến trúc

```mermaid
graph TD
    Client[Client App (React)]

    subgraph "Lớp Cổng (Edge Layer)"
        Gateway[Spring Cloud Gateway]
        LB[Cân bằng tải - Load Balancer]
    end

    subgraph "Hạ tầng (Infrastructure)"
        Kafka{{Cụm Apache Kafka Cluster}}
        Redis[(Bộ nhớ đệm Redis)]
        Eureka[Đăng ký dịch vụ - Service Registry]
        NiFi[Apache NiFi]
    end

    subgraph "Dịch vụ lõi (Core Services)"
        Auth[Dịch vụ Xác thực - Auth Service]
        Product[Dịch vụ Sản phẩm - Product Service]
        Order[Dịch vụ Đơn hàng - Order Service]
        User[Dịch vụ Người dùng - User Service]
        Notif[Dịch vụ Thông báo - Notification Service]
        Analytics[Dịch vụ Phân tích - Analytics Service]
    end

    Client -->|HTTPS| LB
    LB --> Gateway
    Gateway -->|Kiểm tra Auth| Auth
    Gateway -->|Định tuyến| Product
    Gateway -->|Định tuyến| Order
    Gateway -->|Định tuyến| User

    %% Tương tác giữa các dịch vụ
    Auth -.->|JWT| Gateway

    %% Lưu trữ đệm
    Product -->|Đọc/Ghi| Redis
    Auth -->|Phiên làm việc| Redis

    %% Hướng sự kiện
    Order -->|Đặt hàng thành công| Kafka
    User -->|Đăng ký người dùng| Kafka

    %% Đối tượng tiêu thụ (Consumers)
    Kafka -->|Tiêu thụ Đơn hàng| Notif
    Kafka -->|Tiêu thụ Đơn hàng| Product
    Kafka -->|Tiêu thụ Sự kiện| Analytics

    %% Luồng dữ liệu
    Product -->|Dữ liệu Sản phẩm| NiFi
    NiFi -->|Chuyển đổi & Đồng bộ| Analytics
```

## 4. Chi tiết các Microservices

### A. Gateway API (Spring Cloud Gateway)

- **Vai trò**: Điểm truy cập duy nhất cho tất cả các yêu cầu từ phía máy khách.
- **Tính năng**:
  - **Định tuyến (Routing)**: Chuyển tiếp yêu cầu đến các dịch vụ phù hợp (ví dụ: `/api/products` -> Product Service).
  - **Bảo mật**: Xác thực Token (JWT), cấu hình CORS.
  - **Giới hạn tốc độ (Rate Limiting)**: Ngăn chặn tấn công DDoS bằng bộ giới hạn tốc độ dựa trên Redis.

### B. Dịch vụ Xác thực - Auth Service (Authentication & Identity)

- **Vai trò**: Quản lý người dùng, vai trò và cấp phát token.
- **Công nghệ**: Spring Security, OAuth2 Resource Server.
- **Tích hợp**:
  - Lưu trữ thông tin đăng nhập người dùng an toàn (PostgreSQL).
  - Lưu trữ phiên làm việc/token trong **Redis**.

### C. Dịch vụ Sản phẩm - Product Service (Catalog)

- **Vai trò**: Quản lý sản phẩm, danh mục và kho hàng.
- **Công nghệ**: Spring Data JPA.
- **Hiệu năng**: Sử dụng mạnh mẽ **Redis** để lưu trữ danh sách và chi tiết sản phẩm (Phù hợp với tác vụ đọc nhiều).
- **Sự kiện**: Lắng nghe sự kiện `OrderPlaced` (từ Kafka) để khấu trừ số lượng tồn kho.

### D. Dịch vụ Đơn hàng - Order Service (Transactions)

- **Vai trò**: Xử lý thanh toán giỏ hàng, tạo đơn hàng và xử lý thanh toán.
- **Quy trình**:
  1. Kiểm tra tính hợp lệ của yêu cầu.
  2. Tạo đơn hàng (Trạng thái: Chờ xử lý - Pending).
  3. Xuất bản sự kiện `OrderCreated` lên **Kafka**.
  4. Xử lý phản hồi từ cổng thanh toán -> Xuất bản sự kiện `OrderPaid`.

### E. Dịch vụ Thông báo - Notification Service

- **Vai trò**: Gửi email, SMS hoặc thông báo đẩy (Push notification).
- **Kích hoạt**: Tiêu thụ các sự kiện từ **Kafka** (ví dụ: `OrderPaid` -> Gửi email xác nhận đơn hàng).
- **Công nghệ**: JavaMailSender, Firebase (FCM).

### F. Dịch vụ Phân tích - Analytics Service

- **Vai trò**: Tổng hợp dữ liệu cho Dashboard Quản trị.
- **Tích hợp**:
  - **Apache NiFi**: Thu thập nhật ký (logs) và dữ liệu thô từ các dịch vụ/DB khác.
  - Chuyển đổi dữ liệu (ETL) và tải vào DB Phân tích.
  - Cung cấp API cho các biểu đồ trên Dashboard.

## 5. Thành phần hạ tầng

### Kafka (Hệ thống tin nhắn)

- **Chủ đề (Topics)**:
  - `orders.events` (đã tạo, đã thanh toán, đã hủy)
  - `users.events` (đã đăng ký, đã cập nhật)
  - `inventory.events` (kho thấp, đã cập nhật)
- **Lợi ích**: Giải coupling (ngắt kết nối trực tiếp) giữa các dịch vụ. Dịch vụ đơn hàng không cần đợi tích hợp email hoàn tất mới phản hồi cho khách.

### Redis (Lưu trữ đệm)

- **Các trường hợp sử dụng**:
  - **Cache Aside**: Chi tiết sản phẩm, Cây danh mục.
  - **Lưu trữ phiên**: Phiên đăng nhập của người dùng.
  - **Khóa phân tán (Distributed Lock)**: Ngăn chặn việc chi tiêu trùng lặp hoặc tranh chấp kho hàng.

### Apache NiFi (Luồng dữ liệu)

- **Các trường hợp sử dụng**:
  - **Đồng bộ Microservice**: Đồng bộ dữ liệu sản phẩm sang công cụ tìm kiếm (ví dụ: Elasticsearch) nếu cần.
  - **Báo cáo**: Định kỳ lấy dữ liệu từ Order DB, biến đổi và đẩy sang Data Warehouse cho `Analytics Service`.
  - **Sao lưu**: Tự động chuyển các bản sao lưu cơ sở dữ liệu lên lưu trữ đám mây.

## 6. Lộ trình triển khai

1.  **Thiết lập hạ tầng**: Sử dụng Docker Compose cho Postgres, Redis, Kafka, NiFi.
2.  **Dịch vụ cốt lõi**: Triển khai Registry (Eureka), Gateway và Auth Service.
3.  **Logic nghiệp vụ**: Triển khai Dịch vụ Sản phẩm và Người dùng (CRUD).
4.  **Luồng giao dịch**: Triển khai Dịch vụ Đơn hàng + Người tạo sự kiện Kafka (Producer).
5.  **Xử lý sự kiện**: Triển khai Dịch vụ Thông báo + Đối tượng tiêu thụ Kafka (Consumer).
6.  **Dữ liệu nâng cao**: Thiết lập các pipeline NiFi và Dịch vụ Phân tích.
