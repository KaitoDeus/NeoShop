import api from "./api";

const settingsService = {
  getSettings: async () => {
    const response = await api.get("/admin/settings");
    return response.data;
  },

  updateSettings: async (settings) => {
    const response = await api.post("/admin/settings", settings);
    return response.data;
  },
};

export default settingsService;
