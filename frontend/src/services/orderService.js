import api from './api';

const orderService = {
    // Tạo đơn hàng
    createOrder: async (orderRequest) => {
        const response = await api.post('/orders', orderRequest);
        return response.data;
    },

    // Lấy danh sách đơn hàng của user
    getMyOrders: async (page = 0, size = 10) => {
        const response = await api.get('/orders/my-orders', {
            params: { page, size }
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
        const response = await api.post('/payments/process', paymentData);
        return response.data;
    },

    // Admin: Lấy tất cả đơn hàng
    getAllOrders: async (page = 0, size = 10, status = '') => {
        const response = await api.get('/admin/orders', {
             params: { page, size, status }
        });
        return response.data;
    }
};

export default orderService;
