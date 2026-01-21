import React from 'react';
import Hero from '../../components/sections/Hero/Hero';
import QuickCategories from '../../components/sections/QuickCategories/QuickCategories';
import FlashSale from '../../components/sections/FlashSale/FlashSale';
import TrendingProducts from '../../components/sections/TrendingProducts/TrendingProducts';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <Hero />
      <QuickCategories />
      <FlashSale />
      <TrendingProducts />
    </div>
  );
};

export default Home;
