'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { authStorage } from '@/lib/auth/index';

export default function LogoutButton() {
  const router = useRouter();

  const onClick = () => {
    authStorage.clearAll();
    router.push('/login');
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-900"
      aria-label="Log out"
    >
      Log out
    </button>
  );
}