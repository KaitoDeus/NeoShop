# NeoShop — Nền tảng Thương mại Điện tử Kỹ thuật số

<div align="center">

![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite_6-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot_3-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![Java](https://img.shields.io/badge/Java_21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL_15-336791?style=for-the-badge&logo=postgresql&logoColor=white)
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
| **Database**  | PostgreSQL                          | 15         |
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
│                     │     │  + WebSocket STOMP   │     │                     │
│ • Pages & Routes    │     │ • Controllers        │     │ • users, roles      │
│ • Context API       │     │ • Services           │     │ • products, orders  │
│ • Hooks             │     │ • Repositories (JPA) │     │ • chat_rooms/msgs   │
│ • Service Layer     │     │ • Security (JWT)     │     │ • coupons, reviews  │
│   (Axios)           │     │ • WebSocket Config   │     │ • product_keys      │
└─────────────────────┘     └─────────────────────┘     └─────────────────────┘
       :5173                       :8080                       :5433
```

### Luồng Xử Lý Chính

```
  Khách hàng                              NeoShop Server
      │                                        │
      │  (1) Duyệt & Tìm kiếm sản phẩm        │
      │───────────────────────────────────────► │
      │                                        │
      │  (2) Thêm vào giỏ hàng                 │
      │───────────────────────────────────────► │  ← LocalStorage + Context API
      │                                        │
      │  (3) Checkout + Nhập mã giảm giá       │
      │───────────────────────────────────────► │  ← POST /api/coupons/validate
      │                                        │
      │  (4) Thanh toán (VNPay / MoMo)          │
      │───────────────────────────────────────► │  ← Redirect → Payment Gateway
      │                                        │
      │  (5) Callback → Cập nhật trạng thái     │
      │  ◄──────────────────────────────────── │  ← Webhook IPN + Return URL
      │                                        │
      │  (6) Nhận Product Key tức thời          │
      │  ◄──────────────────────────────────── │  ← Auto-assign key từ kho
      │                                        │
```

---

## 4. Chức Năng

### 🛒 Dành cho Khách Hàng

- **Duyệt sản phẩm** theo danh mục, tìm kiếm, lọc giá, sắp xếp
- **Giỏ hàng** đồng bộ tức thời qua Context API + LocalStorage
- **Thanh toán** qua VNPay, MoMo với cơ chế Webhook IPN đối soát tự động
- **Mã giảm giá** — nhập coupon tại checkout, hỗ trợ giảm theo % hoặc cố định
- **Nhận key tức thời** — hệ thống tự động cấp phát mã key từ kho ngay sau thanh toán
- **Đánh giá sản phẩm** — viết review kèm chấm sao, hiển thị tại trang chi tiết
- **Chat hỗ trợ** — widget floating gửi/nhận tin nhắn thời gian thực với admin
- **Đăng nhập Google** — OAuth 2.0 qua Google Identity Services, tự động tạo tài khoản
- **Quản lý hồ sơ** — cập nhật thông tin cá nhân, đổi avatar, đổi mật khẩu

### 🔧 Dành cho Quản trị viên (Admin)

- **Dashboard** — thống kê doanh thu, đơn hàng, người dùng với biểu đồ tương tác
- **Quản lý sản phẩm** — CRUD sản phẩm, quản lý danh mục, hành động hàng loạt
- **Quản lý kho key** — nhập key đơn/hàng loạt, theo dõi trạng thái (Available/Sold)
- **Quản lý đơn hàng** — lọc, tìm kiếm, tạo đơn thủ công, xuất CSV
- **Quản lý khách hàng** — CRUD người dùng, phân quyền, kích hoạt/vô hiệu hóa
- **Mã giảm giá** — tạo/sửa/xoá coupon với các điều kiện áp dụng
- **Tin nhắn** — trả lời chat từ khách hàng, đánh dấu đã đọc, xoá hội thoại
- **Cài đặt hệ thống** — cấu hình thương hiệu, thanh toán, bán hàng, bảo mật, SEO
- **Thống kê nâng cao** — lọc theo khoảng thời gian, biểu đồ doanh thu/chi phí/lợi nhuận

### 🔐 Bảo mật

- JWT Authentication + Spring Security Filter Chain
- Role-based Access Control (RBAC) — `USER` / `ADMIN`
- Rate Limiting cho API Authentication
- CORS cấu hình chặt chẽ
- Input Validation (`@Valid`) cho tất cả Request DTOs
- Global Exception Handler (`@ControllerAdvice`)
- WebSocket Authentication qua JWT Interceptor

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
