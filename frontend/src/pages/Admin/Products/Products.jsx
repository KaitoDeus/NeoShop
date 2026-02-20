import { 
  FiPlus, FiSearch, FiFilter, FiEdit2, FiTrash2, 
  FiMoreVertical, FiKey, FiChevronLeft, FiChevronRight 
} from 'react-icons/fi';
import { useState, useEffect } from 'react';
import StatsCard from '../../../components/admin/Dashboard/StatsCard';
import { productStats } from '../../../data/adminMockData'; // Keep mock stats for now
import productService from '../../../services/productService';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProductsAdmin(page, 10);
      setProducts(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

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
              {/* Add dynamic categories later */}
            </select>
            <select className="filter-select">
              <option>Tất cả trạng thái</option>
              {/* Add dynamic statuses later */}
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
            {loading ? (
                <tr><td colSpan="7" style={{textAlign: 'center', padding: '2rem'}}>Đang tải dữ liệu...</td></tr>
            ) : products.length === 0 ? (
                <tr><td colSpan="7" style={{textAlign: 'center', padding: '2rem'}}>Không có sản phẩm nào.</td></tr>
            ) : (
                products.map(product => (
                  <tr key={product.id}>
                    <td className="checkbox-cell">
                      <input type="checkbox" className="custom-checkbox" />
                    </td>
                    <td>
                      <div className="product-cell">
                        <img src={'https://via.placeholder.com/50'} alt="" className="product-thumb" loading="lazy" />
                        <div className="product-info">
                          <h4>{product.title}</h4>
                          <span className="product-sku">SKU: {product.id.substring(0, 8)}</span>
                        </div>
                      </div>
                    </td>
                    <td>{product.categoryName || 'Chưa phân loại'}</td>
                    <td className="font-bold text-primary">{(product.salePrice || product.price)?.toLocaleString()} đ</td>
                    <td>
                      {product.stockQuantity === 0 ? (
                        <span className="stock-danger">0 (Hết hàng)</span>
                      ) : product.stockQuantity < 5 ? (
                        <span className="stock-warning">{product.stockQuantity} (Sắp hết)</span>
                      ) : (
                        <span className="stock-ok">{product.stockQuantity}</span>
                      )}
                    </td>
                    <td>
                      <span className={`status-badge ${product.status === 'ACTIVE' || product.status === 'active' ? 'status-active' : 'status-hidden'}`}>
                        <span className="status-dot"></span>
                        {product.status}
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
                ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="table-footer">
          <div className="table-info">
            Hiển thị <span className="font-bold">{products.length > 0 ? page * 10 + 1 : 0}</span> đến <span className="font-bold">{Math.min((page + 1) * 10, totalElements)}</span> trong <span className="font-bold">{totalElements}</span> kết quả
          </div>
          <div className="pagination">
            <button className="page-btn" onClick={() => handlePageChange(page - 1)} disabled={page === 0}><FiChevronLeft /></button>
            {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} className={`page-btn ${page === i ? 'active' : ''}`} onClick={() => handlePageChange(i)}>
                    {i + 1}
                </button>
            )).slice(Math.max(0, page - 2), Math.min(totalPages, page + 3))} 
            <button className="page-btn" onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages - 1}><FiChevronRight /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
