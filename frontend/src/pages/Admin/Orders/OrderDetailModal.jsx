import React from 'react';
import { FiX, FiCheckCircle, FiClock, FiXCircle, FiCreditCard, FiSmartphone, FiBriefcase, FiUser, FiMail } from 'react-icons/fi';
import orderService from '../../../services/orderService';
import './OrderDetailModal.css';

const OrderDetailModal = ({ order, onClose }) => {
  if (!order) return null;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PAID':
      case 'COMPLETED':
      case 'success':
        return <span className="status-badge status-active"><FiCheckCircle /> Thành công</span>;
      case 'PENDING':
      case 'pending':
        return <span className="status-badge status-warning" style={{ background: '#fef3c7', color: '#b45309' }}><FiClock /> Chờ thanh toán</span>;
      case 'FAILED':
      case 'CANCELLED':
      case 'failed':
        return <span className="status-badge status-danger" style={{ background: '#fee2e2', color: '#b91c1c' }}><FiXCircle /> Thất bại</span>;
      default:
        return <span className="status-badge status-hidden">{status}</span>;
    }
  };

  const getPaymentIcon = (method) => {
    switch (method) {
      case 'MOMO': return <><FiSmartphone className="text-purple" /> MOMO</>;
      case 'BANK_TRANSFER': return <><FiBriefcase className="text-blue" /> Chuyển khoản</>;
      case 'VISA': return <><FiCreditCard className="text-green" /> Thẻ VISA</>;
      default: return <><FiCreditCard /> {method || 'Chưa xác định'}</>;
    }
  };

  const handleUpdateStatus = async (status) => {
    if (window.confirm(`Bạn có chắc muốn chuyển trạng thái đơn hàng sang ${status}?`)) {
      try {
        await orderService.updateStatus(order.id, status);
        alert('Cập nhật trạng thái thành công!');
        onClose();
        window.location.reload(); 
      } catch (error) {
        alert('Lỗi khi cập nhật trạng thái');
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Bạn có chắc muốn xóa đơn hàng này? Thao tác này không thể hoàn tác.')) {
      try {
        await orderService.deleteOrder(order.id);
        alert('Xóa đơn hàng thành công!');
        onClose();
        window.location.reload();
      } catch (error) {
        alert('Lỗi khi xóa đơn hàng');
      }
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content order-detail-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Chi Tiết Đơn Hàng</h2>
          <button className="close-btn" onClick={onClose}><FiX size={24} /></button>
        </div>
        
        <div className="modal-body">
          <div className="detail-section">
            <div className="detail-row">
              <span className="detail-label">Mã đơn hàng:</span>
              <span className="detail-value font-bold">{order.id}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Ngày tạo:</span>
              <span className="detail-value text-secondary">
                {new Date(order.orderDate).toLocaleString('vi-VN')}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Trạng thái:</span>
              <span className="detail-value">{getStatusBadge(order.status)}</span>
            </div>
          </div>

          <div className="detail-grid">
            <div className="detail-box">
              <h3>Thông tin người mua</h3>
              <div className="box-content">
                <p><FiUser className="box-icon" /> <strong>{order.username || 'Khách vãng lai'}</strong></p>
                {order.userEmail && <p><FiMail className="box-icon" /> {order.userEmail}</p>}
              </div>
            </div>
            
            <div className="detail-box">
              <h3>Thanh toán</h3>
              <div className="box-content">
                <p className="payment-method-disp">{getPaymentIcon(order.paymentMethod)}</p>
                <p className="total-amount">
                  Tổng tiền: <span className="font-bold text-primary">{order.totalAmount?.toLocaleString()} đ</span>
                </p>
              </div>
            </div>
          </div>

          <div className="order-items-section">
            <h3>Sản phẩm đã mua</h3>
            <table className="items-table">
              <thead>
                <tr>
                  <th>Tên sản phẩm</th>
                  <th style={{ textAlign: 'center' }}>Số lượng</th>
                </tr>
              </thead>
              <tbody>
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, index) => (
                    <tr key={index}>
                      <td className="item-name">{item.productTitle}</td>
                      <td className="item-qty" style={{ textAlign: 'center' }}>x{item.quantity}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" style={{ textAlign: 'center' }}>Không có dữ liệu sản phẩm</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <div className="left-actions">
            <button className="btn-danger" onClick={handleDelete} style={{ background: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FiXCircle /> Xóa đơn
            </button>
          </div>
          <div className="right-actions" style={{ display: 'flex', gap: '0.5rem' }}>
            {order.status !== 'PAID' && order.status !== 'COMPLETED' && (
              <button className="btn-success" onClick={() => handleUpdateStatus('PAID')} style={{ background: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' }}>
                Đã thanh toán
              </button>
            )}
            {order.status === 'PENDING' && (
              <button className="btn-danger-outline" onClick={() => handleUpdateStatus('CANCELLED')} style={{ background: 'white', color: '#b91c1c', border: '1px solid #fee2e2', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' }}>
                Hủy đơn
              </button>
            )}
            <button className="btn-outline" onClick={onClose} style={{ padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', border: '1px solid #e2e8f0', background: 'white' }}>Đóng</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
