import React from 'react';
import { 
  FiSearch, FiShoppingCart, FiUser, FiCode, 
  FiChevronLeft, FiChevronRight, FiPhone, FiHelpCircle, FiGift,
  FiEye, FiTrendingUp, FiPercent, FiBriefcase, FiCreditCard
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      {/* 2. MAIN HEADER */}
      <div className="container main-header">
        {/* Logo */}
        <Link to="/" className="header-logo">
          <FiCode className="logo-icon" style={{ fontSize: '2rem', color: '#2563eb' }} />
          <h1>NeoShop</h1>
        </Link>
        
        {/* Search Bar */}
        <div className="search-container">
           <input type="text" placeholder="Tìm kiếm sản phẩm" className="search-input" />
           <button className="search-btn">
             <FiSearch size={20} />
           </button>
        </div>

        {/* User & Cart */}
        <div className="header-actions">
           <Link to="/login" className="user-btn">
              <div className="user-icon-circle"><FiUser /></div>
              <span>Đăng nhập / Đăng ký</span>
           </Link>
           
           <Link to="/cart" className="cart-box">
              <FiShoppingCart size={20} />
              <span>Giỏ hàng</span>
              <span className="cart-count">3</span>
           </Link>
        </div>
      </div>

      {/* 3. BOTTOM NAV */}
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
    </header>
  );
};

export default Header;
