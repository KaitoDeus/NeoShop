import React, { useState } from 'react';
import { FiFilter, FiChevronDown, FiRotateCcw } from 'react-icons/fi';
import './FilterBar.css';
import './FilterBarSlider.css';

const FilterBar = ({ 
  filters, 
  onFilterChange, 
  onReset,
  sortBy,
  onSortChange
}) => {
  const [minPrice, setMinPrice] = useState(filters.priceRange[0] || '');
  const [maxPrice, setMaxPrice] = useState(filters.priceRange[1] || '');

  const handlePriceBlur = () => {
    let min = minPrice === '' ? 0 : Number(minPrice);
    let max = maxPrice === '' ? 50000000 : Number(maxPrice);
    
    // Validate
    if (min < 0) min = 0;
    if (max > 100000000) max = 100000000; // 100 Mil VND limit
    if (min > max) {
       // Swap if inverted (optional UX decision, or just clamp)
       const temp = min;
       min = max;
       max = temp;
    }

    onFilterChange('priceRange', [min, max]);
    setMinPrice(min); // Sync local state
    setMaxPrice(max); // Sync local state
  };

  const handleCategoryChange = (e) => {
    // Mapping: "Danh mục" -> Category or Platform
    // Let's assume "Danh mục" here allows selecting specific categories defined in mockProducts (games, ai, office...)
    // ... (rest of logic)
    
    const val = e.target.value;
    onFilterChange('platforms', val === 'all' ? [] : [val]);
  };

  const handleFeatureChange = (e) => {
      const val = e.target.value;
      onFilterChange('features', val === 'all' ? [] : [val]);
  };

  return (
    <div className="filter-bar-container">
      {/* Title is handled in parent, this is just the bar */}
      
      <div className="filter-bar">
        
        {/* NHÓM 1: Bộ lọc Danh mục & Thể loại */}
        <div className="filter-group-left">
            {/* Lọc theo Danh mục */}
            <div className="filter-item">
                <label>Danh mục</label>
                <div className="select-wrapper">
                    <select 
                        onChange={handleCategoryChange}
                        value={filters.platforms?.[0] || 'all'}
                    >
                        <option value="all">Tất cả</option>
                        <option value="Steam">Steam Game</option>
                        <option value="Xbox Live">Xbox Live</option>
                        <option value="PlayStation Network">PlayStation</option>
                        <option value="Epic Games">Epic Games</option>
                    </select>
                    <FiChevronDown className="select-icon" />
                </div>
            </div>

            {/* Lọc theo Thể loại */}
            <div className="filter-item">
                <label>Thể loại</label>
                 <div className="select-wrapper">
                    <select
                        onChange={handleFeatureChange}
                        value={filters.features?.[0] || 'all'}
                    >
                        <option value="all">Tất cả</option>
                        <option value="Instant Delivery">Giao ngay</option>
                        <option value="Subscription">Gói đăng ký</option>
                        <option value="Global Key">Global Key</option>
                    </select>
                    <FiChevronDown className="select-icon" />
                </div>
            </div>
        </div>

        {/* NHÓM 2: Thanh trượt giá */}
        <div className="filter-group-center">
            <div className="price-filter-item">
                <div className="price-header">
                    <label>Mức giá</label>
                </div>
                
                <div className="range-slider-compact">
                    {/* Thanh trượt & Nút kéo */}
                    <div className="slider-track-wrapper">
                        <div className="slider-track"></div>
                        <div 
                            className="slider-range"
                            style={{
                                left: `${(Number(minPrice) / 50000000) * 100}%`,
                                width: `${((Number(maxPrice) - Number(minPrice)) / 50000000) * 100}%`
                            }}
                        ></div>
                        {/* Nút kéo giá thấp nhất (Min) */}
                        <input 
                            type="range"
                            min="0"
                            max="50000000"
                            step="100000"
                            value={minPrice === '' ? 0 : minPrice}
                            onChange={(e) => {
                                const val = Math.min(Number(e.target.value), (maxPrice === '' ? 50000000 : maxPrice) - 100000);
                                setMinPrice(val);
                            }}
                            onMouseUp={() => onFilterChange('priceRange', [Number(minPrice), Number(maxPrice)])}
                            onTouchEnd={() => onFilterChange('priceRange', [Number(minPrice), Number(maxPrice)])}
                            className="thumb-input"
                            style={{ zIndex: minPrice > 45000000 ? 5 : 3 }}
                        />
                        {/* Nút kéo giá cao nhất (Max) */}
                        <input 
                            type="range" 
                            min="0"
                            max="50000000"
                            step="100000"
                            value={maxPrice === '' ? 50000000 : maxPrice}
                            onChange={(e) => {
                                const val = Math.max(Number(e.target.value), (minPrice === '' ? 0 : minPrice) + 100000);
                                setMaxPrice(val);
                            }}
                            onMouseUp={() => onFilterChange('priceRange', [Number(minPrice), Number(maxPrice)])}
                            onTouchEnd={() => onFilterChange('priceRange', [Number(minPrice), Number(maxPrice)])}
                            className="thumb-input"
                            style={{ zIndex: 4 }}
                        />
                    </div>

                    {/* Hiển thị giá trị (Chỉ đọc) */}
                    <div className="price-badges">
                        <span className="price-badge">
                            {new Intl.NumberFormat('vi-VN').format(minPrice === '' ? 0 : minPrice)} ₫
                        </span>
                        <span className="price-separator">-</span>
                        <span className="price-badge">
                            {new Intl.NumberFormat('vi-VN').format(maxPrice === '' ? 50000000 : maxPrice)} ₫
                        </span>
                    </div>
                </div>
            </div>
        </div>

        {/* NHÓM 3: Sắp xếp & Thao tác */}
        <div className="filter-group-right">
             <div className="filter-item filter-item-sort">
                <label>Sắp xếp</label>
                 <div className="select-wrapper">
                    <select value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
                        <option value="popular">Phổ biến</option>
                        <option value="best_sellers">Bán chạy</option>
                        <option value="newest">Mới nhất</option>
                        <option value="price_asc">Giá: Thấp → Cao</option>
                        <option value="price_desc">Giá: Cao → Thấp</option>
                    </select>
                    <FiChevronDown className="select-icon" />
                </div>
            </div>

            <button className="btn-filter-submit">
                Lọc
            </button>

            {/* Nút khôi phục bộ lọc */}
            <button className="btn-reset-text" onClick={() => {
                setMinPrice('');
                setMaxPrice('');
                onReset();
            }} title="Khôi phục bộ lọc">
                <FiRotateCcw /> 
            </button>
        </div>

      </div>
    </div>
  );
};

export default FilterBar;
