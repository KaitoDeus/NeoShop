import React from "react";
import { Link } from "react-router-dom";
import {
  FiMail,
  FiMessageCircle,
  FiPhone,
  FiMapPin,
  FiClock,
  FiFacebook,
  FiInstagram,
  FiTwitter,
} from "react-icons/fi";
import "./Contact.css";

const Contact = () => {
  return (
    <div className="contact-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Trang chủ</Link> <span>/</span>
          <span style={{ color: "#0f172a", fontWeight: "500" }}>Liên hệ</span>
        </div>

        {/* Header */}
        <div className="contact-header">
          <h1>Liên hệ với chúng tôi</h1>
          <p>Đội ngũ NeoShop luôn sẵn sàng lắng nghe và hỗ trợ bạn 24/7</p>
        </div>

        <div className="contact-layout">
          {/* Contact Info */}
          <div className="contact-info">
            <h3>Thông tin liên hệ</h3>

            <div className="info-list">
              <div className="info-item">
                <div className="info-icon">
                  <FiMessageCircle />
                </div>
                <div className="info-content">
                  <h4>Live Chat</h4>
                  <p>Trò chuyện trực tiếp với CSKH</p>
                  <span className="status online">Đang hoạt động</span>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <FiMail />
                </div>
                <div className="info-content">
                  <h4>Email</h4>
                  <p>support@neoshop.vn</p>
                  <span className="detail">Phản hồi trong 24 giờ</span>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <FiPhone />
                </div>
                <div className="info-content">
                  <h4>Hotline</h4>
                  <p>1900 1234 56</p>
                  <span className="detail">8:00 - 22:00 hàng ngày</span>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <FiClock />
                </div>
                <div className="info-content">
                  <h4>Giờ hỗ trợ</h4>
                  <p>24/7 - Mọi lúc mọi nơi</p>
                  <span className="detail">Kể cả ngày lễ, Tết</span>
                </div>
              </div>
            </div>

            {/* Social */}
            <div className="social-section">
              <h4>Kết nối với chúng tôi</h4>
              <div className="social-links">
                <a
                  href="https://facebook.com/neoshop"
                  target="_blank"
                  rel="noreferrer"
                  className="social-link facebook"
                >
                  <FiFacebook />
                </a>
                <a
                  href="https://instagram.com/neoshop"
                  target="_blank"
                  rel="noreferrer"
                  className="social-link instagram"
                >
                  <FiInstagram />
                </a>
                <a
                  href="https://twitter.com/neoshop"
                  target="_blank"
                  rel="noreferrer"
                  className="social-link twitter"
                >
                  <FiTwitter />
                </a>
              </div>
            </div>
          </div>

          {/* Map Embed */}
          <div
            className="contact-map-wrapper"
            style={{
              width: "100%",
              height: "100%",
              minHeight: "400px",
              borderRadius: "1rem",
              overflow: "hidden",
              boxShadow:
                "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
            }}
          >
            <iframe
              src="https://maps.google.com/maps?q=02%20Võ%20Oanh,%20Phường%2025,%20Bình%20Thạnh,%20Thành%20phố%20Hồ%20Chí%20Minh&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "400px" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Map Vị trí NeoShop"
            ></iframe>
          </div>
        </div>

        {/* FAQ Quick Links */}
        <div className="quick-help">
          <h3>Có thể bạn đang tìm</h3>
          <div className="quick-links">
            <Link to="/help" className="quick-link">
              Câu hỏi thường gặp
            </Link>
            <Link to="/activation-guide" className="quick-link">
              Hướng dẫn kích hoạt
            </Link>
            <Link to="/warranty" className="quick-link">
              Chính sách bảo hành
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
