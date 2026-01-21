import React, { useState, useMemo } from 'react';
import SidebarFilter from '../../components/sections/SidebarFilter/SidebarFilter';
import ProductList from '../../components/sections/ProductList/ProductList';
import { MOCK_PRODUCTS } from '../../data/mockProducts';
import './ProductCategory.css';

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

  // Filter Handler
  const handleFilterChange = (group, value) => {
    setFilters(prev => ({ ...prev, [group]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      platforms: [],
      priceRange: [0, 1000],
      features: []
    });
  };

  // Filter Logic
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(product => {
      // Platform Filter
      if (filters.platforms.length > 0) {
        // Map UI labels to data values (simple mapping for now)
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
          'Global Key': 'global', // Assuming mock data has this or similar
          'Pre-order': 'preorder'
        };
        // Check if product has ALL selected features (AND logic)
        // Or ANY (OR logic). Usually filters are AND across groups, OR within groups.
        // Let's assume features are tags in data.
        // For simplicity, let's check if product.features includes ANY of selected
        const selectedFeatures = filters.features.map(f => featureMap[f]);
        // Simple check: does product have any of the selected features?
        // Note: Mock data needs 'features' array.
        // If product.features is undefined, skip if filter active
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
      case 'popular':
      default:
        return products; // Mock "popular" as default order
    }
  }, [filteredProducts, sortBy]);

  return (
    <div className="category-page container">
      {/* Breadcrumbs */}
      <div className="breadcrumb">
        Trang chủ <span>/</span> Games <span>/</span> Nhập vai (RPG)
      </div>

      {/* Header */}
      <div className="category-header">
        <h1 className="category-title">
          Game Nhập Vai (RPG)
          <span className="product-count">{sortedProducts.length} sản phẩm</span>
        </h1>
        <p className="category-desc">
          Khám phá thế giới, xây dựng nhân vật và tạo nên câu chuyện của riêng bạn.
          Sản phẩm kỹ thuật số được giao hàng ngay lập tức.
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
            products={sortedProducts}
            sortBy={sortBy}
            onSortChange={setSortBy}
            viewMode={viewMode}
            onViewChange={setViewMode}
          />
        </section>
      </div>
    </div>
  );
};

export default ProductCategory;
