import { FiSearch, FiBell, FiUser } from 'react-icons/fi';
import './Header.css';

const Header = () => {
  return (
    <header className="admin-header">
      <div className="header-search">
        <FiSearch className="search-icon" />
        <input 
          type="text" 
          placeholder="Tìm kiếm đơn hàng, khách hàng..." 
          className="search-input"
        />
      </div>

      <div className="header-actions">
        <button className="action-btn notification-btn">
          <FiBell size={20} />
          <span className="badge">3</span>
        </button>
        
        <div className="profile-menu">
          <div className="profile-btn">
             <span className="profile-text">Hồ sơ</span>
             <FiUser size={20} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
