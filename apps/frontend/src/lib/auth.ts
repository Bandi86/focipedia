import { authAPI } from './api';

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  isVerified: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

// Helper function to check if token is expired
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch {
    return true;
  }
};

// Helper function to get token expiration time
const getTokenExpiration = (token: string): number | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp;
  } catch {
    return null;
  }
};

export const auth = {
  // Check if user is authenticated with valid token
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    
    const accessToken = localStorage.getItem('accessToken') || localStorage.getItem('access_token');
    if (!accessToken) return false;
    
    // Check if token is expired
    if (isTokenExpired(accessToken)) {
      // Try to refresh token
      const refreshToken = localStorage.getItem('refreshToken') || localStorage.getItem('refresh_token');
      if (refreshToken && !isTokenExpired(refreshToken)) {
        // Token is expired but refresh token is valid - we'll refresh on next API call
        return true;
      }
      // Both tokens are expired, clear auth
      auth.clearAuth();
      return false;
    }
    
    return true;
  },

  // Get current user from localStorage
  getCurrentUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Get access token with automatic refresh
  getAccessToken: async (): Promise<string | null> => {
    if (typeof window === 'undefined') return null;
    
    const accessToken = localStorage.getItem('accessToken') || localStorage.getItem('access_token');
    if (!accessToken) return null;
    
    // If token is not expired, return it
    if (!isTokenExpired(accessToken)) {
      return accessToken;
    }
    
    // Token is expired, try to refresh
    const refreshToken = localStorage.getItem('refreshToken') || localStorage.getItem('refresh_token');
    if (!refreshToken || isTokenExpired(refreshToken)) {
      auth.clearAuth();
      return null;
    }
    
    try {
      const response = await authAPI.refreshToken({ refreshToken });
      const authData = response.data.data || response.data;
      auth.setAuth(authData);
      return authData.accessToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      auth.clearAuth();
      return null;
    }
  },

  // Set authentication data
  setAuth: (authData: AuthResponse): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('accessToken', authData.accessToken);
    localStorage.setItem('refreshToken', authData.refreshToken);
    localStorage.setItem('user', JSON.stringify(authData.user));
    
    // Store token expiration time for easier checking
    const expiration = getTokenExpiration(authData.accessToken);
    if (expiration) {
      localStorage.setItem('tokenExpiration', expiration.toString());
    }
  },

  // Clear authentication data
  clearAuth: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpiration');
    // Also clear any other auth-related keys
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  // Login
  login: async (emailOrUsername: string, password: string): Promise<AuthResponse> => {
    console.log('Auth.login called with:', { emailOrUsername });
    try {
      const response = await authAPI.login({ emailOrUsername, password });
      console.log('Login API response:', response.data);
      // The backend returns data directly, not wrapped in a data property
      const authData = response.data.data || response.data;
      auth.setAuth(authData);
      return authData;
    } catch (error) {
      console.error('Login API error:', error);
      throw error;
    }
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
    // Don't automatically set auth - let the UI handle it
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

  // Verify email
  verifyEmail: async (token: string): Promise<{ message: string }> => {
    const response = await authAPI.verifyEmail({ token });
    return response.data;
  },

  // Resend email verification
  resendEmailVerification: async (email: string): Promise<{ message: string }> => {
    const response = await authAPI.resendVerification({ email });
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const response = await authAPI.forgotPassword({ email });
    return response.data;
  },

  // Reset password
  resetPassword: async (token: string, password: string): Promise<{ message: string }> => {
    const response = await authAPI.resetPassword({ token, password });
    return response.data;
  },
}; 