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

## 🏗️ Giai đoạn 2: Phát triển Backend (Hoàn thành)

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

## 🛠️ Giai đoạn 4: Quản lý Nâng cao & Vận hành (Hoàn thành)

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

## 🧪 Giai đoạn 5: Kiểm thử Tự động (Hoàn thành)

### 10. Unit Testing (JUnit 5 + Mockito)

- [x] Khởi tạo cấu trúc thư mục `src/test/java`.
- [x] **AuthServiceTest**: Kiểm thử logic đăng nhập & phân quyền.
- [x] **ProductServiceTest**: Kiểm thử danh mục & tìm kiếm.
- [x] **OrderServiceTest**: Kiểm thử tạo đơn hàng & gán Key tự động.

### 11. Integration Testing

- [x] Thiết lập Testcontainers cho PostgreSQL.
- [x] Kiểm thử luồng API End-to-End.

---

## 🔗 Giai đoạn 6: Tích hợp Frontend ↔ Backend Toàn diện (Hoàn thành)

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

- [x] Trang **Admin Coupons** (`/admin/coupons`): CRUD mã giảm giá.
- [x] Trang **Admin Dashboard**: Hiển thị thống kê Payment (thành công / thất bại).

### 14.1. Admin Panel Depth — Kết nối dữ liệu thực & Chức năng (Hoàn thành)

- [x] **Kết nối API thực cho các danh sách Quản trị**:
  - [x] Danh sách Đơn hàng: Thay thế mock data bằng `GET /api/admin/orders`.
  - [x] Danh sách Sản phẩm: Thay thế mock data bằng `GET /api/admin/products`.
  - [x] Danh sách Khách hàng: Thay thế mock data bằng `GET /api/admin/users`.
  - [x] Chức năng Thêm khách hàng mới: Đã bổ sung Modal và API `POST /api/admin/users`.
- [x] **Hoàn thiện các nút hành động (Event Handlers)**:
  - [x] Gắn sự kiện "Xem chi tiết" cho Đơn hàng (Hiển thị popup thông tin chi tiết đơn).
  - [x] Gắn sự kiện "Chỉnh sửa" & "Xóa" cho Sản phẩm (Gửi request cập nhật DB).
  - [x] Gắn sự kiện "Quản lý Key" (Xem/Thêm/Xóa key cho từng sản phẩm cụ thể).
- [x] **Trang Thống kê nâng cao**:
  - [x] Kết nối API lọc theo thời gian (7 ngày, 30 ngày, năm).
  - [x] Xuất báo cáo CSV từ dữ liệu thực.
- [x] **Trang Cấu hình (Settings)**:
  - [x] Lưu cấu hình hệ thống (Tên shop, thông tin liên hệ, cài đặt thanh toán) vào Database.
- [x] **Phân trang & Tìm kiếm**:
  - [x] Đồng bộ logic Pagination giữa Frontend và Backend API cho tất cả các bảng Admin.
  - [x] Filter đơn hàng theo trạng thái (Success, Pending, Failed) sử dụng API.
  - [x] Tích hợp thanh tìm kiếm và bộ lọc trạng thái/danh mục cho Sản phẩm.

### 14.2. Kết quả Rà soát & Kiểm thử Admin (Audit Results)

- [x] **Sidebar Navigation**: Đã bổ sung link "Mã giảm giá" (Coupons) bị thiếu.
- [x] **Chức năng Tìm kiếm/Lọc (Search & Filter)**:
  - [x] Tìm kiếm sản phẩm theo tên (Backend-supported).
  - [x] Lọc đơn hàng theo trạng thái và bộ lọc thời gian Stats.
- [x] **Quản lý Key (Inventory Management)**: Đã kiểm thử luồng thêm/xóa key cho từng sản phẩm.
- [x] **Tìm kiếm & Bộ lọc (Admin Search & Filters)**:
  - [x] Tìm kiếm Đơn hàng theo ID/Email/Username (Backend-supported).
  - [x] Tìm kiếm Key theo mã Key/Tên sản phẩm.
  - [x] Sắp xếp mặc định theo ngày mới nhất cho Đơn hàng và Key.
- [x] **Nhập kho hàng loạt (Bulk Inventory)**:
  - [x] Chức năng nhập danh sách Key bằng Textarea, tự động tách dòng.
  - [x] API `POST /api/admin/keys/bulk` hỗ trợ xử lý hàng loạt.
- [x] **Các mục đã cải thiện (Fixed)**:
  - [x] **Thẻ thống kê (Stats Cards)** trên Dashboard: Đã kết nối với API `getOverviewStats`.
  - [x] **Hành động hàng loạt (Bulk Actions)**: Đã triển khai và Fix lỗi API 500 cho Sản phẩm & Người dùng.
  - [x] **Quản lý Danh mục (Category CRUD)**: Hoàn thiện Thêm/Sửa/Xóa.
  - [x] **Placeholder Settings**: Chuyển đổi thành các tab chức năng Bảo mật, SEO, Backup.
  - [x] **Quản lý Đơn hàng (Nâng cao)**:
    - [x] Tìm kiếm theo **tên sản phẩm** (Backend + Frontend).
    - [x] Bộ lọc **Ngày tạo** (Date Range Picker).
    - [x] Chức năng **Xuất báo cáo** (CSV Export).
    - [x] Chức năng **Tạo đơn thủ công** (Manual Order Entry Modal & API).

### 14.3. Tính năng Đánh giá & Nhận xét (Reviews & Ratings)

- [x] Backend: Thiết kế Entity `Review`, API CRUD cho bình luận và chấm điểm.
- [x] Backend: Tự động tính toán điểm trung bình (Average Rating) của sản phẩm.
- [x] Frontend: Giao diện hiển thị danh sách đánh giá tại trang Chi tiết sản phẩm.
- [x] Frontend: Form cho phép người dùng viết đánh giá mới.

---

## 🔒 Giai đoạn 7: Tối ưu & Bảo mật (Hoàn thành)

### 15. Performance & Caching

- [x] Tối ưu SQL queries bằng JPQL/Native Query cho `StatisticsService`.
- [x] Thêm **phân trang** (Pagination) cho tất cả danh sách API.
- [x] Lazy loading hình ảnh sản phẩm trên Frontend.

### 16. Bảo mật Nâng cao

- [x] Thêm **Rate Limiting** cho API Authentication (Simple In-Memory).
- [x] Cấu hình **CORS** chặt chẽ (chỉ cho phép domain Frontend).
- [x] Thêm **Input Validation** (@Valid) cho tất cả Request DTOs.
- [x] Global **Exception Handler** (`@ControllerAdvice`) trả về lỗi chuẩn hóa.

### 17. CI/CD Pipeline

- [x] Thiết lập **GitHub Actions** cho Build + Test tự động.
- [x] Auto-deploy lên môi trường staging khi merge vào `main`.

---

## 💬 Giai đoạn 8: Chat & Hỗ trợ Trực tuyến (Hoàn thành)

### 18. Hệ thống Chat Thời gian thực (WebSocket)

- [x] **Backend**: Thiết kế Entity `ChatRoom`, `ChatMessage` với JPA.
- [x] **Backend**: Cấu hình Spring WebSocket + STOMP + SockJS.
- [x] **Backend**: API REST quản lý phòng chat, tin nhắn, đánh dấu đã đọc.
- [x] **Backend**: Xác thực WebSocket qua JWT (Interceptor).
- [x] **Frontend (User)**: `ChatWidget` floating cho người dùng gửi/nhận tin nhắn.
- [x] **Frontend (Admin)**: Trang `Messages` quản lý tất cả cuộc hội thoại.
- [x] Chỉ báo đang nhập (Typing Indicator) thời gian thực.
- [x] Trạng thái "Đã xem" (Seen) hiển thị trên tin nhắn gần nhất.
- [x] Đếm tin nhắn chưa đọc (Unread Count) đồng bộ giữa Frontend & Database.
- [x] Nút "Đánh dấu đã đọc tất cả" cho Admin.
- [x] Quick Replies (Phản hồi nhanh) cho cả User và Admin.

### 19. Trang Cấu hình (Settings) Nâng cao

- [x] Tab **Chung**: Thương hiệu (Logo), Mạng xã hội & Liên hệ hỗ trợ.
- [x] Tab **Thanh toán**: Cấu hình VNPAY, MoMo, Chuyển khoản ngân hàng (VietQR).
- [x] Tab **Bán hàng**: Chế độ bảo trì, Thông báo Telegram cho đơn hàng mới.
- [x] Tab **Bảo mật**: Bật/Tắt đăng nhập Google OAuth 2.0.
- [x] Tab **SEO**: Từ khóa & Meta cho key kỹ thuật số.

### 20. OAuth Social Login (Google)

- [x] **Backend**: Tích hợp `google-api-client` để xác thực Google ID Token.
- [x] **Backend**: API `POST /api/v1/auth/google` nhận credential từ frontend.
- [x] **Backend**: Tự động tạo tài khoản mới hoặc liên kết tài khoản hiện có khi đăng nhập Google.
- [x] **Backend**: Thêm trường `auth_provider` và `provider_id` vào Entity `User`.
- [x] **Frontend**: Tích hợp **Google Identity Services** (GIS) cho luồng đăng nhập/đăng ký.
- [x] **Frontend**: Nút "Tiếp tục với Google" trên form đăng nhập/đăng ký.
- [x] **Frontend**: Thêm `googleLogin` vào `AuthContext` để quản lý state.
- [x] **Bảo mật**: Endpoint `/api/v1/auth/google` được permit trong `SecurityConfig`.

---

## 🌐 Giai đoạn 9: Production & Monitoring

### 21. Deploy Production

- [x] Deploy **Frontend** lên Vercel / Netlify.
- [x] Deploy **Backend** lên Railway / Render.
- [x] Cấu hình **Supabase PostgreSQL** cho production database.
- [x] Thiết lập **Custom Domain** + SSL.

### 22. Monitoring & Logging

- [x] Tích hợp **Structured Logging** (JSON format).
- [x] Health check endpoint cho uptime monitoring.
- [x] Thiết lập **Error Tracking** (Sentry hoặc tương đương).

---

## 🛠️ Trạng thái Vận hành (Local Environment)

| Thành phần      | Port | Trạng thái          |
| :-------------- | :--- | :------------------ |
| **Frontend**    | 5173 | 🟢 Running (Docker) |
| **Backend API** | 8080 | 🟢 Running (Docker) |
| **Database**    | 5433 | 🟢 Running (Docker) |

---

_Cập nhật lần cuối: 2026-02-28_
