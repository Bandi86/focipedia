import React from 'react';
import { render, screen } from '@/test-utils/render';
import userEvent from '@testing-library/user-event';
import LogoutButton from '../LogoutButton';

// Mock next/navigation useRouter
jest.mock('next/navigation', () => {
  const actual = jest.requireActual('next/navigation');
  return {
    ...actual,
    useRouter: () => ({
      push: jest.fn(),
      replace: jest.fn(),
      refresh: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      prefetch: jest.fn(),
    }),
  };
});

// Mock our auth library to spy on authStorage.clearAll
jest.mock('@/lib/auth/index', () => {
  const actual = jest.requireActual('@/lib/auth/index');
  return {
    ...actual,
    authStorage: {
      ...actual.authStorage,
      clearAll: jest.fn(),
    },
  };
});

describe('LogoutButton', () => {
  it('clears auth storage and navigates to /login on click', async () => {
    const user = userEvent.setup();
    const { useRouter } = jest.requireMock('next/navigation') as {
      useRouter: () => { push: jest.Mock };
    };
    const router = useRouter();
    const { authStorage } = jest.requireMock('@/lib/auth/index') as {
      authStorage: { clearAll: jest.Mock };
    };

    render(<LogoutButton />);

    const btn = screen.getByRole('button', { name: /log out/i });
    await user.click(btn);

    expect(authStorage.clearAll).toHaveBeenCalledTimes(1);
    expect(router.push).toHaveBeenCalledWith('/login');
  });
});