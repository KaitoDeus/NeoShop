import { useState, useEffect, useRef } from 'react';
import { 
  FiSearch, FiShoppingCart, FiUser, FiMenu, FiX, FiLogOut, FiSettings
} from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import { MOCK_PRODUCTS } from '../../../data/mockProducts'; // Import Data
import './Header.css';
import Logo from '../Logo/Logo';

import productService from '../../../services/productService';
import { getProductCover } from '../../../utils/imageHelpers';

// Debounce helper
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const Header = () => {
  const { cartCount } = useCart();
  const { user, logout, getAvatar } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Logic tìm kiếm
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Effect for fetching suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
        if (!debouncedQuery.trim()) {
            setSuggestions([]);
            return;
        }

        try {
            // Using searchProducts from service
            const data = await productService.searchProducts(debouncedQuery, 0, 5);
            if (data && data.content) {
                // Map backend response to search suggestion format
                const mapped = data.content.map(p => ({
                    id: p.id,
                    title: p.title,
                    price: p.salePrice || p.price,
                    imageCover: getProductCover(p.title)
                }));
                setSuggestions(mapped);
                setShowSuggestions(true);
            }
        } catch (error) {
            console.error("Search error:", error);
        }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
      e.preventDefault(); // Prevent form submission if wrapped
      if (query.trim()) {
          navigate(`/category?search=${encodeURIComponent(query)}`);
          setShowSuggestions(false);
      }
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

  const handleLogout = () => {
    logout();
    closeMobileMenu();
    navigate('/login');
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
               onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit(e)}
               onFocus={() => query.length > 0 && setShowSuggestions(true)}
               onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
             />
             <button className="search-btn" onClick={handleSearchSubmit}>
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
                     <img src={product.imageCover} style={{width: 32, height: 32, borderRadius: 4, objectFit: 'cover'}} alt={product.title} />
                     <div className="suggestion-info">
                        <span className="suggest-title">{product.title}</span>
                        <span className="suggest-price">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}</span>
                     </div>
                   </div>
                 ))
               ) : (
                 <div className="no-suggestions">Không tìm thấy sản phẩm</div>
               )}
             </div>
           )}
        </div>

        {/* Action Group */}
        <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
            {/* Tài khoản */}
            {user ? (
                <div className="user-logged-in" style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <Link to={user.role === 'admin' ? '/admin' : '/profile'} className="user-profile-link" style={{display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#334155', fontWeight: '500'}}>
                        <img 
                            src={getAvatar(user.avatar)} 
                            alt="Avatar" 
                            style={{width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover'}}
                        />
                        <span className="desktop-only" style={{maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                            {user.name}
                        </span>
                    </Link>
                    <button onClick={handleLogout} style={{background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '4px'}} title="Đăng xuất">
                        <FiLogOut size={20} />
                    </button>
                </div>
            ) : (
                <Link to="/login" className="user-btn">
                   <div className="user-icon-circle"><FiUser /></div>
                   <span className="desktop-only">Đăng nhập</span>
                </Link>
            )}
            
            {/* Giỏ hàng */}
            <Link to="/cart" className="cart-box">
               <FiShoppingCart size={20} />
               {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </Link>

            {/* Nút menu mobile */}
            <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
        </div>
      </div>

      {/* Menu điều hướng mobile */}
      <div className={`mobile-nav ${mobileMenuOpen ? 'open' : ''}`}>
        <ul className="mobile-nav-links">
          {user ? (
             <>
                <li>
                    <div className="mobile-user-info" style={{padding: '1rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '10px'}}>
                        <img src={getAvatar(user.avatar)} alt="Avatar" style={{width: '40px', height: '40px', borderRadius: '50%'}} />
                        <div>
                            <div style={{fontWeight: 'bold'}}>{user.name}</div>
                            <div style={{fontSize: '0.8rem', color: '#64748b'}}>{user.email}</div>
                        </div>
                    </div>
                </li>
                <li>
                    <Link to={user.role === 'admin' ? '/admin' : '/profile'} className="mobile-nav-item" onClick={closeMobileMenu}>
                        <FiUser /> {user.role === 'admin' ? 'Trang quản trị' : 'Hồ sơ cá nhân'}
                    </Link>
                </li>
                <li>
                    <button className="mobile-nav-item" onClick={handleLogout} style={{width: '100%', textAlign: 'left', background: 'none', border: 'none', fontSize: '1rem', cursor: 'pointer', color: '#ef4444'}}>
                        <FiLogOut /> Đăng xuất
                    </button>
                </li>
             </>
          ) : (
            <li>
                <Link to="/login" className="mobile-nav-item" onClick={closeMobileMenu}>
                <FiUser /> Đăng nhập / Đăng ký
                </Link>
            </li>
          )}
          <li>
              <Link to="/category" className="mobile-nav-item" onClick={closeMobileMenu}>
                  Danh mục sản phẩm
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
