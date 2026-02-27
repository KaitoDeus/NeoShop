import React from "react";
import { Link } from "react-router-dom";
import {
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiYoutube,
  FiSend,
} from "react-icons/fi";
import Logo from "../Logo/Logo";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Section */}
          <div className="footer-brand">
            <Logo />
            <p className="footer-description">
              Nền tảng cung cấp giải pháp bản quyền phần mềm, game và tài khoản
              Premium hàng đầu Việt Nam. Trải nghiệm dịch vụ nhanh chóng, an
              toàn và chuyên nghiệp.
            </p>
            <div className="footer-social">
              <a
                href="https://facebook.com/neoshop"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
              >
                <FiFacebook />
              </a>
              <a
                href="https://instagram.com/neoshop"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <FiInstagram />
              </a>
              <a
                href="https://twitter.com/neoshop"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
              >
                <FiTwitter />
              </a>
              <a
                href="https://youtube.com/neoshop"
                target="_blank"
                rel="noreferrer"
                aria-label="Youtube"
              >
                <FiYoutube />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>Cửa hàng</h4>
            <ul className="footer-links">
              <li>
                <Link to="/category?category=os">Hệ điều hành</Link>
              </li>
              <li>
                <Link to="/category?category=office">Phần mềm văn phòng</Link>
              </li>
              <li>
                <Link to="/category?category=games">Trò chơi bản quyền</Link>
              </li>
              <li>
                <Link to="/category?category=ai">Công cụ AI</Link>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div className="footer-col">
            <h4>Hỗ trợ & Pháp lý</h4>
            <ul className="footer-links">
              <li>
                <Link to="/help">Trung tâm trợ giúp</Link>
              </li>
              <li>
                <Link to="/activation-guide">Hướng dẫn kích hoạt</Link>
              </li>
              <li>
                <Link to="/warranty">Chính sách bảo hành</Link>
              </li>
              <li>
                <Link to="/privacy">Chính sách bảo mật</Link>
              </li>
              <li>
                <Link to="/terms">Điều khoản dịch vụ</Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="footer-col newsletter-col">
            <h4>Bản tin NeoShop</h4>
            <p className="newsletter-text">
              Đăng ký để nhận thông báo về các ưu đãi mới nhất và cập nhật công
              nghệ.
            </p>
            <form
              className="newsletter-form"
              onSubmit={(e) => e.preventDefault()}
            >
              <input type="email" placeholder="Email của bạn" required />
              <button type="submit" aria-label="Subscribe">
                <FiSend />
              </button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">
            &copy; {new Date().getFullYear()} NeoShop. All rights reserved.
          </p>
          <div className="footer-bottom-links">
            <p>Hệ thống phân phối bản quyền số uy tín</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
