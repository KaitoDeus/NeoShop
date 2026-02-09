import { useState } from 'react';
import { 
  FiPlus, FiSearch, FiCalendar, FiUploadCloud, FiEye, FiEyeOff, FiCopy, FiX, FiCheck
} from 'react-icons/fi';
import StatsCard from '../../../components/admin/Dashboard/StatsCard';
import { keyStats, keysData } from '../../../data/adminMockData';
import './Keys.css';

const Keys = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [visibleKeyId, setVisibleKeyId] = useState(null);

  const toggleKeyVisibility = (id) => {
    setVisibleKeyId(visibleKeyId === id ? null : id);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'available':
        return <span className="status-badge badge-available"><span className="status-dot"></span>Chưa bán</span>;
      case 'sold':
        return <span className="status-badge badge-sold">Đã bán</span>;
      default:
        return <span className="status-badge status-hidden">{status}</span>;
    }
  };

  return (
    <div className="keys-page">
      {/* 1. Header & Actions */}
      <div className="page-header">
        <div>
          <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>
            Trang chủ / Sản phẩm / Quản lý kho Key
          </div>
          <h1 className="page-title">Quản lý Kho Key</h1>
          <p className="page-subtitle">Quản lý danh sách mã thẻ, tài khoản số và nhập kho hàng loạt.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn-outline" onClick={() => setShowAddModal(true)}>
            <FiPlus /> Thêm thủ công
          </button>
          <button className="btn-primary" style={{ background: '#7c3aed' }}>
            <FiUploadCloud /> Nhập kho hàng loạt
          </button>
        </div>
      </div>

      {/* 2. Stats Cards */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {keyStats.map(stat => (
          <StatsCard key={stat.id} {...stat} />
        ))}
      </div>

      {/* 3. Table Section */}
      <div className="products-table-container">
        {/* Filters */}
        <div className="filters-bar" style={{ gap: '1rem', padding: '1rem' }}>
          <div className="search-wrapper" style={{ flex: 2 }}>
            <label className="form-label" style={{ marginBottom: '0.25rem' }}>Tìm kiếm</label>
            <div style={{ position: 'relative' }}>
              <FiSearch className="search-icon" style={{ top: '50%', transform: 'translateY(-50%)' }} />
              <input type="text" placeholder="Tìm theo mã key, tên sản phẩm..." className="form-input" style={{ paddingLeft: '2.5rem' }} />
            </div>
          </div>
          
          <div style={{ flex: 1 }}>
            <label className="form-label" style={{ marginBottom: '0.25rem' }}>Sản phẩm</label>
            <select className="form-select">
               <option>Tất cả sản phẩm</option>
            </select>
          </div>
          
          <div style={{ flex: 1 }}>
            <label className="form-label" style={{ marginBottom: '0.25rem' }}>Trạng thái</label>
            <select className="form-select">
               <option>Tất cả</option>
               <option>Chưa bán</option>
               <option>Đã bán</option>
            </select>
          </div>

          <div style={{ flex: 1 }}>
            <label className="form-label" style={{ marginBottom: '0.25rem' }}>Ngày nhập</label>
            <div style={{ position: 'relative' }}>
               <input type="date" className="form-input" />
            </div>
          </div>
        </div>

        {/* Table */}
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Sản phẩm</th>
              <th>Mã Key / Tài khoản</th>
              <th>Ngày nhập</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {keysData.map(item => (
              <tr key={item.id}>
                <td style={{ color: '#94a3b8' }}>{item.id}</td>
                <td>
                  <div className="product-cell">
                    <img src={item.image} alt="" className="product-icon" />
                    <div>
                      <div className="font-medium text-primary">{item.product}</div>
                      <div className="text-secondary" style={{ fontSize: '0.75rem' }}>{item.type}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="key-code-wrapper">
                    <span>
                      {visibleKeyId === item.id ? item.key : '••••-••••-••••-••••'}
                    </span>
                    <button className="icon-btn-sm" onClick={() => toggleKeyVisibility(item.id)}>
                      {visibleKeyId === item.id ? <FiEyeOff /> : <FiEye />}
                    </button>
                    <button className="icon-btn-sm" title="Sao chép">
                      <FiCopy />
                    </button>
                  </div>
                </td>
                <td className="text-secondary">
                  <div>{item.date}</div>
                  <div style={{ fontSize: '0.75rem' }}>{item.time}</div>
                </td>
                <td>{getStatusBadge(item.status)}</td>
                <td>
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>

         {/* Pagination */}
         <div className="table-footer">
          <div className="table-info">
            Hiển thị 1-5 trong số 12,450 key
          </div>
          <div className="pagination">
            <button className="page-btn"><FiCheck /></button>
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
          </div>
        </div>
      </div>

      {/* Add Key Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-container" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Thêm Key thủ công</h3>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>
                <FiX />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Sản phẩm <span className="text-danger">*</span></label>
                <select className="form-select">
                  <option value="">Chọn sản phẩm...</option>
                  <option>Windows 11 Pro</option>
                  <option>Netflix Premium</option>
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">Loại Key</label>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                  <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', cursor: 'pointer' }}>
                    <input type="radio" name="keyType" defaultChecked /> License Key
                  </label>
                  <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', cursor: 'pointer' }}>
                    <input type="radio" name="keyType" /> Tài khoản
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Mã Key / Tài khoản <span className="text-danger">*</span></label>
                <textarea 
                  className="form-textarea" 
                  placeholder="Nhập mã key ở đây..."
                ></textarea>
                <p className="helper-text">Mỗi dòng 1 key. Hệ thống sẽ tự động tách.</p>
              </div>
              
              <div className="form-group">
                <label className="form-label">Ghi chú</label>
                <input type="text" className="form-input" placeholder="Ghi chú nội bộ (tuỳ chọn)" />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-outline" onClick={() => setShowAddModal(false)}>Hủy bỏ</button>
              <button className="btn-primary">Lưu & Tiếp tục</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Keys;
