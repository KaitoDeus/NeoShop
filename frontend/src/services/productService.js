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
    },

    // Admin: Lấy tất cả sản phẩm
    getAllProductsAdmin: async (page = 0, size = 10, title = '', categoryId = '', status = '') => {
        const response = await api.get('/admin/products', {
             params: { page, size, title, categoryId, status }
        });
        return response.data;
    },

    // Admin: Tạo sản phẩm mới
    createProduct: async (productData) => {
        const response = await api.post('/admin/products', productData);
        return response.data;
    },

    // Admin: Cập nhật sản phẩm
    updateProduct: async (id, productData) => {
        const response = await api.put(`/admin/products/${id}`, productData);
        return response.data;
    },

    // Admin: Xóa sản phẩm
    deleteProduct: async (id) => {
        const response = await api.delete(`/admin/products/${id}`);
        return response.data;
    },

    // Admin: Quản lý Key
    getProductKeys: async (productId) => {
        const response = await api.get(`/admin/products/${productId}/keys`);
        return response.data;
    },

    addProductKey: async (productId, keyData) => {
        const response = await api.post(`/admin/products/${productId}/keys`, keyData);
        return response.data;
    },

    deleteProductKey: async (keyId) => {
        const response = await api.delete(`/admin/keys/${keyId}`);
        return response.data;
    },

    searchKeys: async (params) => {
        // params: { page, size, query, productId, status }
        const response = await api.get('/admin/keys', { params });
        return response.data;
    },

    bulkAddKeys: async (bulkData) => {
        // bulkData: { productId, keyCodes: [] }
        const response = await api.post('/admin/keys/bulk', bulkData);
        return response.data;
    }
};

export default productService;
