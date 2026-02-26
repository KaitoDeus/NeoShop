# NeoShop

## Mục Lục

1. [Giới Thiệu Đề Tài](#1-giới-thiệu-đề-tài)
2. [Công nghệ Sử Dụng](#2-công-nghệ-sử-dụng)
3. [Kiến Trúc Hệ Thống](#3-kiến-trúc-hệ-thống)
4. [Giao Diện](#4-giao-diện)
5. [Hướng Dẫn Cài Đặt và Chạy (Local)](#5-hướng-dẫn-cài-đặt-và-chạy-local)
6. [Hướng Dẫn Sử Dụng](#6-hướng-dẫn-sử-dụng)
7. [Tác Giả & Liên Hệ](#7-tác-giả--liên-hệ)

---

## 1. Giới Thiệu Đề Tài

**NeoShop** là nền tảng thương mại điện tử chuyên cung cấp các sản phẩm kỹ thuật số (tài khoản Netflix, Spotify, khóa học, phần mềm bản quyền, game Steam, v.v.). Ứng dụng cung cấp giao diện hiện đại, trải nghiệm mua sắm mượt mà cùng quy trình thanh toán nhanh chóng, an toàn.

---

## 2. Công nghệ Sử Dụng

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![Java](https://img.shields.io/badge/Java-007396?style=for-the-badge&logo=java&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

---

## 3. Kiến Trúc Hệ Thống

### Các Lớp Logic (Logic Layers)

```text
+---------------------+       +---------------------+       +---------------------+
|      FRONTEND       |       |       BACKEND       |       |      DATABASE       |
| (React / Vite.js)   | <---> | (Spring Boot REST)  | <---> |    (PostgreSQL)     |
| - Pages             |       | - Controllers       |       | - Tables: Users,    |
| - Contexts          |       | - Services          |       |   Products, Orders, |
| - Services          |       | - Repositories      |       |   Categories        |
+---------------------+       +---------------------+       +---------------------+
```

### Mô Hình Kiến Trúc (Architecture)

```text
+-----------------------+           +-----------------------+
|      Client (Web)     | <-------> |     API Gateway /     |
|   (Giao diện người    |           |    Spring REST API    |
|        dùng)          |           |   (Xử lý logic core)  |
+-----------------------+           +-----------------------+
          |                                     |
          | HTTP Requests                       | JPA / Hibernate
          v                                     v
+-----------------------+           +-----------------------+
|  React Router (DOM)   |           |      PostgreSQL       |
|   (Điều hướng trang)  |           | (Lưu trữ dữ liệu)     |
+-----------------------+           +-----------------------+
```

### Luồng Xử Lý Chính (E-commerce Flow)

```text
  [ KHÁCH HÀNG ]                      [ HỆ THỐNG NEOSHOP ]
        |                                     |
        | (1) Truy cập Web & Tìm kiếm         |
        |------------------------------------>|
        |                                     |
        |   (2) Hiển thị Danh sách SP & Mô tả |
        |<------------------------------------|
        |                                     |
        | (3) Chọn "Thêm vào giỏ" / Mua ngay  |
        |------------------------------------>|
        |                                     |---- [ Cập nhật Cart Context ]
        | (4) Chuyển đến trang Checkout       |
        |------------------------------------>|
        |                                     |
  [ THANH TOÁN ]                              |
        |                                     |
        | (5) Nhập mã giảm giá (Nếu có)       |
        |------------------------------------>|
        |                                     |
        | (6) Chọn Phương Thức Thanh Toán     |
        |     (Thẻ Tín Dụng, Ví Điện Tử...)   |
        |------------------------------------>|
        |                                     |
        | (7) Xác nhận "Hoàn tất thanh toán"  |
        |------------------------------------>|
        |                                     |---- [ Xử lý hóa đơn DB ]
        | (8) Nhận Code Tức Thời              |<----------|
        |<------------------------------------|
        |                                     |
```

---

## 4. Giao Diện

_Giao diện cửa hàng hiện đại, tốc độ phản hồi cực nhanh, lấy cảm hứng từ các thiết kế UI/UX công nghệ._

![Giao diện trang chủ](/frontend/docs/homepage.png) _(Hình minh họa)_

---

## 5. Hướng Dẫn Cài Đặt và Chạy (Local)

Để chạy dự án này trên máy tính cá nhân, bạn cần cài đặt **Node.js**, **Java (JDK 17+)** và **Docker/Docker Compose**.

### Bước 1: Clone dự án

Mở terminal và chạy lệnh sau để tải mã nguồn về:

```bash
git clone https://github.com/KaitoDeus/NeoShop.git
cd NeoShop
```

### Bước 2: Khởi động qua Docker Compose

Hệ thống đã được đóng gói sẵn với Docker để tiện triển khai cả Frontend, Backend và Database chỉ bằng một lệnh duy nhất:

```bash
docker compose up -d --build
```

### Bước 3: Truy cập ứng dụng

Sau quá trình cài đặt và khởi động (khoảng vài phút):

- **Trang web khách hàng:** Truy cập địa chỉ `http://localhost:3000` trên trình duyệt để sử dụng.
- **API Server:** Hoạt động mặc định tại `http://localhost:8080`.
- **Database:** PostgreSQL chạy ở cổng `5433` (Map sang 5432 nội bộ).

---

## 6. Hướng Dẫn Sử Dụng

1.  **Duyệt Sản Phẩm**: Tại giao diện chính, bạn có thể xem các danh mục, Banner Deal, các sản phẩm Nổi bật và Tìm kiếm với từ khóa.
2.  **Xem Chi Tiết**: Ấn vào box sản phẩm để xem giới thiệu kĩ năng ứng dụng, bảo hành, review sản phẩm.
3.  **Mua Hàng**:
    - Nhấn **Thêm vào giỏ** hoặc **Mua ngay** ở trang thông tin chi tiết.
    - Chuyển hướng sang trang **Checkout**.
4.  **Thanh Toán**:
    - Ở trang Checkout, chọn loại tài khoản/ví thanh toán. Hệ thống xác nhận và hiển thị mã Code tức thời lên màn hình và gửi qua Email đăng ký.

---

## 7. Tác Giả & Liên Hệ

| Thông Tin     | Chi Tiết                                                |
| :------------ | :------------------------------------------------------ |
| **Developer** | Võ Anh Khải                                             |
| **Email**     | [khaivo300605@gmail.com](mailto:khaivo300605@gmail.com) |
