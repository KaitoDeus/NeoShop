import { createContext, useContext, useState, useEffect } from 'react';

// Tạo Context
const AuthContext = createContext();

// Hook để sử dụng Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được sử dụng trong AuthProvider');
  }
  return context;
};

// Provider Component
export const AuthProvider = ({ children }) => {
  // Trạng thái user: null (chưa đăng nhập) hoặc object user
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('neoshop_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  // Hàm đăng nhập (Mock)
  const login = (email, password) => {
    // Giả lập logic đăng nhập
    // Trong thực tế sẽ gọi API
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock Admin User
        if (email === 'admin@neoshop.com' && password === 'admin123') {
           const adminUser = {
             id: 'admin_01',
             name: 'Admin User',
             email: email,
             role: 'admin',
             avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff'
           };
           setUser(adminUser);
           localStorage.setItem('neoshop_user', JSON.stringify(adminUser));
           resolve(adminUser);
        } else {
           // Mock Normal User
           const normalUser = {
             id: 'user_' + Date.now(),
             name: 'Member User',
             email: email,
             role: 'user',
             avatar: `https://ui-avatars.com/api/?name=${email}&background=random`
           };
           setUser(normalUser);
           localStorage.setItem('neoshop_user', JSON.stringify(normalUser));
           resolve(normalUser);
        }
      }, 1000);
    });
  };

  // Hàm đăng xuất
  const logout = () => {
    setUser(null);
    localStorage.removeItem('neoshop_user');
  };

  // Kiểm tra quyền Admin
  const isAdmin = user?.role === 'admin';

  const value = {
    user,
    login,
    logout,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
