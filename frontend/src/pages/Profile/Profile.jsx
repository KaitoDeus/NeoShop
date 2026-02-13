import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiUser, 
  FiPackage, 
  FiLogOut, 
  FiSettings, 
  FiMapPin, 
  FiPhone, 
  FiMail, 
  FiCalendar,
  FiChevronRight,
  FiLock,
  FiCamera
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import orderService from '../../services/orderService';
import userService from '../../services/userService';
import './Profile.css';

const Profile = () => {
  const { user, logout, updateUser, getAvatar } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  
  // Settings Form State
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || user?.name || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    address: user?.address || '',
    avatar: user?.avatar || ''
  });

  const [message, setMessage] = useState({ type: '', text: '' });
  const [uploading, setUploading] = useState(false);
  
  // Password Change State
  const [passwordData, setPasswordData] = useState({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
  });

  // Sync profile data when user context updates
  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName || user.name || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        address: user.address || '',
        avatar: user.avatar || ''
      });
    }
  }, [user]);


  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [user, activeTab, navigate]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const data = await orderService.getMyOrders(0, 20);
      setOrders(data.content || []);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    
    try {
        // Don't save the UI-avatars fallback URL to the backend
        let avatarToSave = profileData.avatar;
        if (avatarToSave && avatarToSave.includes('ui-avatars.com')) {
          avatarToSave = null;
        }

        const updatedUser = await userService.updateProfile({
            fullName: profileData.fullName,
            phoneNumber: profileData.phoneNumber,
            address: profileData.address,
            avatar: avatarToSave
        });
        
        updateUser(updatedUser);
        setMessage({ type: 'success', text: 'Cập nhật thông tin thành công!' });
    } catch (error) {
        console.error("Update failed", error);
        setMessage({ type: 'error', text: 'Cập nhật thất bại. Vui lòng thử lại.' });
    }
  };

  const handlePasswordChange = async (e) => {
      e.preventDefault();
      setMessage({ type: '', text: '' });

      if (passwordData.newPassword !== passwordData.confirmPassword) {
          setMessage({ type: 'error', text: 'Mật khẩu xác nhận không khớp!' });
          return;
      }

      if (passwordData.newPassword.length < 6) {
          setMessage({ type: 'error', text: 'Mật khẩu mới phải có ít nhất 6 ký tự.' });
          return;
      }

      try {
          await userService.changePassword({
              oldPassword: passwordData.oldPassword,
              newPassword: passwordData.newPassword
          });
          setMessage({ type: 'success', text: 'Đổi mật khẩu thành công!' });
          setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      } catch (error) {
          console.error("Change password failed", error);
          setMessage({ type: 'error', text: 'Đổi mật khẩu thất bại. Kiểm tra lại mật khẩu cũ.' });
      }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordInput = (e) => {
      const { name, value } = e.target;
      setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Kích thước ảnh không được vượt quá 2MB' });
      return;
    }

    setUploading(true);
    try {
      const imageUrl = await userService.uploadAvatar(file);
      setProfileData(prev => ({ ...prev, avatar: imageUrl }));
      setMessage({ type: 'success', text: 'Tải ảnh lên thành công! Nhấn Lưu để cập nhật hồ sơ.' });
    } catch (error) {
      console.error("Upload failed", error);
      setMessage({ type: 'error', text: 'Tải ảnh lên thất bại. Vui lòng thử lại.' });
    } finally {
      setUploading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="profile-page">
      <div className="profile-container">
        
        {/* Sidebar */}
        <aside className="profile-sidebar">
          <div className="user-brief">
            <div className="user-avatar-large">
              {user.avatar ? (
                <img src={getAvatar(user.avatar)} alt="avatar" />
              ) : (
                <FiUser />
              )}
            </div>
            <h3>{user.fullName || user.username}</h3>
            <p>{user.email}</p>
          </div>
          
          <nav className="profile-nav">
            <button 
              className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <FiPackage /> Đơn hàng của tôi
            </button>
            <button 
              className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <FiSettings /> Thiết lập tài khoản
            </button>
            <button 
              className={`nav-item ${activeTab === 'password' ? 'active' : ''}`}
              onClick={() => setActiveTab('password')}
            >
              <FiLock /> Đổi mật khẩu
            </button>
            <button className="nav-item logout" onClick={handleLogout}>
              <FiLogOut /> Đăng xuất
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="profile-content">
          
          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="tab-content fade-in">
              <div className="tab-header">
                <h2>Lịch sử đơn hàng</h2>
                <p>Theo dõi trạng thái và lịch sử mua sắm của bạn.</p>
              </div>

              {loadingOrders ? (
                <div className="loading-state">
                    <div className="spinner"></div> Đang tải đơn hàng...
                </div>
              ) : orders.length === 0 ? (
                <div className="empty-state">
                  <FiPackage size={64} />
                  <h3>Bạn chưa có đơn hàng nào</h3>
                  <p>Hãy khám phá các sản phẩm tuyệt vời của chúng tôi và đặt hàng ngay hôm nay!</p>
                  <button onClick={() => navigate('/')} className="shop-now-btn">Mua sắm ngay</button>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map(order => (
                    <div key={order.id} className="order-card">
                      <div className="order-header">
                        <div className="order-id">
                            <span className="id-label">Mã đơn hàng</span>
                            <span className="id-value">#{order.id.substring(0, 8)}</span>
                        </div>
                        <span className={`order-status ${order.status?.toLowerCase()}`}>
                            {order.status}
                        </span>
                      </div>
                      
                      <div className="order-body">
                         <div className="order-meta">
                            <div className="meta-item">
                                <FiCalendar /> {new Date(order.orderDate).toLocaleDateString('vi-VN')}
                            </div>
                            <div className="meta-item">
                                {order.items ? order.items.length : 0} món
                            </div>
                         </div>
                         
                         <div className="order-items-preview">
                            {order.items && order.items.slice(0, 3).map((item, idx) => (
                                <div key={idx} className="item-preview-row">
                                    <span>{item.productTitle}</span>
                                    <span>x{item.quantity}</span>
                                </div>
                            ))}
                            {order.items && order.items.length > 3 && (
                                <div className="more-items">...và {order.items.length - 3} sản phẩm khác</div>
                            )}
                         </div>
                      </div>

                      <div className="order-footer">
                        <span className="total-price">
                            {order.totalAmount?.toLocaleString('vi-VN')} ₫
                        </span>
                        <button 
                            className="view-detail-btn" 
                            onClick={() => navigate(`/order-success/${order.id}`)}
                        >
                            Xem chi tiết <FiChevronRight />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="tab-content fade-in">
              <div className="tab-header">
                <h2>Thiết lập tài khoản</h2>
                <p>Quản lý thông tin cá nhân và bảo mật.</p>
              </div>
              
              {message.text && activeTab === 'settings' && (
                  <div className={`alert-message ${message.type}`}>
                      {message.text}
                  </div>
              )}

              <div className="settings-container">
                <form onSubmit={handleUpdateProfile}>
                    <div className="form-group avatar-section">
                        <label>Ảnh đại diện</label>
                        <div className="avatar-input-wrapper">
                             <div className="current-avatar" onClick={() => document.getElementById('avatar-upload').click()}>
                                {profileData.avatar ? <img src={getAvatar(profileData.avatar)} alt="Preview" /> : <FiUser />}
                                <div className="avatar-edit-overlay">
                                    <FiCamera />
                                </div>
                             </div>
                             <div className="avatar-controls">
                                 <input 
                                    id="avatar-upload"
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={handleAvatarUpload}
                                 />
                                 <button 
                                    type="button" 
                                    className="upload-btn"
                                    onClick={() => document.getElementById('avatar-upload').click()}
                                    disabled={uploading}
                                 >
                                    {uploading ? 'Đang tải...' : 'Thay đổi ảnh'}
                                 </button>
                                 <p className="upload-hint">Hỗ trợ JPG, PNG. Tối đa 2MB.</p>
                             </div>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Họ và tên</label>
                            <input 
                                type="text" 
                                name="fullName"
                                className="form-input" 
                                value={profileData.fullName}
                                onChange={handleInputChange}
                                placeholder="Nhập họ tên của bạn"
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input 
                                type="email" 
                                name="email"
                                className="form-input" 
                                value={profileData.email}
                                disabled
                                style={{ opacity: 0.7, cursor: 'not-allowed' }}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Số điện thoại</label>
                            <input 
                                type="tel" 
                                name="phoneNumber"
                                className="form-input" 
                                value={profileData.phoneNumber}
                                onChange={handleInputChange}
                                placeholder="Thêm số điện thoại"
                            />
                        </div>
                        <div className="form-group">
                            <label>Địa chỉ</label>
                            <input 
                                type="text" 
                                name="address"
                                className="form-input" 
                                value={profileData.address}
                                onChange={handleInputChange}
                                placeholder="Thêm địa chỉ giao hàng mặc định"
                            />
                        </div>
                    </div>
                    
                    <button type="submit" className="save-btn">Lưu thay đổi</button>
                </form>
              </div>
            </div>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
              <div className="tab-content fade-in">
                  <div className="tab-header">
                      <h2>Đổi mật khẩu</h2>
                      <p>Bảo vệ tài khoản của bạn bằng mật khẩu mạnh.</p>
                  </div>

                  {message.text && activeTab === 'password' && (
                      <div className={`alert-message ${message.type}`}>
                          {message.text}
                      </div>
                  )}

                  <div className="settings-container">
                      <form onSubmit={handlePasswordChange}>
                          <div className="form-group">
                              <label>Mật khẩu hiện tại</label>
                              <input 
                                  type="password"
                                  name="oldPassword"
                                  className="form-input"
                                  value={passwordData.oldPassword}
                                  onChange={handlePasswordInput}
                                  required
                              />
                          </div>
                          <div className="form-group">
                              <label>Mật khẩu mới</label>
                              <input 
                                  type="password"
                                  name="newPassword"
                                  className="form-input"
                                  value={passwordData.newPassword}
                                  onChange={handlePasswordInput}
                                  required
                                  minLength={6}
                              />
                          </div>
                          <div className="form-group">
                              <label>Xác nhận mật khẩu mới</label>
                              <input 
                                  type="password"
                                  name="confirmPassword"
                                  className="form-input"
                                  value={passwordData.confirmPassword}
                                  onChange={handlePasswordInput}
                                  required
                                  minLength={6}
                              />
                          </div>
                          <button type="submit" className="save-btn">Đổi mật khẩu</button>
                      </form>
                  </div>
              </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default Profile;
