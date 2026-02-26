import React from 'react';
import { FiGrid, FiList, FiZap, FiShoppingCart, FiChevronDown, FiCheck } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { formatUSDtoVND } from '../../../utils/formatPrice';
import { useCart } from '../../../context/CartContext';
import './ProductList.css';

const ProductList = ({ 
  products, 
  sortBy,
  onSortChange,
  viewMode,
  onViewChange,
  hasMore = false,
  onLoadMore,
  totalProducts = 0,
  isLoading = false
}) => {
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div className="product-list-container">
      {/* Sort and View Bar */}
      <div className="sort-bar">

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
              <div className="card-image" style={{ background: prod.imageColor, position: 'relative', overflow: 'hidden' }}>
                <img 
                  src={prod.image || 'https://via.placeholder.com/300?text=No+Image'} 
                  alt={prod.title} 
                  loading="lazy" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, opacity: 1, zIndex: 0 }} 
                />
                {prod.discount && <span className="badge-sale" style={{ zIndex: 1 }}>{prod.discount}</span>}
              </div>
              <div className="card-content">
                <h3 className="card-title">{prod.title}</h3>
                <p className="card-desc">{prod.desc}</p>
                <div className="card-footer">
                  <div className="price-box">
                    {prod.oldPrice && <span className="price-old">{formatUSDtoVND(prod.oldPrice)}</span>}
                    <span className="price-new">{formatUSDtoVND(prod.price)}</span>
                  </div>
                  <button 
                    className={`cart-btn ${isInCart(prod.id) ? 'in-cart' : ''}`} 
                    onClick={(e) => handleAddToCart(e, prod)}
                  >
                    {isInCart(prod.id) ? <FiCheck /> : <FiShoppingCart />}
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

      {/* Load More Button */}
      {hasMore && (
        <div className="load-more-wrapper">
          <button 
            className={`btn-load-more ${isLoading ? 'loading' : ''}`}
            onClick={onLoadMore}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Đang tải...
              </>
            ) : (
              <>
                <FiChevronDown /> Xem thêm sản phẩm
              </>
            )}
          </button>
        </div>
      )}

      {/* All Loaded Message */}
      {!hasMore && products.length > 0 && products.length === totalProducts && (
        <div className="all-loaded">
          Đã hiển thị tất cả sản phẩm
        </div>
      )}
    </div>
  );
};

export default ProductList;
