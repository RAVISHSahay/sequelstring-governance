import axios from 'axios';

// Create Axios instance
const api = axios.create({
    baseURL: '/api/v1', // Proxied to http://localhost:8000/api/v1
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor (e.g., for auth tokens)
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Or from Supabase auth session
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
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
        // Handle global errors (e.g., 401 Unauthorized)
        if (error.response && error.response.status === 401) {
            // Redirect to login or refresh token
            console.warn('Unauthorized access');
        }
        return Promise.reject(error);
    }
);

export default api;
