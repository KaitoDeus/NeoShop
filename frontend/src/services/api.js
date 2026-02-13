import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        try {
            const userString = localStorage.getItem('neoshop_user');
            if (userString) {
                const user = JSON.parse(userString);
                if (user && user.token) {
                    config.headers['Authorization'] = `Bearer ${user.token}`;
                    if (config.headers.set) {
                        config.headers.set('Authorization', `Bearer ${user.token}`);
                    }
                }
            }
        } catch (error) {
            console.error('[API] Error in request interceptor', error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('neoshop_user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
