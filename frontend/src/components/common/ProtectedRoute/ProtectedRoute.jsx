import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useAuth();

  // Kiểm tra quyền Admin
  const isAdmin = user?.role === "admin";

  // Nếu chưa đăng nhập -> Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Nếu yêu cầu Admin mà không phải Admin -> Home
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Render các route con
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
