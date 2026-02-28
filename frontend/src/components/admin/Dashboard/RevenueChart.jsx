import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { revenueData as mockRevenueData } from "../../../data/adminMockData";
import api from "../../../services/api";
import "./DashboardWidgets.css";

const RevenueChart = () => {
  const [chartData, setChartData] = useState(mockRevenueData);
  const [days, setDays] = useState(7);

  useEffect(() => {
    const fetchChart = async () => {
      try {
        const res = await api.get("/admin/dashboard/revenue-chart", {
          params: { days },
        });
        if (res.data && res.data.length > 0) {
          setChartData(res.data);
        }
      } catch {
        // Fallback to mock data
      }
    };
    fetchChart();
  }, [days]);

  return (
    <div className="dashboard-widget chart-widget">
      <div className="widget-header">
        <div>
          <h3 className="widget-title">Tăng trưởng doanh thu</h3>
          <p className="widget-subtitle">Tổng quan doanh thu {days} ngày qua</p>
        </div>
        <div className="chart-actions">
          <button
            className={`chart-filter ${days === 7 ? "active" : ""}`}
            onClick={() => setDays(7)}
          >
            7 ngày
          </button>
          <button
            className={`chart-filter ${days === 30 ? "active" : ""}`}
            onClick={() => setDays(30)}
          >
            30 ngày
          </button>
        </div>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e2e8f0"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
              dy={10}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              formatter={(value) => [
                `${Number(value).toLocaleString()} đ`,
                "Doanh thu",
              ]}
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
