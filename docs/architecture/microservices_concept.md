# Understanding Backend & Microservices Structure

Bạn thắc mắc rất đúng! Hiện tại thư mục `backend/` đang trống là vì dự án mới chỉ đang ở bước **thiết kế (Design Phase)**. Những gì bạn thấy trong thư mục `docs/` chính là bản kế hoạch để "xây" nội dung cho thư mục này.

## 1. Backend chứa những gì?

Backend không chỉ là code, nó là "bộ não" xử lý mọi thứ "ngầm" mà người dùng không thấy:

- **Xác thực (Auth)**: Kiểm tra login, phân quyền (ai là Admin, ai là User).
- **Logic Nghiệp vụ**: Ví dụ khi đặt hàng thì phải trừ kho, tính tiền, tạo vận đơn.
- **Dữ liệu (Database)**: Lưu trữ sản phẩm, đơn hàng, thông tin khách hàng.
- **Kết nối bên thứ 3**: Gửi Email, thanh toán qua Momo/VNPay.

## 2. Cấu trúc Microservices: Tại sao lại là "Folders trong Folder"?

Có 2 cách chính để tổ chức code Microservices:

### Cách A: Monorepo (Một kho chứa - Cách đang được chọn cho NeoShop)

Toàn bộ các dịch vụ nhỏ (services) nằm chung trong một thư mục `backend/`.

```
backend/
├── neoshop-gateway/ (Cổng vào duy nhất)
├── neoshop-auth/    (Dịch vụ đăng nhập)
├── neoshop-catalog/ (Dịch vụ sản phẩm)
└── pom.xml          (File cấu hình chung)
```

- **Ưu điểm**: Dễ quản lý code, dễ chạy thử cả hệ thống trên máy cá nhân, các service dễ chia sẻ code dùng chung (DTO, Utils).
- **Thực tế**: Dù nằm chung thư mục, nhưng khi chạy (Deploy), mỗi folder này sẽ biến thành một "con" server riêng biệt, chạy độc lập hoàn toàn.

### Cách B: Polyrepo (Nhiều kho chứa)

Mỗi service (`auth`, `catalog`, `order`) là một Project/Git Repository riêng biệt.

- **Ưu điểm**: Các team làm việc hoàn toàn không đụng chạm nhau.
- **Nhược điểm**: Rất khó quản lý phiên bản và cấu hình chung khi dự án còn nhỏ.

## 3. Cấu trúc bên trong một Service (Ví dụ: `neoshop-auth`)

Khi chúng ta bắt đầu code, bên trong mỗi thư mục service sẽ có cấu trúc chuẩn (ví dụ Java Spring Boot hoặc .NET):

```
neoshop-auth/
├── src/main/java/... (Code xử lý: Controller, Service, Repository)
├── src/main/resources/ (Cấu hình, Script tạo bảng Database)
├── Dockerfile (File để đóng gói thành Container)
└── pom.xml (Khai báo thư viện cho riêng service này)
```

**Tóm lại**: Cấu trúc "Folders trong `backend/`" mà bạn thấy trong tài liệu chính là cách tiếp cận **Monorepo**. Nó giúp bạn bắt đầu dự án nhanh và bao quát hơn. Khi dự án lớn lên hàng nghìn người dùng, chúng ta có thể tách chúng ra các Repository riêng nếu cần.

Bạn có muốn tôi thử tạo "khung" (Boilerplate) cho 1 service đầu tiên để bạn hình dung rõ hơn không?
