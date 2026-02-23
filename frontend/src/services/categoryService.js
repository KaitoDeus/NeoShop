import api from './api';

const categoryService = {
    // Lấy tất cả danh mục
    getAllCategories: async () => {
        const response = await api.get('/categories');
        return response.data;
    },

    // Admin potentially needs more methods later
    // createCategory: async (data) => ...
};

export default categoryService;
