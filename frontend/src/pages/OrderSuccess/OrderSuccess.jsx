import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import {
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiCopy,
  FiHome,
  FiShoppingBag,
  FiDownload,
} from "react-icons/fi";
import orderService from "../../services/orderService";
import "./OrderSuccess.css";

const OrderSuccess = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Lấy query params (ví dụ: ?resultCode=1006 từ MoMo)
  const queryParams = new URLSearchParams(location.search);
  const momoResultCode = queryParams.get("resultCode");
  const vnpResponseCode = queryParams.get("vnp_ResponseCode");

  // Xác định xem URL có báo lỗi thanh toán không (MoMo resultCode != 0 hoặc VNPay responseCode != 00)
  const isPaymentFailedFromUrl = 
    (momoResultCode && momoResultCode !== "0") || 
    (vnpResponseCode && vnpResponseCode !== "00");

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

  if (loading)
    return (
      <div className="success-loading">Đang tải thông tin đơn hàng...</div>
    );

  if (!order)
    return <div className="success-error">Không tìm thấy đơn hàng.</div>;

  // Ghi đè trạng thái nếu URL báo lỗi thanh toán, đề phòng lúc web load thì Backend chưa kịp nhận IPN
  const displayStatus = isPaymentFailedFromUrl ? "FAILED" : order.status;

  return (
    <div className="order-success-page">
      <div className="success-card">
        <div className="success-icon-box">
          {displayStatus === "FAILED" || displayStatus === "CANCELLED" ? (
            <FiXCircle size={64} color="#ef4444" />
          ) : displayStatus === "PENDING" ? (
            <FiClock size={64} color="#f59e0b" />
          ) : (
            <FiCheckCircle size={64} color="#10b981" />
          )}
        </div>
        <h1
          className="success-title"
          style={{
            color:
              displayStatus === "FAILED" || displayStatus === "CANCELLED"
                ? "#ef4444"
                : displayStatus === "PENDING"
                  ? "#f59e0b"
                  : "#1f2937",
          }}
        >
          {displayStatus === "FAILED" || displayStatus === "CANCELLED"
            ? "Thanh toán thất bại!"
            : displayStatus === "PENDING"
              ? "Đang chờ xử lý!"
              : "Thanh toán thành công!"}
        </h1>
        <p className="success-subtitle">
          {displayStatus === "FAILED" || displayStatus === "CANCELLED"
            ? "Giao dịch không thành công hoặc đã bị hủy."
            : displayStatus === "PENDING"
              ? "Đơn hàng của bạn đang được xử lý."
              : "Cảm ơn bạn đã mua sắm tại NeoShop."}
        </p>
        <div className="order-id-box">
          <span>Mã đơn hàng:</span>
          <strong>{order.id}</strong>
          <button
            className="copy-btn-mini"
            onClick={() => navigator.clipboard.writeText(order.id)}
          >
            <FiCopy />
          </button>
        </div>

        {(displayStatus === "PAID" || displayStatus === "COMPLETED") && (
          <div className="digital-delivery-info">
            <h3>📦 Sản phẩm kỹ thuật số</h3>
            <p>
              Mã kích hoạt (Key) đã được gửi tới email:{" "}
              <strong>{order.shippingAddress}</strong>
            </p>
            <p>Vui lòng kiểm tra hộp thư (cả mục Spam/Promotions).</p>
          </div>
        )}

        <div className="ordered-items-list">
          {order.items.map((item) => (
            <div key={item.id} className="success-item-row">
              <div className="item-name">
                {item.productTitle}{" "}
                <span className="item-qty">x{item.quantity}</span>
              </div>
              <div className="item-price">
                {item.unitPrice ? item.unitPrice.toLocaleString("vi-VN") : 0}đ
              </div>
            </div>
          ))}
          <div className="success-total-row">
            <span>Tổng cộng</span>
            <span>
              {order.totalAmount
                ? order.totalAmount.toLocaleString("vi-VN")
                : 0}
              đ
            </span>
          </div>
        </div>

        <div className="success-actions">
          <Link to="/" className="btn-home">
            <FiHome /> Về trang chủ
          </Link>
          <Link to="/profile" className="btn-history">
            <FiShoppingBag /> Xem lịch sử đơn hàng
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
