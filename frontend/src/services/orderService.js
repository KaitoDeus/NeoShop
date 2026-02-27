import api from "./api";

const orderService = {
  // Tạo đơn hàng (User)
  createOrder: async (orderRequest) => {
    const response = await api.post("/orders", orderRequest);
    return response.data;
  },

  // Admin: Tạo đơn hàng cho user cụ thể
  adminCreateOrder: async (userId, orderRequest) => {
    const response = await api.post("/admin/orders", orderRequest, {
      params: { userId },
    });
    return response.data;
  },

  // Lấy danh sách đơn hàng của user
  getMyOrders: async (page = 0, size = 10) => {
    const response = await api.get("/orders/my-orders", {
      params: { page, size },
    });
    return response.data;
  },

  // Lấy chi tiết đơn hàng
  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Payment Process (tạm thời)
  processPayment: async (paymentData) => {
    const response = await api.post("/payments/process", paymentData);
    return response.data;
  },

  // Admin: Lấy tất cả đơn hàng
  getAllOrders: async (
    page = 0,
    size = 10,
    status = "",
    query = "",
    startDate = "",
    endDate = "",
  ) => {
    const response = await api.get("/admin/orders", {
      params: {
        page,
        size,
        status: status || undefined,
        query: query || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      },
    });
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.patch(`/admin/orders/${id}/status`, null, {
      params: { status },
    });
    return response.data;
  },

  deleteOrder: async (id) => {
    const response = await api.delete(`/admin/orders/${id}`);
    return response.data;
  },

  bulkDeleteOrders: async (ids) => {
    const response = await api.delete("/admin/orders/bulk", { data: ids });
    return response.data;
  },

  bulkUpdateOrderStatus: async (ids, status) => {
    const response = await api.patch("/admin/orders/bulk-status", ids, {
      params: { status },
    });
    return response.data;
  },
};

export default orderService;
