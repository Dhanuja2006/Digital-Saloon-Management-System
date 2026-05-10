import axios from 'axios';

const api = axios.create({
    baseURL: 'https://digital-saloon-management-system-1.onrender.com/api', // Adjust base URL according to backend routes
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
