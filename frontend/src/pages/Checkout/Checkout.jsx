import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiMail, FiCheck, FiCpu, FiCreditCard, FiGlobe, 
  FiCopy, FiAlertTriangle, FiArrowRight, FiZap, 
  FiShield, FiLifeBuoy, FiInfo, FiSmartphone, FiLoader
} from 'react-icons/fi';
import { FaBitcoin, FaWallet } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import orderService from '../../services/orderService';
import couponService from '../../services/couponService';
import './Checkout.css';

const Checkout = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState('crypto');
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
        const result = await couponService.validateCoupon(couponCode, totalPrice);
        if (result.valid) {
            setDiscountAmount(result.discountAmount);
            alert(`Áp dụng mã thành công! Giảm ${result.discountAmount.toLocaleString('vi-VN')}₫`);
        }
    } catch (error) {
        console.error(error);
        alert('Mã giảm giá không hợp lệ hoặc không đủ điều kiện.');
        setDiscountAmount(0);
    }
  };

  const handleComplete = async () => {
    if (!user) {
        if (window.confirm("Bạn cần đăng nhập để thanh toán. Đi tới trang đăng nhập?")) {
            navigate('/login');
        }
        return;
    }

    setIsProcessing(true);
    try {
        const orderRequest = {
            paymentMethod: paymentMethod.toUpperCase(),
            shippingAddress: user.email, // Sản phẩm số gửi qua email
            couponCode: couponCode || null,
            items: cartItems.map(item => ({
                productId: item.id,
                quantity: item.qty || 1
            }))
        };

        // 1. Tạo đơn hàng
        const orderResponse = await orderService.createOrder(orderRequest);
        
        // 2. Giả lập xử lý thanh toán (UX delay)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // 3. Xóa giỏ hàng và chuyển hướng
        clearCart();
        alert("Đặt hàng thành công! Mã đơn hàng: " + orderResponse.id);
        navigate('/'); // Tạm thời về trang chủ, sau này sẽ là trang Order Success
    } catch (error) {
        console.error("Order failed", error);
        alert("Đặt hàng thất bại: " + (error.response?.data?.message || "Lỗi kết nối server"));
    } finally {
        setIsProcessing(false);
    }
  };

  const finalPrice = Math.max(0, totalPrice - discountAmount);

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
              <h3 className="section-title"><FiMail /> Email nhận hàng</h3>
              <p style={{color: '#64748b', fontSize: '0.9rem', marginBottom: '1rem'}}>
                Mã sản phẩm kỹ thuật số sẽ được gửi tới đây ngay lập tức sau khi thanh toán.
              </p>
              <div className="email-box">
                <div className="email-icon-wrapper"><FiMail /></div>
                <div className="email-input-wrapper">
                  <span className="email-label">EMAIL CỦA BẠN</span>
                  <input 
                    type="email" 
                    className="email-value" 
                    value={user?.email || ''}
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
              <div className="methods-grid">
                <div 
                  className={`method-card ${paymentMethod === 'crypto' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('crypto')}
                >
                  <div className="method-icon-box"><FaBitcoin /></div>
                  <span className="method-name">Crypto</span>
                  <span className="method-extra discount">-5% Giảm giá</span>
                  <FiCheck className="method-select-badge" />
                </div>
                
                <div 
                  className={`method-card ${paymentMethod === 'card' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <div className="method-icon-box"><FiCreditCard /></div>
                  <span className="method-name">Thẻ tín dụng</span>
                  <span className="method-extra">Tức thì</span>
                  <FiCheck className="method-select-badge" />
                </div>

                <div 
                  className={`method-card ${paymentMethod === 'wallet' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('wallet')}
                >
                  <div className="method-icon-box"><FaWallet /></div>
                  <span className="method-name">Ví điện tử</span>
                  <span className="method-extra">Momo / ZaloPay</span>
                  <FiCheck className="method-select-badge" />
                </div>
              </div>
            </div>

            {/* 3. Payment Details (Mock Display) */}
            {paymentMethod === 'crypto' && (
              <div className="checkout-section">
                <div className="transfer-header">
                  <h3 className="section-title" style={{marginBottom: 0}}>Chi tiết chuyển khoản</h3>
                  <div className="network-tabs">
                    <span className="network-tab active">USDT</span>
                    <span className="network-tab">ERC20</span>
                  </div>
                </div>

                <div className="transfer-content">
                  <div className="qr-code-box">
                    <div className="qr-placeholder" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '0.8rem'}}>QR CODE</div>
                  </div>
                  
                  <div className="transfer-amounts">
                    <div className="amount-group">
                      <span className="amount-label">TỔNG SỐ TIỀN</span>
                      <div className="amount-value-row">
                        <span className="amount-value">{finalPrice.toLocaleString('vi-VN')} ₫</span>
                        <button className="copy-btn"><FiCopy /> Sao chép</button>
                      </div>
                    </div>

                    <div className="amount-group">
                      <span className="amount-label">ĐỊA CHỈ VÍ</span>
                      <div className="address-group">
                        <span className="wallet-address">0x71C7656EC7ab88b098defB751B7401B5f6d8976F</span>
                        <button className="copy-btn"><FiCopy /></button>
                      </div>
                    </div>

                    <div className="warning-note">
                      <FiAlertTriangle /> Chỉ gửi USDT qua mạng Ethereum (ERC20).
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Other methods placeholder... */}
          </div>

          {/* Sidebar Summary */}
          <div className="checkout-sidebar">
            <div className="checkout-summary-card">
              <h3 className="summary-title">Tóm tắt đơn hàng</h3>
              
              <div className="summary-items-container">
                 {cartItems.map(item => (
                    <div className="summary-item-card" key={item.id}>
                      <div 
                        className="item-thumb" 
                        style={{background: item.imageColor || 'linear-gradient(135deg, #2563eb, #06b6d4)'}}
                      ></div>
                      <div className="item-info-mini">
                        <h4 style={{fontSize: '0.9rem', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '150px'}}>{item.title}</h4>
                        <div className="item-tags" style={{marginTop: '4px'}}>
                          <span className="tag-available" style={{fontSize: '0.7rem', padding: '2px 6px'}}>x{item.qty}</span>
                          <span style={{fontSize: '0.85rem', fontWeight: 'bold'}}>{(item.price * item.qty).toLocaleString('vi-VN')}₫</span>
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
                <button className="mini-apply-btn" onClick={handleApplyCoupon}>ÁP DỤNG</button>
              </div>

              <div className="summary-details">
                <div className="summary-line">
                  <span>Tạm tính</span>
                  <span>{totalPrice.toLocaleString('vi-VN')} ₫</span>
                </div>
                {discountAmount > 0 && (
                    <div className="summary-line discount">
                    <span>Mã giảm giá</span>
                    <span>-{discountAmount.toLocaleString('vi-VN')} ₫</span>
                    </div>
                )}
                <div className="summary-line total-due">
                  <span>Tổng cộng</span>
                  <span>{finalPrice.toLocaleString('vi-VN')} ₫</span>
                </div>
              </div>

              <button 
                className="complete-btn" 
                onClick={handleComplete}
                disabled={isProcessing}
                style={{opacity: isProcessing ? 0.7 : 1}}
              >
                {isProcessing ? <><FiLoader className="spin" /> Đang xử lý...</> : <><FiArrowRight /> Hoàn tất thanh toán</>}
              </button>
              
              <p className="terms-note">
                Bằng cách thanh toán, bạn đồng ý với <a href="#">Điều khoản của NeoShop</a>.
              </p>
            </div>

            <div className="activation-banner">
              <div className="activation-icon"><FiInfo /></div>
              <div className="activation-text">
                <h5>Kích hoạt tức thì</h5>
                <p>Mã của bạn sẽ được hiển thị ngay sau khi xác nhận thanh toán thành công.</p>
              </div>
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
