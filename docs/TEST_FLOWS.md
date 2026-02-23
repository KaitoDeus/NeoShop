# NeoShop Master Testing Flows

Tài liệu này tổng hợp các luồng tương tác quan trọng của Người dùng (User) và Quản trị viên (Admin) để hỗ trợ việc kiểm thử tự động (End-to-End Testing).

---

## 🔐 1. Luồng Authentication & Profile

**Mục tiêu**: Kiểm tra đăng ký, đăng nhập và quản lý thông tin cá nhân.

1. **Đăng ký (User)**:
   - Truy cập `/login` -> Chuyển sang tab Đăng ký.
   - Nhập thông tin: Tên, Email, Mật khẩu.
   - Nhấn Đăng ký -> Chờ chuyển hướng về Đăng nhập hoặc Home.
2. **Đăng nhập (User/Admin)**:
   - Truy cập `/login`.
   - Nhập Email & Mật khẩu.
   - Kiểm tra Token lưu trong `localStorage` (`neoshop_user`).
3. **Xem hồ sơ (User)**:
   - Truy cập `/profile`.
   - Kiểm tra thông tin hiển thị và lịch sử đơn hàng.
   - Cập nhật Avatar (Thử thay đổi ảnh).

---

## 🛒 2. Luồng Mua sắm (User Flow)

**Mục tiêu**: Kiểm tra từ lúc chọn hàng đến khi nhận mã Key.

1. **Duyệt sản phẩm**:
   - Truy cập `/category` hoặc cuộn ở trang Home.
   - Tìm theo tên sản phẩm bằng thanh Search ở Header.
   - Click vào sản phẩm để xem `/product/:id`.
2. **Giỏ hàng**:
   - Thêm sản phẩm vào giỏ (nút "Thêm vào giỏ").
   - Truy cập `/cart` -> Thay đổi số lượng -> Xóa sản phẩm.
3. **Thanh toán**:
   - Từ `/cart` nhấn "Thanh toán".
   - Nhập mã giảm giá (ví dụ: `WELCOME10`) -> Nhấn Áp dụng.
   - Chọn phương thức thanh toán -> Nhấn "Đặt hàng ngay".
4. **Nhận hàng**:
   - Chuyển hướng đến `/order-success/:id`.
   - Kiểm tra hiển thị **Mã Key** số đã mua.

---

## 🛠️ 3. Luồng Quản trị (Admin Flow)

**Mục tiêu**: Kiểm tra các tác vụ vận hành của Admin.

1. **Quản lý Sản phẩm**:
   - Truy cập `/admin/products`.
   - Tìm kiếm: Nhập "Steam" -> Nhấn Enter -> Kiểm tra danh sách lọc.
   - Thêm: Nhấn "Thêm sản phẩm mới" -> Điền form -> Lưu -> Kiểm tra sản phẩm mới ở đầu bảng.
   - Chỉnh sửa: Nhấn icon Edit -> Thay đổi giá -> Lưu.
   - Xóa: Nhấn icon Thùng rác -> Xác nhận.
2. **Quản lý Kho Key**:
   - Tại dòng sản phẩm, nhấn icon "Chìa khóa".
   - Kiểm tra danh sách key hiện có.
   - Nhấn "Thêm Key" -> Nhập danh sách key (mỗi dòng 1 key) -> Lưu.
3. **Quản lý Đơn hàng**:
   - Truy cập `/admin/orders`.
   - Filter theo trạng thái "Đã thanh toán".
   - Nhấn "Xem chi tiết" -> Kiểm tra thông tin người mua và trạng thái License key.
4. **Thống kê & Báo cáo**:
   - Truy cập `/admin/stats`.
   - Nhấn "Lọc" theo khoảng thời gian.
   - Nhấn "Xuất CSV" -> Kiểm tra file tải về.
5. **Cấu hình hệ thống**:
   - Truy cập `/admin/settings`.
   - Thay đổi "Tên cửa hàng" -> Nhấn Lưu -> F5 trang để kiểm tra dữ liệu đã persist vào DB.

---

## 🧪 4. Checkpoint kỹ thuật cho Browser Subagent

Khi chạy testing tự động, hãy chú ý các phần tử sau:

- **Xác thực**: Kiểm tra xem header có hiển thị Avatar người dùng sau khi login không.
- **Mạng (Network)**: Kiểm tra mã lỗi 401 hoặc 500 trong console.
- **Phản hồi (Toast/Alert)**: Kiểm tra thông báo "Thành công" sau mỗi thao tác Lưu/Xóa.
- **Responsive**: Kiểm tra sidebar có bị ẩn/hiện đúng trên mobile (nếu có logic collapse).
