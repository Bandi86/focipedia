'use client';

import { useEffect, useState } from 'react';
import { authStorage } from './authStorage';

export interface AuthState {
  isHydrated: boolean;
  isAuthenticated: boolean;
  accessToken: string | null;
  user: unknown | null;
}

export function useAuthState(): AuthState {
  const [isHydrated, setHydrated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<unknown | null>(null);

  useEffect(() => {
    const token = authStorage.getToken();
    const u = authStorage.getUser<unknown>();
    setAccessToken(token);
    setUser(u);
    setHydrated(true);
  }, []);

  const isAuthenticated = Boolean(accessToken);

  return { isHydrated, isAuthenticated, accessToken, user };
}