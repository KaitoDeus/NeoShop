import { useState, useEffect } from 'react';
import StatsCard from '../../../components/admin/Dashboard/StatsCard';
import RevenueChart from '../../../components/admin/Dashboard/RevenueChart';
import PaymentPieChart from '../../../components/admin/Dashboard/PaymentPieChart';
import RecentOrders from '../../../components/admin/Dashboard/RecentOrders';
import { statsData as mockStatsData } from '../../../data/adminMockData';
import statsService from '../../../services/statsService';

const Dashboard = () => {
  const [stats, setStats] = useState(mockStatsData);
  const [paymentStats, setPaymentStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const data = await statsService.getOverviewStats();
      if (data) {
        setStats([
          { id: 1, title: 'Tổng doanh thu', value: `${Number(data.totalRevenue || 0).toLocaleString('vi-VN')} đ`, percent: 12, isIncrease: true, compareText: '', iconType: 'money', color: 'blue' },
          { id: 2, title: 'Tổng đơn hàng', value: String(data.totalOrders || 0), percent: 5, isIncrease: true, compareText: '', iconType: 'bag', color: 'green' },
          { id: 3, title: 'Sản phẩm', value: String(data.activeProducts || 0), percent: 0, isIncrease: true, compareText: '', iconType: 'key', color: 'purple' },
          { id: 4, title: 'Người dùng', value: String(data.totalUsers || 0), percent: 2, isIncrease: true, compareText: '', iconType: 'user', color: 'orange' },
        ]);
        setPaymentStats(data.paymentStats || []);
      }
    } catch (error) {
      console.error("Dashboard stats fetch failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>Tổng quan</h2>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {stats.map((stat) => (
          <StatsCard key={stat.id} {...stat} />
        ))}
      </div>

      {/* Chart Section */}
      <div className="dashboard-charts-grid grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
            <RevenueChart />
        </div>
        <div>
            <PaymentPieChart data={paymentStats} />
        </div>
      </div>

      {/* Recent Orders */}
      <div>
        <RecentOrders />
      </div>
    </div>
  );
};

export default Dashboard;
