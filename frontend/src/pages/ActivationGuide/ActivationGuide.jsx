import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiKey, FiChevronRight, FiMonitor, FiDownload, FiCopy,
  FiCheckCircle, FiAlertCircle, FiHelpCircle
} from 'react-icons/fi';
import './ActivationGuide.css';

const PLATFORMS = [
  {
    id: 'steam',
    name: 'Steam',
    color: '#1b2838',
    steps: [
      'Mở ứng dụng Steam trên máy tính của bạn',
      'Đăng nhập vào tài khoản Steam của bạn',
      'Trên thanh menu, chọn "Games" (Trò chơi)',
      'Chọn "Activate a Product on Steam..." (Kích hoạt sản phẩm trên Steam)',
      'Đọc và chấp nhận Steam Subscriber Agreement',
      'Dán key đã mua vào ô "Product Code" và nhấn "Next"',
      'Game sẽ được thêm vào thư viện của bạn'
    ]
  },
  {
    id: 'xbox',
    name: 'Xbox / Microsoft Store',
    color: '#107c10',
    steps: [
      'Truy cập website redeem.microsoft.com',
      'Đăng nhập bằng tài khoản Microsoft của bạn',
      'Nhập key 25 ký tự vào ô "Nhập mã 25 ký tự"',
      'Nhấn "TIẾP THEO" để xác nhận',
      'Sản phẩm sẽ được thêm vào tài khoản của bạn'
    ]
  },
  {
    id: 'psn',
    name: 'PlayStation Network',
    color: '#003087',
    steps: [
      'Đăng nhập vào PlayStation Store trên console hoặc web',
      'Chọn biểu tượng tài khoản của bạn ở góc trên bên phải',
      'Chọn "Đổi mã" (Redeem Codes)',
      'Nhập mã 12 ký tự đã nhận được',
      'Nhấn "Đổi" để hoàn tất'
    ]
  },
  {
    id: 'epic',
    name: 'Epic Games',
    color: '#2f2d2e',
    steps: [
      'Mở Epic Games Launcher trên máy tính',
      'Nhấn vào tên tài khoản của bạn ở góc dưới bên trái',
      'Chọn "Redeem Code" (Đổi mã)',
      'Nhập key vào ô và nhấn "REDEEM"',
      'Game sẽ xuất hiện trong thư viện của bạn'
    ]
  },
  {
    id: 'adobe',
    name: 'Adobe Creative Cloud',
    color: '#ff0000',
    steps: [
      'Truy cập redeem.adobe.com',
      'Đăng nhập vào Adobe ID của bạn (hoặc tạo tài khoản mới)',
      'Nhập mã đổi thưởng (redemption code) đã nhận',
      'Nhấn "Submit" để xác nhận',
      'Tải và cài đặt ứng dụng Adobe CC trên máy tính',
      'Đăng nhập để sử dụng các ứng dụng đã kích hoạt'
    ]
  },
  {
    id: 'windows',
    name: 'Windows / Office',
    color: '#0078d4',
    steps: [
      'Nhấn Windows + I để mở Settings (Cài đặt)',
      'Chọn "Update & Security" > "Activation"',
      'Nhấn "Change product key" (Thay đổi key sản phẩm)',
      'Nhập key 25 ký tự và nhấn "Next"',
      'Chờ Windows xác minh và kích hoạt key',
      'Khởi động lại máy tính nếu được yêu cầu'
    ]
  }
];

const ActivationGuide = () => {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Đã sao chép!');
  };

  return (
    <div className="activation-guide-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Trang chủ</Link> <span>/</span>
          <Link to="/tro-giup">Hỗ trợ</Link> <span>/</span>
          <span style={{ color: '#0f172a', fontWeight: '500' }}>Hướng dẫn kích hoạt</span>
        </div>

        {/* Header */}
        <div className="guide-header">
          <div className="header-content">
            <h1><FiKey /> Hướng dẫn kích hoạt sản phẩm</h1>
            <p>
              Làm theo các bước dưới đây để kích hoạt key sản phẩm số của bạn. 
              Nếu gặp khó khăn, đội ngũ hỗ trợ 24/7 luôn sẵn sàng giúp đỡ.
            </p>
          </div>
        </div>

        {/* Important Notes */}
        <div className="notes-box">
          <h3><FiAlertCircle /> Lưu ý quan trọng</h3>
          <ul>
            <li>Mỗi key chỉ có thể kích hoạt <strong>một lần duy nhất</strong>.</li>
            <li>Đảm bảo bạn đã đăng nhập đúng tài khoản muốn kích hoạt.</li>
            <li>Không chia sẻ key với người khác để tránh mất quyền sử dụng.</li>
            <li>Liên hệ CSKH ngay nếu key không hoạt động trong vòng 24 giờ.</li>
          </ul>
        </div>

        {/* Platform Guides */}
        <div className="platforms-section">
          <h2><FiMonitor /> Chọn nền tảng của bạn</h2>
          
          <div className="platforms-grid">
            {PLATFORMS.map((platform) => (
              <div key={platform.id} className="platform-card">
                <div 
                  className="platform-header" 
                  style={{ background: platform.color }}
                >
                  <h3>{platform.name}</h3>
                </div>
                <div className="platform-steps">
                  {platform.steps.map((step, idx) => (
                    <div key={idx} className="step-item">
                      <div className="step-number">{idx + 1}</div>
                      <p>{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Troubleshooting */}
        <div className="troubleshoot-section">
          <h2><FiHelpCircle /> Gặp vấn đề khi kích hoạt?</h2>
          
          <div className="troubleshoot-grid">
            <div className="trouble-card">
              <FiAlertCircle className="trouble-icon error" />
              <h4>Key không hợp lệ</h4>
              <p>Kiểm tra lại key, đảm bảo không có khoảng trắng thừa. Thử sao chép lại từ email gốc.</p>
            </div>
            <div className="trouble-card">
              <FiAlertCircle className="trouble-icon warning" />
              <h4>Key đã được sử dụng</h4>
              <p>Liên hệ CSKH ngay với ảnh chụp màn hình lỗi và mã đơn hàng để được hỗ trợ.</p>
            </div>
            <div className="trouble-card">
              <FiAlertCircle className="trouble-icon info" />
              <h4>Không nhận được key</h4>
              <p>Kiểm tra thư mục Spam. Nếu không có, liên hệ CSKH với email đã dùng để đặt hàng.</p>
            </div>
          </div>

          <div className="cta-box">
            <p>Vẫn cần trợ giúp?</p>
            <Link to="/lien-he" className="btn-primary">
              Liên hệ hỗ trợ 24/7
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivationGuide;
