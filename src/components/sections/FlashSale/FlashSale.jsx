import React from 'react';
import { FiZap, FiShoppingCart, FiArrowRight } from 'react-icons/fi';
import { formatUSDtoVND } from '../../../utils/formatPrice';
import './FlashSale.css';

const products = [
  {
    id: 1,
    name: "Adobe Creative Cloud",
    discount: "-60%",
    price: 24.99,
    oldPrice: 59.99,
    imageColor: "linear-gradient(135deg, #f87171, #ef4444)"
  },
  {
    id: 2,
    name: "Thẻ quà tặng PSN 500K",
    discount: "-40%",
    price: 30.00,
    oldPrice: 50.00,
    imageColor: "linear-gradient(135deg, #60a5fa, #3b82f6)"
  },
  {
    id: 3,
    name: "Spotify Premium 1 Năm",
    discount: "-25%",
    price: 74.25,
    oldPrice: 99.00,
    imageColor: "linear-gradient(135deg, #34d399, #10b981)"
  },
  {
    id: 4,
    name: "Netflix 4K 6 Tháng",
    discount: "-50%",
    price: 60.00,
    oldPrice: 120.00,
    imageColor: "linear-gradient(135deg, #f472b6, #db2777)"
  }
];

const FlashSale = () => {
  return (
    <section className="flash-sale">
      <div className="container">
        <div className="flash-header">
          <div className="flash-title-group">
            <h2 className="flash-title">
              <FiZap style={{ fill: 'orange', color: 'orange' }} /> Flash Sale
            </h2>
            <div className="timer">
              <span>04</span> : <span>23</span> : <span>12</span>
            </div>
          </div>
          <a href="#" className="btn-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
            Xem tất cả <FiArrowRight />
          </a>
        </div>

        <div className="flash-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image" style={{ background: product.imageColor }}>
                <span className="discount-badge">{product.discount}</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                    {product.name.split(' ')[0]}
                </div>
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <div className="delivery-tag">
                  <FiZap size={12} /> Giao ngay
                </div>
                <div className="price-row">
                  <div>
                    <span className="old-price">{formatUSDtoVND(product.oldPrice)}</span>
                    <div className="new-price">{formatUSDtoVND(product.price)}</div>
                  </div>
                  <button className="add-btn">
                    <FiShoppingCart />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FlashSale;
