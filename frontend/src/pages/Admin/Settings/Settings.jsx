import { useState, useEffect } from 'react';
import { 
  FiSettings, FiCreditCard, FiShield, FiGlobe, FiMail, 
  FiDatabase, FiSave, FiRefreshCw, FiUpload, FiLock,
  FiShoppingBag, FiInfo, FiServer, FiAlertCircle, FiX
} from 'react-icons/fi';
import settingsService from '../../../services/settingsService';
import './Settings.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({});
  const [originalSettings, setOriginalSettings] = useState({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const data = await settingsService.getSettings();
      setSettings(data);
      setOriginalSettings(data);
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? (checked ? 'true' : 'false') : value;
    
    setSettings(prev => ({
      ...prev,
      [name]: val
    }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await settingsService.updateSettings(settings);
      setOriginalSettings(settings);
      setIsDirty(false);
      alert('Đã lưu cấu hình hệ thống thành công!');
    } catch (error) {
      console.error("Failed to save settings:", error);
      alert('Có lỗi xảy ra khi lưu cấu hình.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setSettings(originalSettings);
    setIsDirty(false);
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
            <input 
              name="shopName"
              type="text" 
              className="form-control" 
              value={settings.shopName || 'NeoShop Digital Store'} 
              onChange={handleChange} 
            />
            <p className="helper-text">Tên hiển thị trên hóa đơn và email.</p>
          </div>
          <div className="form-group">
            <label className="form-label">Email liên hệ</label>
            <input 
              name="contactEmail"
              type="email" 
              className="form-control" 
              value={settings.contactEmail || 'support@neoshop.vn'} 
              onChange={handleChange} 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Số điện thoại</label>
            <input 
              name="contactPhone"
              type="text" 
              className="form-control" 
              value={settings.contactPhone || '1900 8888'} 
              onChange={handleChange} 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Múi giờ (Timezone)</label>
            <select 
              name="timezone"
              className="form-control" 
              value={settings.timezone || 'GMT+7'} 
              onChange={handleChange}
            >
              <option value="GMT+7">GMT+07:00 Bangkok, Hanoi, Jakarta</option>
              <option value="GMT+8">GMT+08:00 Singapore</option>
            </select>
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
            <input 
              name="bankEnabled"
              type="checkbox" 
              checked={settings.bankEnabled === 'true'} 
              onChange={handleChange} 
            />
            <span className="slider"></span>
          </label>
        </div>
        <div className="form-grid" style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
          <div className="form-group">
             <label className="form-label">Ngân hàng</label>
             <select 
               name="bankName"
               className="form-control"
               value={settings.bankName || 'Vietcombank'}
               onChange={handleChange}
             >
               <option>Vietcombank</option>
               <option>MBBank</option>
               <option>Techcombank</option>
             </select>
          </div>
          <div className="form-group">
             <label className="form-label">Số tài khoản</label>
             <input 
               name="bankAccountNumber"
               type="text" 
               className="form-control" 
               value={settings.bankAccountNumber || ''} 
               onChange={handleChange} 
             />
          </div>
          <div className="form-group">
             <label className="form-label">Chủ tài khoản</label>
             <input 
               name="bankAccountName"
               type="text" 
               className="form-control" 
               value={settings.bankAccountName || ''} 
               onChange={handleChange} 
             />
          </div>
        </div>

        {/* E-Wallets */}
        <div className="setting-row">
          <div className="setting-info">
            <h4>Ví MoMo</h4>
            <p>Tích hợp cổng thanh toán tự động qua API MoMo.</p>
          </div>
          <label className="switch">
            <input 
              name="momoEnabled"
              type="checkbox" 
              checked={settings.momoEnabled === 'true'} 
              onChange={handleChange} 
            />
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
            <input 
              name="autoDeliverKey"
              type="checkbox" 
              checked={settings.autoDeliverKey === 'true'} 
              onChange={handleChange} 
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="setting-row">
          <div className="setting-info">
            <h4>Ẩn sản phẩm hết hàng</h4>
            <p>Tự động chuyển trạng thái sản phẩm sang "Ẩn" khi kho key bằng 0.</p>
          </div>
          <label className="switch">
            <input 
              name="hideOutOfStock"
              type="checkbox" 
              checked={settings.hideOutOfStock === 'true'} 
              onChange={handleChange} 
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="form-grid margin-top-lg" style={{ marginTop: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label">Thời gian giữ đơn hàng (phút)</label>
            <input 
              name="holdOrderMinutes"
              type="number" 
              className="form-control" 
              value={settings.holdOrderMinutes || '15'} 
              onChange={handleChange} 
            />
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'general', label: 'Thông tin chung', icon: <FiInfo /> },
    { id: 'payment', label: 'Thanh toán', icon: <FiCreditCard /> },
    { id: 'sales', label: 'Bán hàng', icon: <FiShoppingBag /> },
    { id: 'security', label: 'Bảo mật', icon: <FiShield /> },
    { id: 'seo', label: 'SEO & Meta', icon: <FiGlobe /> },
  ];

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1 className="settings-title">Cài Đặt Hệ Thống</h1>
        <p className="settings-subtitle">Quản lý toàn bộ cấu hình vận hành, bán hàng và bảo mật của NeoShop.</p>
      </div>

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

      <div className="settings-content">
        {activeTab === 'general' && renderGeneral()}
        {activeTab === 'payment' && renderPayment()}
        {activeTab === 'sales' && renderSales()}
        {['security', 'seo'].includes(activeTab) && (
           <div className="settings-section animate-fade-in">
             <div className="section-body" style={{ textAlign: 'center', padding: '3rem' }}>
                <FiServer size={48} color="#e2e8f0" style={{ marginBottom: '1rem' }} />
                <h3>Tính năng đang phát triển</h3>
                <p className="text-secondary">Cấu hình nâng cao cho {activeTab.toUpperCase()} sẽ sớm được cập nhật.</p>
             </div>
          </div>
        )}
      </div>

      <div className="sticky-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {isDirty && <span style={{ color: '#eab308', fontSize: '0.9rem', fontWeight: 500 }}><FiAlertCircle style={{ marginBottom: '-2px' }}/> Có thay đổi chưa lưu</span>}
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-secondary" onClick={handleCancel}>Hủy bỏ</button>
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
