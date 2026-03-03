# Hướng dẫn Triển khai NeoShop (Deployment Guide)

Tài liệu này hướng dẫn các bước để đưa dự án NeoShop lên môi trường Production.

## 1. Cơ sở dữ liệu (Supabase)

Chúng ta sử dụng Supabase để cung cấp PostgreSQL database miễn phí và ổn định.

1. Truy cập [Supabase](https://supabase.com/) và tạo dự án mới.
2. Vào phần **Project Settings** > **Database**.
3. Copy **Connection string** (dạng URI). Nó sẽ có dạng: `postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-ID].supabase.co:5432/postgres`.
4. Lưu giá trị này vào biến môi trường `SPRING_DATASOURCE_URL` trên Railway.

## 2. Triển khai Backend (Railway)

Railway là nền tảng dễ dàng nhất để chạy Spring Boot app từ GitHub.

1. Kết nối tài khoản GitHub với Railway.
2. Chọn **New Project** > **Deploy from GitHub repo**.
3. Chọn repo `NeoShop`.
4. Cấu hình các biến môi trường (Variables):
   - `SPRING_DATASOURCE_URL`: (Lấy từ Supabase ở bước 1)
   - `SPRING_DATASOURCE_USERNAME`: `postgres`
   - `SPRING_DATASOURCE_PASSWORD`: (Mật khẩu DB của bạn)
   - `SENTRY_DSN`: (Lấy từ Sentry dashboard nếu có)
   - `JWT_SECRET`: (Tạo một chuỗi ngẫu nhiên dài)
   - `VNPAY_TMN_CODE`, `VNPAY_HASH_SECRET`: (Thông tin sandbox hoặc thực tế)
   - `GOOGLE_CLIENT_ID`: (Từ Google Cloud Console)

## 3. Triển khai Frontend (Vercel/Netlify)

Frontend được viết bằng React (Vite), rất phù hợp với Vercel.

1. Đẩy code frontend lên GitHub (nếu chưa).
2. Trên Vercel, chọn **New Project** và trỏ vào repo `NeoShop`.
3. Thiết lập **Root Directory** là `frontend`.
4. Cấu hình biến môi trường:
   - `VITE_API_BASE_URL`: URL của backend đã deploy trên Railway (ví dụ: `https://neoshop-backend-production.up.railway.app`)

## 4. Kiểm tra Giám sát (Monitoring)

Sau khi deploy thành công, bạn có thể kiểm tra:

- **Health Check**: `https://<your-backend-url>/actuator/health`
- **Logs**: Xem trực tiếp trong tab **Logs** của Railway (sẽ thấy định dạng JSON nếu set profile `prod`).
- **Sentry**: Kiểm tra dashboard Sentry để xem các Exception nếu có.
