import api from './api';

const userService = {
    // Lấy thông tin người dùng hiện tại
    getCurrentUser: async () => {
        const response = await api.get('/users/profile');
        return response.data;
    },

    // Cập nhật thông tin người dùng
    updateProfile: async (userData) => {
        const response = await api.patch('/users/profile', userData);
        return response.data;
    },

    // Đổi mật khẩu
    changePassword: async (passwordData) => {
        // passwordData: { oldPassword, newPassword }
        const response = await api.post('/users/change-password', passwordData);
        return response.data;
    },

    // Tải lên avatar
    uploadAvatar: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/upload/image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    // Admin: Lấy tất cả người dùng
    getAllUsers: async (page = 0, size = 10) => {
        const response = await api.get('/admin/users', {
             params: { page, size }
        });
        return response.data;
    },

    // Admin: Tạo người dùng mới
    createUser: async (userData) => {
        const response = await api.post('/admin/users', userData);
        return response.data;
    },

    updateUser: async (id, userData) => {
        const response = await api.put(`/admin/users/${id}`, userData);
        return response.data;
    },

    deleteUser: async (id) => {
        const response = await api.delete(`/admin/users/${id}`);
        return response.data;
    }
};

export default userService;
