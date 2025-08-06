'use client';

import React from 'react';
import { useAuthState } from '@/lib/auth/index';

export default function AuthStatusBadge() {
  const { isHydrated, isAuthenticated } = useAuthState();

  let label = 'Loading…';
  if (isHydrated) {
    label = isAuthenticated ? 'Authenticated' : 'Guest';
  }

  return (
    <span
      aria-live="polite"
      className={`inline-flex items-center rounded px-2 py-1 text-sm ${
        !isHydrated
          ? 'bg-gray-200 text-gray-700'
          : isAuthenticated
          ? 'bg-green-200 text-green-800'
          : 'bg-yellow-200 text-yellow-800'
      }`}
    >
      {label}
    </span>
  );
}