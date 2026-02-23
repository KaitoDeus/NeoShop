import { 
  FiPlus, FiSearch, FiCalendar, FiDownload, FiUser, 
  FiChevronLeft, FiChevronRight, FiCreditCard, FiSmartphone, FiBriefcase, FiCopy 
} from 'react-icons/fi';
import { useState, useEffect } from 'react';
import StatsCard from '../../../components/admin/Dashboard/StatsCard';
import { orderStats } from '../../../data/adminMockData'; // Keep stats mock for now or implement stats API later if requested
import orderService from '../../../services/orderService';
import OrderDetailModal from './OrderDetailModal';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [page, filterStatus]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getAllOrders(page, 10, filterStatus);
      setOrders(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PAID':
      case 'COMPLETED':
      case 'success':
        return <span className="status-badge status-active"><span className="status-dot"></span>Thành công</span>;
      case 'PENDING':
      case 'pending':
        return <span className="status-badge status-warning" style={{ background: '#fef3c7', color: '#b45309' }}><span className="status-dot"></span>Chờ thanh toán</span>;
      case 'FAILED':
      case 'CANCELLED':
      case 'failed':
        return <span className="status-badge status-danger" style={{ background: '#fee2e2', color: '#b91c1c' }}><span className="status-dot"></span>Thất bại</span>;
      default:
        return <span className="status-badge status-hidden">{status}</span>;
    }
  };

  const getPaymentIcon = (method) => {
    switch (method) {
      case 'MOMO': return <FiSmartphone className="text-purple" />;
      case 'BANK_TRANSFER': return <FiBriefcase className="text-blue" />;
      case 'VISA': return <FiCreditCard className="text-green" />;
      default: return <FiCreditCard />;
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
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
               <button 
                 className={`filter-tab ${filterStatus === '' ? 'active' : ''}`}
                 onClick={() => { setFilterStatus(''); setPage(0); }}
               >Tất cả</button>
               <button 
                 className={`filter-tab ${filterStatus === 'PAID' ? 'active' : ''}`}
                 onClick={() => { setFilterStatus('PAID'); setPage(0); }}
               >Thanh toán</button>
               <button 
                 className={`filter-tab ${filterStatus === 'PENDING' ? 'active' : ''}`}
                 onClick={() => { setFilterStatus('PENDING'); setPage(0); }}
               >Chờ thanh toán</button>
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
            {loading ? (
                <tr><td colSpan="7" style={{textAlign: 'center', padding: '2rem'}}>Đang tải dữ liệu...</td></tr>
            ) : orders.length === 0 ? (
                <tr><td colSpan="7" style={{textAlign: 'center', padding: '2rem'}}>Không có đơn hàng nào.</td></tr>
            ) : (
                orders.map(order => (
                  <tr key={order.id}>
                    <td className="order-id">
                      <div className="id-wrapper">
                        {order.id.substring(0, 8)}...
                        <FiCopy className="copy-icon" size={14} title="Sao chép mã" onClick={() => navigator.clipboard.writeText(order.id)}/>
                      </div>
                    </td>
                    <td>
                      <span className="order-product">
                          {order.items && order.items.length > 0 ? (
                              order.items.map(i => `${i.productTitle} x${i.quantity}`).join(', ')
                          ) : 'Không có sản phẩm'}
                      </span>
                      <div className="order-customer">
                        <FiUser size={14} /> {order.username || order.userEmail || 'Khách vãng lai'}
                      </div>
                    </td>
                    <td className="font-bold text-primary">{order.totalAmount?.toLocaleString()} đ</td>
                    <td>
                      <div className="payment-info">
                        <span className="payment-icon">{getPaymentIcon(order.paymentMethod)}</span>
                        {order.paymentMethod === 'BANK_TRANSFER' ? 'Chuyển khoản' : order.paymentMethod}
                      </div>
                    </td>
                    <td>{getStatusBadge(order.status)}</td>
                    <td className="text-secondary">
                      <div>{new Date(order.orderDate).toLocaleDateString('vi-VN')}</div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{new Date(order.orderDate).toLocaleTimeString('vi-VN')}</div>
                    </td>
                    <td>
                      <button 
                        className="btn-outline" 
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                        onClick={() => setSelectedOrder(order)}
                      >
                        Xem chi tiết
                      </button>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="table-footer">
          <div className="table-info">
            Hiển thị <span className="font-bold">{orders.length > 0 ? page * 10 + 1 : 0}</span> đến <span className="font-bold">{Math.min((page + 1) * 10, totalElements)}</span> của <span className="font-bold">{totalElements}</span> đơn hàng
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

      {/* 4. Modal (Hiển thị khi selectedOrder có dữ liệu) */}
      <OrderDetailModal 
        order={selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
      />
    </div>
  );
};

export default Orders;
