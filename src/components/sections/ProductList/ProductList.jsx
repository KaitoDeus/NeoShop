import React from 'react';
import { FiGrid, FiList, FiZap, FiShoppingCart, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import './ProductList.css';

const ProductList = ({ products, sortBy, onSortChange, viewMode, onViewChange }) => {
  const navigate = useNavigate();

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  const handleAddToCart = (e, title) => {
    e.stopPropagation();
    alert(`Đã thêm ${title} vào giỏ!`);
  };

  return (
    <div className="product-list-container">
      {/* Sort and View Bar */}
      <div className="sort-bar">
        <div className="sort-options">
          <button 
            className={`sort-btn ${sortBy === 'popular' ? 'active' : ''}`}
            onClick={() => onSortChange('popular')}
          >
            Phổ biến
          </button>
          <button 
            className={`sort-btn ${sortBy === 'newest' ? 'active' : ''}`}
            onClick={() => onSortChange('newest')}
          >
            Mới nhất
          </button>
          <button 
            className={`sort-btn ${sortBy === 'price_asc' ? 'active' : ''}`}
            onClick={() => onSortChange('price_asc')}
          >
            Giá: Thấp đến Cao
          </button>
          <button 
            className={`sort-btn ${sortBy === 'price_desc' ? 'active' : ''}`}
            onClick={() => onSortChange('price_desc')}
          >
            Giá: Cao đến Thấp
          </button>
        </div>
        <div className="view-options">
          <button 
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => onViewChange('grid')}
          >
            <FiGrid />
          </button>
          <button 
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => onViewChange('list')}
          >
            <FiList />
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div className={`product-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
        {products.length > 0 ? (
          products.map((prod) => (
            <div 
                key={prod.id} 
                className="product-card" 
                onClick={() => handleProductClick(prod.id)}
                style={{ cursor: 'pointer' }}
            >
              <div className="card-image" style={{ background: prod.imageColor }}>
                <span className="badge-instant"><FiZap size={10} /> {prod.tag}</span>
                {prod.discount && <span className="badge-sale">{prod.discount}</span>}
              </div>
              <div className="card-content">
                <h3 className="card-title">{prod.title}</h3>
                <p className="card-desc">{prod.desc}</p>
                <div className="card-footer">
                  <div className="price-box">
                    {prod.oldPrice && <span className="price-old">${prod.oldPrice}</span>}
                    <span className="price-new">{prod.price.toLocaleString('us-US', { style: 'currency', currency: 'USD' })}</span>
                  </div>
                  <button className="cart-btn" onClick={(e) => handleAddToCart(e, prod.title)}>
                    <FiShoppingCart />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-products">
            <p>Không tìm thấy sản phẩm nào phù hợp.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button className="page-btn"><FiChevronLeft /></button>
        <button className="page-btn active">1</button>
        <button className="page-btn">2</button>
        <button className="page-btn">3</button>
        <button className="page-btn">...</button>
        <button className="page-btn">12</button>
        <button className="page-btn"><FiChevronRight /></button>
      </div>
    </div>
  );
};

export default ProductList;
