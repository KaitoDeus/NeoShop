import { useState, useEffect } from 'react';
import { 
  FiSettings, FiCreditCard, FiShield, FiGlobe, FiMail, 
  FiDatabase, FiSave, FiRefreshCw, FiUpload, FiLock,
  FiShoppingBag, FiInfo, FiServer, FiAlertCircle
} from 'react-icons/fi';
import './Settings.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fake change detection
  const handleChange = () => setIsDirty(true);

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsDirty(false);
      alert('Đã lưu cấu hình hệ thống thành công!');
    }, 1000);
  };

  // --- TAB CONTENT RENDERERS ---

  const renderGeneral = () => (
    <div className="settings-section animate-fade-in">
      <div className="section-header">
        <h3 className="section-title"><FiInfo /> Thông tin cửa hàng</h3>
      </div>
      <div className="section-body">
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Tên cửa hàng</label>
            <input type="text" className="form-control" defaultValue="NeoShop Digital Store" onChange={handleChange} />
            <p className="helper-text">Tên hiển thị trên hóa đơn và email.</p>
          </div>
          <div className="form-group">
            <label className="form-label">Email liên hệ</label>
            <input type="email" className="form-control" defaultValue="support@neoshop.vn" onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Số điện thoại</label>
            <input type="text" className="form-control" defaultValue="1900 8888" onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Múi giờ (Timezone)</label>
            <select className="form-control" onChange={handleChange}>
              <option value="GMT+7">GMT+07:00 Bangkok, Hanoi, Jakarta</option>
              <option value="GMT+8">GMT+08:00 Singapore</option>
            </select>
          </div>
        </div>
        
        <div className="form-group" style={{ marginTop: '1.5rem' }}>
          <label className="form-label">Logo hệ thống</label>
          <div className="logo-upload-box">
             <div className="upload-placeholder">
               <FiUpload size={32} color="#94a3b8" />
               <span style={{color: '#6366f1', fontWeight: 600}}>Tải logo mới lên</span>
               <span style={{fontSize: '0.8rem', color: '#64748b'}}>Hỗ trợ PNG, JPG (Max 2MB)</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPayment = () => (
    <div className="settings-section animate-fade-in">
      <div className="section-header">
        <h3 className="section-title"><FiCreditCard /> Cấu hình thanh toán</h3>
      </div>
      <div className="section-body">
        {/* Bank Transfer */}
        <div className="setting-row">
          <div className="setting-info">
            <h4>Chuyển khoản ngân hàng (VietQR)</h4>
            <p>Hiển thị mã QR động để khách hàng quét thanh toán.</p>
          </div>
          <label className="switch">
            <input type="checkbox" defaultChecked onChange={handleChange} />
            <span className="slider"></span>
          </label>
        </div>
        <div className="form-grid" style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
          <div className="form-group">
             <label className="form-label">Ngân hàng</label>
             <select className="form-control">
               <option>Vietcombank</option>
               <option>MBBank</option>
               <option>Techcombank</option>
             </select>
          </div>
          <div className="form-group">
             <label className="form-label">Số tài khoản</label>
             <input type="text" className="form-control" defaultValue="99998888" onChange={handleChange} />
          </div>
          <div className="form-group">
             <label className="form-label">Chủ tài khoản</label>
             <input type="text" className="form-control" defaultValue="NGUYEN VAN A" onChange={handleChange} />
          </div>
        </div>

        {/* E-Wallets */}
        <div className="setting-row">
          <div className="setting-info">
            <h4>Ví MoMo</h4>
            <p>Tích hợp cổng thanh toán tự động qua API MoMo.</p>
          </div>
          <label className="switch">
            <input type="checkbox" onChange={handleChange} />
            <span className="slider"></span>
          </label>
        </div>
        
        <div className="setting-row">
          <div className="setting-info">
            <h4>Cổng PayPal / Stripe</h4>
            <p>Dành cho thanh toán quốc tế (Visa/MasterCard).</p>
          </div>
          <label className="switch">
            <input type="checkbox" onChange={handleChange} />
            <span className="slider"></span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderSales = () => (
    <div className="settings-section animate-fade-in">
      <div className="section-header">
        <h3 className="section-title"><FiShoppingBag /> Cấu hình bán hàng</h3>
      </div>
      <div className="section-body">
        <div className="setting-row">
          <div className="setting-info">
            <h4>Tự động giao Key</h4>
            <p>Hệ thống tự động gửi key qua email ngay khi đơn hàng chuyển trạng thái "Thành công".</p>
          </div>
          <label className="switch">
            <input type="checkbox" defaultChecked onChange={handleChange} />
            <span className="slider"></span>
          </label>
        </div>

        <div className="setting-row">
          <div className="setting-info">
            <h4>Ẩn sản phẩm hết hàng</h4>
            <p>Tự động chuyển trạng thái sản phẩm sang "Ẩn" khi kho key bằng 0.</p>
          </div>
          <label className="switch">
            <input type="checkbox" onChange={handleChange} />
            <span className="slider"></span>
          </label>
        </div>

        <div className="form-grid margin-top-lg" style={{ marginTop: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label">Thời gian giữ đơn hàng (phút)</label>
            <input type="number" className="form-control" defaultValue="15" onChange={handleChange} />
            <p className="helper-text">Hủy đơn nếu khách không thanh toán sau khoảng thời gian này.</p>
          </div>
          <div className="form-group">
             <label className="form-label">Ngưỡng cảnh báo kho</label>
             <input type="number" className="form-control" defaultValue="5" onChange={handleChange} />
             <p className="helper-text">Thông báo admin khi số lượng key còn ít hơn ngưỡng.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="settings-section animate-fade-in">
       <div className="section-header">
        <h3 className="section-title"><FiShield /> Bảo mật hệ thống</h3>
      </div>
      <div className="section-body">
         <div className="setting-row">
          <div className="setting-info">
            <h4>Xác thực 2 bước (2FA)</h4>
            <p>Bắt buộc tất cả tài khoản Admin/Staff sử dụng OTP khi đăng nhập.</p>
          </div>
          <label className="switch">
            <input type="checkbox" onChange={handleChange} />
            <span className="slider"></span>
          </label>
        </div>

        <div className="setting-row">
          <div className="setting-info">
            <h4>Chặn đăng nhập từ IP lạ</h4>
            <p>Hệ thống sẽ gửi email cảnh báo khi phát hiện IP mới đăng nhập vào trang quản trị.</p>
          </div>
          <label className="switch">
            <input type="checkbox" defaultChecked onChange={handleChange} />
            <span className="slider"></span>
          </label>
        </div>

        <div className="form-grid" style={{ marginTop: '1.5rem' }}>
           <div className="form-group">
             <label className="form-label">Phiên đăng nhập hết hạn (phút)</label>
             <input type="number" className="form-control" defaultValue="60" onChange={handleChange} />
           </div>
           <div className="form-group">
             <label className="form-label">Số lần nhập sai mật khẩu tối đa</label>
             <input type="number" className="form-control" defaultValue="5" onChange={handleChange} />
           </div>
        </div>

        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
           <h4 style={{ marginBottom: '1rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <FiAlertCircle /> Khu vực nguy hiểm
           </h4>
           <button className="btn btn-secondary" style={{ borderColor: '#ef4444', color: '#ef4444' }}>
             Đổi mật khẩu Admin cấp cao
           </button>
        </div>
      </div>
    </div>
  );

  const renderSEO = () => (
    <div className="settings-section animate-fade-in">
      <div className="section-header">
        <h3 className="section-title"><FiGlobe /> SEO & Metadata</h3>
      </div>
      <div className="section-body">
         <div className="form-group">
            <label className="form-label">Tiêu đề trang chủ (Meta Title)</label>
            <input type="text" className="form-control" defaultValue="NeoShop - Bản quyền phần mềm & Tài khoản số uy tín" onChange={handleChange} />
         </div>
         <div className="form-group">
            <label className="form-label">Mô tả trang chủ (Meta Description)</label>
            <textarea className="form-control form-textarea" defaultValue="Chuyên cung cấp key Windows, Office, Kaspersky, tài khoản Netflix, Spotify chính chủ, bảo hành 1 đổi 1." onChange={handleChange}></textarea>
         </div>
         <div className="form-group">
            <label className="form-label">Từ khóa (Keywords)</label>
            <div className="tags-input-container">
               <span className="tag-badge">phan mem ban quyen <FiXTag /></span>
               <span className="tag-badge">key windows 11 <FiXTag /></span>
               <span className="tag-badge">netflix premium <FiXTag /></span>
               <input type="text" placeholder="Nhập và ấn Enter..." style={{ border: 'none', outline: 'none', flex: 1, fontSize: '0.9rem' }} />
            </div>
         </div>
         <div className="form-grid" style={{ marginTop: '1.5rem' }}>
            <div className="form-group">
               <label className="form-label">Google Analytics ID</label>
               <input type="text" className="form-control" placeholder="G-XXXXXXXXXX" onChange={handleChange} />
            </div>
            <div className="form-group">
               <label className="form-label">Facebook Pixel ID</label>
               <input type="text" className="form-control" placeholder="1234567890" onChange={handleChange} />
            </div>
         </div>
      </div>
    </div>
  );

  // Helper component for tags
  const FiXTag = () => <span style={{ cursor: 'pointer', marginLeft: 4 }}>×</span>;

  // --- MAIN RENDER ---

  const tabs = [
    { id: 'general', label: 'Thông tin chung', icon: <FiInfo /> },
    { id: 'payment', label: 'Thanh toán', icon: <FiCreditCard /> },
    { id: 'sales', label: 'Bán hàng', icon: <FiShoppingBag /> },
    { id: 'security', label: 'Bảo mật', icon: <FiShield /> },
    { id: 'seo', label: 'SEO & Meta', icon: <FiGlobe /> },
    { id: 'email', label: 'Email & Thông báo', icon: <FiMail /> },
    { id: 'system', label: 'Hệ thống & Backup', icon: <FiDatabase /> },
  ];

  return (
    <div className="settings-container">
      {/* Header */}
      <div className="settings-header">
        <h1 className="settings-title">Cài Đặt Hệ Thống</h1>
        <p className="settings-subtitle">Quản lý toàn bộ cấu hình vận hành, bán hàng và bảo mật của NeoShop.</p>
      </div>

      {/* Tabs */}
      <div className="settings-tabs-nav">
        {tabs.map(tab => (
          <div 
            key={tab.id}
            className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon} {tab.label}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="settings-content">
        {activeTab === 'general' && renderGeneral()}
        {activeTab === 'payment' && renderPayment()}
        {activeTab === 'sales' && renderSales()}
        {activeTab === 'security' && renderSecurity()}
        {activeTab === 'seo' && renderSEO()}
        {/* Placeholder for other tabs to save space in code since logic is similar */}
        {['email', 'system'].includes(activeTab) && (
          <div className="settings-section animate-fade-in">
             <div className="section-body" style={{ textAlign: 'center', padding: '3rem' }}>
                <FiServer size={48} color="#e2e8f0" style={{ marginBottom: '1rem' }} />
                <h3>Tính năng đang phát triển</h3>
                <p className="text-secondary">Cấu hình cho {activeTab === 'email' ? 'Email' : 'Sao lưu'} sẽ sớm được cập nhật.</p>
             </div>
          </div>
        )}
      </div>

      {/* Sticky Footer */}
      <div className="sticky-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {isDirty && <span style={{ color: '#eab308', fontSize: '0.9rem', fontWeight: 500 }}><FiAlertCircle style={{ marginBottom: '-2px' }}/> Có thay đổi chưa lưu</span>}
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-secondary">Hủy bỏ</button>
          <button 
            className="btn btn-primary" 
            disabled={!isDirty || isLoading}
            onClick={handleSave}
          >
            {isLoading ? <FiRefreshCw className="spin" /> : <FiSave />} 
            {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
