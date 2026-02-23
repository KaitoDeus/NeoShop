import { useState, useEffect } from 'react';
import { 
  FiSearch, FiEdit2, FiTrash2, FiUser, 
  FiChevronLeft, FiChevronRight
} from 'react-icons/fi';
import StatsCard from '../../../components/admin/Dashboard/StatsCard';
import { userStats } from '../../../data/adminMockData'; // Keep mock stats for now
import userService from '../../../services/userService';
import UserModal from './UserModal';
import './Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [editingUser, setEditingUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredUsers = users.filter(user => 
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phoneNumber?.includes(searchTerm)
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  const handleCreate = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này? Thao tác này không thể hoàn tác.")) {
      try {
        await userService.deleteUser(id);
        fetchUsers();
      } catch (error) {
        console.error("Failed to delete user:", error);
        alert("Lỗi khi xóa người dùng.");
      }
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editingUser) {
        await userService.updateUser(editingUser.id, formData);
        alert("Cập nhật thông tin thành công!");
      } else {
        await userService.createUser(formData);
        alert("Thêm người dùng thành công!");
      }
      fetchUsers();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save user:", error);
      throw error;
    }
  };

  const getStatusBadge = (active) => {
    return active 
      ? <span className="status-badge status-active"><span className="status-dot"></span>Hoạt động</span>
      : <span className="status-badge status-locked"><span className="status-dot"></span>Bị khóa</span>;
  };

  return (
    <div className="users-page">
      <div className="page-header">
        <div>
          <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>
            Trang chủ / Khách hàng
          </div>
          <h1 className="page-title">Quản lý Khách hàng</h1>
          <p className="page-subtitle">Quản lý danh sách người dùng và lịch sử giao dịch.</p>
        </div>
        <button className="btn-primary" onClick={handleCreate}>
          <FiUser /> Thêm khách hàng
        </button>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {userStats.map(stat => (
          <StatsCard key={stat.id} {...stat} />
        ))}
      </div>

      <div className="products-table-container">
        <div className="filters-bar" style={{ padding: '1rem', gap: '1rem' }}>
          <div className="search-wrapper" style={{ flex: 1 }}>
            <FiSearch className="search-icon" style={{ top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              className="form-input" 
              placeholder="Tìm theo tên, email, số điện thoại..." 
              style={{ paddingLeft: '2.5rem' }} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Khách hàng</th>
              <th>Số điện thoại</th>
              <th>Role</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
                <tr><td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>Đang tải dữ liệu...</td></tr>
            ) : filteredUsers.length === 0 ? (
                <tr><td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>Không có người dùng nào.</td></tr>
            ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td style={{ color: '#94a3b8' }}>{user.id.substring(0, 8)}...</td>
                    <td>
                      <div className="user-cell">
                        <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.fullName || user.username}&background=random`} alt={user.fullName} className="user-avatar-sm" />
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
                    <td>{getStatusBadge(user.active !== undefined ? user.active : true)}</td>
                    <td>
                      <div className="action-btn-group">
                        <button className="btn-icon" title="Sửa" onClick={() => handleEdit(user)}>
                          <FiEdit2 />
                        </button>
                        <button className="btn-icon text-danger" title="Xóa" onClick={() => handleDelete(user.id)}>
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
        
        <div className="table-footer">
          <div className="table-info">
            Hiển thị <span className="font-bold">{filteredUsers.length}</span> / <span className="font-bold">{totalElements}</span> người dùng
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

      {isModalOpen && (
        <UserModal 
          user={editingUser}
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSave} 
        />
      )}
    </div>
  );
};

export default Users;
