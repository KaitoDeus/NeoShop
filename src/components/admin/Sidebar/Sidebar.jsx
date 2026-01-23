import { NavLink } from 'react-router-dom';
import { 
  FiGrid, FiBox, FiShoppingCart, FiKey, 
  FiUsers, FiBarChart2, FiSettings, FiLogOut 
} from 'react-icons/fi';
import './Sidebar.css';

const Sidebar = () => {
  const menuItems = [
    { path: '/admin/dashboard', name: 'Tổng quan', icon: <FiGrid /> },
    { path: '/admin/orders', name: 'Đơn hàng', icon: <FiShoppingCart /> },
    { path: '/admin/products', name: 'Sản phẩm', icon: <FiBox /> },
    { path: '/admin/keys', name: 'Kho Key', icon: <FiKey /> },
    { path: '/admin/users', name: 'Khách hàng', icon: <FiUsers /> },
    { path: '/admin/stats', name: 'Thống kê', icon: <FiBarChart2 /> },
    { path: '/admin/settings', name: 'Cấu hình', icon: <FiSettings /> },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <div className="logo-area">
          <div className="logo-icon">NS</div>
          <span className="logo-text">NeoShop Admin</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink 
                to={item.path} 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="admin-profile">
          <img 
            src="https://ui-avatars.com/api/?name=Admin+Neo&background=random" 
            alt="Admin" 
            className="admin-avatar" 
          />
          <div className="admin-info">
            <h4 className="admin-name">Admin Neo</h4>
            <p className="admin-email">admin@neoshop.com</p>
          </div>
        </div>
        
      </div>
    </aside>
  );
};

export default Sidebar;
