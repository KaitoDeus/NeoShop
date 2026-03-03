# Hướng dẫn Triển khai NeoShop (Deployment Guide)

Tài liệu này hướng dẫn các bước để đưa dự án NeoShop lên môi trường Production.

## 1. Cơ sở dữ liệu (Railway PostgreSQL)

Chúng ta sử dụng dịch vụ **PostgreSQL** của chính Railway để đảm bảo độ trễ thấp nhất và dễ dàng quản lý biến môi trường.

1. Trên Railway Dashboard, nhấn **New** > **Database** > **Add PostgreSQL**.
2. Railway sẽ tự động tạo các biến môi trường: `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, và `PGDATABASE`.
3. Backend của chúng ta đã được cấu hình trong `application.yml` để tự động nhận diện các biến này.

## 2. Triển khai Backend (Railway)

Backend được Dockerize (Multi-stage build) và tối ưu cho monorepo.

1. Kết nối repo GitHub với Railway.
2. Railway sẽ tự động phát hiện `railway.json` và `backend/Dockerfile`.
3. Cấu hình các biến môi trường bổ sung (Variables):
   - `JWT_SECRET`: (Chuỗi ngẫu nhiên dài để bảo mật JWT).
   - `ALLOWED_ORIGINS`: (URL của Frontend sau khi deploy, ví dụ: `https://neoshop.vercel.app`).
   - `SPRINGDOC_ENABLED`: `false` (Mặc định là false trên prod để ẩn Swagger).
   - `SENTRY_DSN`: (Dùng để track lỗi production).
   - `VNPAY_TMN_CODE`, `MOMO_PARTNER_CODE`, vv. (Cấu hình thanh toán).

## 3. Triển khai Frontend (Vercel / Railway)

Frontend React (Vite) có thể deploy linh hoạt.

1. **Vercel**: Trỏ vào thư mục `frontend/`, thiết lập `Install Command` là `npm install` và `Build Command` là `npm run build`.
2. Biến môi trường:
   - `VITE_API_BASE_URL`: URL của backend (URL Railway cung cấp).

## 4. CI/CD & Giám sát (Workflow)

Hệ thống sử dụng GitHub Actions để tự động kiểm tra code:

- **Build Check**: Mỗi khi có Pull Request, hệ thống sẽ chạy `dry-run` docker build cho cả backend và frontend để đảm bảo không lỗi context.
- **Caching**: Sử dụng cache cho Maven và NPM để tăng tốc độ build.
- **Logs**: Railway sẽ hiển thị logs định dạng JSON (Structured Logging). Bạn có thể dùng Sentry để xem các cảnh báo/lỗi chi tiết.
- **Health Check**: Endpoint `/api/actuator/health` luôn được mở để Railway monitor trạng thái ứng dụng.

## 5. Lưu ý Bảo mật

- **Swagger**: Bị vô hiệu hóa mặc định trên Production. Để bật (không khuyến khích), set `SPRINGDOC_ENABLED=true`.
- **CORS**: Chỉ cho phép các domain được định nghĩa trong `ALLOWED_ORIGINS`.
