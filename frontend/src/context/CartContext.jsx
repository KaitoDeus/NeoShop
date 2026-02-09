import { createContext, useContext, useState, useEffect } from 'react';

// Tạo Context
const CartContext = createContext();

// Hook để sử dụng Cart Context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart phải được sử dụng trong CartProvider');
  }
  return context;
};

// Provider Component
export const CartProvider = ({ children }) => {
  // Khởi tạo state từ localStorage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('neoshop_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  // Lưu vào localStorage mỗi khi cartItems thay đổi
  useEffect(() => {
    localStorage.setItem('neoshop_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Tính tổng số lượng sản phẩm
  const cartCount = cartItems.reduce((total, item) => total + item.qty, 0);

  // Tính tổng tiền (VNĐ)
  const totalPrice = cartItems.reduce((total, item) => total + (item.priceVND * item.qty), 0);

  // Thêm sản phẩm vào giỏ
  const addToCart = (product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      
      if (existingItem) {
        // Nếu đã có, tăng số lượng
        return prev.map(item =>
          item.id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }
      
      // Nếu chưa có, thêm mới
      const priceVND = Math.round(product.price * 25000);
      return [...prev, {
        id: product.id,
        title: product.title,
        imageColor: product.imageColor,
        platform: product.platform,
        type: product.category === 'subscription' ? 'Subscription' : 'Key kỹ thuật số',
        priceVND,
        qty: 1
      }];
    });
  };

  // Xóa sản phẩm khỏi giỏ
  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  // Cập nhật số lượng
  const updateQuantity = (productId, newQty) => {
    if (newQty < 1) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId
          ? { ...item, qty: newQty }
          : item
      )
    );
  };

  // Xóa toàn bộ giỏ hàng
  const clearCart = () => {
    setCartItems([]);
  };

  // Kiểm tra sản phẩm đã có trong giỏ chưa
  const isInCart = (productId) => {
    return cartItems.some(item => item.id === productId);
  };

  const value = {
    cartItems,
    cartCount,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
