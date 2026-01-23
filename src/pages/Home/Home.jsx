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
  const bestSellers = getBestSellers(4);
  const newestProducts = getNewestProducts(4);
  const steamGames = getSteamGames(4);
  const aiProducts = getAIProducts(4);
  const learningProducts = getProductsByCategory('learning');
  const entertainmentProducts = getProductsByCategory('entertainment');
  const officeProducts = getProductsByCategory('office');

  return (
    <div className="home-page">
      <Hero />
      <QuickCategories />
      
      {/* Sản phẩm nổi bật */}
      <FeaturedProducts />
      
      {/* Từ khóa nổi bật */}
      <TrendingKeywords />
      
      {/* Sản phẩm bán chạy nhất */}
      <ProductSection 
        title="Sản phẩm bán chạy nhất"
        icon="🔥"
        subtitle="Top sản phẩm được mua nhiều nhất tuần này"
        products={bestSellers}
        categoryLink="/category?sort=best_sellers"
        bgColor="bg-alt"
      />
      
      {/* Game trên Steam */}
      <ProductSection 
        title="Game trên Steam"
        icon="🎮"
        subtitle="Key game Steam chính hãng giá tốt"
        products={steamGames}
        categoryLink="/category?platform=steam"
      />
      
      {/* Sản phẩm AI */}
      <ProductSection 
        title="Sản phẩm AI"
        icon="🤖"
        subtitle="ChatGPT, Midjourney, Copilot và nhiều công cụ AI khác"
        products={aiProducts}
        categoryLink="/category?category=ai"
        bgColor="bg-alt"
      />
      
      {/* Học tập */}
      {learningProducts.length > 0 && (
        <ProductSection 
          title="Học tập"
          icon="📚"
          subtitle="Khóa học online, ứng dụng học ngôn ngữ"
          products={learningProducts}
          categoryLink="/category?category=learning"
        />
      )}
      
      {/* Giải trí */}
      {entertainmentProducts.length > 0 && (
        <ProductSection 
          title="Giải trí"
          icon="🎬"
          subtitle="Netflix, Spotify và các dịch vụ streaming"
          products={entertainmentProducts}
          categoryLink="/category?category=entertainment"
          bgColor="bg-alt"
        />
      )}
      
      {/* Làm việc */}
      {officeProducts.length > 0 && (
        <ProductSection 
          title="Làm việc"
          icon="💼"
          subtitle="Office 365, Adobe CC, Canva và các công cụ văn phòng"
          products={officeProducts}
          categoryLink="/category?category=office"
        />
      )}
      
      {/* Sản phẩm mới */}
      <ProductSection 
        title="Sản phẩm mới"
        icon="✨"
        subtitle="Vừa được thêm vào cửa hàng"
        products={newestProducts}
        categoryLink="/category?sort=newest"
        bgColor="bg-alt"
      />
    </div>
  );
};

export default Home;
