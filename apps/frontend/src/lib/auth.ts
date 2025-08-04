import { authAPI } from './api';

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

export const auth = {
  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('accessToken');
  },

  // Get current user from localStorage
  getCurrentUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Set authentication data
  setAuth: (authData: AuthResponse): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('accessToken', authData.accessToken);
    localStorage.setItem('refreshToken', authData.refreshToken);
    localStorage.setItem('user', JSON.stringify(authData.user));
  },

  // Clear authentication data
  clearAuth: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  // Login
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await authAPI.login({ email, password });
    const authData = response.data.data;
    auth.setAuth(authData);
    return authData;
  },

  // Register
  register: async (userData: {
    email: string;
    password: string;
    username: string;
    displayName: string;
  }): Promise<AuthResponse> => {
    const response = await authAPI.register(userData);
    const authData = response.data.data;
    auth.setAuth(authData);
    return authData;
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      await authAPI.logout();
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API call failed:', error);
    } finally {
      auth.clearAuth();
    }
  },
}; 