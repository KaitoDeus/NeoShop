import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/common/ProtectedRoute/ProtectedRoute';
import MainLayout from './layouts/MainLayout/MainLayout';
import AdminLayout from './layouts/AdminLayout'; // Import Admin Layout
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
import Dashboard from './pages/Admin/Dashboard/Dashboard'; // Import Dashboard
import Products from './pages/Admin/Products/Products'; // Import Products
import Orders from './pages/Admin/Orders/Orders'; // Import Orders
import Users from './pages/Admin/Users/Users'; // Import Users
import Stats from './pages/Admin/Stats/Stats'; // Import Stats
import Keys from './pages/Admin/Keys/Keys'; // Import Keys
import Coupons from './pages/Admin/Coupons/Coupons'; // Import Coupons
import Categories from './pages/Admin/Categories/Categories'; // Import Categories
import Settings from './pages/Admin/Settings/Settings'; // Re-Import Settings
import './App.css';
import OrderSuccess from './pages/OrderSuccess/OrderSuccess';
import Profile from './pages/Profile/Profile';

// Main App Component

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Admin Routes (Protected) */}
            <Route element={<ProtectedRoute adminOnly={true} />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="products" element={<Products />} />
                <Route path="orders" element={<Orders />} />
                <Route path="keys" element={<Keys />} />
                <Route path="coupons" element={<Coupons />} />
                <Route path="categories" element={<Categories />} />
                <Route path="users" element={<Users />} />
                <Route path="stats" element={<Stats />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Route>

            {/* Ứng dụng chính với Layout */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Auth />} />
              <Route path="profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="category" element={<ProductCategory />} />
              <Route path="product/:id" element={<ProductDetail />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="order-success/:id" element={<OrderSuccess />} />
              <Route path="delivery" element={<Delivery />} />
              {/* Trang Hỗ Trợ */}
              <Route path="help" element={<HelpCenter />} />
              <Route path="activation-guide" element={<ActivationGuide />} />
              <Route path="warranty" element={<WarrantyPolicy />} />
              <Route path="contact" element={<Contact />} />
              {/* Trang Pháp Lý */}
              <Route path="privacy" element={<PrivacyPolicy />} />
              <Route path="terms" element={<Terms />} />
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;


