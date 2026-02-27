import React from "react";
import { Link } from "react-router-dom";
import {
  FiShield,
  FiCheckCircle,
  FiAlertCircle,
  FiRefreshCcw,
  FiClock,
  FiMessageCircle,
  FiFileText,
} from "react-icons/fi";
import "./WarrantyPolicy.css";

const WarrantyPolicy = () => {
  return (
    <div className="warranty-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Trang chủ</Link> <span>/</span>
          <Link to="/help">Hỗ trợ</Link> <span>/</span>
          <span style={{ color: "#0f172a", fontWeight: "500" }}>
            Chính sách bảo hành
          </span>
        </div>

        {/* Header */}
        <div className="policy-header">
          <FiShield className="header-icon" />
          <h1>Chính sách bảo hành</h1>
          <p>Cam kết đồng hành và bảo vệ quyền lợi khách hàng</p>
        </div>

        {/* Highlights */}
        <div className="highlights">
          <div className="highlight-card">
            <FiCheckCircle className="hl-icon green" />
            <h4>Bảo hành trọn đời</h4>
            <p>Với các sản phẩm key vĩnh viễn</p>
          </div>
          <div className="highlight-card">
            <FiRefreshCcw className="hl-icon blue" />
            <h4>Đổi mới 1:1</h4>
            <p>Nếu key bị lỗi do hệ thống</p>
          </div>
          <div className="highlight-card">
            <FiClock className="hl-icon orange" />
            <h4>Hỗ trợ 24/7</h4>
            <p>Phản hồi nhanh chóng</p>
          </div>
          <div className="highlight-card">
            <FiMessageCircle className="hl-icon purple" />
            <h4>Tư vấn miễn phí</h4>
            <p>Hỗ trợ cài đặt và kích hoạt</p>
          </div>
        </div>

        {/* Policy Content */}
        <div className="policy-content">
          <section className="policy-section">
            <h2>
              <FiFileText /> 1. Phạm vi bảo hành
            </h2>
            <p>
              NeoShop cam kết bảo hành cho tất cả các sản phẩm được mua trực
              tiếp từ website chính thức với các điều kiện sau:
            </p>

            <div className="info-box success">
              <h4>
                <FiCheckCircle /> Được bảo hành
              </h4>
              <ul>
                <li>Key không hoạt động do lỗi từ nhà phân phối</li>
                <li>Key đã bị sử dụng trước khi giao (key cũ)</li>
                <li>Key không đúng sản phẩm đã đặt mua</li>
                <li>Key không thể kích hoạt tại khu vực được quảng cáo</li>
                <li>
                  Tài khoản subscription bị khóa trước thời hạn (không do vi
                  phạm chính sách của nền tảng)
                </li>
              </ul>
            </div>

            <div className="info-box error">
              <h4>
                <FiAlertCircle /> Không được bảo hành
              </h4>
              <ul>
                <li>Key đã được kích hoạt thành công bởi khách hàng</li>
                <li>Key bị mất do khách hàng tiết lộ cho người khác</li>
                <li>
                  Tài khoản bị khóa do vi phạm điều khoản dịch vụ của nền tảng
                  (Steam, PSN, Xbox...)
                </li>
                <li>Yêu cầu bảo hành sau 24 giờ kể từ khi phát hiện lỗi</li>
                <li>Không cung cấp được bằng chứng mua hàng từ NeoShop</li>
              </ul>
            </div>
          </section>

          <section className="policy-section">
            <h2>
              <FiClock /> 2. Thời gian bảo hành
            </h2>
            <table className="warranty-table">
              <thead>
                <tr>
                  <th>Loại sản phẩm</th>
                  <th>Thời gian bảo hành</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Key game / phần mềm vĩnh viễn</td>
                  <td>
                    <strong>Trọn đời</strong> (miễn là sản phẩm còn hoạt động)
                  </td>
                </tr>
                <tr>
                  <td>Tài khoản subscription (Netflix, Spotify...)</td>
                  <td>
                    <strong>Toàn bộ thời hạn</strong> đã đăng ký
                  </td>
                </tr>
                <tr>
                  <td>Gift card / Thẻ nạp</td>
                  <td>
                    <strong>24 giờ</strong> kể từ khi giao
                  </td>
                </tr>
                <tr>
                  <td>Các sản phẩm khác</td>
                  <td>
                    <strong>7 ngày</strong> kể từ khi giao
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="policy-section">
            <h2>
              <FiRefreshCcw /> 3. Quy trình yêu cầu bảo hành
            </h2>
            <div className="steps-list">
              <div className="step">
                <div className="step-num">1</div>
                <div className="step-content">
                  <h4>Liên hệ bộ phận CSKH</h4>
                  <p>
                    Qua Live Chat trên website hoặc email support@neoshop.vn
                  </p>
                </div>
              </div>
              <div className="step">
                <div className="step-num">2</div>
                <div className="step-content">
                  <h4>Cung cấp thông tin</h4>
                  <p>
                    Mã đơn hàng, email đặt hàng, mô tả vấn đề và ảnh chụp màn
                    hình lỗi (nếu có)
                  </p>
                </div>
              </div>
              <div className="step">
                <div className="step-num">3</div>
                <div className="step-content">
                  <h4>Xác minh</h4>
                  <p>
                    NeoShop sẽ kiểm tra và xác minh trong vòng 12-24 giờ làm
                    việc
                  </p>
                </div>
              </div>
              <div className="step">
                <div className="step-num">4</div>
                <div className="step-content">
                  <h4>Giải quyết</h4>
                  <p>
                    Đổi key mới hoặc hoàn tiền 100% tùy theo yêu cầu của khách
                    hàng
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="policy-section">
            <h2>
              <FiShield /> 4. Cam kết của NeoShop
            </h2>
            <ul className="commitment-list">
              <li>
                <FiCheckCircle /> Luôn ưu tiên quyền lợi của khách hàng
              </li>
              <li>
                <FiCheckCircle /> Xử lý khiếu nại nhanh chóng, minh bạch
              </li>
              <li>
                <FiCheckCircle /> Hoàn tiền 100% nếu lỗi thuộc về NeoShop
              </li>
              <li>
                <FiCheckCircle /> Hỗ trợ kỹ thuật miễn phí trong suốt quá trình
                sử dụng
              </li>
              <li>
                <FiCheckCircle /> Bảo mật thông tin khách hàng tuyệt đối
              </li>
            </ul>
          </section>
        </div>

        {/* CTA */}
        <div className="cta-section">
          <p>Cần hỗ trợ về bảo hành?</p>
          <Link to="/contact" className="btn-primary">
            <FiMessageCircle /> Liên hệ ngay
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WarrantyPolicy;
