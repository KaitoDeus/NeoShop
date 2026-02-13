import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import FilterBar from '../../components/sections/FilterBar/FilterBar';
import ProductList from '../../components/sections/ProductList/ProductList';
import productService from '../../services/productService';
import './ProductCategory.css';

const PRODUCTS_PER_LOAD = 12;

const ProductCategory = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');
  
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  
  // UI States
  const [filters, setFilters] = useState({
    platforms: [],
    priceRange: [0, 50000000],
    features: []
  });
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  
  // Fetch Products Function
  const fetchProducts = async (currentPage, isReset = false) => {
    setIsLoading(true);
    try {
        let data;
        // If searchQuery is present, use search API
        if (searchQuery && searchQuery.trim().length > 0) {
            data = await productService.searchProducts(searchQuery, currentPage, PRODUCTS_PER_LOAD);
        } else {
            data = await productService.getAllProducts(currentPage, PRODUCTS_PER_LOAD);
        }
        
        // Map backend response to legacy frontend format
        const mappedProducts = data.content.map(p => ({
            ...p,
            id: p.id,
            title: p.title,
            desc: p.description, // Mapping description
            price: p.price,
            oldPrice: p.salePrice || (p.price * 1.2), // Mock old price visual
            discount: p.salePrice ? '-' + Math.round((1 - p.salePrice/p.price)*100) + '%' : null,
            imageColor: 'linear-gradient(135deg, #1e1b4b, #312e81)', // Default placeholder
            tag: p.stockQuantity > 0 ? 'Sẵn hàng' : 'Hết hàng',
            platform: p.categoryName || 'steam' 
        }));

        setProducts(prev => isReset ? mappedProducts : [...prev, ...mappedProducts]);
        setHasMore(!data.last);
        
    } catch (error) {
        console.error("Failed to fetch products", error);
    } finally {
        setIsLoading(false);
    }
  };

  // Initial Load & Search Change
  useEffect(() => {
    setPage(0);
    // Note: We don't call setProducts([]) here to avoid flash, handled in fetchProducts
    fetchProducts(0, true);
  }, [searchQuery]); // Re-fetch when search query changes

  // Handle Load More
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage, false);
  };

  // Handlers (Giữ nguyên UI handlers)
  const handleFilterChange = (group, value) => {
    setFilters(prev => ({ ...prev, [group]: value }));
    // Note: Backend filter integration pending
  };

  const handleResetFilters = () => {
    setFilters({ platforms: [], priceRange: [0, 50000000], features: [] });
  };
  
  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    // Note: Backend sort integration pending
  };

  return (
    <div className="category-page container">
      {/* Breadcrumbs */}
      <div className="breadcrumb">
        <Link to="/">Trang chủ</Link> <span>/</span> <span style={{ color: '#0f172a', fontWeight: '500' }}>Tất cả sản phẩm</span>
      </div>

      {/* Header */}
      <div className="category-header">
        <h1 className="category-title">Khám phá sản phẩm</h1>
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
          products={products}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          viewMode={viewMode}
          onViewChange={setViewMode}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
          totalProducts={products.length} // Actually should be data.totalElements for correct count display
          isLoading={isLoading}
        />
      </section>
    </div>
  );
};

export default ProductCategory;
