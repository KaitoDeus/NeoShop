import { 
  FiCalendar, FiFilter, FiMoreHorizontal, FiDownload, FiPrinter 
} from 'react-icons/fi';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import StatsCard from '../../../components/admin/Dashboard/StatsCard';
import { reportStats, categoryRevenue, topProducts, financialData } from '../../../data/adminMockData';
import './Stats.css';

const Stats = () => {
  return (
    <div className="stats-page">
      {/* 1. Header & Filter */}
      <div className="page-header">
        <div>
          <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>
            Trang chủ / Báo cáo
          </div>
          <h1 className="page-title">Thống Kê & Báo Cáo</h1>
          <p className="page-subtitle">Theo dõi hiệu suất kinh doanh và tài chính của NeoShop</p>
        </div>
        
        <div className="filters-bar" style={{ gap: '0.5rem', padding: '0.75rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Từ ngày</span>
            <div className="date-picker-btn" style={{ padding: '0.4rem 0.75rem' }}>
              10/01/2023 <FiCalendar />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Đến ngày</span>
            <div className="date-picker-btn" style={{ padding: '0.4rem 0.75rem' }}>
              10/31/2023 <FiCalendar />
            </div>
          </div>
          <button className="btn-primary" style={{ height: '38px', alignSelf: 'flex-end' }}>
            <FiFilter /> Lọc
          </button>
        </div>
      </div>

      {/* 2. KPI Cards */}
      <div className="stats-grid">
        {reportStats.map(stat => (
          <StatsCard key={stat.id} {...stat} />
        ))}
      </div>

      {/* 3. Charts Row */}
      <div className="charts-row">
        {/* Category Revenue Chart */}
        <div className="dashboard-widget">
          <div className="widget-header">
            <h3 className="widget-title">Tỷ lệ doanh thu theo danh mục</h3>
            <FiMoreHorizontal className="text-secondary" style={{ cursor: 'pointer' }} />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center' }}>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryRevenue}
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={0}
                    dataKey="value"
                  >
                    {categoryRevenue.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="chart-center-text">
                <span className="chart-center-label">Tổng cộng</span>
                <span className="chart-center-value">100%</span>
              </div>
            </div>
            
            <div className="legend-list">
              {categoryRevenue.map((item, index) => (
                <div key={index} className="legend-item">
                  <div className="legend-info">
                    <div className="legend-color" style={{ background: item.color }}></div>
                    <span className="legend-name">{item.name}</span>
                  </div>
                  <span className="legend-value">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="dashboard-widget">
          <div className="widget-header">
            <h3 className="widget-title">Top 5 sản phẩm bán chạy nhất</h3>
            <a href="#" className="view-all-btn">Xem tất cả</a>
          </div>
          
          <div className="top-products-list">
            {topProducts.map((product, index) => (
              <div key={index} className="product-progress-item">
                <div className="product-progress-header">
                  <span className="font-medium text-primary">{product.name}</span>
                  <span className="text-secondary">{product.sold} sold</span>
                </div>
                <div className="product-progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${product.percent}%`,
                      opacity: 1 - (index * 0.15) // Fade effect for lower ranks
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Financial Table */}
      <div className="dashboard-widget">
        <div className="financial-table-header">
          <h3 className="widget-title">Tổng kết tài chính theo tháng</h3>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn-sm-outline"><FiDownload /> Xuất Excel</button>
            <button className="btn-sm-primary"><FiPrinter /> In báo cáo</button>
          </div>
        </div>
        
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tháng</th>
                <th>Tổng Thu</th>
                <th>Tổng Chi</th>
                <th>Lợi Nhuận</th>
                <th>Đơn Hàng</th>
                <th>Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {financialData.map((row, index) => (
                <tr key={index}>
                  <td className="font-bold text-primary" style={{ textTransform: 'uppercase' }}>{row.month}</td>
                  <td className="text-success font-bold">+ {row.revenue}</td>
                  <td className="text-danger font-bold">- {row.expense}</td>
                  <td className="text-indigo font-bold">{row.profit}</td>
                  <td>{row.orders} đơn</td>
                  <td>
                    {row.status === 'completed' ? (
                      <span className="badge badge-success">Đã chốt</span>
                    ) : (
                      <span className="badge badge-warning">Chưa chốt</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Stats;
