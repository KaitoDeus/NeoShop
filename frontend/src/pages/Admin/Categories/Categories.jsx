import { useState, useEffect } from 'react';
import { 
  FiPlus, FiSearch, FiEdit2, FiTrash2, FiTag, FiFolder, FiChevronRight, FiImage
} from 'react-icons/fi';
import categoryService from '../../../services/categoryService';
import CategoryModal from './CategoryModal';
import './Categories.css';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này? Hãy chắc chắn rằng không còn sản phẩm nào thuộc danh mục này.")) {
      try {
        await categoryService.deleteCategory(id);
        fetchCategories();
      } catch (error) {
        console.error("Failed to delete category:", error);
        alert("Lỗi khi xóa danh mục. Vấn đề có thể do ràng buộc dữ liệu.");
      }
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.id, formData);
      } else {
        await categoryService.createCategory(formData);
      }
      fetchCategories();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save category:", error);
      throw error;
    }
  };

  const getParentName = (parentId) => {
    if (!parentId) return '-';
    const parent = categories.find(c => c.id === parentId);
    return parent ? parent.name : '-';
  };

  const filteredCategories = categories.filter(cat => 
    cat.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.slug?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="categories-page">
      <div className="page-header">
        <div>
          <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>
            Trang chủ / Sản phẩm / Danh mục
          </div>
          <h1 className="page-title">Quản lý Danh mục</h1>
          <p className="page-subtitle">Quản lý các nhóm sản phẩm kỹ thuật số của hệ thống.</p>
        </div>
        <button className="btn-primary" onClick={handleCreate}>
          <FiPlus /> Thêm danh mục mới
        </button>
      </div>

      <div className="products-table-container">
        <div className="filters-bar" style={{ padding: '1rem' }}>
          <div className="search-wrapper" style={{ maxWidth: '400px' }}>
            <FiSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Tìm kiếm danh mục..." 
              className="form-input" 
              style={{ paddingLeft: '2.5rem' }} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: '80px' }}>Icon</th>
              <th>Tên danh mục</th>
              <th>Slug (URL)</th>
              <th>Danh mục cha</th>
              <th style={{ width: '120px', textAlign: 'center' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{textAlign: 'center', padding: '3rem'}}>
                <div className="loading-spinner">Đang tải dữ liệu...</div>
              </td></tr>
            ) : filteredCategories.length === 0 ? (
              <tr><td colSpan="5" style={{textAlign: 'center', padding: '3rem'}}>Không có danh mục nào.</td></tr>
            ) : (
              filteredCategories.map(cat => (
                <tr key={cat.id}>
                  <td>
                    <div className="category-icon-preview">
                       {cat.iconUrl ? <img src={cat.iconUrl} alt="" /> : <FiFolder />}
                    </div>
                  </td>
                  <td>
                    <div className="font-semibold text-primary" style={{ fontSize: '1rem' }}>{cat.name}</div>
                  </td>
                  <td className="text-secondary">
                    <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.85rem' }}>
                      {cat.slug}
                    </code>
                  </td>
                  <td>
                    <span className={`badge ${cat.parentId ? 'badge-info' : 'badge-light'}`}>
                      {getParentName(cat.parentId)}
                    </span>
                  </td>
                  <td>
                    <div className="action-btn-group" style={{ justifyContent: 'center' }}>
                      <button className="btn-icon" title="Sửa" onClick={() => handleEdit(cat)}>
                        <FiEdit2 />
                      </button>
                      <button className="btn-icon text-danger" title="Xóa" onClick={() => handleDelete(cat.id)}>
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>


      {isModalOpen && (
        <CategoryModal 
          category={editingCategory}
          categories={categories}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default Categories;
