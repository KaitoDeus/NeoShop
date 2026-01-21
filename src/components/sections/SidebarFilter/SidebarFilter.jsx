import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import './SidebarFilter.css';

const SidebarFilter = ({ filters, onFilterChange, onReset }) => {
  const [collapsed, setCollapsed] = useState({});

  const toggleGroup = (id) => {
    setCollapsed(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCheckboxChange = (group, value) => {
    const currentValues = filters[group] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    onFilterChange(group, newValues);
  };

  const handlePriceChange = (type, value) => {
    const newRange = [...filters.priceRange];
    if (type === 'min') newRange[0] = Number(value);
    if (type === 'max') newRange[1] = Number(value);
    onFilterChange('priceRange', newRange);
  };

  return (
    <aside className="sidebar-filter">
      <div className="filter-header">
        <h3>Bộ Lọc</h3>
        <button className="reset-btn" onClick={onReset}>Đặt lại</button>
      </div>

      {/* Platform Filter */}
      <div className="filter-group">
        <h4 onClick={() => toggleGroup('platform')}>
          Nền tảng {collapsed['platform'] ? <FiChevronDown /> : <FiChevronUp />}
        </h4>
        {!collapsed['platform'] && (
          <div className="checkbox-group">
            {['Steam', 'Xbox Live', 'PlayStation Network', 'Epic Games'].map(platform => (
              <label key={platform} className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={filters.platforms.includes(platform)}
                  onChange={() => handleCheckboxChange('platforms', platform)}
                /> 
                <span>{platform}</span> 
                {/* <span className="count">--</span> */}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="filter-group">
        <h4 onClick={() => toggleGroup('price')}>
          Khoảng giá {collapsed['price'] ? <FiChevronDown /> : <FiChevronUp />}
        </h4>
        {!collapsed['price'] && (
          <>
            <input 
              type="range" 
              min="0" 
              max="1000"
              value={filters.priceRange[1]}
              onChange={(e) => handlePriceChange('max', e.target.value)}
              className="range-slider"
            />
            <div className="price-inputs">
              <input 
                type="number" 
                placeholder="$0" 
                value={filters.priceRange[0]}
                onChange={(e) => handlePriceChange('min', e.target.value)}
                className="price-input" 
              />
              <span>-</span>
              <input 
                type="number" 
                placeholder="$100+" 
                value={filters.priceRange[1]}
                onChange={(e) => handlePriceChange('max', e.target.value)}
                className="price-input" 
              />
            </div>
          </>
        )}
      </div>

      {/* Features */}
      <div className="filter-group">
        <h4 onClick={() => toggleGroup('features')}>
          Tính năng {collapsed['features'] ? <FiChevronDown /> : <FiChevronUp />}
        </h4>
        {!collapsed['features'] && (
          <div className="checkbox-group">
            {[
              { id: 'Instant Delivery', label: 'Giao ngay' },
              { id: 'Subscription', label: 'Gói đăng ký' },
              { id: 'Global Key', label: 'Global Key' }
            ].map(feature => (
              <label key={feature.id} className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={filters.features.includes(feature.id)}
                  onChange={() => handleCheckboxChange('features', feature.id)}
                /> 
                <span>{feature.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default SidebarFilter;
