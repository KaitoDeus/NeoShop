import { useState, useEffect } from "react";
import {
  FiCalendar,
  FiFilter,
  FiMoreHorizontal,
  FiDownload,
  FiPrinter,
  FiRefreshCw,
} from "react-icons/fi";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import StatsCard from "../../../components/admin/Dashboard/StatsCard";
import statsService from "../../../services/statsService";
import { formatDate } from "../../../utils/formatDate";
import "./Stats.css";

const Stats = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    overview: null,
    monthly: [],
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [overview, monthly] = await Promise.all([
        statsService.getOverviewStats(),
        statsService.getMonthlyFinancials(),
      ]);
      setData({ overview, monthly });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!data.monthly.length) return;

    const headers = [
      "Tháng",
      "Doanh thu",
      "Chi phí (Ước tính)",
      "Lợi nhuận (Ước tính)",
      "Trạng thái",
    ];
    const csvContent = [
      headers.join(","),
      ...data.monthly.map(
        (row) =>
          `"${row.month}","${row.revenue}","${row.expense}","${row.profit}","${row.status}"`,
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `BaoCao_NeoShop_${formatDate(new Date())}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div
        className="stats-page"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <FiRefreshCw className="spin" size={48} color="#2563eb" />
      </div>
    );
  }

  const kpiCards = [
    {
      id: 1,
      title: "Tổng doanh thu",
      value: (data.overview?.totalRevenue || 0).toLocaleString() + " đ",
      change: "+12%",
      isPositive: true,
      icon: <FiDownload />,
      color: "blue",
    },
    {
      id: 2,
      title: "Tổng đơn hàng",
      value: (data.overview?.totalOrders || 0).toLocaleString(),
      change: "+5%",
      isPositive: true,
      icon: <FiDownload />,
      color: "green",
    },
    {
      id: 3,
      title: "Khách hàng",
      value: (data.overview?.totalUsers || 0).toLocaleString(),
      change: "+2%",
      isPositive: true,
      icon: <FiDownload />,
      color: "purple",
    },
    {
      id: 4,
      title: "Sản phẩm active",
      value: (data.overview?.activeProducts || 0).toLocaleString(),
      change: "+0%",
      isPositive: true,
      icon: <FiDownload />,
      color: "orange",
    },
  ];

  const categoryRevenue = data.overview?.categoryStats || [];
  const topProducts = data.overview?.topProducts || [];

  return (
    <div className="stats-page">
      <div className="page-header">
        <div>
          <div
            style={{
              fontSize: "0.85rem",
              color: "#64748b",
              marginBottom: "0.5rem",
            }}
          >
            Trang chủ / Báo cáo
          </div>
          <h1 className="page-title">Thống Kê & Báo Cáo</h1>
          <p className="page-subtitle">
            Theo dõi hiệu suất kinh doanh và tài chính của NeoShop
          </p>
        </div>

        <div
          className="filters-bar"
          style={{ gap: "0.5rem", padding: "0.75rem" }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
          >
            <span
              style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                color: "#94a3b8",
                textTransform: "uppercase",
              }}
            >
              Từ ngày
            </span>
            <div
              className="date-picker-btn"
              style={{ padding: "0.4rem 0.75rem" }}
            >
              01/01/2026 <FiCalendar />
            </div>
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
          >
            <span
              style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                color: "#94a3b8",
                textTransform: "uppercase",
              }}
            >
              Đến ngày
            </span>
            <div
              className="date-picker-btn"
              style={{ padding: "0.4rem 0.75rem" }}
            >
              23/02/2026 <FiCalendar />
            </div>
          </div>
          <button
            className="btn-primary"
            style={{ height: "38px", alignSelf: "flex-end" }}
            onClick={fetchStats}
          >
            <FiFilter /> Lọc
          </button>
        </div>
      </div>

      <div className="stats-grid">
        {kpiCards.map((stat) => (
          <StatsCard key={stat.id} {...stat} />
        ))}
      </div>

      <div className="charts-row">
        <div className="dashboard-widget">
          <div className="widget-header">
            <h3 className="widget-title">Tỷ lệ doanh thu theo danh mục</h3>
            <FiMoreHorizontal
              className="text-secondary"
              style={{ cursor: "pointer" }}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              alignItems: "center",
            }}
          >
            <div className="chart-wrapper" style={{ position: "relative" }}>
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
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke="none"
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                }}
              >
                <span
                  style={{
                    display: "block",
                    fontSize: "0.8rem",
                    color: "#64748b",
                  }}
                >
                  Tổng cộng
                </span>
                <span
                  style={{
                    display: "block",
                    fontSize: "1.2rem",
                    fontWeight: 700,
                    color: "#1e293b",
                  }}
                >
                  100%
                </span>
              </div>
            </div>

            <div className="legend-list">
              {categoryRevenue.map((item, index) => (
                <div key={index} className="legend-item">
                  <div className="legend-info">
                    <div
                      className="legend-color"
                      style={{ background: item.color }}
                    ></div>
                    <span
                      className="legend-name"
                      style={{ fontSize: "0.85rem" }}
                    >
                      {item.name}
                    </span>
                  </div>
                  <span className="legend-value">
                    {item.value?.toLocaleString()} đ
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="dashboard-widget">
          <div className="widget-header">
            <h3 className="widget-title">Top 5 sản phẩm bán chạy nhất</h3>
          </div>

          <div className="top-products-list" style={{ marginTop: "1rem" }}>
            {topProducts.map((product, index) => (
              <div key={index} style={{ marginBottom: "1.25rem" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem",
                  }}
                >
                  <span style={{ fontWeight: 500, fontSize: "0.9rem" }}>
                    {product.name}
                  </span>
                  <span style={{ color: "#64748b", fontSize: "0.85rem" }}>
                    {product.sold} đã bán
                  </span>
                </div>
                <div
                  style={{
                    height: "8px",
                    background: "#f1f5f9",
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      background: "#2563eb",
                      width: `${Math.min(100, (product.sold / (topProducts[0]?.sold || 1)) * 100)}%`,
                      opacity: 1 - index * 0.15,
                    }}
                  ></div>
                </div>
              </div>
            ))}
            {topProducts.length === 0 && (
              <p style={{ textAlign: "center", color: "#94a3b8" }}>
                Chưa có dữ liệu sản phẩm
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="dashboard-widget">
        <div
          className="financial-table-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <h3 className="widget-title">Tổng kết tài chính theo tháng</h3>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button className="btn-sm-outline" onClick={exportToCSV}>
              <FiDownload /> Xuất CSV
            </button>
            <button className="btn-sm-primary" onClick={() => window.print()}>
              <FiPrinter /> In báo cáo
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tháng</th>
                <th>Tổng Thu</th>
                <th>Tổng Chi (Ước tính)</th>
                <th>Lợi Nhuận (Ước tính)</th>
                <th>Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {data.monthly.map((row, index) => (
                <tr key={index}>
                  <td
                    className="font-bold text-primary"
                    style={{ textTransform: "uppercase" }}
                  >
                    {row.month}
                  </td>
                  <td className="text-success font-bold">
                    + {row.revenue?.toLocaleString()} đ
                  </td>
                  <td className="text-danger font-bold">
                    - {row.expense?.toLocaleString()} đ
                  </td>
                  <td style={{ color: "#6366f1", fontWeight: 700 }}>
                    {row.profit?.toLocaleString()} đ
                  </td>
                  <td>
                    <span
                      className="badge-success"
                      style={{
                        background: "#dcfce7",
                        color: "#166534",
                        padding: "4px 12px",
                        borderRadius: "99px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                      }}
                    >
                      Đã chốt
                    </span>
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
