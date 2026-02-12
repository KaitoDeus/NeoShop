import { useState, useEffect } from 'react';
import StatsCard from '../../../components/admin/Dashboard/StatsCard';
import RevenueChart from '../../../components/admin/Dashboard/RevenueChart';
import RecentOrders from '../../../components/admin/Dashboard/RecentOrders';
import { statsData as mockStatsData } from '../../../data/adminMockData';

const Dashboard = () => {
  const [stats, setStats] = useState(mockStatsData);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/admin/dashboard/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setStats([
            { id: 1, title: 'Tổng doanh thu', value: `${Number(data.totalRevenue).toLocaleString('vi-VN')} đ`, percent: 12, isIncrease: true, compareText: '', iconType: 'money' },
            { id: 2, title: 'Tổng đơn hàng', value: String(data.totalOrders), percent: 5, isIncrease: true, compareText: '', iconType: 'bag' },
            { id: 3, title: 'Sản phẩm', value: String(data.activeProducts), percent: 0, isIncrease: true, compareText: '', iconType: 'key' },
            { id: 4, title: 'Người dùng', value: String(data.totalUsers), percent: 2, isIncrease: true, compareText: '', iconType: 'user' },
          ]);
        }
      } catch {
        // Fallback to mock data
      }
    };
    fetchStats();
  }, []);

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
      <div style={{ marginBottom: '2rem' }}>
        <RevenueChart />
      </div>

      {/* Recent Orders */}
      <div>
        <RecentOrders />
      </div>
    </div>
  );
};

export default Dashboard;

