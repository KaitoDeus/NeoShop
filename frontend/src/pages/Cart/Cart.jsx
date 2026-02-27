import React, { useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiTrash2,
  FiZap,
  FiLock,
  FiHeadphones,
  FiArrowLeft,
  FiKey,
  FiShoppingBag,
  FiRotateCcw,
  FiShield,
  FiPlus,
  FiMinus,
} from "react-icons/fi";
import { useCart } from "../../context/CartContext";
import "./Cart.css";

const Cart = () => {
  const {
    cartItems,
    checkedItems,
    totalPrice,
    removeFromCart,
    updateQuantity,
    toggleItemCheck,
    toggleAllChecks,
    removeCheckedItems,
  } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (checkedItems.length > 0) {
      navigate("/checkout");
    }
  };

  const isAllChecked =
    cartItems.length > 0 && checkedItems.length === cartItems.length;

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container empty-cart">
          <FiShoppingBag className="empty-icon" />
          <h2>Giỏ hàng của bạn đang trống</h2>
          <p style={{ color: "#64748b" }}>
            Hãy thêm vài sản phẩm thú vị vào giỏ nhé!
          </p>
          <Link
            to="/category"
            className="btn-checkout"
            style={{ maxWidth: "250px", margin: "2rem auto" }}
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        {/* Header */}
        <div className="cart-header-section">
          <h1 className="cart-title">
            Giỏ hàng của bạn ({cartItems.length} sản phẩm)
          </h1>
          <p className="cart-subtitle">
            Kiểm tra lại các sản phẩm số trước khi tiến hành thanh toán an toàn.
          </p>
        </div>

        <div className="cart-layout">
          {/* Cột trái: Danh sách sản phẩm */}
          <div className="cart-items-list">
            <div
              className="cart-list-header"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
                background: "white",
                padding: "1rem",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                  color: "#0f172a",
                }}
              >
                <input
                  type="checkbox"
                  checked={isAllChecked}
                  onChange={(e) => toggleAllChecks(e.target.checked)}
                  style={{ width: "18px", height: "18px", cursor: "pointer" }}
                />
                Chọn tất cả ({cartItems.length})
              </label>

              {checkedItems.length > 0 && (
                <button
                  onClick={removeCheckedItems}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#ef4444",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  <FiTrash2 />{" "}
                  {checkedItems.length === cartItems.length
                    ? "Xoá tất cả"
                    : `Xoá ${checkedItems.length} mục đã chọn`}
                </button>
              )}
            </div>

            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onRemove={removeFromCart}
                onUpdateQty={updateQuantity}
                onToggleCheck={toggleItemCheck}
              />
            ))}

            <Link to="/category" className="back-link">
              <FiArrowLeft /> Tiếp tục mua sắm
            </Link>
          </div>

          {/* Cột phải: Tóm tắt đơn hàng */}
          <div className="cart-summary">
            <h3 className="summary-title">Tóm tắt đơn hàng</h3>
            <p
              style={{
                fontSize: "0.85rem",
                color: "#64748b",
                marginBottom: "1rem",
              }}
            >
              Đã chọn {checkedItems.length} sản phẩm
            </p>

            <div className="summary-row">
              <span>Tạm tính</span>
              <span>{totalPrice.toLocaleString("vi-VN")}₫</span>
            </div>
            <div className="summary-row">
              <span>Giảm giá</span>
              <span style={{ color: "#10b981" }}>-0₫</span>
            </div>
            <div className="summary-row">
              <span>Thuế (Sản phẩm số)</span>
              <span>0₫</span>
            </div>

            <div className="summary-row total">
              <span>Tổng thanh toán</span>
              <span className="summary-total-price">
                {totalPrice.toLocaleString("vi-VN")}₫
              </span>
            </div>

            <div className="promo-box">
              <input
                type="text"
                className="promo-input"
                placeholder="Nhập mã khuyến mãi NeoShop"
              />
              <button className="btn-apply">ÁP DỤNG</button>
            </div>

            <button
              className="btn-checkout"
              onClick={handleCheckout}
              disabled={checkedItems.length === 0}
              style={{
                opacity: checkedItems.length === 0 ? 0.5 : 1,
                cursor: checkedItems.length === 0 ? "not-allowed" : "pointer",
              }}
            >
              <FiLock /> Thanh toán với NeoShop
            </button>

            <p className="checkout-note">
              Mã sản phẩm sẽ được gửi tự động qua email của bạn ngay sau khi
              thanh toán thành công.
            </p>

            <div className="trust-badges">
              <div className="trust-item">
                <FiShield className="trust-icon" />
                <span>Bảo mật 100%</span>
              </div>
              <div className="trust-item">
                <FiHeadphones className="trust-icon" />
                <span>Hỗ trợ 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component con: Sản phẩm trong giỏ (Optimized with React.memo)
const CartItem = React.memo(
  ({ item, onRemove, onUpdateQty, onToggleCheck }) => {
    const navigate = useNavigate();

    const handleItemClick = () => {
      navigate(`/product/${item.id}`);
    };

    return (
      <div className="cart-item">
        <div
          className="item-checkbox"
          style={{ display: "flex", alignItems: "center" }}
        >
          <input
            type="checkbox"
            checked={item.isChecked !== false}
            onChange={() => onToggleCheck(item.id)}
            style={{ width: "18px", height: "18px", cursor: "pointer" }}
          />
        </div>

        {/* Nội dung */}
        <div className="item-content">
          <div>
            <div className="item-header">
              <h3
                className="item-name"
                style={{ cursor: "pointer" }}
                onClick={handleItemClick}
              >
                {item.title}
              </h3>
              <div className="item-price">
                {item.priceVND.toLocaleString("vi-VN")}₫
              </div>
            </div>

            <div className="item-badges">
              <span className="badge-platform">
                {item.platform === "steam" ? "Steam" : item.platform}
              </span>
            </div>
          </div>

          <div className="item-meta">
            <div className="meta-left">
              <span
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                {item.type === "Subscription" ? (
                  <FiRotateCcw size={14} />
                ) : (
                  <FiKey size={14} />
                )}
                {item.type}
              </span>
              <div className="qty-control">
                <button
                  className="qty-btn"
                  onClick={() => onUpdateQty(item.id, item.qty - 1)}
                >
                  <FiMinus size={12} />
                </button>
                <span className="qty-value">{item.qty}</span>
                <button
                  className="qty-btn"
                  onClick={() => onUpdateQty(item.id, item.qty + 1)}
                >
                  <FiPlus size={12} />
                </button>
              </div>
            </div>
            <button className="remove-btn" onClick={() => onRemove(item.id)}>
              <FiTrash2 /> Xóa
            </button>
          </div>
        </div>
      </div>
    );
  },
);

export default Cart;
