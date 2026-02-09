import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import FilterBar from '../../components/sections/FilterBar/FilterBar';
import ProductList from '../../components/sections/ProductList/ProductList';
import { MOCK_PRODUCTS } from '../../data/mockProducts';
import './ProductCategory.css';

const PRODUCTS_PER_LOAD = 8;

const ProductCategory = () => {
  // Trạng thái bộ lọc
  const [filters, setFilters] = useState({
    platforms: [],
    priceRange: [0, 50000000], // 0 - 50 million VND
    features: []
  });

  // Trạng thái sắp xếp & hiển thị
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');
  
  // Trạng thái tải thêm
  const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_LOAD);
  const [isLoading, setIsLoading] = useState(false);

  // Xử lý bộ lọc
  const handleFilterChange = (group, value) => {
    setFilters(prev => ({ ...prev, [group]: value }));
    setVisibleCount(PRODUCTS_PER_LOAD); // Reset khi thay đổi bộ lọc
  };

  const handleResetFilters = () => {
    setFilters({
      platforms: [],
      priceRange: [0, 50000000],
      features: []
    });
    setVisibleCount(PRODUCTS_PER_LOAD);
  };

  // Logic lọc sản phẩm
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(product => {
      // Lọc theo nền tảng
      if (filters.platforms.length > 0) {
        const platformMap = {
          'Steam': 'steam',
          'Xbox Live': 'xbox',
          'PlayStation Network': 'psn',
          'Epic Games': 'other'
        };
        const selectedPlatforms = filters.platforms.map(p => platformMap[p]);
        if (!selectedPlatforms.includes(product.platform)) return false;
      }

      // Lọc theo giá (Convert USD to VND for comparison)
      const priceVND = product.price * 25000;
      if (priceVND < filters.priceRange[0] || priceVND > filters.priceRange[1]) {
        return false;
      }

      // Lọc theo tính năng
      if (filters.features.length > 0) {
        const featureMap = {
          'Instant Delivery': 'instant',
          'Subscription': 'subscription',
          'Global Key': 'global',
          'Pre-order': 'preorder'
        };
        const selectedFeatures = filters.features.map(f => featureMap[f]);
        if (!product.features) return false;
        
        const hasFeature = selectedFeatures.some(f => product.features.includes(f));
        if (!hasFeature) return false;
      }

      return true;
    });
  }, [filters]);

  // Logic sắp xếp
  const sortedProducts = useMemo(() => {
    const products = [...filteredProducts];
    switch (sortBy) {
      case 'price_asc':
        return products.sort((a, b) => a.price - b.price);
      case 'price_desc':
        return products.sort((a, b) => b.price - a.price);
      case 'newest':
        return products.sort((a, b) => new Date(b.date) - new Date(a.date));
      case 'best_sellers':
        return products.sort((a, b) => (b.sales || 0) - (a.sales || 0));
      case 'popular':
      default:
        return products;
    }
  }, [filteredProducts, sortBy]);

  // Sản phẩm hiển thị
  const visibleProducts = useMemo(() => {
    return sortedProducts.slice(0, visibleCount);
  }, [sortedProducts, visibleCount]);

  // Còn sản phẩm chưa hiển thị
  const hasMore = visibleCount < sortedProducts.length;

  // Xử lý tải thêm
  const handleLoadMore = () => {
    setIsLoading(true);
    // Giả lập độ trễ tải
    setTimeout(() => {
      setVisibleCount(prev => prev + PRODUCTS_PER_LOAD);
      setIsLoading(false);
    }, 500);
  };

  // Xử lý thay đổi sắp xếp
  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setVisibleCount(PRODUCTS_PER_LOAD); // Reset số lượng hiển thị khi thay đổi sắp xếp
  };

  return (
    <div className="category-page container">
      {/* Breadcrumbs */}
      <div className="breadcrumb">
        <Link to="/">Trang chủ</Link> <span>/</span> <span style={{ color: '#0f172a', fontWeight: '500' }}>Tất cả sản phẩm</span>
      </div>

      {/* Header */}
      <div className="category-header">
        <h1 className="category-title">Tìm kiếm sản phẩm</h1>
      </div>

      {/* Filter Bar */}
      <FilterBar 
        filters={filters} 
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        sortBy={sortBy}
        onSortChange={handleSortChange}
      />

      {/* Product List */}
      <section className="product-content">
        <ProductList 
          products={visibleProducts}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          viewMode={viewMode}
          onViewChange={setViewMode}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
          totalProducts={sortedProducts.length}
          isLoading={isLoading}
        />
      </section>
    </div>
  );
};

export default ProductCategory;
