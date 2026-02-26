import React, { useState, useEffect } from 'react';
import Hero from '../../components/sections/Hero/Hero';
import QuickCategories from '../../components/sections/QuickCategories/QuickCategories';
import FeaturedProducts from '../../components/sections/FeaturedProducts/FeaturedProducts';
import TrendingKeywords from '../../components/sections/TrendingKeywords/TrendingKeywords';
import ProductSection from '../../components/sections/ProductSection/ProductSection';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import './Home.css';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [steamGames, setSteamGames] = useState([]);
  const [aiOfficeProducts, setAiOfficeProducts] = useState([]);
  const [entertainmentProducts, setEntertainmentProducts] = useState([]);
  const [newestProducts, setNewestProducts] = useState([]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const catData = await categoryService.getAllCategories();
        setCategories(catData);

        // Fetch all products (or a generous page) to filter by category locally for sections
        const productRes = await productService.getAllProducts(0, 50);
        const allProducts = productRes.content || [];
        
        // Map backend product model to frontend expectations
        const mappedProducts = allProducts.map(p => ({
          ...p,
          oldPrice: p.price,
          price: p.salePrice || p.price,
          discount: p.salePrice && p.price > p.salePrice ? `-${Math.round((1 - p.salePrice / p.price) * 100)}%` : null
        }));

        const getProductsBySlugs = (slugs, limit) => {
          const matchingCats = catData.filter(c => slugs.includes(c.slug)).map(c => c.id);
          return mappedProducts.filter(p => p.category && matchingCats.includes(p.category.id)).slice(0, limit);
        };

        const steam = getProductsBySlugs(['game-tren-steam'], 4);
        setSteamGames(steam);

        const aiOffice = getProductsBySlugs(['the-gioi-ai', 'lam-viec'], 4);
        setAiOfficeProducts(aiOffice);

        const entLearn = getProductsBySlugs(['giai-tri', 'hoc-tap'], 4);
        setEntertainmentProducts(entLearn);

        // Define newest as anything not in the above sets, or just newest by some criteria
        const usedIds = [...steam, ...aiOffice, ...entLearn].map(p => p.id);
        const newest = mappedProducts.filter(p => !usedIds.includes(p.id)).slice(0, 4);
        setNewestProducts(newest);

      } catch (err) {
        console.error("Error fetching homepage data:", err);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="home-page">
      <Hero />
      <QuickCategories />
      
      {/* Nổi bật */}
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
          categoryLink="/category?category=game-tren-steam"
          bgColor="bg-alt"
        />
      )}
      
      {/* Sản phẩm AI & Làm việc */}
      {aiOfficeProducts.length > 0 && (
        <ProductSection 
          title="AI & Làm việc"
          icon="🤖"
          subtitle="Các công cụ tăng năng suất và sáng tạo"
          products={aiOfficeProducts}
          categoryLink="/category?category=the-gioi-ai"
        />
      )}
      
      {/* Giải trí & Học tập */}
      {entertainmentProducts.length > 0 && (
        <ProductSection 
          title="Giải trí & Học tập"
          icon="🎬"
          subtitle="Netflix, Spotify, Duolingo, Coursera và hơn thế nữa"
          products={entertainmentProducts}
          categoryLink="/category?category=giai-tri"
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
          categoryLink="/category"
        />
      )}
    </div>
  );
};

export default Home;
