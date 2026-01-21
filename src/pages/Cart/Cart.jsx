import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiZap, FiLock, FiHeadphones, FiArrowLeft, FiKey, FiShoppingBag, FiRotateCcw, FiShield } from 'react-icons/fi';
import { MOCK_PRODUCTS } from '../../data/mockProducts';
import './Cart.css';

// Mock Cart Data (In real app, use Context/Redux)
const INITIAL_CART = [
  {
    ...MOCK_PRODUCTS[0], // Cyberpunk
    qty: 1,
    type: 'Key kỹ thuật số',
    priceVND: 375000 // Fixed for demo
  },
  {
    ...MOCK_PRODUCTS[2], // Xbox Pass
    qty: 1,
    type: 'Subscription',
    priceVND: 625000
  },
  {
    ...MOCK_PRODUCTS[5], // Adobe
    qty: 1,
    type: 'Subscription',
    priceVND: 8725000
  }
];

const Cart = () => {
  const [cartItems, setCartItems] = useState(INITIAL_CART);

  const handleRemove = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((acc, item) => acc + item.priceVND, 0);
  };

  const subtotal = calculateSubtotal();
  const tax = 0; // Digital tax
  const total = subtotal + tax;

  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container empty-cart">
          <FiShoppingBag className="empty-icon" />
          <h2>Giỏ hàng của bạn đang trống</h2>
          <p style={{color: '#64748b'}}>Hãy thêm vài sản phẩm thú vị vào giỏ nhé!</p>
          <Link to="/category" className="btn-checkout" style={{maxWidth: '250px', margin: '2rem auto'}}>
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
          <h1 className="cart-title">Giỏ hàng của bạn ({cartItems.length} sản phẩm)</h1>
          <p className="cart-subtitle">Kiểm tra lại các sản phẩm số trước khi tiến hành thanh toán an toàn.</p>
        </div>

        <div className="cart-layout">
          {/* LEFT COLUMN: Cart Items */}
          <div className="cart-items-list">
            {cartItems.map(item => (
              <CartItem key={item.id} item={item} onRemove={handleRemove} />
            ))}
            
            <Link to="/category" className="back-link">
              <FiArrowLeft /> Tiếp tục mua sắm
            </Link>
          </div>

          {/* RIGHT COLUMN: Summary */}
          <div className="cart-summary">
            <h3 className="summary-title">Tóm tắt đơn hàng</h3>
            
            <div className="summary-row">
              <span>Tạm tính</span>
              <span>{subtotal.toLocaleString('vi-VN')}₫</span>
            </div>
            <div className="summary-row">
              <span>Giảm giá</span>
              <span style={{color: '#10b981'}}>-0₫</span>
            </div>
            <div className="summary-row">
              <span>Thuế (Sản phẩm số)</span>
              <span>0₫</span>
            </div>
            
            <div className="summary-row total">
              <span>Tổng thanh toán</span>
              <span className="summary-total-price">{total.toLocaleString('vi-VN')}₫</span>
            </div>

            <div className="promo-box">
               <input type="text" className="promo-input" placeholder="Nhập mã khuyến mãi NeoShop" />
               <button className="btn-apply">ÁP DỤNG</button>
            </div>

            <button className="btn-checkout" onClick={handleCheckout}>
               <FiLock /> Thanh toán với NeoShop
            </button>
            
            <p className="checkout-note">
               Mã sản phẩm sẽ được gửi tự động qua email của bạn ngay sau khi thanh toán thành công.
            </p>

            <div className="trust-badges">
               <div className="trust-item">
                  <FiZap className="trust-icon" />
                  <span>Giao ngay</span>
               </div>
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

// Sub-component: Cart Item
const CartItem = ({ item, onRemove }) => {
  const navigate = useNavigate();

  const handleItemClick = () => {
    navigate(`/product/${item.id}`);
  };

  return (
    <div className="cart-item">
      {/* Visual */}
      <div 
        className="item-visual" 
        style={{background: item.imageColor || '#333', cursor: 'pointer'}}
        onClick={handleItemClick}
      >
         {/* Fallback to simple icon if no image */}
         {!item.thumbnail && <FiKey style={{opacity: 0.5}} />}
      </div>

      {/* Content */}
      <div className="item-content">
         <div>
            <div className="item-header">
               <h3 
                  className="item-name" 
                  style={{cursor: 'pointer'}}
                  onClick={handleItemClick}
               >
                 {item.title}
               </h3>
               <div className="item-price">
                  {item.priceVND.toLocaleString('vi-VN')}₫
               </div>
            </div>
            
            <div className="item-badges">
               <span className="badge-platform">{item.platform === 'steam' ? 'Steam' : item.platform}</span>
               <span className="badge-instant"><FiZap size={12}/> Giao ngay</span>
            </div>
         </div>

         <div className="item-meta">
            <div className="meta-left">
               <span style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                   {item.type === 'Subscription' ? <FiRotateCcw size={14} /> : <FiKey size={14} />} 
                   {item.type}
               </span>
               <span>Qty: {item.qty}</span>
            </div>
            <button className="remove-btn" onClick={() => onRemove(item.id)}>
               <FiTrash2 /> Xóa
            </button>
         </div>
      </div>
    </div>
  );
};

export default Cart;
