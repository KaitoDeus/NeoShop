# NeoShop — Thương mại Điện tử Kỹ thuật số

<div align="center">

![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite_6-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot_3-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![Java](https://img.shields.io/badge/Java_21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL_17-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![WebSocket](https://img.shields.io/badge/WebSocket-010101?style=for-the-badge&logo=socketdotio&logoColor=white)

</div>

---

## 📖 Mục Lục

1. [Giới Thiệu](#1-giới-thiệu)
2. [Công Nghệ](#2-công-nghệ)
3. [Kiến Trúc Hệ Thống](#3-kiến-trúc-hệ-thống)
4. [Chức Năng](#4-chức-năng)
5. [Giao Diện](#5-giao-diện)
6. [Cài Đặt & Chạy](#6-cài-đặt--chạy)
7. [Cấu Trúc Dự Án](#7-cấu-trúc-dự-án)
8. [Hướng Dẫn Sử Dụng](#8-hướng-dẫn-sử-dụng)

---

## 1. Giới Thiệu

**NeoShop** là nền tảng thương mại điện tử chuyên cung cấp các sản phẩm kỹ thuật số — tài khoản premium (Netflix, Spotify, YouTube), khóa bản quyền phần mềm (Windows, Office, Adobe), game Steam, và nhiều loại key số khác.

Hệ thống tự động cấp phát mã key ngay sau khi thanh toán thành công, hỗ trợ thanh toán qua VNPay và MoMo, chat hỗ trợ thời gian thực, và giao diện quản trị toàn diện.

---

## 2. Công Nghệ

| Thành phần    | Công nghệ                           | Phiên bản  |
| :------------ | :---------------------------------- | :--------- |
| **Frontend**  | React + Vite + Vanilla CSS          | 19.x / 6.x |
| **Backend**   | Spring Boot + Spring Security + JWT | 3.x        |
| **Runtime**   | Java (OpenJDK)                      | 21         |
| **Database**  | PostgreSQL                          | 17         |
| **Realtime**  | Spring WebSocket + STOMP + SockJS   | —          |
| **Auth**      | JWT + Google OAuth 2.0 (GIS)        | —          |
| **Payment**   | VNPay Sandbox + MoMo Sandbox        | —          |
| **Container** | Docker + Docker Compose             | —          |
| **CI/CD**     | GitHub Actions                      | —          |
| **API Docs**  | Swagger / OpenAPI 3                 | —          |

---

## 3. Kiến Trúc Hệ Thống

```
┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
│      FRONTEND       │     │       BACKEND       │     │      DATABASE       │
│   React + Vite      │◄───►│  Spring Boot REST   │◄───►│    PostgreSQL 15    │
│                     │     │  + WebSocket STOMP  │     │                     │
│ • Pages & Routes    │     │ • Controllers       │     │ • users, roles      │
│ • Context API       │     │ • Services          │     │ • products, orders  │
│ • Hooks             │     │ • Repositories (JPA)│     │ • chat_rooms/msgs   │
│ • Service Layer     │     │ • Security (JWT)    │     │ • coupons, reviews  │
│   (Axios)           │     │ • WebSocket Config  │     │ • product_keys      │
└─────────────────────┘     └─────────────────────┘     └─────────────────────┘
       :5173                       :8080                       :5433
```

### Luồng Xử Lý Chính

```
  Khách hàng                              NeoShop Server
      │                                        │
      │  (1) Duyệt & Tìm kiếm sản phẩm         │
      │───────────────────────────────────────►│
      │                                        │
      │  (2) Thêm vào giỏ hàng                 │
      │───────────────────────────────────────►│  ← LocalStorage + Context API
      │                                        │
      │  (3) Checkout + Nhập mã giảm giá       │
      │───────────────────────────────────────►│  ← POST /api/coupons/validate
      │                                        │
      │  (4) Thanh toán (VNPay / MoMo)         │
      │───────────────────────────────────────►│  ← Redirect → Payment Gateway
      │                                        │
      │  (5) Callback → Cập nhật trạng thái    │
      │  ◄──────────────────────────────────── │  ← Webhook IPN + Return URL
      │                                        │
      │  (6) Nhận Product Key tức thời         │
      │  ◄──────────────────────────────────── │  ← Auto-assign key từ kho
      │                                        │
```

---

## 4. Chức Năng Hệ Thống

**Động Cơ Thương Mại Điện Tử (Digital E-commerce Engine)**

- **Quản lý Danh mục & Sản phẩm:** Khả năng tìm kiếm, phân trang và lọc nâng cao bằng các truy vấn JPA/Hibernate.
- **Quản lý Kho Kỹ Thuật Số (Digital Keys):** Hệ thống quản lý mã kích hoạt (Product Keys). Tự động khóa và cấp phát mã ngay lập tức cho khách hàng khi giao dịch thành công. Cơ chế đồng bộ số lượng tồn kho theo thời gian thực dựa trên trạng thái thiết thực của mã.
- **Giỏ Hàng Động:** Đồng bộ trạng thái tức thời trên Frontend sử dụng React Context API kết hợp với LocalStorage để ngăn ngừa mất dữ liệu.

**Xác Thực & Phân Quyền (Authentication & Authorization)**

- **Xác thực Phi Trạng Thái (Stateless Auth):** Sử dụng chuẩn JSON Web Tokens (JWT) cho toàn bộ các endpoint bảo mật.
- **Tích hợp OAuth 2.0:** Đăng nhập và đăng ký qua nền tảng Google Identity Services, kết nối mượt mà với quy trình tự động cấp phát JWT.
- **Kiểm soát Truy Cập (RBAC):** Cấu hình bảo mật qua `@PreAuthorize`, thiết lập ranh giới rõ ràng giữa khách hàng (USER) và người quản trị (ADMIN).
- **Mã Hóa Mật Khẩu:** Thuật toán BCrypt cho cơ sở dữ liệu nhằm bảo mật nguyên bản mật khẩu.

**Tích Hợp Thanh Toán (Payment Gateway Integration)**

- **Cơ Chế Webhook & IPN:** Tích hợp quy trình Server-to-Server đảm bảo đối soát đơn hàng tự động với API VNPay và MoMo. Đơn hàng được xử lý ngay cả khi người dùng không quay lại trang kết quả.
- **Bảo Mật Phương Thức Giao Dịch:** Xây dựng tính toán tự động các chữ ký mật mã (HMAC-SHA512 & SHA256) cho request dữ liệu thanh toán, loại bỏ rủi ro giả mạo thông tin tiền tệ.

**Giao Tiếp Thời Gian Thực (Real-time Communication)**

- **Kênh Chat Hỗ Trợ:** Tích hợp giao tiếp hai chiều (Bidirectional) qua nền tảng Socket thông qua giao thức STOMP, cung cấp khả năng tư vấn tức khắc.
- **Bảo Mật WebSocket:** Tùy biến Interceptor để kiểm duyệt JWT Token ở vòng Handshake, nhằm xác thực người dùng ngay khi thiết lập đường truyền.

**Cơ Chế Khuyến Mãi & Tương Tác (Marketing & User Engagement)**

- **Công Cụ Mã Giảm Giá (Coupon Engine):** Hỗ trợ thiết lập linh hoạt hạn mức chiết khấu theo tỷ lệ phần trăm hoặc giá trị cố định. Xây dựng các điều kiện rào cản như: số lượt sử dụng, tổng đơn hàng tối thiểu và vòng đời mã.
- **Hệ Thống Đánh Giá Tính Điểm:** Chỉ hệ thống ghi nhận người dùng đã mua hàng thành công mới được ủy quyền viết review. Tự động tính toán bình quân đánh giá cho mỗi loại sản phẩm.

**Vận Hành & Phân Tích (Admin Operations & Analytics)**

- **Bảng Điều Khiển Tổng Quan (Dashboard):** Khai thác các truy vấn trực quan hóa biểu đồ về doanh thu, số lượng hóa đơn, và xu hướng khởi tạo tài khoản.
- **Quản Lý Giao Dịch Hàng Loạt (Bulk Operations):** Đóng gói logic hỗ trợ nghiệp vụ thêm mới/cập nhật hàng loạt mã kích hoạt (keys), đơn vị sản phẩm dưới quyền bảo hộ của Spring `@Transactional`.
- **Cấu Hình Cửa Hàng Hệ Thống Động:** Cho phép thay đổi thông tin cài đặt giao diện/email/số điện thoại từ bảng điều khiển thay vì mã nguồn cứng (hardcode). Cập nhật realtime xuống phía User.

**Độ Tin Cậy Hệ Thống (Security & Resilience)**

- **Xử Lý Lỗi Tập Trung (Global Exception Handling):** Sử dụng công cụ `ControllerAdvice` để chặn toàn bộ ngoại lệ cục/đáy, cấu trúc lại json error không làm lộ cấu trúc server.
- **Kiểm Soát Nội Dung (Input Validation):** Cài đặt ràng buộc chặt mức REST API với kiến trúc Jakarta Validation. Bắt chặt dữ liệu sai định dạng từ bước tiếp nhận.
- **Quản Trị Tên Miền Đa Nền Tảng:** Áp đặt chính sách cấu hình CORS nghiêm ngặt để Frontend UI và Backend API giao tiếp bảo mật xuyên domain.

---

## 5. Giao Diện

![Giao diện trang chủ](/frontend/public/homepage.png)

---

## 6. Cài Đặt & Chạy

### Yêu cầu

- **Docker** & **Docker Compose** (bắt buộc)
- **Git** để clone dự án

### Bước 1 — Clone dự án

```bash
git clone https://github.com/KaitoDeus/NeoShop.git
cd NeoShop
```

### Bước 2 — Cấu hình biến môi trường

Sao chép file mẫu và điền thông tin:

```bash
cp .env.example .env
```

Mở file `.env` và cập nhật các giá trị (VNPay, MoMo, Google OAuth...).

### Bước 3 — Khởi động

```bash
docker compose up -d --build
```

### Bước 4 — Truy cập

| Dịch vụ          | URL                                   | Mô tả                       |
| :--------------- | :------------------------------------ | :-------------------------- |
| **Frontend**     | http://localhost:5173                 | Giao diện web               |
| **Backend API**  | http://localhost:8080                 | REST API Server             |
| **Swagger Docs** | http://localhost:8080/swagger-ui.html | Tài liệu API                |
| **Database**     | `localhost:5433`                      | PostgreSQL (user: postgres) |

### Tài khoản mặc định

| Vai trò | Username | Password   |
| :------ | :------- | :--------- |
| Admin   | `admin`  | `admin123` |

---

## 7. Cấu Trúc Dự Án

```
NeoShop/
├── backend/                    # Spring Boot Backend
│   ├── src/main/java/com/neoshop/
│   │   ├── config/             # Security, WebSocket, Swagger
│   │   ├── controller/         # REST + WebSocket Controllers
│   │   ├── model/              # Entity, DTO (Request/Response)
│   │   ├── repository/         # JPA Repositories
│   │   └── service/            # Business Logic
│   └── src/main/resources/
│       └── application.yml     # Cấu hình ứng dụng
├── frontend/                   # React + Vite Frontend
│   ├── src/
│   │   ├── components/         # UI Components (Navbar, Footer, ChatWidget...)
│   │   ├── context/            # AuthContext, CartContext
│   │   ├── hooks/              # Custom Hooks (useChat)
│   │   ├── pages/              # Trang: Home, Auth, Product, Admin...
│   │   ├── services/           # API Service Layer (Axios)
│   │   └── utils/              # Tiện ích (formatDate, formatPrice...)
│   └── vite.config.js
├── database/
│   ├── init/script.sql         # Script khởi tạo DB ~100K dòng
│   └── migrations/             # Migration scripts
├── .github/workflows/          # CI/CD Pipeline
├── docker-compose.yml          # Orchestration
├── .env.example                # Mẫu biến môi trường
└── docs/PROGRESS.md            # Tiến trình phát triển
```

---

## 8. Hướng Dẫn Sử Dụng

### Khách hàng

1. **Duyệt sản phẩm** — Truy cập trang chủ, chọn danh mục hoặc tìm kiếm
2. **Xem chi tiết** — Nhấn vào sản phẩm để xem mô tả, đánh giá, giá
3. **Mua hàng** — Nhấn "Thêm vào giỏ" hoặc "Mua ngay"
4. **Thanh toán** — Chọn VNPay/MoMo, nhập mã giảm giá (nếu có), xác nhận
5. **Nhận key** — Product key hiển thị ngay tại trang xác nhận đơn hàng
6. **Chat hỗ trợ** — Nhấn biểu tượng 💬 góc phải để nhắn tin với admin

### Quản trị viên

1. Đăng nhập tại `/auth` với tài khoản admin
2. Truy cập `/admin` để vào trang quản trị
3. Sử dụng sidebar để điều hướng giữa các module
