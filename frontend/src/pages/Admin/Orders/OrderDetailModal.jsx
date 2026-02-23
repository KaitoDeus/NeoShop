import React from 'react';
import { FiX, FiCheckCircle, FiClock, FiXCircle, FiCreditCard, FiSmartphone, FiBriefcase, FiUser, FiMail } from 'react-icons/fi';
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
        
        <div className="modal-footer">
          <button className="btn-outline" onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
