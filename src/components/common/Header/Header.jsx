import { useState, useEffect } from 'react';
import { 
  FiSearch, FiShoppingCart, FiUser, FiMenu, FiX
} from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { MOCK_PRODUCTS } from '../../../data/mockProducts'; // Import Data
import './Header.css';
import Logo from '../Logo/Logo';

const Header = () => {
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Logic tìm kiếm
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.trim() === '') {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const filtered = MOCK_PRODUCTS.filter(p => 
      p.title.toLowerCase().includes(value.toLowerCase())
    ).slice(0, 5); // Giới hạn 5 kết quả
    
    setSuggestions(filtered);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (id) => {
    navigate(`/product/${id}`);
    setShowSuggestions(false);
    setQuery('');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };
  
  // Logic ẩn Header khi cuộn trang
  const [visible, setVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const isVisible = prevScrollPos > currentScrollPos || currentScrollPos < 10;
      
      setVisible(isVisible);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);
  
  return (
    <header className={`header ${visible ? '' : 'header-hidden'}`}>
      {/* Header chính */}
      <div className="container main-header">
        {/* Logo */}
        <Logo />
        
        {/* Thanh tìm kiếm */}
        <div className="search-container">
           <div className="search-wrapper">
             <input 
               type="text" 
               placeholder="Tìm kiếm sản phẩm" 
               className="search-input"
               value={query}
               onChange={handleSearchChange}
               onFocus={() => query.length > 0 && setShowSuggestions(true)}
               onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
             />
             <button className="search-btn">
               <FiSearch size={20} />
             </button>
           </div>
           
           {/* Gợi ý tìm kiếm */}
           {showSuggestions && query.length > 0 && (
             <div className="search-suggestions">
               {suggestions.length > 0 ? (
                 suggestions.map(product => (
                   <div 
                      key={product.id} 
                      className="suggestion-item"
                      onClick={() => handleSuggestionClick(product.id)}
                   >
                     <img src="https://placehold.co/40" style={{background: product.imageColor, width: 32, height: 32, borderRadius: 4, objectFit: 'cover'}} alt="" />
                     <div className="suggestion-info">
                        <span className="suggest-title">{product.title}</span>
                        <span className="suggest-price">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price * 25000)}</span>
                     </div>
                   </div>
                 ))
               ) : (
                 <div className="no-suggestions">Không tìm thấy sản phẩm</div>
               )}
             </div>
           )}
        </div>

        {/* Tài khoản & Giỏ hàng */}
        <Link to="/login" className="user-btn">
           <div className="user-icon-circle"><FiUser /></div>
           <span>Đăng nhập / Đăng ký</span>
        </Link>
        
        <Link to="/cart" className="cart-box">
           <FiShoppingCart size={20} />
           <span>Giỏ hàng</span>
           {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </Link>

        {/* Nút menu mobile */}
        <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>



      {/* Menu điều hướng mobile */}
      <div className={`mobile-nav ${mobileMenuOpen ? 'open' : ''}`}>
        <ul className="mobile-nav-links">

          <li>
            <Link to="/login" className="mobile-nav-item" onClick={closeMobileMenu}>
              <FiUser /> Đăng nhập / Đăng ký
            </Link>
          </li>
        </ul>
      </div>

      {/* Lớp phủ bóng mờ */}
      {mobileMenuOpen && <div className="mobile-nav-overlay" onClick={closeMobileMenu}></div>}
    </header>
  );
};

export default Header;
