import api from './api';

const couponService = {
    validateCoupon: async (code, orderAmount) => {
        const response = await api.post('/coupons/validate', { code, orderAmount });
        return response.data;
    },

    // Admin APIs
    getAllCoupons: async () => {
        const response = await api.get('/admin/coupons');
        return response.data;
    },

    createCoupon: async (coupon) => {
        const response = await api.post('/admin/coupons', coupon);
        return response.data;
    },

    deleteCoupon: async (id) => {
        await api.delete(`/admin/coupons/${id}`);
    }
};

export default couponService;
