import React from 'react';
import { render, screen } from '@/test-utils/render';
import AuthStatusBadge from '../AuthStatusBadge';

// We will mock useAuthState from our auth library entrypoint
jest.mock('@/lib/auth/index', () => {
  const actual = jest.requireActual('@/lib/auth/index');
  return {
    ...actual,
    useAuthState: jest.fn(),
  };
});

describe('AuthStatusBadge', () => {
  const { useAuthState } = jest.requireMock('@/lib/auth/index') as {
    useAuthState: jest.Mock;
  };

  afterEach(() => {
    useAuthState.mockReset();
  });

  it('renders "Loading…" when not hydrated', () => {
    useAuthState.mockReturnValue({
      isHydrated: false,
      isAuthenticated: false,
      accessToken: null,
      user: null,
    });

    render(<AuthStatusBadge />);
    expect(screen.getByText('Loading…')).toBeInTheDocument();
  });

  it('renders "Authenticated" when hydrated and authenticated', () => {
    useAuthState.mockReturnValue({
      isHydrated: true,
      isAuthenticated: true,
      accessToken: 'token',
      user: { id: 'u1' },
    });

    render(<AuthStatusBadge />);
    expect(screen.getByText('Authenticated')).toBeInTheDocument();
  });

  it('renders "Guest" when hydrated and not authenticated', () => {
    useAuthState.mockReturnValue({
      isHydrated: true,
      isAuthenticated: false,
      accessToken: null,
      user: null,
    });

    render(<AuthStatusBadge />);
    expect(screen.getByText('Guest')).toBeInTheDocument();
  });
});