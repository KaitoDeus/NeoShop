import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiCheckCircle, FiCopy, FiHome, FiShoppingBag, FiDownload } from 'react-icons/fi';
import orderService from '../../services/orderService';
import './OrderSuccess.css'; // Will create CSS separately

const OrderSuccess = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const data = await orderService.getOrderById(id);
                setOrder(data);
            } catch (error) {
                console.error("Failed to load order", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    if (loading) return <div className="success-loading">Đang tải thông tin đơn hàng...</div>;

    if (!order) return <div className="success-error">Không tìm thấy đơn hàng.</div>;

    return (
        <div className="order-success-page">
            <div className="success-card">
                <div className="success-icon-box">
                    <FiCheckCircle size={64} color="#10b981" />
                </div>
                <h1 className="success-title">Thanh toán thành công!</h1>
                <p className="success-subtitle">Cảm ơn bạn đã mua sắm tại NeoShop.</p>
                <div className="order-id-box">
                    <span>Mã đơn hàng:</span>
                    <strong>{order.id}</strong>
                    <button className="copy-btn-mini" onClick={() => navigator.clipboard.writeText(order.id)}><FiCopy /></button>
                </div>

                <div className="digital-delivery-info">
                    <h3>📦 Sản phẩm kỹ thuật số</h3>
                    <p>Mã kích hoạt (Key) đã được gửi tới email: <strong>{order.shippingAddress}</strong></p>
                    <p>Vui lòng kiểm tra hộp thư (cả mục Spam/Promotions).</p>
                </div>

                <div className="ordered-items-list">
                    {order.items.map(item => (
                        <div key={item.id} className="success-item-row">
                            <div className="item-name">{item.productTitle} <span className="item-qty">x{item.quantity}</span></div>
                            <div className="item-price">{item.unitPrice ? item.unitPrice.toLocaleString('vi-VN') : 0}đ</div>
                        </div>
                    ))}
                    <div className="success-total-row">
                        <span>Tổng cộng</span>
                        <span>{order.totalAmount ? order.totalAmount.toLocaleString('vi-VN') : 0}đ</span>
                    </div>
                </div>

                <div className="success-actions">
                    <Link to="/" className="btn-home"><FiHome /> Về trang chủ</Link>
                    <Link to="/profile" className="btn-history"><FiShoppingBag /> Xem lịch sử đơn hàng</Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
