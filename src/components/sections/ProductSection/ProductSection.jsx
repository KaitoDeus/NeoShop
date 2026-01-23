import { Link } from 'react-router-dom';
import { FiShoppingCart, FiArrowRight, FiZap, FiCheck } from 'react-icons/fi';
import { formatUSDtoVND } from '../../../utils/formatPrice';
import { useCart } from '../../../context/CartContext';
import './ProductSection.css';

const ProductSection = ({ title, icon, subtitle, products, categoryLink, bgColor }) => {
  const { addToCart, isInCart } = useCart();

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <section className={`product-section ${bgColor || ''}`}>
      <div className="container">
        <div className="section-header">
          <div className="header-left">
            <h2 className="section-title">
              <span className="title-icon">{icon}</span> {title}
            </h2>
            {subtitle && <p className="section-subtitle">{subtitle}</p>}
          </div>
          <Link to={categoryLink || '/category'} className="btn-link">
            Xem tất cả <FiArrowRight />
          </Link>
        </div>

        <div className="products-grid">
          {products.map((product) => (
            <Link to={`/product/${product.id}`} key={product.id} className="product-card">
              <div className="card-image" style={{ background: product.imageColor }}>
                {product.discount && <span className="discount-badge">{product.discount}</span>}
                <span className="tag-badge">{product.tag}</span>
              </div>
              <div className="card-content">
                <h3 className="card-title">{product.title}</h3>
                <div className="card-meta">
                  <span className="delivery-tag"><FiZap size={12} /> Giao ngay</span>
                </div>
                <div className="card-footer">
                  <div className="price-box">
                    {product.oldPrice && (
                      <span className="price-old">{formatUSDtoVND(product.oldPrice)}</span>
                    )}
                    <span className="price-new">{formatUSDtoVND(product.price)}</span>
                  </div>
                  <button 
                    className={`cart-btn ${isInCart(product.id) ? 'in-cart' : ''}`}
                    onClick={(e) => handleAddToCart(e, product)}
                  >
                    {isInCart(product.id) ? <FiCheck /> : <FiShoppingCart />}
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

export default ProductSection;
