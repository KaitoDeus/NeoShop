import { useState } from 'react';
import { 
  FiSearch, FiFilter, FiMoreHorizontal, FiUser, FiLock, FiUnlock, 
  FiMail, FiPhone, FiCalendar, FiShoppingBag, FiCreditCard, FiX,
  FiRefreshCw
} from 'react-icons/fi';
import StatsCard from '../../../components/admin/Dashboard/StatsCard';
import './Users.css';

// Mock Data
const userStats = [
  { id: 1, title: "Tổng khách hàng", value: "1,250", percent: 12, isIncrease: true, compareText: "so với tháng trước", iconType: "user" },
  { id: 2, title: "Khách mới (Tháng)", value: "340", percent: 5, isIncrease: true, compareText: "so với tháng trước", iconType: "user-add" },
  { id: 3, title: "Đang hoạt động", value: "1,180", percent: 2, isIncrease: true, compareText: "người dùng", iconType: "check" },
  { id: 4, title: "Bị khóa", value: "70", percent: -1, isIncrease: false, compareText: "tài khoản", iconType: "alert" }
];

const usersData = [
  { id: "#U1024", name: "Nguyễn Văn A", email: "nguyenvana@gmail.com", phone: "0912 345 678", joined: "20/10/2023", orders: 12, spent: "4.500.000 đ", status: "active", avatar: "https://i.pravatar.cc/150?u=1" },
  { id: "#U1023", name: "Trần Minh", email: "tranminh@gmail.com", phone: "0987 654 321", joined: "18/10/2023", orders: 3, spent: "850.000 đ", status: "locked", avatar: "https://i.pravatar.cc/150?u=2" },
  { id: "#U1022", name: "Lê Thị Hồng", email: "hongle@outlook.com", phone: "0909 123 456", joined: "15/10/2023", orders: 25, spent: "12.200.000 đ", status: "active", avatar: "https://i.pravatar.cc/150?u=3" },
  { id: "#U1021", name: "Phạm Văn B", email: "phamvanb@gmail.com", phone: "0933 888 999", joined: "12/10/2023", orders: 1, spent: "150.000 đ", status: "active", avatar: "https://i.pravatar.cc/150?u=4" },
  { id: "#U1020", name: "Hoàng Tùng", email: "tung.dev@tech.vn", phone: "0977 777 777", joined: "10/10/2023", orders: 8, spent: "2.400.000 đ", status: "active", avatar: "https://i.pravatar.cc/150?u=5" },
];

const Users = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  const getStatusBadge = (status) => {
    return status === 'active' 
      ? <span className="status-badge status-active"><span className="status-dot"></span>Hoạt động</span>
      : <span className="status-badge status-locked"><span className="status-dot"></span>Bị khóa</span>;
  };

  return (
    <div className="users-page">
      {/* 1. Header */}
      <div className="page-header">
        <div>
          <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>
            Trang chủ / Khách hàng
          </div>
          <h1 className="page-title">Quản lý Khách hàng</h1>
          <p className="page-subtitle">Quản lý danh sách người dùng và lịch sử giao dịch.</p>
        </div>
        <button className="btn-primary" onClick={() => alert('Chức năng thêm khách hàng mới')}>
          <FiUser /> Thêm khách hàng
        </button>
      </div>

      {/* 2. Stats Grid */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {userStats.map(stat => (
          <StatsCard key={stat.id} {...stat} />
        ))}
      </div>

      {/* 3. Filter & Search */}
      <div className="products-table-container">
        <div className="filters-bar" style={{ padding: '1rem', gap: '1rem' }}>
          <div className="search-wrapper" style={{ flex: 2 }}>
            <FiSearch className="search-icon" style={{ top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              className="form-input" 
              placeholder="Tìm theo tên, email, số điện thoại..." 
              style={{ paddingLeft: '2.5rem' }} 
            />
          </div>
          <div style={{ flex: 1 }}>
            <select className="form-select">
              <option value="">Trạng thái: Tất cả</option>
              <option value="active">Hoạt động</option>
              <option value="locked">Bị khóa</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
             <select className="form-select">
              <option value="">Chi tiêu: Tất cả</option>
              <option value="high">Trên 5 triệu</option>
              <option value="medium">1 - 5 triệu</option>
              <option value="low">Dưới 1 triệu</option>
            </select>
          </div>
          <button className="btn-outline" style={{ padding: '0.6rem 1rem' }}>
            <FiFilter /> Lọc
          </button>
        </div>

        {/* 4. Users Table */}
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Khách hàng</th>
              <th>Số điện thoại</th>
              <th>Ngày đăng ký</th>
              <th>Đơn hàng</th>
              <th>Tổng chi tiêu</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {usersData.map((user) => (
              <tr key={user.id}>
                <td style={{ color: '#94a3b8' }}>{user.id}</td>
                <td>
                  <div className="user-cell">
                    <img src={user.avatar} alt={user.name} className="user-avatar-sm" />
                    <div className="user-info-text">
                      <span className="user-name">{user.name}</span>
                      <span className="user-email">{user.email}</span>
                    </div>
                  </div>
                </td>
                <td>{user.phone}</td>
                <td>{user.joined}</td>
                <td style={{ textAlign: 'center' }}>
                    <span className="badge-gray" style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px' }}>
                        {user.orders}
                    </span>
                </td>
                <td className="font-bold text-primary">{user.spent}</td>
                <td>{getStatusBadge(user.status)}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                        className="btn-outline" 
                        style={{ padding: '0.4rem', border: 'none', color: '#6366f1' }}
                        onClick={() => setSelectedUser(user)}
                    >
                        Xem chi tiết
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 5. User Detail Drawer */}
      {selectedUser && (
        <div className="user-detail-overlay" onClick={() => setSelectedUser(null)}>
          <div className="user-detail-drawer" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
               <div className="drawer-user-profile">
                  <img src={selectedUser.avatar} alt={selectedUser.name} className="drawer-avatar" />
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{selectedUser.name}</h3>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                        {getStatusBadge(selectedUser.status)}
                        <span style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'flex', alignItems: 'center' }}>
                            ID: {selectedUser.id}
                        </span>
                    </div>
                  </div>
               </div>
               <button onClick={() => setSelectedUser(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}>
                 <FiX />
               </button>
            </div>
            
            <div className="drawer-body">
               {/* Contact Info */}
               <div className="info-section">
                  <h4 className="info-title">Thông tin cá nhân</h4>
                  <div className="info-grid">
                     <div className="info-item">
                        <label><FiMail style={{ marginBottom: -2, marginRight: 4 }} /> Email</label>
                        <span>{selectedUser.email}</span>
                     </div>
                     <div className="info-item">
                        <label><FiPhone style={{ marginBottom: -2, marginRight: 4 }} /> Số điện thoại</label>
                        <span>{selectedUser.phone}</span>
                     </div>
                     <div className="info-item">
                        <label><FiCalendar style={{ marginBottom: -2, marginRight: 4 }} /> Ngày đăng ký</label>
                        <span>{selectedUser.joined}</span>
                     </div>
                     <div className="info-item">
                        <label><FiCreditCard style={{ marginBottom: -2, marginRight: 4 }} /> Tổng chi tiêu</label>
                        <span className="text-primary font-bold">{selectedUser.spent}</span>
                     </div>
                  </div>
               </div>

               {/* Recent Activity */}
               <div className="info-section">
                  <h4 className="info-title">Lịch sử giao dịch gần đây</h4>
                  <div className="order-history-list">
                     {[1, 2, 3].map((i) => (
                        <div key={i} className="history-item">
                           <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                              <div style={{ background: '#e0e7ff', padding: '0.5rem', borderRadius: '6px', color: '#4338ca' }}>
                                 <FiShoppingBag />
                              </div>
                              <div>
                                 <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Đơn hàng #NEO-882{i}</div>
                                 <div style={{ fontSize: '0.75rem', color: '#64748b' }}>20/10/2023 - 10:30 AM</div>
                              </div>
                           </div>
                           <div style={{ textAlign: 'right' }}>
                              <div className="text-primary font-bold" style={{ fontSize: '0.9rem' }}>150.000 đ</div>
                              <div className="item-status success" style={{ fontSize: '0.75rem' }}>Thành công</div>
                           </div>
                        </div>
                     ))}
                  </div>
                  <button style={{ width: '100%', marginTop: '1rem', padding: '0.5rem', background: 'none', border: '1px dashed #cbd5e1', color: '#64748b', borderRadius: '6px', cursor: 'pointer' }}>
                     Xem tất cả {selectedUser.orders} đơn hàng
                  </button>
               </div>
            </div>

            <div className="drawer-footer">
               {selectedUser.status === 'active' ? (
                 <button className="btn-outline" style={{ flex: 1, borderColor: '#ef4444', color: '#ef4444' }}>
                   <FiLock /> Khóa tài khoản
                 </button>
               ) : (
                 <button className="btn-outline" style={{ flex: 1, borderColor: '#166534', color: '#166534' }}>
                   <FiUnlock /> Mở khóa
                 </button>
               )}
               <button className="btn-primary" style={{ flex: 1 }}>
                 <FiRefreshCw /> Reset Mật khẩu
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
