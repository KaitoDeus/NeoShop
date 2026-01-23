import StatsCard from '../../../components/admin/Dashboard/StatsCard';
import RevenueChart from '../../../components/admin/Dashboard/RevenueChart';
import RecentOrders from '../../../components/admin/Dashboard/RecentOrders';
import { statsData } from '../../../data/adminMockData';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>Tổng quan</h2>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {statsData.map((stat) => (
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
