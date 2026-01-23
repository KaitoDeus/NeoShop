import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiZap, FiLock, FiHeadphones, FiArrowLeft, FiKey, FiShoppingBag, FiRotateCcw, FiShield, FiPlus, FiMinus } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import './Cart.css';

const Cart = () => {
  const { cartItems, totalPrice, removeFromCart, updateQuantity } = useCart();
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
          {/* Cột trái: Danh sách sản phẩm */}
          <div className="cart-items-list">
            {cartItems.map(item => (
              <CartItem 
                key={item.id} 
                item={item} 
                onRemove={removeFromCart}
                onUpdateQty={updateQuantity}
              />
            ))}
            
            <Link to="/category" className="back-link">
              <FiArrowLeft /> Tiếp tục mua sắm
            </Link>
          </div>

          {/* Cột phải: Tóm tắt đơn hàng */}
          <div className="cart-summary">
            <h3 className="summary-title">Tóm tắt đơn hàng</h3>
            
            <div className="summary-row">
              <span>Tạm tính</span>
              <span>{totalPrice.toLocaleString('vi-VN')}₫</span>
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
              <span className="summary-total-price">{totalPrice.toLocaleString('vi-VN')}₫</span>
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

// Component con: Sản phẩm trong giỏ
const CartItem = ({ item, onRemove, onUpdateQty }) => {
  const navigate = useNavigate();

  const handleItemClick = () => {
    navigate(`/product/${item.id}`);
  };

  return (
    <div className="cart-item">
      {/* Hình ảnh */}
      <div 
        className="item-visual" 
        style={{background: item.imageColor || '#333', cursor: 'pointer'}}
        onClick={handleItemClick}
      >
         {!item.thumbnail && <FiKey style={{opacity: 0.5}} />}
      </div>

      {/* Nội dung */}
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
};

export default Cart;
