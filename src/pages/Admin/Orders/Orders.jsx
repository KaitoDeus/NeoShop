import { 
  FiPlus, FiSearch, FiCalendar, FiDownload, FiUser, 
  FiChevronLeft, FiChevronRight, FiCreditCard, FiSmartphone, FiBriefcase, FiCopy 
} from 'react-icons/fi';
import StatsCard from '../../../components/admin/Dashboard/StatsCard';
import { orderStats, ordersData } from '../../../data/adminMockData';
import './Orders.css';

const Orders = () => {
  // ... (getStatusBadge and getPaymentIcon functions remain the same)
  const getStatusBadge = (status) => {
    switch (status) {
      case 'success':
        return <span className="status-badge status-active"><span className="status-dot"></span>Thành công</span>;
      case 'pending':
        return <span className="status-badge status-warning" style={{ background: '#fef3c7', color: '#b45309' }}><span className="status-dot"></span>Chờ thanh toán</span>;
      case 'failed':
        return <span className="status-badge status-danger" style={{ background: '#fee2e2', color: '#b91c1c' }}><span className="status-dot"></span>Thất bại</span>;
      default:
        return <span className="status-badge status-hidden">{status}</span>;
    }
  };

  const getPaymentIcon = (method) => {
    switch (method) {
      case 'Momo': return <FiSmartphone className="text-purple" />;
      case 'Bank': return <FiBriefcase className="text-blue" />;
      case 'Visa': return <FiCreditCard className="text-green" />;
      default: return <FiCreditCard />;
    }
  };

  return (
    <div className="orders-page">
      {/* 1. Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Quản Lý Đơn Hàng</h1>
          <p className="page-subtitle">Theo dõi, kiểm tra và xử lý các đơn hàng sản phẩm số</p>
        </div>
        <div className="header-actions" style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-outline">
            <FiDownload /> Xuất báo cáo
          </button>
          <button className="btn-primary">
            <FiPlus size={20} />
            Tạo đơn thủ công
          </button>
        </div>
      </div>

      {/* 2. Stats Cards */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {orderStats.map(stat => (
          <StatsCard key={stat.id} {...stat} />
        ))}
      </div>

      {/* 3. Orders Table Section */}
      <div className="products-table-container">
        {/* Filters Bar */}
        <div className="filters-bar">
          <div className="search-wrapper">
            <FiSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Tìm kiếm theo mã đơn, khách hàng hoặc email..." 
              className="search-input"
            />
          </div>
          
          <div className="filter-group">
            <div className="filter-tabs">
               <button className="filter-tab active">Tất cả</button>
               <button className="filter-tab">Thành công</button>
               <button className="filter-tab">Chờ thanh toán</button>
            </div>
            <button className="date-picker-btn">
               <FiCalendar /> Ngày tạo
            </button>
          </div>
        </div>

        {/* Table */}
        <table className="admin-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Sản phẩm & Khách hàng</th>
              <th>Tổng tiền</th>
              <th>PTTT</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {ordersData.map(order => (
              <tr key={order.id}>
                <td className="order-id">
                  <div className="id-wrapper">
                    {order.id}
                    <FiCopy className="copy-icon" size={14} title="Sao chép mã" />
                  </div>
                </td>
                <td>
                  <span className="order-product">{order.product}</span>
                  <div className="order-customer">
                    <FiUser size={14} /> {order.customer}
                  </div>
                </td>
                <td className="font-bold text-primary">{order.total}</td>
                <td>
                  <div className="payment-info">
                    <span className="payment-icon">{getPaymentIcon(order.payment)}</span>
                    {order.payment === 'Bank' ? 'Chuyển khoản' : order.payment}
                  </div>
                </td>
                <td>{getStatusBadge(order.status)}</td>
                <td className="text-secondary">
                  <div>{order.date}</div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{order.time}</div>
                </td>
                <td>
                  <button className="btn-outline" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>
                    Xem chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="table-footer">
          <div className="table-info">
            Hiển thị <span className="font-bold">1</span> đến <span className="font-bold">5</span> của <span className="font-bold">128</span> đơn hàng
          </div>
          <div className="pagination">
            <button className="page-btn"><FiChevronLeft /></button>
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">3</button>
            <button className="page-btn">...</button>
            <button className="page-btn"><FiChevronRight /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
