import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

// Tạo Context
const AuthContext = createContext();

// Hook để sử dụng Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth phải được sử dụng trong AuthProvider");
  }
  return context;
};

// Provider Component
export const AuthProvider = ({ children }) => {
  // Trạng thái user: null (chưa đăng nhập) hoặc object user
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("neoshop_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  // Hàm đăng nhập (Real API)
  const login = async (username, password) => {
    try {
      // Gọi API login
      // Lưu ý: Backend endpoint /api/v1/auth/login map với axios baseURL /api
      const response = await api.post("/v1/auth/login", { username, password });
      const data = response.data; // { token, username, roles }

      // Tạo object user để lưu frontend
      const userData = {
        id: data.username, // Tạm dùng username làm ID
        name: data.username,
        email: data.email || username, // Ưu tiên email từ server
        username: data.username,
        token: data.token,
        roles: data.roles || [],
        // Mapping role để giữ tương thích code cũ (check user.role === 'admin')
        role:
          data.roles &&
          (data.roles.includes("ADMIN") || data.roles.includes("ROLE_ADMIN"))
            ? "admin"
            : "user",
        avatar:
          data.avatar ||
          `https://ui-avatars.com/api/?name=${data.username}&background=random`,
      };

      setUser(userData);
      localStorage.setItem("neoshop_user", JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error("Login failed:", error);
      // Ném lỗi để component UI bắt được và hiển thị thông báo
      throw error;
    }
  };

  // Hàm đăng xuất
  const register = async (username, email, password) => {
    try {
      const response = await api.post("/v1/auth/register", {
        username,
        email,
        password,
      });
      const data = response.data;

      const userData = {
        id: data.username,
        name: data.username,
        email: email, // Use email from args
        username: data.username,
        token: data.token,
        roles: data.roles || [],
        role:
          data.roles &&
          (data.roles.includes("ADMIN") || data.roles.includes("ROLE_ADMIN"))
            ? "admin"
            : "user",
        avatar:
          data.avatar ||
          `https://ui-avatars.com/api/?name=${data.username}&background=random`,
      };

      setUser(userData);
      localStorage.setItem("neoshop_user", JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      console.error("Register failed", error);
      let msg = "Đăng ký thất bại";
      if (error.response && typeof error.response.data === "string") {
        msg = error.response.data;
      } else if (error.response?.data?.message) {
        msg = error.response.data.message;
      }
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("neoshop_user");
    api.defaults.headers.common["Authorization"] = null;
  };

  // Kiểm tra quyền Admin
  const isAdmin =
    user?.role === "admin" ||
    (user?.roles &&
      (user.roles.includes("ADMIN") || user.roles.includes("ROLE_ADMIN")));

  const updateUser = (updatedData) => {
    setUser((prev) => {
      const newUser = { ...prev, ...updatedData };
      // Map fullName to name to keep header consistent
      if (updatedData.fullName) newUser.name = updatedData.fullName;

      // Quan trọng: Giữ lại token cũ nếu data mới không có
      if (!updatedData.token && prev?.token) {
        newUser.token = prev.token;
      }

      // Đảm bảo avatar luôn có giá trị (không null)
      if (!newUser.avatar) {
        newUser.avatar = `https://ui-avatars.com/api/?name=${newUser.username || "User"}&background=random`;
      }

      localStorage.setItem("neoshop_user", JSON.stringify(newUser));
      return newUser;
    });
  };

  const getAvatar = (url) => {
    if (!url)
      return `https://ui-avatars.com/api/?name=${user?.username || "User"}&background=random`;
    if (url.startsWith("http")) return url;
    // Phục vụ cho ảnh từ backend (relative path)
    return `http://localhost:8080${url}`;
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser, // Expose this
    isAdmin,
    getAvatar, // Expose this
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
