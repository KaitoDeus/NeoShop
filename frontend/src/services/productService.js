import api from './api';

const productService = {
    // Lấy danh sách sản phẩm (có phân trang)
    getAllProducts: async (page = 0, size = 12) => {
        const response = await api.get('/products', {
            params: { page, size }
        });
        return response.data;
    },

    // Lấy chi tiết sản phẩm
    getProductById: async (id) => {
        const response = await api.get(`/products/${id}`);
        return response.data;
    },

    // Tìm kiếm sản phẩm
    searchProducts: async (query, page = 0, size = 12) => {
        const response = await api.get('/products/search', {
            params: { query, page, size }
        });
        return response.data;
    },

    // Lấy sản phẩm theo danh mục (ID)
    getProductsByCategoryId: async (categoryId, page = 0, size = 12) => {
        const response = await api.get(`/products/category/${categoryId}`, {
            params: { page, size }
        });
        return response.data;
    }
};

export default productService;
