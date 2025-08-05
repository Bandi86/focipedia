import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { auth } from '@/lib/auth';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock auth module
jest.mock('@/lib/auth', () => ({
  auth: {
    forgotPassword: jest.fn(),
  },
}));

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockAuth = auth as jest.Mocked<typeof auth>;

describe('ForgotPasswordForm', () => {
  const mockPush = jest.fn();
  const mockOnSuccess = jest.fn();
  const mockOnError = jest.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
    });

    jest.clearAllMocks();
  });

  it('should render forgot password form', () => {
    render(<ForgotPasswordForm />);

    expect(screen.getByText('Reset Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument();
  });

  it('should show validation error for invalid email', async () => {
    render(<ForgotPasswordForm />);

    const emailInput = screen.getByPlaceholderText(/email address/i);
    const submitButton = screen.getByRole('button', { name: /send reset link/i });

    await user.type(emailInput, 'invalid-email');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    });
  });

  it('should show validation error for empty email', async () => {
    render(<ForgotPasswordForm />);

    const submitButton = screen.getByRole('button', { name: /send reset link/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
  });

  it('should submit form with valid email and show success state', async () => {
    mockAuth.forgotPassword.mockResolvedValue({ message: 'Reset email sent' });

    render(<ForgotPasswordForm onSuccess={mockOnSuccess} />);

    const emailInput = screen.getByPlaceholderText(/email address/i);
    const submitButton = screen.getByRole('button', { name: /send reset link/i });

    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockAuth.forgotPassword).toHaveBeenCalledWith('test@example.com');
    });

    await waitFor(() => {
      expect(screen.getByText('Check Your Email')).toBeInTheDocument();
      expect(screen.getByText(/we've sent a password reset link/i)).toBeInTheDocument();
    });

    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it('should handle API error', async () => {
    mockAuth.forgotPassword.mockRejectedValue({
      response: { data: { message: 'User not found' } }
    });

    render(<ForgotPasswordForm onError={mockOnError} />);

    const emailInput = screen.getByPlaceholderText(/email address/i);
    const submitButton = screen.getByRole('button', { name: /send reset link/i });

    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledWith('User not found');
    });
  });

  it('should handle API error without response data', async () => {
    mockAuth.forgotPassword.mockRejectedValue(new Error('Network error'));

    render(<ForgotPasswordForm onError={mockOnError} />);

    const emailInput = screen.getByPlaceholderText(/email address/i);
    const submitButton = screen.getByRole('button', { name: /send reset link/i });

    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledWith('Failed to send password reset email');
    });
  });

  it('should show loading state during submission', async () => {
    mockAuth.forgotPassword.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(<ForgotPasswordForm />);

    const emailInput = screen.getByPlaceholderText(/email address/i);
    const submitButton = screen.getByRole('button', { name: /send reset link/i });

    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);

    expect(screen.getByText('Sending...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('should allow resending email in success state', async () => {
    mockAuth.forgotPassword.mockResolvedValue({ message: 'Reset email sent' });

    render(<ForgotPasswordForm />);

    // Submit form first
    const emailInput = screen.getByPlaceholderText(/email address/i);
    const submitButton = screen.getByRole('button', { name: /send reset link/i });

    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);

    // Wait for success state
    await waitFor(() => {
      expect(screen.getByText('Check Your Email')).toBeInTheDocument();
    });

    // Test resend functionality
    const resendButton = screen.getByText(/resend email/i);
    await user.click(resendButton);

    await waitFor(() => {
      expect(mockAuth.forgotPassword).toHaveBeenCalledTimes(2);
      expect(mockAuth.forgotPassword).toHaveBeenLastCalledWith('test@example.com');
    });
  });

  it('should navigate back to login', async () => {
    mockAuth.forgotPassword.mockResolvedValue({ message: 'Reset email sent' });

    render(<ForgotPasswordForm />);

    // Submit form first
    const emailInput = screen.getByPlaceholderText(/email address/i);
    const submitButton = screen.getByRole('button', { name: /send reset link/i });

    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);

    // Wait for success state
    await waitFor(() => {
      expect(screen.getByText('Check Your Email')).toBeInTheDocument();
    });

    // Test navigation
    const backButton = screen.getByText(/back to login/i);
    await user.click(backButton);

    expect(mockPush).toHaveBeenCalledWith('/login');
  });
});