import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import FilterBar from '../../components/sections/FilterBar/FilterBar';
import ProductList from '../../components/sections/ProductList/ProductList';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import { getProductCover } from '../../utils/imageHelpers';
import './ProductCategory.css';

const PRODUCTS_PER_LOAD = 12;

const ProductCategory = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || '';
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  
  const [filters, setFilters] = useState({
    categoryId: '',
    priceRange: [0, 50000000],
    features: []
  });
  
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  
  // 1. Fetch Categories once
  useEffect(() => {
    let isMounted = true;
    const loadCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();
        if (isMounted) {
          setCategories(data);
          // Auto-select category from URL if present
          if (categoryParam) {
            const matched = data.find(c => c.slug === categoryParam || c.id === categoryParam);
            if (matched) {
              setFilters(prev => ({ ...prev, categoryId: matched.id }));
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    loadCategories();
    return () => { isMounted = false; };
  }, [categoryParam]);

  // Stable trigger for fetching
  const fetchProducts = useCallback(async (currentPage, isReset = false, currentFilters = filters) => {
    setIsLoading(true);
    try {
        const filterParams = {
            query: searchQuery || undefined,
            categoryId: currentFilters.categoryId || undefined,
            minPrice: currentFilters.priceRange[0],
            maxPrice: currentFilters.priceRange[1]
        };

        const data = await productService.getAllProducts(currentPage, PRODUCTS_PER_LOAD, filterParams);
        
        const mappedProducts = data.content.map(p => {
            const effectivePrice = p.salePrice || p.price;
            const originalPrice = p.salePrice ? p.price : (p.price * 1.25);
            const discountPercent = p.salePrice ? Math.round((1 - p.salePrice/p.price)*100) : 0;

            return {
                ...p,
                id: p.id,
                title: p.title,
                desc: p.description,
                price: effectivePrice,
                oldPrice: originalPrice,
                discount: discountPercent > 0 ? `-${discountPercent}%` : null,
                image: getProductCover(p.title),
                tag: p.stockQuantity > 0 ? 'Sẵn hàng' : 'Hết hàng',
                platform: p.categoryName || 'Common'
            };
        });

        setProducts(prev => isReset ? mappedProducts : [...prev, ...mappedProducts]);
        setHasMore(!data.last);
        
    } catch (error) {
        console.error("Failed to fetch products", error);
    } finally {
        setIsLoading(false);
    }
  }, [searchQuery, filters]);

  // Initial Load & URL Parameter Sync
  useEffect(() => {
    setPage(0);
    // Determine the active category ID correctly
    let activeCategoryId = filters.categoryId;
    if (categoryParam && categories.length > 0) {
        const matched = categories.find(c => c.slug === categoryParam || c.id === categoryParam);
        if (matched) activeCategoryId = matched.id;
    }
    
    const initialFilters = { ...filters, categoryId: activeCategoryId };
    fetchProducts(0, true, initialFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, categoryParam, categories.length]); 

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage, false);
  };

  const handleFilterChange = (group, value) => {
    setFilters(prev => ({ ...prev, [group]: value }));
  };

  const handleResetFilters = () => {
    const defaultFilters = { categoryId: '', priceRange: [0, 50000000], features: [] };
    setFilters(defaultFilters);
    setPage(0);
    fetchProducts(0, true, defaultFilters);
  };

  const handleFilterSubmit = () => {
    setPage(0);
    fetchProducts(0, true);
  };
  
  const handleSortChange = (newSort) => {
    setSortBy(newSort);
  };

  return (
    <div className="category-page container">
      <div className="breadcrumb">
        <Link to="/">Trang chủ</Link> <span>/</span> <span style={{ color: '#0f172a', fontWeight: '500' }}>Tất cả sản phẩm</span>
      </div>

      <div className="category-header">
        <h1 className="category-title">Khám phá sản phẩm</h1>
      </div>

      <FilterBar 
        categories={categories}
        filters={filters} 
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        onFilterSubmit={handleFilterSubmit}
        sortBy={sortBy}
        onSortChange={handleSortChange}
      />

      <section className="product-content">
        <ProductList 
          products={products}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          viewMode={viewMode}
          onViewChange={setViewMode}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
          totalProducts={products.length}
          isLoading={isLoading}
        />
      </section>
    </div>
  );
};

export default ProductCategory;
