# Phân tích Dự án NeoShop

## 1. Tổng quan

NeoShop là một ứng dụng thương mại điện tử hiện đại. Ban đầu được thiết kế theo hướng Microservices, dự án đã được chuyển đổi sang kiến trúc **Monolith hiện đại** để tối ưu hóa hiệu năng và đơn giản hóa việc phát triển cho giai đoạn đầu. Backend được xây dựng với Spring Boot theo mô hình **5-layer pattern** (Layered Architecture).

## 2. Công nghệ sử dụng

### Backend

- **Framework**: Spring Boot 3.2+
- **Kiến trúc**: Monolith (5 layers: Config, Controller, Service, Repository, Model)
- **Bảo mật**: Spring Security + JWT
- **Hệ quản trị CSDL**: PostgreSQL 17

### Frontend

- **Frontend Framework**: React 19
- **Công cụ xây dựng (Build Tool)**: Vite
- **Điều hướng**: React Router DOM v7
- **Quản lý trạng thái**: React Context API (`AuthContext`, `CartContext`)
- **Định dạng kiểu dáng (Styling)**: CSS Modular.
- **Biểu đồ (Charts)**: Recharts.

## 3. Cấu trúc dự án

Dự án tuân theo tổ chức dựa trên tính năng và chức năng:

```
src/
├── assets/         # Tài sản tĩnh (hình ảnh, các tệp ghi đè toàn cục)
├── components/     # Các thành phần giao diện UI có thể tái sử dụng
│   ├── admin/      # Các thành phần dành riêng cho Admin (Sidebar, Biểu đồ)
│   ├── common/     # Các thành phần dùng chung (Nút, Ô nhập liệu, Modal)
│   └── sections/   # Các phần của trang (Danh sách sản phẩm, Hero, Footer)
├── context/        # Trạng thái toàn cục (Xác thực, Giỏ hàng)
├── layouts/        # Bố cục trang
│   ├── MainLayout  # Bố cục cửa hàng (Header + Outlet + Footer)
│   └── AdminLayout # Bố cục quản trị (Sidebar + Header + Outlet)
├── pages/          # Các trang/khung nhìn của ứng dụng
│   ├── Auth/       # Đăng nhập/Đăng ký
│   ├── Home/       # Trang chủ
│   ├── Product*/   # Danh sách và chi tiết sản phẩm
│   ├── Cart/       # Giỏ hàng và Thanh toán
│   ├── Admin/      # Dashboard quản trị và các trang quản lý
│   └── ...         # Các trang tĩnh (Hỗ trợ, Liên hệ, Pháp lý)
└── utils/          # Các hàm hỗ trợ và hằng số
```

## 4. Các mô-đun chức năng chính

### A. Storefront (Dành cho người dùng)

- **Xác thực (Auth)**: Đăng nhập và đăng ký người dùng (`/login`).
- **Khám phá sản phẩm**:
  - Trang chủ với các phần nổi bật.
  - Danh mục sản phẩm (`/category`).
  - Chi tiết sản phẩm (`/product/:id`).
- **Giỏ hàng & Thanh toán**:
  - Quản lý giỏ hàng (`/cart`).
  - Quy trình thanh toán (`/checkout`).
  - Thông tin giao hàng (`/delivery`).
- **Hỗ trợ & Pháp lý**: Trung tâm trợ giúp, biểu mẫu liên hệ, chính sách bảo mật, điều khoản.

### B. Dashboard Quản trị (Được bảo vệ)

- **Kiểm soát truy cập**: Được bảo vệ bởi `ProtectedRoute` (Chỉ dành cho Admin).
- **Dashboard**: Tổng quan số liệu thống kê và biểu đồ doanh thu.
- **Quản lý sản phẩm**: Các thao tác CRUD (Thêm, Đọc, Sửa, Xóa) cho sản phẩm (`/admin/products`).
- **Quản lý đơn hàng**: Xem và cập nhật trạng thái đơn hàng (`/admin/orders`).
- **Quản lý người dùng**: Quản lý tài khoản khách hàng (`/admin/users`).
- **Khóa/Bản quyền**: Quản lý khóa sản phẩm kỹ thuật số (`/admin/keys`).
- **Cài đặt hệ thống**: Cấu hình hệ thống (`/admin/settings`).

## 5. Yêu cầu dữ liệu (Suy luận từ UI)

Dựa trên các trang và thành phần, backend cần hỗ trợ:

- **Người dùng (Users)**: Hồ sơ chuẩn, vai trò (admin/user), token xác thực.
- **Sản phẩm (Products)**: Tiêu đề, mô tả, giá, giá khuyến mãi, danh mục, hình ảnh, tồn kho, khóa kỹ thuật số.
- **Danh mục (Categories)**: Phân cấp (cha/con), biểu tượng.
- **Giỏ hàng (Carts)**: Các mục giỏ hàng lâu dài cho mỗi người dùng (hoặc phiên làm việc).
- **Đơn hàng (Orders)**: Các mặt hàng, trạng thái (đang chờ, đã thanh toán, đã giao), chi tiết giao hàng, thông tin thanh toán.
- **Thống kê (Statistics)**: Tổng hợp doanh thu, sự tăng trưởng người dùng, số lượng đơn hàng.
