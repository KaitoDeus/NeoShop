import { NavLink, Link } from "react-router-dom";
import {
  FiGrid,
  FiBox,
  FiShoppingCart,
  FiKey,
  FiUsers,
  FiBarChart2,
  FiSettings,
  FiLogOut,
  FiHome,
  FiMessageSquare,
} from "react-icons/fi";
import Logo from "../../common/Logo/Logo";
import "./Sidebar.css";

const Sidebar = () => {
  // Cấu hình các mục menu điều hướng
  const menuItems = [
    { path: "/admin/dashboard", name: "Tổng quan", icon: <FiGrid /> },
    { path: "/admin/orders", name: "Đơn hàng", icon: <FiShoppingCart /> },
    { path: "/admin/products", name: "Sản phẩm", icon: <FiBox /> },
    { path: "/admin/categories", name: "Danh mục", icon: <FiGrid /> },
    { path: "/admin/keys", name: "Kho Key", icon: <FiKey /> },
    { path: "/admin/coupons", name: "Mã giảm giá", icon: <FiShoppingCart /> },
    { path: "/admin/messages", name: "Tin nhắn", icon: <FiMessageSquare /> },
    { path: "/admin/users", name: "Người dùng", icon: <FiUsers /> },
    { path: "/admin/stats", name: "Thống kê", icon: <FiBarChart2 /> },
    { path: "/admin/settings", name: "Cấu hình", icon: <FiSettings /> },
  ];

  // Render Sidebar Admin
  return (
    <aside className="admin-sidebar">
      {/* Header của Sidebar */}
      <div className="sidebar-header">
        <div className="logo-area">
          <Logo disableLink={true} />
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: "700",
              color: "#2563eb",
              background: "#dbeafe",
              padding: "2px 8px",
              borderRadius: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Admin
          </span>
        </div>
      </div>

      {/* Menu điều hướng chính */}
      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer Sidebar (Thông tin Admin & Nút thoát) */}
      <div className="sidebar-footer">
        <Link
          to="/"
          className="nav-link"
          style={{
            marginBottom: "1rem",
            border: "1px solid #f1f5f9",
            justifyContent: "center",
          }}
        >
          <span className="nav-icon">
            <FiHome />
          </span>
          <span className="nav-text">Về trang chủ</span>
        </Link>

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
