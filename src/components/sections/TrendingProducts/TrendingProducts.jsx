import React from 'react';
import { FiMonitor, FiDollarSign } from 'react-icons/fi';
import './TrendingProducts.css';

const products = [
  { id: 1, name: "Windows 10 Pro", price: 12.99, tag: "Key OEM", icon: "win" },
  { id: 2, name: "Elden Ring Key", price: 49.99, tag: "Global", icon: "steam" },
  { id: 3, name: "Discord Nitro 1 Năm", price: 45.00, tag: "Gift Link", icon: "discord" },
  { id: 4, name: "Voucher Binance", price: 98.00, tag: "USDT", icon: "crypto" },
  { id: 5, name: "Kaspersky Total", price: 15.99, tag: "3 Thiết bị", icon: "security" },
];

const TrendingProducts = () => {
  return (
    <section className="trending-section">
      <div className="container">
        <h2 className="section-title">Xu Hướng</h2>
        
        <div className="trending-grid">
          {products.map((p) => (
             <div key={p.id} className="trending-card">
               <div className="trending-image-container">
                  <span className="product-tag">{p.tag}</span>
                  {/* Placeholder Icon */}
                  <div style={{ fontSize: '3rem', opacity: 0.5 }}>
                     {p.icon === 'win' && '🪟'}
                     {p.icon === 'steam' && '🎮'}
                     {p.icon === 'discord' && '💬'}
                     {p.icon === 'crypto' && '💰'}
                     {p.icon === 'security' && '🔒'}
                  </div>
               </div>
               <div className="trending-info">
                 <h3 className="trending-name">{p.name}</h3>
                 <div className="trending-meta">
                   <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Giao ngay</span>
                   <span className="trending-price">${p.price}</span>
                 </div>
               </div>
             </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingProducts;
