import React from "react";
import { Link } from "react-router-dom";
import {
  FiLock,
  FiShield,
  FiEye,
  FiDatabase,
  FiMail,
  FiGlobe,
} from "react-icons/fi";
import "./PrivacyPolicy.css";

const PrivacyPolicy = () => {
  return (
    <div className="privacy-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Trang chủ</Link> <span>/</span>
          <span style={{ color: "#0f172a", fontWeight: "500" }}>
            Chính sách bảo mật
          </span>
        </div>

        {/* Header */}
        <div className="policy-header">
          <FiLock className="header-icon" />
          <h1>Chính sách bảo mật</h1>
          <p>Cập nhật lần cuối: 01/01/2026</p>
        </div>

        {/* Summary */}
        <div className="summary-box">
          <h3>Tóm tắt</h3>
          <p>
            NeoShop cam kết bảo vệ quyền riêng tư và thông tin cá nhân của bạn.
            Chúng tôi chỉ thu thập những thông tin cần thiết để cung cấp dịch vụ
            và không bao giờ bán thông tin của bạn cho bên thứ ba.
          </p>
        </div>

        {/* Content */}
        <div className="policy-content">
          <section className="policy-section">
            <h2>
              <FiDatabase /> 1. Thông tin chúng tôi thu thập
            </h2>
            <p>
              Khi bạn sử dụng dịch vụ của NeoShop, chúng tôi có thể thu thập các
              loại thông tin sau:
            </p>

            <h4>1.1. Thông tin bạn cung cấp trực tiếp:</h4>
            <ul>
              <li>
                <strong>Thông tin tài khoản:</strong> Họ tên, địa chỉ email, số
                điện thoại khi đăng ký tài khoản
              </li>
              <li>
                <strong>Thông tin thanh toán:</strong> Thông tin thẻ tín
                dụng/ghi nợ (được mã hóa và xử lý bởi đối tác thanh toán)
              </li>
              <li>
                <strong>Thông tin liên hệ:</strong> Nội dung tin nhắn khi bạn
                liên hệ hỗ trợ
              </li>
            </ul>

            <h4>1.2. Thông tin thu thập tự động:</h4>
            <ul>
              <li>
                <strong>Thông tin thiết bị:</strong> Loại trình duyệt, hệ điều
                hành, địa chỉ IP
              </li>
              <li>
                <strong>Dữ liệu sử dụng:</strong> Các trang bạn truy cập, thời
                gian truy cập, hành vi tương tác
              </li>
              <li>
                <strong>Cookies:</strong> Dữ liệu để cải thiện trải nghiệm và
                ghi nhớ tùy chọn của bạn
              </li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>
              <FiEye /> 2. Cách chúng tôi sử dụng thông tin
            </h2>
            <p>Thông tin của bạn được sử dụng cho các mục đích sau:</p>
            <ul>
              <li>Xử lý đơn hàng và giao sản phẩm số</li>
              <li>Cung cấp hỗ trợ khách hàng</li>
              <li>Gửi thông báo về đơn hàng, cập nhật tài khoản</li>
              <li>Cải thiện sản phẩm và dịch vụ của NeoShop</li>
              <li>Phát hiện và ngăn chặn gian lận</li>
              <li>Tuân thủ các yêu cầu pháp lý</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>
              <FiShield /> 3. Bảo mật thông tin
            </h2>
            <p>
              NeoShop áp dụng các biện pháp bảo mật tiên tiến để bảo vệ thông
              tin của bạn:
            </p>
            <div className="security-grid">
              <div className="security-item">
                <strong>Mã hóa SSL/TLS</strong>
                <p>Tất cả dữ liệu được truyền qua kết nối an toàn</p>
              </div>
              <div className="security-item">
                <strong>Mã hóa dữ liệu</strong>
                <p>Thông tin nhạy cảm được mã hóa khi lưu trữ</p>
              </div>
              <div className="security-item">
                <strong>Kiểm soát truy cập</strong>
                <p>Chỉ nhân viên được ủy quyền mới có quyền truy cập</p>
              </div>
              <div className="security-item">
                <strong>Giám sát 24/7</strong>
                <p>Hệ thống bảo mật hoạt động liên tục</p>
              </div>
            </div>
          </section>

          <section className="policy-section">
            <h2>
              <FiGlobe /> 4. Chia sẻ thông tin
            </h2>
            <p>
              Chúng tôi <strong>không bán</strong> thông tin cá nhân của bạn.
              Thông tin chỉ được chia sẻ trong các trường hợp:
            </p>
            <ul>
              <li>
                <strong>Đối tác thanh toán:</strong> Để xử lý giao dịch (ví dụ:
                cổng thanh toán, ngân hàng)
              </li>
              <li>
                <strong>Nhà cung cấp dịch vụ:</strong> Các bên thứ ba hỗ trợ vận
                hành (ví dụ: dịch vụ email)
              </li>
              <li>
                <strong>Yêu cầu pháp lý:</strong> Khi được yêu cầu bởi cơ quan
                có thẩm quyền
              </li>
              <li>
                <strong>Bảo vệ quyền lợi:</strong> Để ngăn chặn gian lận hoặc
                bảo vệ quyền lợi của NeoShop
              </li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>5. Quyền của bạn</h2>
            <p>Bạn có các quyền sau đối với thông tin cá nhân của mình:</p>
            <ul>
              <li>
                <strong>Quyền truy cập:</strong> Yêu cầu xem thông tin chúng tôi
                lưu trữ về bạn
              </li>
              <li>
                <strong>Quyền chỉnh sửa:</strong> Cập nhật hoặc sửa đổi thông
                tin không chính xác
              </li>
              <li>
                <strong>Quyền xóa:</strong> Yêu cầu xóa tài khoản và thông tin
                cá nhân
              </li>
              <li>
                <strong>Quyền từ chối:</strong> Hủy đăng ký nhận email marketing
              </li>
            </ul>
            <p>
              Để thực hiện các quyền này, vui lòng liên hệ chúng tôi qua email:
              <a href="mailto:privacy@neoshop.vn"> privacy@neoshop.vn</a>
            </p>
          </section>

          <section className="policy-section">
            <h2>6. Cookies</h2>
            <p>
              NeoShop sử dụng cookies để cải thiện trải nghiệm người dùng. Bạn
              có thể quản lý cài đặt cookies trong trình duyệt của mình. Tuy
              nhiên, việc tắt cookies có thể ảnh hưởng đến một số tính năng của
              website.
            </p>
          </section>

          <section className="policy-section">
            <h2>7. Liên hệ</h2>
            <p>Nếu có câu hỏi về chính sách bảo mật, vui lòng liên hệ:</p>
            <div className="contact-box">
              <p>
                <FiMail /> Email: privacy@neoshop.vn
              </p>
              <p>Địa chỉ: NeoShop LLC, TP. Hồ Chí Minh, Việt Nam</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
