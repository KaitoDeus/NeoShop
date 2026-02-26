import React from 'react';
import { Link } from 'react-router-dom';
import { FiTrendingUp } from 'react-icons/fi';
import { TRENDING_KEYWORDS } from '../../../data/mockProducts';
import './TrendingKeywords.css';

const TrendingKeywords = () => {
  return (
    <section className="trending-keywords-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            <FiTrendingUp style={{ color: '#10b981' }} /> Từ khóa nổi bật
          </h2>

        </div>

        <div className="keywords-wrapper">
          {TRENDING_KEYWORDS.map((item, index) => (
            <Link 
              to={`/category?search=${encodeURIComponent(item.keyword)}`} 
              key={item.id} 
              className="keyword-chip"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <span className="keyword-icon">{item.icon}</span>
              <span className="keyword-text">{item.keyword}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingKeywords;
