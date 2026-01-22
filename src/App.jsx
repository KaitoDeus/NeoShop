import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout/MainLayout';
import Home from './pages/Home/Home';
import ProductCategory from './pages/ProductCategory/ProductCategory';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import Cart from './pages/Cart/Cart';
import Checkout from './pages/Checkout/Checkout';
import Delivery from './pages/Delivery/Delivery';
import HelpCenter from './pages/HelpCenter/HelpCenter';
import ActivationGuide from './pages/ActivationGuide/ActivationGuide';
import WarrantyPolicy from './pages/WarrantyPolicy/WarrantyPolicy';
import Contact from './pages/Contact/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy';
import Terms from './pages/Terms/Terms';
import Auth from './pages/Auth/Auth';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Main App with Layout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Auth />} />
          <Route path="category" element={<ProductCategory />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="delivery" element={<Delivery />} />
          {/* Support Pages */}
          <Route path="help" element={<HelpCenter />} />
          <Route path="activation-guide" element={<ActivationGuide />} />
          <Route path="warranty" element={<WarrantyPolicy />} />
          <Route path="contact" element={<Contact />} />
          {/* Legal Pages */}
          <Route path="privacy" element={<PrivacyPolicy />} />
          <Route path="terms" element={<Terms />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

