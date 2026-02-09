import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiCheck, FiCopy, FiDownload, FiExternalLink, 
  FiHome, FiShoppingBag, FiInfo, FiMail, FiPrinter 
} from 'react-icons/fi';
import './Delivery.css';

const Delivery = () => {
  const mockCode = "W269N-WFGWX-YVC9B-4J6C9-T83GX";
  const productName = "Windows 11 Pro Retail Key";

  const handleCopy = () => {
    navigator.clipboard.writeText(mockCode);
    alert("Đã sao chép mã sản phẩm!");
  };

  return (
    <div className="delivery-page">
      <div className="delivery-container">
        {/* Success Card */}
        <div className="delivery-success-card">
          <div className="success-icon-wrapper">
            <FiCheck />
          </div>
          
          <h1 className="delivery-title">Thanh toán thành công!</h1>
          <p className="delivery-subtitle">
            Cảm ơn bạn đã tin tưởng NeoShop. Sản phẩm của bạn đã sẵn sàng.
          </p>

          <div className="product-key-section">
            <span className="product-label-mini">MÃ SẢN PHẨM CỦA BẠN ({productName})</span>
            <div className="key-display-wrapper">
              <span className="product-code">{mockCode}</span>
              <button className="btn-copy-big" onClick={handleCopy}>
                <FiCopy /> Sao chép mã
              </button>
            </div>
          </div>

          <div className="activation-guide">
            <h3 className="guide-title"><FiInfo /> Hướng dẫn kích hoạt</h3>
            <div className="steps-list">
              <div className="step-item">
                <div className="step-number">1</div>
                <div className="step-text">
                  Mở <strong>Settings</strong> (Cài đặt) trên máy tính của bạn.
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">2</div>
                <div className="step-text">
                  Chọn <strong>System</strong> &gt; <strong>Activation</strong> &gt; <strong>Change product key</strong>.
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">3</div>
                <div className="step-text">
                  Nhập mã phía trên và nhấn <strong>Activate</strong> để hoàn tất.
                </div>
              </div>
            </div>
          </div>

          <div className="delivery-actions">
            <Link to="/" className="btn-secondary">
              <FiHome /> Về Trang Chủ
            </Link>
            <Link to="/category" className="btn-primary-glow">
              <FiShoppingBag /> Tiếp tục mua sắm
            </Link>
          </div>
        </div>

        {/* Footer Info */}
        <div className="order-footer-info">
          <div className="footer-item">
             <FiMail /> Đã gửi bản sao vào email của bạn
          </div>
          <div className="footer-item" style={{cursor: 'pointer'}} onClick={() => window.print()}>
             <FiPrinter /> In hóa đơn
          </div>
          <div className="footer-item">
             Mã đơn hàng: #NEO-99821
          </div>
        </div>
      </div>
    </div>
  );
};

export default Delivery;
