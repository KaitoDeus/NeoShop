import React from 'react';
import { FiCode, FiLock } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo" style={{ fontSize: '1.25rem' }}>
              <FiCode className="logo-icon" /> NeoShop
            </div>
            <p>
              Nguồn uy tín cho bản quyền phần mềm, game và tài khoản premium.
              Giao hàng tức thì, hỗ trợ 24/7.
            </p>
          </div>
          
          <div className="footer-col">
            <h4>Cửa hàng</h4>
            <ul className="footer-links">
              <li><a href="#">Hệ điều hành</a></li>
              <li><a href="#">Phần mềm văn phòng</a></li>
              <li><a href="#">Games</a></li>
              <li><a href="#">Thẻ quà tặng</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Hỗ trợ</h4>
            <ul className="footer-links">
              <li><a href="#">Trung tâm trợ giúp</a></li>
              <li><a href="#">Hướng dẫn kích hoạt</a></li>
              <li><a href="#">Chính sách bảo hành</a></li>
              <li><a href="#">Liên hệ</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Thanh toán an toàn</h4>
            <div className="payment-badges">
              <span className="badge-pay">VISA</span>
              <span className="badge-pay">MasterCard</span>
              <span className="badge-pay">PayPal</span>
              <span className="badge-pay">Crypto</span>
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontSize: '0.8rem' }}>
              <FiLock /> Thanh toán bảo mật SSL
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2026 NeoShop LLC. Bảo lưu mọi quyền.</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#">Chính sách bảo mật</a>
            <a href="#">Điều khoản dịch vụ</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
