import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiMail, FiMessageCircle, FiPhone, FiMapPin, FiClock,
  FiSend, FiFacebook, FiInstagram, FiTwitter, FiCheckCircle
} from 'react-icons/fi';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    orderCode: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Trong ứng dụng thực tế, gửi đến backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    
    // Reset sau 3 giây
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        orderCode: '',
        message: ''
      });
    }, 3000);
  };

  return (
    <div className="contact-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Trang chủ</Link> <span>/</span>
          <span style={{ color: '#0f172a', fontWeight: '500' }}>Liên hệ</span>
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
                <a href="#" className="social-link facebook">
                  <FiFacebook />
                </a>
                <a href="#" className="social-link instagram">
                  <FiInstagram />
                </a>
                <a href="#" className="social-link twitter">
                  <FiTwitter />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-wrapper">
            <h3>Gửi tin nhắn</h3>
            <p>Điền thông tin bên dưới, chúng tôi sẽ phản hồi sớm nhất có thể</p>

            {submitted ? (
              <div className="success-message">
                <FiCheckCircle className="success-icon" />
                <h4>Gửi thành công!</h4>
                <p>Chúng tôi sẽ phản hồi bạn trong thời gian sớm nhất.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Họ và tên *</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Nhập họ tên của bạn"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="email@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="subject">Chủ đề *</label>
                    <select 
                      id="subject" 
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Chọn chủ đề --</option>
                      <option value="order">Hỏi về đơn hàng</option>
                      <option value="activation">Hỗ trợ kích hoạt</option>
                      <option value="refund">Yêu cầu hoàn tiền</option>
                      <option value="warranty">Bảo hành sản phẩm</option>
                      <option value="partnership">Hợp tác kinh doanh</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="orderCode">Mã đơn hàng (nếu có)</label>
                    <input 
                      type="text" 
                      id="orderCode" 
                      name="orderCode"
                      value={formData.orderCode}
                      onChange={handleChange}
                      placeholder="VD: NEO-123456"
                    />
                  </div>
                </div>

                <div className="form-group full">
                  <label htmlFor="message">Nội dung tin nhắn *</label>
                  <textarea 
                    id="message" 
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Mô tả chi tiết vấn đề bạn gặp phải..."
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn-submit">
                  <FiSend /> Gửi tin nhắn
                </button>
              </form>
            )}
          </div>
        </div>

        {/* FAQ Quick Links */}
        <div className="quick-help">
          <h3>Có thể bạn đang tìm</h3>
          <div className="quick-links">
            <Link to="/tro-giup" className="quick-link">
              Câu hỏi thường gặp
            </Link>
            <Link to="/huong-dan-kich-hoat" className="quick-link">
              Hướng dẫn kích hoạt
            </Link>
            <Link to="/chinh-sach-bao-hanh" className="quick-link">
              Chính sách bảo hành
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
