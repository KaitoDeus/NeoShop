import { useState } from 'react';
import { 
  FiSearch, FiShoppingCart, FiUser, FiCode, 
  FiEye, FiTrendingUp, FiPercent, FiBriefcase, FiCreditCard,
  FiMenu, FiX
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import './Header.css';

const Header = () => {
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };
  
  return (
    <header className="header">
      {/* Header chính */}
      <div className="container main-header">
        {/* Logo */}
        <Link to="/" className="header-logo">
          <FiCode className="logo-icon" style={{ fontSize: '2rem', color: '#2563eb' }} />
          <h1>NeoShop</h1>
        </Link>
        
        {/* Thanh tìm kiếm */}
        <div className="search-container">
           <input type="text" placeholder="Tìm kiếm sản phẩm" className="search-input" />
           <button className="search-btn">
             <FiSearch size={20} />
           </button>
        </div>

        {/* Tài khoản & Giỏ hàng */}
        <div className="header-actions">
           <Link to="/login" className="user-btn">
              <div className="user-icon-circle"><FiUser /></div>
              <span>Đăng nhập / Đăng ký</span>
           </Link>
           
           <Link to="/cart" className="cart-box">
              <FiShoppingCart size={20} />
              <span>Giỏ hàng</span>
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
           </Link>

           {/* Mobile Menu Button */}
           <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
             {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
           </button>
        </div>
      </div>

      {/* Thanh điều hướng - Desktop */}
      <div className="container bottom-nav">
         <ul className="nav-links">
            <li>
               <Link to="#" className="nav-item">
                 <FiEye /> Sản phẩm bạn vừa xem
               </Link>
            </li>
            <li>
               <Link to="/category" className="nav-item">
                 <FiTrendingUp /> Sản phẩm mua nhiều
               </Link>
            </li>
             <li>
               <Link to="/category" className="nav-item">
                 <FiPercent /> Sản phẩm khuyến mại
               </Link>
            </li>
             <li>
               <Link to="#" className="nav-item">
                 <FiBriefcase /> Tuyển dụng
               </Link>
            </li>
             <li>
               <Link to="#" className="nav-item">
                 <FiCreditCard /> Hình thức thanh toán
               </Link>
            </li>
         </ul>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`mobile-nav ${mobileMenuOpen ? 'open' : ''}`}>
        <ul className="mobile-nav-links">
          <li>
            <Link to="#" className="mobile-nav-item" onClick={closeMobileMenu}>
              <FiEye /> Sản phẩm bạn vừa xem
            </Link>
          </li>
          <li>
            <Link to="/category" className="mobile-nav-item" onClick={closeMobileMenu}>
              <FiTrendingUp /> Sản phẩm mua nhiều
            </Link>
          </li>
          <li>
            <Link to="/category" className="mobile-nav-item" onClick={closeMobileMenu}>
              <FiPercent /> Sản phẩm khuyến mại
            </Link>
          </li>
          <li>
            <Link to="#" className="mobile-nav-item" onClick={closeMobileMenu}>
              <FiBriefcase /> Tuyển dụng
            </Link>
          </li>
          <li>
            <Link to="#" className="mobile-nav-item" onClick={closeMobileMenu}>
              <FiCreditCard /> Hình thức thanh toán
            </Link>
          </li>
          <li>
            <Link to="/login" className="mobile-nav-item" onClick={closeMobileMenu}>
              <FiUser /> Đăng nhập / Đăng ký
            </Link>
          </li>
        </ul>
      </div>

      {/* Overlay */}
      {mobileMenuOpen && <div className="mobile-nav-overlay" onClick={closeMobileMenu}></div>}
    </header>
  );
};

export default Header;
