import api from "./api";

const statsService = {
  getOverviewStats: async () => {
    const response = await api.get("/admin/dashboard/stats");
    return response.data;
  },

  getMonthlyFinancials: async () => {
    const response = await api.get("/admin/dashboard/monthly-stats");
    return response.data;
  },

  getRevenueChart: async () => {
    const response = await api.get("/admin/dashboard/revenue-chart");
    return response.data;
  },
};

export default statsService;
