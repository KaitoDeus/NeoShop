import React, { useState, useEffect } from "react";
import { FiChevronDown, FiRotateCcw } from "react-icons/fi";
import "./FilterBar.css";
import "./FilterBarSlider.css";

const FilterBar = ({
  categories = [],
  filters,
  onFilterChange,
  onReset,
  sortBy,
  onSortChange,
  onFilterSubmit,
}) => {
  // Use range values [0, 50,000,000]
  const [minPrice, setMinPrice] = useState(filters.priceRange[0] ?? 0);
  const [maxPrice, setMaxPrice] = useState(filters.priceRange[1] ?? 50000000);

  // Sync with props when changed externally (e.g. reset)
  useEffect(() => {
    setMinPrice(filters.priceRange[0] ?? 0);
    setMaxPrice(filters.priceRange[1] ?? 50000000);
  }, [filters.priceRange]);

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    onFilterChange("categoryId", val === "all" ? "" : val);
  };

  const handleFeatureChange = (e) => {
    const val = e.target.value;
    onFilterChange("features", val === "all" ? [] : [val]);
  };

  const onMinChange = (e) => {
    const value = Math.min(Number(e.target.value), maxPrice - 500000);
    setMinPrice(value);
    onFilterChange("priceRange", [value, maxPrice]);
  };

  const onMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), minPrice + 500000);
    setMaxPrice(value);
    onFilterChange("priceRange", [minPrice, value]);
  };

  return (
    <div className="filter-bar-container">
      <div className="filter-bar">
        {/* NHÓM 1: Bộ lọc Danh mục & Thể loại */}
        <div className="filter-group-left">
          <div className="filter-item">
            <label>Danh mục</label>
            <div className="select-wrapper">
              <select
                onChange={handleCategoryChange}
                value={filters.categoryId || "all"}
              >
                <option value="all">Tất cả danh mục</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <FiChevronDown className="select-icon" />
            </div>
          </div>

          <div className="filter-item">
            <label>Thể loại</label>
            <div className="select-wrapper">
              <select
                onChange={handleFeatureChange}
                value={filters.features?.[0] || "all"}
              >
                <option value="all">Tất cả thể loại</option>
                <option value="best_seller">Bán chạy</option>
                <option value="new_arrival">Mới về</option>
                <option value="on_sale">Đang giảm giá</option>
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
              <div className="slider-track-wrapper">
                <div className="slider-track"></div>
                <div
                  className="slider-range"
                  style={{
                    left: `${(minPrice / 50000000) * 100}%`,
                    width: `${((maxPrice - minPrice) / 50000000) * 100}%`,
                  }}
                ></div>
                <input
                  type="range"
                  min="0"
                  max="50000000"
                  step="100000"
                  value={minPrice}
                  onChange={onMinChange}
                  className="thumb-input min-thumb"
                  style={{ zIndex: minPrice > 25000000 ? 5 : 4 }}
                />
                <input
                  type="range"
                  min="0"
                  max="50000000"
                  step="100000"
                  value={maxPrice}
                  onChange={onMaxChange}
                  className="thumb-input max-thumb"
                  style={{ zIndex: 4 }}
                />
              </div>

              <div className="price-badges">
                <span className="price-badge">
                  {new Intl.NumberFormat("vi-VN").format(minPrice)} ₫
                </span>
                <span className="price-separator">-</span>
                <span className="price-badge">
                  {new Intl.NumberFormat("vi-VN").format(maxPrice)} ₫
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
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
              >
                <option value="popular">Phổ biến</option>
                <option value="best_sellers">Bán chạy</option>
                <option value="newest">Mới nhất</option>
                <option value="price_asc">Giá: Thấp → Cao</option>
                <option value="price_desc">Giá: Cao → Thấp</option>
              </select>
              <FiChevronDown className="select-icon" />
            </div>
          </div>

          <button
            className="btn-filter-submit"
            onClick={(e) => {
              e.preventDefault();
              onFilterSubmit();
            }}
          >
            Lọc
          </button>

          <button
            className="btn-reset-text"
            onClick={(e) => {
              e.preventDefault();
              onReset();
            }}
            title="Khôi phục bộ lọc"
          >
            <FiRotateCcw />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
