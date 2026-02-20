import React from 'react';
import Hero from '../../components/sections/Hero/Hero';
import QuickCategories from '../../components/sections/QuickCategories/QuickCategories';
import FeaturedProducts from '../../components/sections/FeaturedProducts/FeaturedProducts';
import TrendingKeywords from '../../components/sections/TrendingKeywords/TrendingKeywords';
import ProductSection from '../../components/sections/ProductSection/ProductSection';
import { 
  MOCK_PRODUCTS, 
  getBestSellers, 
  getNewestProducts, 
  getSteamGames, 
  getAIProducts,
  getProductsByCategory 
} from '../../data/mockProducts';
import './Home.css';

const Home = () => {
  // Lấy sản phẩm cho từng section
  // FeaturedProducts tự load getBestSellers(4), nên ta lấy list đó ra để lọc không cho hiển thị lại
  const featured = getBestSellers(4);
  const featuredIds = new Set(featured.map(p => p.id));

  // Hàm helper để lọc các sản phẩm trùng lặp
  const filterUnique = (products, usedIds) => {
    const unique = products.filter(p => !usedIds.has(p.id));
    unique.forEach(p => usedIds.add(p.id)); // Thêm vào set để các section sau không dùng lại
    return unique;
  };

  const trackingIds = new Set(featuredIds);

  const steamGames = filterUnique(getSteamGames(10), trackingIds).slice(0, 4);
  
  // Gộp AI và Tiện ích văn phòng (Làm việc)
  const allAiOffice = [...getAIProducts(8), ...getProductsByCategory('office')];
  const aiProducts = filterUnique(allAiOffice, trackingIds).slice(0, 4);

  // Gộp Giải trí và Học tập
  const allEnterLearn = [...getProductsByCategory('entertainment'), ...getProductsByCategory('learning')];
  const entertainmentProducts = filterUnique(allEnterLearn, trackingIds).slice(0, 4);

  // Sản phẩm mới: Những gì còn lại mới nhất
  const newestProducts = filterUnique(getNewestProducts(12), trackingIds).slice(0, 4);

  return (
    <div className="home-page">
      <Hero />
      <QuickCategories />
      
      {/* Sản phẩm nổi bật (Tự load best sellers) */}
      <FeaturedProducts />
      
      {/* Từ khóa nổi bật */}
      <TrendingKeywords />
      
      {/* Game trên Steam */}
      {steamGames.length > 0 && (
        <ProductSection 
          title="Game trên Steam"
          icon="🎮"
          subtitle="Key game Steam chính hãng giá tốt"
          products={steamGames}
          categoryLink="/category?platform=steam"
          bgColor="bg-alt"
        />
      )}
      
      {/* Sản phẩm AI & Làm việc */}
      {aiProducts.length > 0 && (
        <ProductSection 
          title="AI & Làm việc"
          icon="🤖"
          subtitle="Các công cụ tăng năng suất và sáng tạo"
          products={aiProducts}
          categoryLink="/category?category=ai"
        />
      )}
      
      {/* Giải trí & Học tập */}
      {entertainmentProducts.length > 0 && (
        <ProductSection 
          title="Giải trí & Học tập"
          icon="🎬"
          subtitle="Netflix, Spotify, Duolingo, Coursera và hơn thế nữa"
          products={entertainmentProducts}
          categoryLink="/category?category=entertainment"
          bgColor="bg-alt"
        />
      )}
      
      {/* Sản phẩm mới */}
      {newestProducts.length > 0 && (
        <ProductSection 
          title="Sản phẩm mới"
          icon="✨"
          subtitle="Vừa được cập nhật trên cửa hàng"
          products={newestProducts}
          categoryLink="/category?sort=newest"
        />
      )}
    </div>
  );
};

export default Home;
