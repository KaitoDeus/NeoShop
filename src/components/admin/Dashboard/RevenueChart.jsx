import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid 
} from 'recharts';
import { revenueData } from '../../../data/adminMockData';
import './DashboardWidgets.css';

const RevenueChart = () => {
  return (
    <div className="dashboard-widget chart-widget">
      <div className="widget-header">
        <div>
          <h3 className="widget-title">Tăng trưởng doanh thu</h3>
          <p className="widget-subtitle">Tổng quan doanh thu 7 ngày qua</p>
        </div>
        <div className="chart-actions">
           <button className="chart-filter active">7 ngày</button>
           <button className="chart-filter">30 ngày</button>
        </div>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 12 }} 
              dy={10}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '8px', 
                border: 'none', 
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
              }}
              formatter={(value) => [`${value.toLocaleString()} đ`, 'Doanh thu']}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#2563eb"
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorValue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
