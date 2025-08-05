import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { EmailVerification } from './EmailVerification';
import { auth } from '@/lib/auth';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
  useRouter: jest.fn(),
}));

// Mock auth module
jest.mock('@/lib/auth', () => ({
  auth: {
    getCurrentUser: jest.fn(),
    verifyEmail: jest.fn(),
    resendEmailVerification: jest.fn(),
  },
}));

const mockUseSearchParams = useSearchParams as jest.MockedFunction<typeof useSearchParams>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockAuth = auth as jest.Mocked<typeof auth>;

describe('EmailVerification', () => {
  const mockPush = jest.fn();
  const mockOnSuccess = jest.fn();
  const mockOnError = jest.fn();

  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
    });

    mockUseSearchParams.mockReturnValue({
      get: jest.fn(),
      getAll: jest.fn(),
      has: jest.fn(),
      keys: jest.fn(),
      values: jest.fn(),
      entries: jest.fn(),
      forEach: jest.fn(),
      toString: jest.fn(),
    } as any);

    jest.clearAllMocks();
  });

  it('should render email verification component', () => {
    const mockSearchParams = mockUseSearchParams();
    (mockSearchParams.get as jest.Mock).mockReturnValue(null);
    mockAuth.getCurrentUser.mockReturnValue(null);

    render(<EmailVerification />);

    expect(screen.getByText('Email Verification')).toBeInTheDocument();
  });

  it('should automatically verify email when token is present in URL', async () => {
    const mockSearchParams = mockUseSearchParams();
    (mockSearchParams.get as jest.Mock).mockReturnValue('test-token');
    mockAuth.verifyEmail.mockResolvedValue({ message: 'Email verified successfully' });

    render(<EmailVerification onSuccess={mockOnSuccess} />);

    await waitFor(() => {
      expect(mockAuth.verifyEmail).toHaveBeenCalledWith('test-token');
    });

    await waitFor(() => {
      expect(screen.getByText('Email Verified!')).toBeInTheDocument();
    });

    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it('should handle verification error', async () => {
    const mockSearchParams = mockUseSearchParams();
    (mockSearchParams.get as jest.Mock).mockReturnValue('invalid-token');
    mockAuth.verifyEmail.mockRejectedValue({
      response: { data: { message: 'Invalid token' } }
    });

    render(<EmailVerification onError={mockOnError} />);

    await waitFor(() => {
      expect(screen.getByText('Verification Failed')).toBeInTheDocument();
    });

    expect(mockOnError).toHaveBeenCalledWith('Invalid token');
  });

  it('should handle expired token', async () => {
    const mockSearchParams = mockUseSearchParams();
    (mockSearchParams.get as jest.Mock).mockReturnValue('expired-token');
    mockAuth.verifyEmail.mockRejectedValue({
      response: { data: { message: 'Token expired' } }
    });

    render(<EmailVerification />);

    await waitFor(() => {
      expect(screen.getByText('Link Expired')).toBeInTheDocument();
    });
  });

  it('should allow resending verification email', async () => {
    const mockSearchParams = mockUseSearchParams();
    (mockSearchParams.get as jest.Mock).mockReturnValue(null);
    mockAuth.getCurrentUser.mockReturnValue({
      id: '1',
      email: 'test@example.com',
      username: 'testuser',
      displayName: 'Test User',
      isVerified: false,
    });
    mockAuth.resendEmailVerification.mockResolvedValue({ message: 'Email sent' });

    render(<EmailVerification />);

    const resendButton = screen.getByText('Resend Verification Email');
    fireEvent.click(resendButton);

    await waitFor(() => {
      expect(mockAuth.resendEmailVerification).toHaveBeenCalledWith('test@example.com');
    });
  });

  it('should show cooldown after resending email', async () => {
    const mockSearchParams = mockUseSearchParams();
    (mockSearchParams.get as jest.Mock).mockReturnValue(null);
    mockAuth.getCurrentUser.mockReturnValue({
      id: '1',
      email: 'test@example.com',
      username: 'testuser',
      displayName: 'Test User',
      isVerified: false,
    });
    mockAuth.resendEmailVerification.mockResolvedValue({ message: 'Email sent' });

    render(<EmailVerification />);

    const resendButton = screen.getByText('Resend Verification Email');
    fireEvent.click(resendButton);

    await waitFor(() => {
      expect(screen.getByText(/Resend in \d+s/)).toBeInTheDocument();
    });
  });

  it('should redirect to login when no user is logged in', () => {
    const mockSearchParams = mockUseSearchParams();
    (mockSearchParams.get as jest.Mock).mockReturnValue(null);
    mockAuth.getCurrentUser.mockReturnValue(null);

    render(<EmailVerification />);

    const loginButton = screen.getByText('Go to Login');
    fireEvent.click(loginButton);

    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('should redirect to dashboard after successful verification', async () => {
    const mockSearchParams = mockUseSearchParams();
    (mockSearchParams.get as jest.Mock).mockReturnValue('valid-token');
    mockAuth.verifyEmail.mockResolvedValue({ message: 'Email verified successfully' });

    render(<EmailVerification />);

    await waitFor(() => {
      expect(screen.getByText('Email Verified!')).toBeInTheDocument();
    });

    // Wait for the redirect timeout
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    }, { timeout: 3000 });
  });
});