import axios from 'axios';
import { auth } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add auth token with automatic refresh
api.interceptors.request.use(
  async (config) => {
    const token = await auth.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken') || localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await api.post('/auth/refresh', {
            refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data.data;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token failed, clear auth and redirect to login
        auth.clearAuth();
        // Don't redirect automatically, let the component handle it
        console.error('Token refresh failed:', refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  refreshToken: (data: any) => api.post('/auth/refresh', data),
  forgotPassword: (data: any) => api.post('/auth/forgot-password', data),
  resetPassword: (data: any) => api.post('/auth/reset-password', data),
  verifyEmail: (data: { token: string }) => api.post('/auth/verify-email', data),
  resendVerification: (data: { email: string }) => api.post('/auth/resend-verification', data),
};

export const userAPI = {
  getProfile: () => api.get('/users/me'),
  updateProfile: (data: any) => api.put('/users/me', data),
  changePassword: (data: any) => api.put('/users/me/password', data),
  deleteAccount: () => api.delete('/users/me'),
};

export const profileAPI = {
  getProfile: () => api.get('/profiles/me'),
  updateProfile: (data: any) => api.put('/profiles/me', data),
  getPublicProfile: (username: string) => api.get(`/profiles/${username}`),
};

export const settingsAPI = {
  getSettings: () => api.get('/settings/me'),
  updateSettings: (data: any) => api.put('/settings/me', data),
  resetSettings: () => api.post('/settings/me/reset'),
};

export const healthAPI = {
  check: () => api.get('/health'),
  ready: () => api.get('/health/ready'),
}; 