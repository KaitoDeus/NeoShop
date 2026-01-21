import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout/MainLayout';
import Home from './pages/Home/Home';
import ProductCategory from './pages/ProductCategory/ProductCategory';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import Cart from './pages/Cart/Cart';
import Checkout from './pages/Checkout/Checkout';
import Delivery from './pages/Delivery/Delivery';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="category" element={<ProductCategory />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="delivery" element={<Delivery />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
