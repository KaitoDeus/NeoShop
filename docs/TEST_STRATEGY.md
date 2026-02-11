# Chiến lược Kiểm thử - Các Tính năng Nâng cao NeoShop

## 1. Tổng quan

Tài liệu này phác thảo chiến lược kiểm thử cho nền tảng NeoShop, tập trung vào các module mới triển khai: Quản lý Mã kỹ thuật số (Digital Key), Xử lý Đơn hàng và Phân tích Quản trị.

## 2. Mục tiêu Kiểm thử

- Xác minh các luồng chức năng chính cho Người dùng và Quản trị viên.
- Đảm bảo logic tự động (Giảm tồn kho, Gán mã key) hoạt động chính xác.
- Xác thực tính bảo mật (RBAC) trên các điểm cuối API.
- Kiểm tra tính toàn vẹn của dữ liệu và tích hợp (Database, Kafka logs).

## 3. Phạm vi Kiểm thử

- **Xác thực Người dùng:** Đăng nhập/Đăng ký JWT.
- **Danh mục Sản phẩm:** Truy vấn danh mục và phân trang sản phẩm.
- **Luồng Đơn hàng:**
  - Tạo đơn hàng.
  - Cập nhật trạng thái (PENDING -> PAID).
- **Mã sản phẩm (Keys):**
  - Admin thêm mới hàng loạt.
  - Tự động gán mã cho khách hàng khi thanh toán thành công.
- **Phân tích:** Độ chính xác của các chỉ số trên Dashboard.

## 4. Môi trường

- **URL:** http://localhost:8080/swagger-ui.html
- **Cơ sở dữ liệu:** PostgreSQL (đã nạp hơn 10k bản ghi).
- **Messaging:** Apache Kafka (Chế độ KRaft).

## 5. Công cụ Kiểm thử

- **Trình duyệt (Swagger UI):** Để thực thi API thủ công.
- **Terminal:** Để kiểm tra nhật ký container (Kafka/Backend).
- **JUnit 5 & Mockito:** Để kiểm thử đơn vị (Unit Test) và tích hợp (Integration Test) backend.

## 6. Kế hoạch Kiểm thử Tự động (Giai đoạn 5)

### 6.1. Kiểm thử Đơn vị (Unit Testing)

- **AuthServiceTest:** Xác minh logic đăng nhập, tạo JWT và xử lý vai trò.
- **ProductServiceTest:** Kiểm tra việc truy xuất danh mục, chức năng tìm kiếm và phân trang.
- **OrderServiceTest:** Tập trung vào các logic nghiệp vụ quan trọng:
  - Khấu trừ tồn kho khi tạo đơn hàng.
  - Tự động gán `ProductKey` khi trạng thái chuyển sang `PAID`.
  - Gửi sự kiện lên Kafka.

### 6.2. Kiểm thử Tích hợp (Integration Testing)

- Sử dụng `@SpringBootTest` với cơ sở dữ liệu kiểm thử riêng biệt (hoặc Testcontainers).
- **AuthControllerTest:** Kiểm tra toàn bộ luồng đăng nhập và chuỗi lọc bảo mật.
- **OrderControllerTest:** Luồng đặt hàng và quy trình trạng thái từ đầu đến cuối (E2E).

## 7. Tiêu chí Đạt/Không đạt

- HTTP 200/201 cho các yêu cầu hợp lệ.
- Dữ liệu trả về đúng định dạng JSON và nội dung chính xác.
- Mã key được gán chính xác cho các đơn hàng trong DB.
- Các số liệu thống kê phản ánh đúng các giao dịch gần đây.
