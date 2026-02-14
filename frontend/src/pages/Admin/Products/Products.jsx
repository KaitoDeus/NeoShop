import { 
  FiPlus, FiSearch, FiFilter, FiEdit2, FiTrash2, 
  FiMoreVertical, FiKey, FiChevronLeft, FiChevronRight 
} from 'react-icons/fi';
import StatsCard from '../../../components/admin/Dashboard/StatsCard';
import { productStats, productsData } from '../../../data/adminMockData';
import './Products.css';

const Products = () => {
  return (
    <div className="products-page">
      {/* 1. Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Sản phẩm</h1>
          <p className="page-subtitle">Quản lý danh sách sản phẩm và kho key số của hệ thống</p>
        </div>
        <button className="btn-primary">
          <FiPlus size={20} />
          Thêm sản phẩm mới
        </button>
      </div>

      {/* 2. Stats Cards */}
      <div className="stats-grid">
        {productStats.map(stat => (
          <StatsCard key={stat.id} {...stat} />
        ))}
      </div>

      {/* 3. Products Table Section */}
      <div className="products-table-container">
        {/* Filters Bar */}
        <div className="filters-bar">
          <div className="search-wrapper">
            <FiSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Tìm kiếm theo tên, SKU..." 
              className="search-input"
            />
          </div>
          <div className="filter-group">
            <select className="filter-select">
              <option>Tất cả danh mục</option>
              <option>Tài khoản</option>
              <option>Game Key</option>
              <option>Phần mềm</option>
            </select>
            <select className="filter-select">
              <option>Tất cả trạng thái</option>
              <option>Hoạt động</option>
              <option>Tạm ẩn</option>
              <option>Hết hàng</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <table className="admin-table">
          <thead>
            <tr>
              <th className="checkbox-cell">
                <input type="checkbox" className="custom-checkbox" />
              </th>
              <th>Sản phẩm</th>
              <th>Danh mục</th>
              <th>Giá bán</th>
              <th>Kho Key</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {productsData.map(product => (
              <tr key={product.id}>
                <td className="checkbox-cell">
                  <input type="checkbox" className="custom-checkbox" />
                </td>
                <td>
                  <div className="product-cell">
                    <img src={product.image} alt="" className="product-thumb" loading="lazy" />
                    <div className="product-info">
                      <h4>{product.name}</h4>
                      <span className="product-sku">SKU: {product.sku}</span>
                    </div>
                  </div>
                </td>
                <td>{product.category}</td>
                <td className="font-bold text-primary">{product.price}</td>
                <td>
                  {product.stock === 0 ? (
                    <span className="stock-danger">0 (Hết hàng)</span>
                  ) : product.stock < 5 ? (
                    <span className="stock-warning">{product.stock} (Sắp hết)</span>
                  ) : (
                    <span className="stock-ok">{product.stock}</span>
                  )}
                </td>
                <td>
                  <span className={`status-badge ${product.status === 'active' ? 'status-active' : 'status-hidden'}`}>
                    <span className="status-dot"></span>
                    {product.status === 'active' ? 'Hoạt động' : 'Tạm ẩn'}
                  </span>
                </td>
                <td>
                  <div className="action-btn-group">
                    <button className="btn-icon" title="Quản lý Key">
                      <FiKey />
                    </button>
                    <button className="btn-icon" title="Chỉnh sửa">
                      <FiEdit2 />
                    </button>
                    <button className="btn-icon" title="Xóa">
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="table-footer">
          <div className="table-info">
            Hiển thị <span className="font-bold">1</span> đến <span className="font-bold">5</span> trong <span className="font-bold">120</span> kết quả
          </div>
          <div className="pagination">
            <button className="page-btn"><FiChevronLeft /></button>
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">3</button>
            <button className="page-btn">...</button>
            <button className="page-btn"><FiChevronRight /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
