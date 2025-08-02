import { useCallback, useMemo, useState } from 'react';

// Shape inferred from tests
export type AuthUser = {
  id: number;
  email: string;
  name?: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  email: string;
  password: string;
  name: string;
};

// The tests mock these API functions via vi.mock('../../api/auth', ...)
// We import them so the mocks apply.
import * as AuthApi from '../../api/auth';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (input: LoginInput) => {
    setIsLoading(true);
    try {
      // The test replaces AuthApi.login with a vi.fn() returning a user
      const loggedInUser = await (AuthApi as any).login(input);
      setUser(loggedInUser);
      setIsAuthenticated(true);
      return loggedInUser;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    setIsLoading(true);
    try {
      const registeredUser = await (AuthApi as any).register(input);
      setUser(registeredUser);
      setIsAuthenticated(true);
      return registeredUser;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await (AuthApi as any).logout();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      login,
      register,
      logout,
    }),
    [user, isAuthenticated, isLoading, login, register, logout]
  );

  return value;
}

export default useAuth;