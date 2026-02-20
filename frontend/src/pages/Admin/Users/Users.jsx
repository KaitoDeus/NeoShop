import { useState, useEffect } from 'react';
import { 
  FiSearch, FiFilter, FiMoreHorizontal, FiUser, FiLock, FiUnlock, 
  FiMail, FiPhone, FiCalendar, FiShoppingBag, FiCreditCard, FiX,
  FiRefreshCw, FiChevronLeft, FiChevronRight
} from 'react-icons/fi';
import StatsCard from '../../../components/admin/Dashboard/StatsCard';
import { userStats } from '../../../data/adminMockData'; // Keep mock stats for now
import userService from '../../../services/userService';
import './Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers(page, 10);
      setUsers(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  const getStatusBadge = (active) => {
    // Modify based on how status is returned. Currently I hardcoded active=true in backend
    return active 
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
              <th>Role</th>
              <th>Đơn hàng</th>
              <th>Tổng chi tiêu</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
                <tr><td colSpan="8" style={{textAlign: 'center', padding: '2rem'}}>Đang tải dữ liệu...</td></tr>
            ) : users.length === 0 ? (
                <tr><td colSpan="8" style={{textAlign: 'center', padding: '2rem'}}>Không có người dùng nào.</td></tr>
            ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td style={{ color: '#94a3b8' }}>{user.id.substring(0, 8)}...</td>
                    <td>
                      <div className="user-cell">
                        <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.fullName}&background=random`} alt={user.fullName} className="user-avatar-sm" />
                        <div className="user-info-text">
                          <span className="user-name">{user.fullName || user.username}</span>
                          <span className="user-email">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>{user.phoneNumber || 'N/A'}</td>
                    <td>
                        {user.roles && user.roles.map(r => (
                            <span key={r} className="badge-gray" style={{marginRight: '4px'}}>{r}</span>
                        ))}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                        <span className="badge-gray" style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px' }}>
                            -
                        </span>
                    </td>
                    <td className="font-bold text-primary">-</td>
                    <td>{getStatusBadge(user.active !== undefined ? user.active : true)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                            className="btn-outline" 
                            style={{ padding: '0.4rem', border: 'none', color: '#2563eb' }}
                            onClick={() => setSelectedUser(user)}
                        >
                            Xem chi tiết
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
        
        {/* Pagination */}
        <div className="table-footer">
          <div className="table-info">
            Hiển thị <span className="font-bold">{users.length > 0 ? page * 10 + 1 : 0}</span> đến <span className="font-bold">{Math.min((page + 1) * 10, totalElements)}</span> trong <span className="font-bold">{totalElements}</span> kết quả
          </div>
          <div className="pagination">
            <button className="page-btn" onClick={() => handlePageChange(page - 1)} disabled={page === 0}><FiChevronLeft /></button>
            {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} className={`page-btn ${page === i ? 'active' : ''}`} onClick={() => handlePageChange(i)}>
                    {i + 1}
                </button>
            )).slice(Math.max(0, page - 2), Math.min(totalPages, page + 3))} 
            <button className="page-btn" onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages - 1}><FiChevronRight /></button>
          </div>
        </div>
      </div>

      {/* 5. User Detail Drawer */}
      {selectedUser && (
        <div className="user-detail-overlay" onClick={() => setSelectedUser(null)}>
          <div className="user-detail-drawer" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
               <div className="drawer-user-profile">
                  <img src={selectedUser.avatar || `https://ui-avatars.com/api/?name=${selectedUser.fullName}&background=random`} alt={selectedUser.fullName} className="drawer-avatar" />
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{selectedUser.fullName || selectedUser.username}</h3>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                        {getStatusBadge(selectedUser.active !== undefined ? selectedUser.active : true)}
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
                        <span>{selectedUser.phoneNumber || 'N/A'}</span>
                     </div>
                     <div className="info-item">
                        <label><FiCalendar style={{ marginBottom: -2, marginRight: 4 }} /> Địa chỉ</label>
                        <span>{selectedUser.address || 'Chưa cập nhật'}</span>
                     </div>
                  </div>
               </div>

               {/* Recent Activity Mocked for now */}
               <div className="info-section">
                  <h4 className="info-title">Lịch sử giao dịch gần đây (Mock)</h4>
                  <div className="order-history-list">
                     <p style={{color: '#94a3b8', fontStyle: 'italic'}}>Chức năng đang phát triển...</p>
                  </div>
               </div>
            </div>

            <div className="drawer-footer">
               {/* Actions */}
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
