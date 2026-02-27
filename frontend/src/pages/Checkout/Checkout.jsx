import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiMail,
  FiCheck,
  FiArrowRight,
  FiZap,
  FiShield,
  FiLifeBuoy,
  FiLoader,
  FiKey,
} from "react-icons/fi";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import orderService from "../../services/orderService";
import couponService from "../../services/couponService";
import "./Checkout.css";

const Checkout = () => {
  const { checkedItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState("VNPAY");
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  // Redirect if cart is empty
  useEffect(() => {
    if (!checkedItems || checkedItems.length === 0) {
      navigate("/cart");
    }
  }, [checkedItems, navigate]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const result = await couponService.validateCoupon(couponCode, totalPrice);
      if (result.valid) {
        setDiscountAmount(result.discountAmount);
        alert(
          `Áp dụng mã thành công! Giảm ${result.discountAmount.toLocaleString("vi-VN")}₫`,
        );
      }
    } catch (error) {
      console.error(error);
      alert("Mã giảm giá không hợp lệ hoặc không đủ điều kiện.");
      setDiscountAmount(0);
    }
  };

  const handleComplete = async () => {
    if (!user) {
      if (
        window.confirm(
          "Bạn cần đăng nhập để thanh toán. Đi tới trang đăng nhập?",
        )
      ) {
        navigate("/login");
      }
      return;
    }

    setIsProcessing(true);
    try {
      const orderRequest = {
        paymentMethod: paymentMethod.toUpperCase(),
        shippingAddress: user.email, // Sản phẩm số gửi qua email
        couponCode: couponCode || null,
        items: checkedItems.map((item) => ({
          productId: item.id,
          quantity: item.qty || 1,
        })),
      };

      // 1. Tạo đơn hàng
      const orderResponse = await orderService.createOrder(orderRequest);

      // 3. Xử lý chuyển hướng thanh toán
      if (orderResponse.paymentUrl) {
        window.location.href = orderResponse.paymentUrl;
      } else {
        navigate(`/order/success/${orderResponse.id}`);
      }
    } catch (error) {
      console.error("Order failed", error);
      alert(
        "Đặt hàng thất bại: " +
          (error.response?.data?.message || "Lỗi kết nối server"),
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const finalPrice = React.useMemo(
    () => Math.max(0, totalPrice - discountAmount),
    [totalPrice, discountAmount],
  );

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* Header */}
        <div className="checkout-header">
          <h1 className="checkout-title">Thông tin thanh toán</h1>
          <span className="step-indicator">Bước 2 trên 3</span>
        </div>

        {/* Progress Bar */}
        <div className="progress-container">
          <div className="progress-bar-bg">
            <div className="progress-bar-fill"></div>
          </div>
          <div className="step-labels">
            <span className="step-label">Xác nhận đơn</span>
            <span className="step-label active">Thanh toán</span>
            <span className="step-label">Kích hoạt</span>
          </div>
        </div>

        <div className="checkout-layout">
          {/* Main Content */}
          <div className="checkout-main">
            {/* 1. Delivery Email */}
            <div className="checkout-section">
              <h3 className="section-title">
                <FiMail /> Email nhận hàng
              </h3>
              <p
                style={{
                  color: "#64748b",
                  fontSize: "0.9rem",
                  marginBottom: "1rem",
                }}
              >
                Mã sản phẩm kỹ thuật số sẽ được gửi tới đây ngay lập tức sau khi
                thanh toán.
              </p>
              <div className="email-box">
                <div className="email-icon-wrapper">
                  <FiMail />
                </div>
                <div className="email-input-wrapper">
                  <span className="email-label">EMAIL CỦA BẠN</span>
                  <input
                    type="email"
                    className="email-value"
                    value={user?.email || ""}
                    readOnly
                    placeholder="Vui lòng đăng nhập"
                  />
                </div>
                {user && <FiCheck className="check-icon" />}
              </div>
            </div>

            {/* 2. Select Method */}
            <div className="checkout-section">
              <h3 className="section-title">Chọn phương thức thanh toán</h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "15px",
                  marginBottom: "1.5rem",
                }}
              >
                <div
                  className={`method-card ${paymentMethod === "VNPAY" ? "active" : ""}`}
                  onClick={() => setPaymentMethod("VNPAY")}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "1rem",
                    border: `2px solid ${paymentMethod === "VNPAY" ? "#3b82f6" : "#e2e8f0"}`,
                    borderRadius: "12px",
                    cursor: "pointer",
                    background: paymentMethod === "VNPAY" ? "#eff6ff" : "white",
                    position: "relative",
                  }}
                >
                  <img
                    src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-VNPAY-QR-1.png"
                    alt="VNPay"
                    style={{
                      height: "32px",
                      marginBottom: "8px",
                      objectFit: "contain",
                    }}
                  />
                  <span
                    className="method-name"
                    style={{
                      fontWeight: "500",
                      color: "#334155",
                      textAlign: "center",
                      fontSize: "0.9rem",
                    }}
                  >
                    Thanh toán qua VNPAY
                  </span>
                  <span
                    className="method-extra"
                    style={{ fontSize: "0.75rem", color: "#94a3b8" }}
                  >
                    Quét mã QR / Thẻ ATM
                  </span>
                  {paymentMethod === "VNPAY" && (
                    <FiCheck
                      className="method-select-badge"
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        color: "#3b82f6",
                      }}
                    />
                  )}
                </div>

                <div
                  className={`method-card ${paymentMethod === "MOMO" ? "active" : ""}`}
                  onClick={() => setPaymentMethod("MOMO")}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "1rem",
                    border: `2px solid ${paymentMethod === "MOMO" ? "#3b82f6" : "#e2e8f0"}`,
                    borderRadius: "12px",
                    cursor: "pointer",
                    background: paymentMethod === "MOMO" ? "#eff6ff" : "white",
                    position: "relative",
                  }}
                >
                  <img
                    src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Transparent.png"
                    alt="MoMo"
                    style={{
                      height: "32px",
                      marginBottom: "8px",
                      objectFit: "contain",
                    }}
                  />
                  <span
                    className="method-name"
                    style={{
                      fontWeight: "500",
                      color: "#334155",
                      textAlign: "center",
                      fontSize: "0.9rem",
                    }}
                  >
                    Ví điện tử MoMo
                  </span>
                  <span
                    className="method-extra"
                    style={{ fontSize: "0.75rem", color: "#94a3b8" }}
                  >
                    Thanh toán tiện lợi an toàn
                  </span>
                  {paymentMethod === "MOMO" && (
                    <FiCheck
                      className="method-select-badge"
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        color: "#3b82f6",
                      }}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Other methods placeholder... */}
          </div>

          {/* Sidebar Summary */}
          <div className="checkout-sidebar">
            <div className="checkout-summary-card">
              <h3
                className="summary-title"
                style={{
                  fontSize: "1.1rem",
                  borderBottom: "1px solid #e2e8f0",
                  paddingBottom: "1rem",
                  marginBottom: "1rem",
                }}
              >
                Tóm tắt đơn hàng
              </h3>

              <div
                className="summary-items-container"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  marginBottom: "1.5rem",
                }}
              >
                {checkedItems.map((item) => (
                  <div
                    className="summary-item-card"
                    key={item.id}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "12px",
                      alignItems: "center",
                    }}
                  >
                    <div className="item-info-mini" style={{ flexGrow: 1 }}>
                      <h4
                        style={{
                          fontSize: "0.9rem",
                          marginBottom: "4px",
                          fontWeight: "600",
                          color: "#1e293b",
                        }}
                      >
                        {item.title}
                      </h4>
                      <div
                        className="item-tags"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <span
                          className="tag-available"
                          style={{
                            fontSize: "0.75rem",
                            padding: "2px 8px",
                            background: "#e2e8f0",
                            color: "#10b981",
                            borderRadius: "4px",
                            fontWeight: "600",
                          }}
                        >
                          x{item.qty}
                        </span>
                        <span
                          style={{
                            fontSize: "0.9rem",
                            fontWeight: "bold",
                            color: "#0f172a",
                          }}
                        >
                          {(item.priceVND * item.qty).toLocaleString("vi-VN")}₫
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="summary-promo-field">
                <input
                  type="text"
                  placeholder="Nhập mã giảm giá"
                  className="mini-promo-input"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button className="mini-apply-btn" onClick={handleApplyCoupon}>
                  ÁP DỤNG
                </button>
              </div>

              <div className="summary-details">
                <div className="summary-line">
                  <span>Tạm tính</span>
                  <span>{totalPrice.toLocaleString("vi-VN")} ₫</span>
                </div>
                {discountAmount > 0 && (
                  <div className="summary-line discount">
                    <span>Mã giảm giá</span>
                    <span>-{discountAmount.toLocaleString("vi-VN")} ₫</span>
                  </div>
                )}
                <div className="summary-line total-due">
                  <span>Tổng cộng</span>
                  <span>{finalPrice.toLocaleString("vi-VN")} ₫</span>
                </div>
              </div>

              <button
                className="complete-btn"
                onClick={handleComplete}
                disabled={isProcessing}
                style={{ opacity: isProcessing ? 0.7 : 1 }}
              >
                {isProcessing ? (
                  <>
                    <FiLoader className="spin" /> Đang xử lý...
                  </>
                ) : (
                  <>
                    <FiArrowRight /> Hoàn tất thanh toán
                  </>
                )}
              </button>

              <p className="terms-note">
                Bằng cách thanh toán, bạn đồng ý với{" "}
                <a href="#">Điều khoản của NeoShop</a>.
              </p>
            </div>
          </div>
        </div>

        {/* Footer badges */}
        <div className="trust-footer">
          <div className="trust-footer-item">
            <FiZap className="trust-footer-icon" /> Giao hàng ngay
          </div>
          <div className="trust-footer-item">
            <FiShield className="trust-footer-icon" /> Đại lý ủy quyền
          </div>
          <div className="trust-footer-item">
            <FiLifeBuoy className="trust-footer-icon" /> Hỗ trợ 24/7
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
