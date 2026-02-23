import React, { useState, useEffect } from 'react';
import { FiX, FiSave } from 'react-icons/fi';
import categoryService from '../../../services/categoryService';
import './ProductModal.css';

const ProductModal = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    salePrice: '',
    categoryId: '',
    status: 'ACTIVE'
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    if (product) {
      setFormData({
        title: product.title || '',
        description: product.description || '',
        price: product.price || '',
        salePrice: product.salePrice || '',
        categoryId: product.categoryId || '',
        status: product.status || 'ACTIVE'
      });
    }
  }, [product]);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Failed to save product:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content product-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
          <button className="close-btn" onClick={onClose}><FiX size={24} /></button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Tên sản phẩm *</label>
              <input 
                type="text" 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                required 
                placeholder="Nhập tên sản phẩm..."
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Giá gốc (đ) *</label>
                <input 
                  type="number" 
                  name="price" 
                  value={formData.price} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Giá khuyến mãi (đ)</label>
                <input 
                  type="number" 
                  name="salePrice" 
                  value={formData.salePrice} 
                  onChange={handleChange} 
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Danh mục</label>
                <select name="categoryId" value={formData.categoryId} onChange={handleChange}>
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Trạng thái</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="ACTIVE">Hoạt động</option>
                  <option value="HIDDEN">Tạm ẩn</option>
                  <option value="OUT_OF_STOCK">Hết hàng</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Mô tả</label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                rows="4"
              ></textarea>
            </div>
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn-outline" onClick={onClose}>Hủy</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              <FiSave /> {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
