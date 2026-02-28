import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import orderService from "../../../services/orderService";
import { formatDate } from "../../../utils/formatDate";
import "./DashboardWidgets.css";

const RecentOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRecentOrders();
  }, []);

  const fetchRecentOrders = async () => {
    try {
      setIsLoading(true);
      // Lấy 5 đơn hàng mới nhất (page 0, size 5)
      const data = await orderService.getAllOrders(0, 5);
      if (data && data.content) {
        setOrders(data.content);
      }
    } catch (error) {
      console.error("Failed to fetch recent orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const s = (status || "").toUpperCase();
    switch (s) {
      case "SUCCESS":
      case "COMPLETED":
        return <span className="badge badge-success">Thành công</span>;
      case "PENDING":
      case "PROCESSING":
        return <span className="badge badge-warning">Đang xử lý</span>;
      case "FAILED":
      case "CANCELLED":
        return <span className="badge badge-error">Thất bại</span>;
      default:
        return <span className="badge badge-gray">{status}</span>;
    }
  };


  const formatCurrency = (amount) => {
    return `${Number(amount || 0).toLocaleString("vi-VN")} đ`;
  };

  const getProductName = (order) => {
    if (order.items && order.items.length > 0) {
      const first = order.items[0].productTitle;
      if (order.items.length > 1) {
        return `${first} (+${order.items.length - 1})`;
      }
      return first;
    }
    return "—";
  };

  const getOrderCode = (order) => {
    // Hiển thị mã đơn rút gọn từ UUID
    const idStr = String(order.id || "");
    return `#${idStr.substring(0, 6).toUpperCase()}`;
  };

  return (
    <div className="dashboard-widget table-widget">
      <div className="widget-header">
        <h3 className="widget-title">Đơn hàng gần đây</h3>
        <Link to="/admin/orders" className="view-all-btn">
          Xem tất cả
        </Link>
      </div>

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Sản phẩm</th>
              <th>Ngày đặt</th>
              <th>Trạng thái</th>
              <th className="text-right">Tổng tiền</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "2rem", color: "#94a3b8" }}>
                  Đang tải...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "2rem", color: "#94a3b8" }}>
                  Chưa có đơn hàng nào
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id}>
                  <td className="font-medium text-primary">
                    {getOrderCode(order)}
                  </td>
                  <td>
                    <div className="customer-cell">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(order.fullName || order.username || "U")}&background=random&size=32`}
                        alt=""
                        className="customer-avatar"
                      />
                      <span>{order.fullName || order.username || "Khách"}</span>
                    </div>
                  </td>
                  <td>{getProductName(order)}</td>
                  <td className="text-secondary">{formatDate(order.orderDate)}</td>
                  <td>{getStatusBadge(order.status)}</td>
                  <td className="text-right font-bold">
                    {formatCurrency(order.totalAmount)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;
