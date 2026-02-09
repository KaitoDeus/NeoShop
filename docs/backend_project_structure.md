# Cấu trúc Dự án Spring Boot

Để tổ chức các microservices, chúng tôi đề xuất cấu trúc **Monorepo** hoặc thiết lập **Đa dự án (Multi-Project)** trong thư mục `backend/` để quản lý dễ dàng hơn trong giai đoạn phát triển ban đầu.

## Sơ đồ Cấu trúc Thư mục Đề xuất

```
backend/
├── neoshop-gateway/          # Spring Cloud Gateway (API Gateway)
├── neoshop-auth/             # Dịch vụ Xác thực & Định danh (Auth)
├── neoshop-catalog/          # Dịch vụ Sản phẩm & Danh mục (Catalog)
├── neoshop-order/            # Dịch vụ Đơn hàng & Giao dịch (Order)
├── neoshop-notification/     # Đối tượng tiêu thụ (Consumer) Kafka cho thông báo
├── neoshop-analytics/        # Dịch vụ Phân tích & Báo cáo (Analytics)
├── neoshop-common/           # Thư viện dùng chung: DTO, Utils, và Cấu hình
└── pom.xml                   # File Maven POM cha
```

## Các Công nghệ Chính cho Nhà phát triển Java

### 1. Spring Cloud

- **Spring Cloud Gateway**: Dành cho API Gateway.
- **Spring Cloud OpenFeign**: Dành cho các cuộc gọi đồng bộ giữa các dịch vụ (nếu cần).
- **Spring Cloud Config**: (Tùy chọn) Quản lý cấu hình tập trung.

### 2. Spring Kafka

- Sử dụng `KafkaTemplate` để gửi tin nhắn từ `Dịch vụ Đơn hàng`.
- Sử dụng `@KafkaListener` trong `Dịch vụ Thông báo` và `Dịch vụ Sản phẩm`.

### 3. Spring Data Redis

- Trừu tượng hóa cấp cao cho việc lưu trữ đệm (caching).
- Sử dụng `@Cacheable` để dễ dàng lưu đệm dữ liệu JSON trong Dịch vụ Sản phẩm.

### 4. Di cư Cơ sở dữ liệu (Database Migrations)

- Sử dụng **Flyway** hoặc **Liquibase** trong `src/main/resources/db/migration` của mỗi dịch vụ. Điều này đảm bảo việc quản lý phiên bản lược đồ cơ sở dữ liệu của bạn được quản lý như mã nguồn.

### 5. Triển khai (Deployment)

- **Docker**: Mỗi dịch vụ nên có một `Dockerfile`.
- **CI/CD**: Sử dụng Github Actions hoặc GitLab CI để xây dựng hình ảnh và triển khai lên Kubernetes hoặc VPS.
