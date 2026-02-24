import { 
  FiPlus, FiSearch, FiCalendar, FiDownload, FiUser, 
  FiChevronLeft, FiChevronRight, FiCreditCard, FiSmartphone, FiBriefcase, FiCopy, FiTrash2 
} from 'react-icons/fi';
import { useState, useEffect } from 'react';
import StatsCard from '../../../components/admin/Dashboard/StatsCard';
import { orderStats } from '../../../data/adminMockData'; // Keep stats mock for now or implement stats API later if requested
import orderService from '../../../services/orderService';
import OrderDetailModal from './OrderDetailModal';
import ManualOrderModal from './ManualOrderModal';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isManualOrderOpen, setIsManualOrderOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [page, filterStatus, searchQuery, startDate, endDate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Format dates for backend if needed (YYYY-MM-DDTHH:mm:ss)
      let formattedStart = startDate ? `${startDate}T00:00:00` : '';
      let formattedEnd = endDate ? `${endDate}T23:59:59` : '';
      
      const data = await orderService.getAllOrders(page, 10, filterStatus, searchQuery, formattedStart, formattedEnd);
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

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(orders.map(o => o.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Bạn có chắc muốn xóa ${selectedIds.length} đơn hàng đã chọn?`)) {
      try {
        await orderService.bulkDeleteOrders(selectedIds);
        setSelectedIds([]);
        fetchOrders();
      } catch (error) {
        console.error(error);
        alert("Lỗi khi xóa hàng loạt.");
      }
    }
  };

  const handleBulkUpdateStatus = async (status) => {
    try {
      await orderService.bulkUpdateOrderStatus(selectedIds, status);
      setSelectedIds([]);
      fetchOrders();
    } catch (error) {
      console.error(error);
      alert("Lỗi khi cập nhật trạng thái hàng loạt.");
    }
  };

  const handleExportCSV = () => {
    if (orders.length === 0) return;
    
    const headers = ['Mã đơn', 'Ngày tạo', 'Khách hàng', 'Email', 'Sản phẩm', 'Tổng tiền', 'PTTT', 'Trạng thái'];
    const rows = orders.map(order => [
      order.id,
      new Date(order.orderDate).toLocaleString('vi-VN'),
      order.username || 'Khách vãng lai',
      order.userEmail || '',
      order.items?.map(i => `${i.productTitle} x${i.quantity}`).join('; '),
      order.totalAmount,
      order.paymentMethod,
      order.status
    ]);
    
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    csvContent += headers.join(",") + "\n";
    rows.forEach(row => {
      csvContent += row.map(cell => `"${cell}"`).join(",") + "\n";
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          <button className="btn-outline" onClick={handleExportCSV}>
            <FiDownload /> Xuất báo cáo
          </button>
          <button className="btn-primary" onClick={() => setIsManualOrderOpen(true)}>
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
              placeholder="Tìm theo sản phẩm, khách hàng..." 
              className="search-input"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
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
            <div style={{ position: 'relative' }}>
              <button 
                className={`date-picker-btn ${startDate || endDate ? 'active' : ''}`}
                onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
              >
                <FiCalendar /> {startDate || endDate ? 
                  (() => {
                    const formatDateStr = (dateStr) => {
                      if (!dateStr) return '...';
                      const p = dateStr.split('-');
                      return p.length === 3 ? `${p[2]}/${p[1]}/${p[0]}` : dateStr;
                    };
                    return `${formatDateStr(startDate)} - ${formatDateStr(endDate)}`;
                  })()
                  : 'Ngày tạo'}
              </button>
              
              {isDatePickerOpen && (
                <div className="date-popover" style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  zIndex: 100,
                  background: 'white',
                  padding: '1rem',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  border: '1px solid #e2e8f0',
                  marginTop: '0.5rem',
                  minWidth: '300px'
                }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <label className="form-label" style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.4rem' }}>Từ ngày</label>
                    <input 
                      type="date" 
                      className="form-control" 
                      id="temp-start-date"
                      defaultValue={startDate}
                    />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label className="form-label" style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.4rem' }}>Đến ngày</label>
                    <input 
                      type="date" 
                      className="form-control" 
                      id="temp-end-date"
                      defaultValue={endDate}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-sm btn-primary" onClick={() => {
                      const start = document.getElementById('temp-start-date').value;
                      const end = document.getElementById('temp-end-date').value;
                      setStartDate(start);
                      setEndDate(end);
                      setPage(0);
                      setIsDatePickerOpen(false);
                    }} style={{ flex: 1 }}>Áp dụng</button>
                    <button className="btn btn-sm btn-outline" onClick={() => { 
                      setStartDate(''); 
                      setEndDate(''); 
                      setPage(0);
                      setIsDatePickerOpen(false); 
                    }} style={{ flex: 1 }}>Xóa</button>
                  </div>
                </div>
              )}
            </div>
          </div>
      </div>

        {/* Bulk Actions Bar */}
        {selectedIds.length > 0 && (
          <div className="bulk-actions-bar">
            <span className="selected-count">Đã chọn <strong>{selectedIds.length}</strong> đơn hàng</span>
            <div className="bulk-btns">
              <button className="btn-outline btn-sm" onClick={() => handleBulkUpdateStatus('PAID')}>Đánh dấu Đã thanh toán</button>
              <button className="btn-danger btn-sm" onClick={handleBulkDelete}>
                <FiTrash2 size={14} /> Xóa đã chọn
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <table className="admin-table">
          <thead>
            <tr>
              <th className="checkbox-cell">
                <input 
                  type="checkbox" 
                  className="custom-checkbox" 
                  onChange={handleSelectAll}
                  checked={orders.length > 0 && selectedIds.length === orders.length}
                />
              </th>
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
                <tr><td colSpan="8" style={{textAlign: 'center', padding: '2rem'}}>Đang tải dữ liệu...</td></tr>
            ) : orders.length === 0 ? (
                <tr><td colSpan="8" style={{textAlign: 'center', padding: '2rem'}}>Không có đơn hàng nào.</td></tr>
            ) : (
                orders.map(order => (
                  <tr key={order.id}>
                    <td className="checkbox-cell">
                      <input 
                        type="checkbox" 
                        className="custom-checkbox" 
                        checked={selectedIds.includes(order.id)}
                        onChange={() => handleSelectRow(order.id)}
                      />
                    </td>
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
                        <FiUser size={14} /> {order.fullName || order.username || order.userEmail || 'Khách vãng lai'}
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

      <ManualOrderModal 
        isOpen={isManualOrderOpen}
        onClose={() => setIsManualOrderOpen(false)}
        onSuccess={fetchOrders}
      />
    </div>
  );
};

export default Orders;
