import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SidebarFilter from '../../components/sections/SidebarFilter/SidebarFilter';
import ProductList from '../../components/sections/ProductList/ProductList';
import { MOCK_PRODUCTS } from '../../data/mockProducts';
import './ProductCategory.css';

const PRODUCTS_PER_LOAD = 8;

const ProductCategory = () => {
  // Filter State
  const [filters, setFilters] = useState({
    platforms: [],
    priceRange: [0, 1000],
    features: []
  });

  // Sort & View State
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');
  
  // Load More State
  const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_LOAD);
  const [isLoading, setIsLoading] = useState(false);

  // Filter Handler
  const handleFilterChange = (group, value) => {
    setFilters(prev => ({ ...prev, [group]: value }));
    setVisibleCount(PRODUCTS_PER_LOAD); // Reset when filter changes
  };

  const handleResetFilters = () => {
    setFilters({
      platforms: [],
      priceRange: [0, 1000],
      features: []
    });
    setVisibleCount(PRODUCTS_PER_LOAD);
  };

  // Filter Logic
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(product => {
      // Platform Filter
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

      // Price Filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }

      // Feature Filter
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

  // Sort Logic
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

  // Visible Products
  const visibleProducts = useMemo(() => {
    return sortedProducts.slice(0, visibleCount);
  }, [sortedProducts, visibleCount]);

  // Has More Products
  const hasMore = visibleCount < sortedProducts.length;

  // Load More Handler
  const handleLoadMore = () => {
    setIsLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      setVisibleCount(prev => prev + PRODUCTS_PER_LOAD);
      setIsLoading(false);
    }, 500);
  };

  // Handle Sort Change
  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setVisibleCount(PRODUCTS_PER_LOAD); // Reset visible count when sort changes
  };

  return (
    <div className="category-page container">
      {/* Breadcrumbs */}
      <div className="breadcrumb">
        <Link to="/">Trang chủ</Link> <span>/</span> <span style={{ color: '#0f172a', fontWeight: '500' }}>Tất cả sản phẩm</span>
      </div>

      {/* Header */}
      <div className="category-header">
        <h1 className="category-title">Tất cả sản phẩm</h1>
        <p className="category-desc">
          Khám phá hàng ngàn sản phẩm số: Game, phần mềm, subscription và nhiều hơn nữa.
          Giao hàng tức thì qua email.
        </p>
      </div>

      {/* Main Layout */}
      <div className="category-grid-layout">
        <aside className="filter-sidebar-wrapper">
          <SidebarFilter 
            filters={filters} 
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </aside>
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
    </div>
  );
};

export default ProductCategory;
