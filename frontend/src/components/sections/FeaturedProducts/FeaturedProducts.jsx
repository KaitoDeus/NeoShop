import React from 'react';
import { Link } from 'react-router-dom';
import { FiStar, FiShoppingCart, FiArrowRight } from 'react-icons/fi';
import { formatUSDtoVND } from '../../../utils/formatPrice';
import { getBestSellers } from '../../../data/mockProducts';
import { getProductCover } from '../../../utils/imageHelpers';
import './FeaturedProducts.css';

const FeaturedProducts = () => {
  const products = getBestSellers(4);

  return (
    <section className="featured-section">
      <div className="container">
        <div className="section-header">
          <div className="header-left">
            <h2 className="section-title">
              <FiStar style={{ fill: '#f59e0b', color: '#f59e0b' }} /> Sản phẩm nổi bật
            </h2>
            <p className="section-subtitle">Được khách hàng đánh giá cao nhất</p>
          </div>
          <Link to="/category" className="btn-link">
            Xem tất cả <FiArrowRight />
          </Link>
        </div>

        <div className="featured-grid">
          {products.map((product) => (
            <Link to={`/product/${product.id}`} key={product.id} className="featured-card">
              <div className="card-image" style={{ background: product.imageColor, position: 'relative', overflow: 'hidden' }}>
                <img 
                  src={getProductCover(product.title)} 
                  alt={product.title} 
                  loading="lazy" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, opacity: 1, zIndex: 0 }} 
                />
                {product.discount && <span className="discount-badge" style={{ zIndex: 1 }}>{product.discount}</span>}
                <span className="featured-badge" style={{ zIndex: 1 }}><FiStar /> Nổi bật</span>
              </div>
              <div className="card-content">
                <span className="card-tag">{product.tag}</span>
                <h3 className="card-title">{product.title}</h3>
                <p className="card-desc">{product.desc}</p>
                <div className="card-footer">
                  <div className="price-box">
                    {product.oldPrice && (
                      <span className="price-old">{formatUSDtoVND(product.oldPrice)}</span>
                    )}
                    <span className="price-new">{formatUSDtoVND(product.price)}</span>
                  </div>
                  <button className="cart-btn">
                    <FiShoppingCart />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
