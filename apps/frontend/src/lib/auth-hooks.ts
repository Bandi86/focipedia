'use client';

import { useState, useEffect } from 'react';
import { auth, User } from './auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const currentUser = auth.getCurrentUser();
      const authenticated = auth.isAuthenticated();
      
      setUser(currentUser);
      setIsAuthenticated(authenticated);
      setLoading(false);
    };

    checkAuth();

    // Listen for storage changes (e.g., when user logs in/out in another tab)
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = async (emailOrUsername: string, password: string) => {
    const authData = await auth.login(emailOrUsername, password);
    setUser(authData.user);
    setIsAuthenticated(true);
    return authData;
  };

  const logout = async () => {
    await auth.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const register = async (userData: {
    email: string;
    password: string;
    username: string;
    displayName: string;
  }) => {
    const authData = await auth.register(userData);
    return authData;
  };

  return {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    register,
  };
}; 