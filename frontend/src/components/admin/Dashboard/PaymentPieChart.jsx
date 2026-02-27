import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import "./DashboardWidgets.css";

const PaymentPieChart = ({ data }) => {
  // Default data if none provided
  // Ensure data is a non-empty array, otherwise use default
  const chartData =
    data && data.length > 0
      ? data
      : [
          { name: "Thành công", value: 1 },
          { name: "Thất bại", value: 0 },
          { name: "Chờ xử lý", value: 0 },
        ];

  const COLORS = ["#10b981", "#ef4444", "#f59e0b"];

  return (
    <div className="dashboard-widget chart-widget">
      <div className="widget-header">
        <h3 className="widget-title">Thống kê thanh toán</h3>
      </div>

      <div className="chart-container" style={{ height: "300px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`${value} đơn`, "Số lượng"]}
              contentStyle={{ borderRadius: "8px", border: "none" }}
            />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PaymentPieChart;
