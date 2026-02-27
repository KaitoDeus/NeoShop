import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

// Tạo Context
const CartContext = createContext();

// Hook để sử dụng Cart Context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart phải được sử dụng trong CartProvider");
  }
  return context;
};

// Provider Component
export const CartProvider = ({ children }) => {
  // Khởi tạo state từ localStorage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("neoshop_cart");
      const parsedCart = savedCart ? JSON.parse(savedCart) : [];
      // Lọc bỏ những sản phẩm lưu từ đợt chạy test cũ (ID là số đếm thay vì UUID của Backend)
      return parsedCart.filter(item => typeof item.id === 'string' && item.id.length > 20);
    } catch {
      return [];
    }
  });

  // Lưu vào localStorage mỗi khi cartItems thay đổi
  useEffect(() => {
    localStorage.setItem("neoshop_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Tính tổng số lượng sản phẩm (hiển thị trên badge)
  const cartCount = cartItems.reduce((total, item) => total + item.qty, 0);

  // Lọc các sản phẩm được chọn (checkout)
  const checkedItems = cartItems.filter((item) => item.isChecked !== false);

  // Tính tổng tiền (VNĐ) của các sản phẩm ĐƯỢC CHỌN
  const totalPrice = checkedItems.reduce(
    (total, item) => total + item.priceVND * item.qty,
    0,
  );

  // Thêm sản phẩm vào giỏ
  const addToCart = useCallback((product) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);

      if (existingItem) {
        // Nếu đã có, tăng số lượng
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
        );
      }

      // Nếu chưa có, thêm mới
      const priceVND = Math.round(product.price);
      return [
        ...prev,
        {
          id: product.id,
          title: product.title,
          imageColor: product.imageColor,
          imageUrl:
            product.image || product.imageUrl || product.thumbnail || "",
          platform: product.platform,
          type:
            product.category === "subscription"
              ? "Subscription"
              : "Key kỹ thuật số",
          priceVND,
          qty: 1,
          isChecked: true,
        },
      ];
    });
  }, []);

  // Xóa sản phẩm khỏi giỏ
  const removeFromCart = useCallback((productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  // Cập nhật số lượng
  const updateQuantity = useCallback(
    (productId, newQty) => {
      if (newQty < 1) {
        removeFromCart(productId);
        return;
      }

      setCartItems((prev) =>
        prev.map((item) =>
          item.id === productId ? { ...item, qty: newQty } : item,
        ),
      );
    },
    [removeFromCart],
  );

  // Check/Uncheck một sản phẩm
  const toggleItemCheck = useCallback((productId) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId
          ? { ...item, isChecked: item.isChecked === false ? true : false }
          : item,
      ),
    );
  }, []);

  // Check/Uncheck tất cả sản phẩm
  const toggleAllChecks = useCallback((isChecked) => {
    setCartItems((prev) => prev.map((item) => ({ ...item, isChecked })));
  }, []);

  // Xóa toàn bộ giỏ hàng
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // Xóa các sản phẩm được tick
  const removeCheckedItems = useCallback(() => {
    setCartItems((prev) => prev.filter((item) => item.isChecked === false));
  }, []);

  // Kiểm tra sản phẩm đã có trong giỏ chưa
  const isInCart = useCallback(
    (productId) => {
      return cartItems.some((item) => item.id === productId);
    },
    [cartItems],
  );

  const value = useMemo(
    () => ({
      cartItems,
      cartCount,
      totalPrice,
      checkedItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      toggleItemCheck,
      toggleAllChecks,
      clearCart,
      removeCheckedItems,
      isInCart,
    }),
    [
      cartItems,
      cartCount,
      totalPrice,
      checkedItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      toggleItemCheck,
      toggleAllChecks,
      clearCart,
      removeCheckedItems,
      isInCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;
