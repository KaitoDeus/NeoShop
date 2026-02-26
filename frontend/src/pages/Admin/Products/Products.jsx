import { 
  FiPlus, FiSearch, FiFilter, FiEdit2, FiTrash2, 
  FiMoreVertical, FiKey, FiChevronLeft, FiChevronRight 
} from 'react-icons/fi';
import { useState, useEffect } from 'react';
import StatsCard from '../../../components/admin/Dashboard/StatsCard';
import { productStats } from '../../../data/adminMockData'; // Keep mock stats for now
import productService from '../../../services/productService';
import ProductModal from './ProductModal';
import KeyManagementModal from './KeyManagementModal';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  // Search & Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [categories, setCategories] = useState([]);
  
  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [activeProductForKey, setActiveProductForKey] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, [page, filterCategory, filterStatus]);

  useEffect(() => {
    // Fetch categories for filter dropdown
    const fetchCats = async () => {
      try {
        const data = await (await import('../../../services/categoryService')).default.getAllCategories();
        setCategories(data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchCats();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProductsAdmin(page, 10, searchTerm, filterCategory, filterStatus);
      setProducts(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      setPage(0);
      fetchProducts();
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        await productService.deleteProduct(id);
        fetchProducts(); // Refresh list
      } catch (error) {
        console.error("Failed to delete product:", error);
        alert("Lỗi khi xóa sản phẩm.");
      }
    }
  };

  const handleSaveProduct = async (formData) => {
    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, formData);
      } else {
        await productService.createProduct(formData);
      }
      fetchProducts(); // Refresh list after save
    } catch (error) {
      console.error("Failed to save product:", error);
      throw error; // Re-throw to be handled in Modal
    }
  };

  const handleOpenKeyManagement = (product) => {
    setActiveProductForKey(product);
    setIsKeyModalOpen(true);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(products.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Bạn có chắc muốn xóa ${selectedIds.length} sản phẩm đã chọn?`)) {
      try {
        await productService.bulkDeleteProducts(selectedIds);
        setSelectedIds([]);
        fetchProducts();
      } catch (error) {
        console.error(error);
        alert("Lỗi khi xóa hàng loạt.");
      }
    }
  };

  const handleBulkUpdateStatus = async (status) => {
    try {
      await productService.bulkUpdateProductStatus(selectedIds, status);
      setSelectedIds([]);
      fetchProducts();
    } catch (error) {
      console.error(error);
      alert("Lỗi khi cập nhật trạng thái hàng loạt.");
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
        <button className="btn-primary" onClick={handleCreateProduct}>
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
              placeholder="Tìm kiếm theo tên..." 
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleSearchKeyPress}
            />
          </div>
          <div className="filter-group">
            <select 
              className="filter-select" 
              value={filterCategory} 
              onChange={(e) => { setFilterCategory(e.target.value); setPage(0); }}
            >
              <option value="">Tất cả danh mục</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <select 
              className="filter-select" 
              value={filterStatus} 
              onChange={(e) => { setFilterStatus(e.target.value); setPage(0); }}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="ACTIVE">Hoạt động</option>
              <option value="HIDDEN">Tạm ẩn</option>
              <option value="OUT_OF_STOCK">Hết hàng</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedIds.length > 0 && (
          <div className="bulk-actions-bar">
            <span className="selected-count">Đã chọn <strong>{selectedIds.length}</strong> sản phẩm</span>
            <div className="bulk-btns">
              <button className="btn-outline btn-sm" onClick={() => handleBulkUpdateStatus('ACTIVE')}>Hiện sản phẩm</button>
              <button className="btn-outline btn-sm" onClick={() => handleBulkUpdateStatus('HIDDEN')}>Ẩn sản phẩm</button>
              <button className="btn-danger btn-sm" onClick={handleBulkDelete}>
                <FiTrash2 size={14} /> Xóa đã chọn
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <table className="admin-table">
          <thead>
            <tr>
              <th className="checkbox-cell">
                <input 
                  type="checkbox" 
                  className="custom-checkbox" 
                  onChange={handleSelectAll}
                  checked={products.length > 0 && selectedIds.length === products.length}
                />
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
                      <input 
                        type="checkbox" 
                        className="custom-checkbox" 
                        checked={selectedIds.includes(product.id)}
                        onChange={() => handleSelectRow(product.id)}
                      />
                    </td>
                    <td>
                      <div className="product-cell">
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
                        <button 
                          className="btn-icon" 
                          title="Quản lý Key"
                          onClick={() => handleOpenKeyManagement(product)}
                        >
                          <FiKey />
                        </button>
                        <button 
                          className="btn-icon" 
                          title="Chỉnh sửa"
                          onClick={() => handleEditProduct(product)}
                        >
                          <FiEdit2 />
                        </button>
                        <button 
                          className="btn-icon text-danger" 
                          title="Xóa"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
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

      {/* Modals */}
      {isProductModalOpen && (
        <ProductModal 
          product={editingProduct} 
          onClose={() => setIsProductModalOpen(false)} 
          onSave={handleSaveProduct}
        />
      )}

      {isKeyModalOpen && activeProductForKey && (
        <KeyManagementModal 
          productId={activeProductForKey.id} 
          productName={activeProductForKey.title}
          onClose={() => setIsKeyModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default Products;
