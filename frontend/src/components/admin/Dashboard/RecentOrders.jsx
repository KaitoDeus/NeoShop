import { Link } from 'react-router-dom';
import { recentOrders } from '../../../data/adminMockData';
import './DashboardWidgets.css';

const RecentOrders = () => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'success':
        return <span className="badge badge-success">Thành công</span>;
      case 'processing':
        return <span className="badge badge-warning">Đang xử lý</span>;
      case 'failed':
        return <span className="badge badge-error">Thất bại</span>;
      default:
        return <span className="badge badge-gray">{status}</span>;
    }
  };

  return (
    <div className="dashboard-widget table-widget">
      <div className="widget-header">
        <h3 className="widget-title">Đơn hàng gần đây</h3>
        <Link to="/admin/orders" className="view-all-btn">Xem tất cả</Link>
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
            {recentOrders.map((order) => (
              <tr key={order.id}>
                <td className="font-medium text-primary">{order.id}</td>
                <td>
                  <div className="customer-cell">
                    <img src={order.customer.avatar} alt="" className="customer-avatar" />
                    <span>{order.customer.name}</span>
                  </div>
                </td>
                <td>{order.product}</td>
                <td className="text-secondary">{order.date}</td>
                <td>{getStatusBadge(order.status)}</td>
                <td className="text-right font-bold">{order.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;
