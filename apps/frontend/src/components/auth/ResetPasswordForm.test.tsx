import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useSearchParams, useRouter } from 'next/navigation';
import { ResetPasswordForm } from './ResetPasswordForm';
import { auth } from '@/lib/auth';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
  useRouter: jest.fn(),
}));

// Mock auth module
jest.mock('@/lib/auth', () => ({
  auth: {
    resetPassword: jest.fn(),
  },
}));

const mockUseSearchParams = useSearchParams as jest.MockedFunction<typeof useSearchParams>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockAuth = auth as jest.Mocked<typeof auth>;

describe('ResetPasswordForm', () => {
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

  it('should render reset password form with valid token', () => {
    const mockSearchParams = mockUseSearchParams();
    (mockSearchParams.get as jest.Mock).mockReturnValue('valid-token');

    render(<ResetPasswordForm />);

    expect(screen.getByText('Set New Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('New password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm new password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset password/i })).toBeInTheDocument();
  });

  it('should show error state when token is missing', () => {
    const mockSearchParams = mockUseSearchParams();
    (mockSearchParams.get as jest.Mock).mockReturnValue(null);

    render(<ResetPasswordForm />);

    expect(screen.getByText('Invalid Reset Link')).toBeInTheDocument();
    expect(screen.getByText(/invalid or missing reset token/i)).toBeInTheDocument();
  });

  it('should show validation errors for empty fields', async () => {
    const mockSearchParams = mockUseSearchParams();
    (mockSearchParams.get as jest.Mock).mockReturnValue('valid-token');

    render(<ResetPasswordForm />);

    const submitButton = screen.getByRole('button', { name: /reset password/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getAllByText(/password is required/i)).toHaveLength(2);
    });
  });

  it('should show validation error for weak password', async () => {
    const mockSearchParams = mockUseSearchParams();
    (mockSearchParams.get as jest.Mock).mockReturnValue('valid-token');

    render(<ResetPasswordForm />);

    const inputs = screen.getAllByDisplayValue('');
    const passwordInput = inputs[0]; // First password input
    const submitButton = screen.getByRole('button', { name: /reset password/i });

    await user.type(passwordInput, 'weak');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
    });
  });

  it('should show validation error for password mismatch', async () => {
    const mockSearchParams = mockUseSearchParams();
    (mockSearchParams.get as jest.Mock).mockReturnValue('valid-token');

    render(<ResetPasswordForm />);

    const inputs = screen.getAllByDisplayValue('');
    const passwordInput = inputs[0]; // First password input
    const confirmPasswordInput = inputs[1]; // Second password input
    const submitButton = screen.getByRole('button', { name: /reset password/i });

    await user.type(passwordInput, 'Password123');
    await user.type(confirmPasswordInput, 'DifferentPassword123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/passwords must match/i)).toBeInTheDocument();
    });
  });

  it('should show password strength indicator', async () => {
    const mockSearchParams = mockUseSearchParams();
    (mockSearchParams.get as jest.Mock).mockReturnValue('valid-token');

    render(<ResetPasswordForm />);

    const inputs = screen.getAllByDisplayValue('');
    const passwordInput = inputs[0]; // First password input

    // Test weak password
    await user.type(passwordInput, 'weak');
    expect(screen.getByText('Very Weak')).toBeInTheDocument();

    // Clear and test strong password
    await user.clear(passwordInput);
    await user.type(passwordInput, 'StrongPassword123!');
    expect(screen.getByText('Strong')).toBeInTheDocument();
  });

  it('should submit form with valid data and show success state', async () => {
    const mockSearchParams = mockUseSearchParams();
    (mockSearchParams.get as jest.Mock).mockReturnValue('valid-token');
    mockAuth.resetPassword.mockResolvedValue({ message: 'Password reset successful' });

    render(<ResetPasswordForm onSuccess={mockOnSuccess} />);

    const inputs = screen.getAllByDisplayValue('');
    const passwordInput = inputs[0]; // First password input
    const confirmPasswordInput = inputs[1]; // Second password input
    const submitButton = screen.getByRole('button', { name: /reset password/i });

    await user.type(passwordInput, 'NewPassword123');
    await user.type(confirmPasswordInput, 'NewPassword123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockAuth.resetPassword).toHaveBeenCalledWith('valid-token', 'NewPassword123');
    });

    await waitFor(() => {
      expect(screen.getByText('Password Reset Successful')).toBeInTheDocument();
    });

    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it('should handle API error', async () => {
    const mockSearchParams = mockUseSearchParams();
    (mockSearchParams.get as jest.Mock).mockReturnValue('valid-token');
    mockAuth.resetPassword.mockRejectedValue({
      response: { data: { message: 'Token expired' } }
    });

    render(<ResetPasswordForm onError={mockOnError} />);

    const inputs = screen.getAllByDisplayValue('');
    const passwordInput = inputs[0]; // First password input
    const confirmPasswordInput = inputs[1]; // Second password input
    const submitButton = screen.getByRole('button', { name: /reset password/i });

    await user.type(passwordInput, 'NewPassword123');
    await user.type(confirmPasswordInput, 'NewPassword123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledWith('Token expired');
    });
  });

  it('should show loading state during submission', async () => {
    const mockSearchParams = mockUseSearchParams();
    (mockSearchParams.get as jest.Mock).mockReturnValue('valid-token');
    mockAuth.resetPassword.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(<ResetPasswordForm />);

    const inputs = screen.getAllByDisplayValue('');
    const passwordInput = inputs[0]; // First password input
    const confirmPasswordInput = inputs[1]; // Second password input
    const submitButton = screen.getByRole('button', { name: /reset password/i });

    await user.type(passwordInput, 'NewPassword123');
    await user.type(confirmPasswordInput, 'NewPassword123');
    await user.click(submitButton);

    expect(screen.getByText('Resetting...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('should navigate to login after successful reset', async () => {
    const mockSearchParams = mockUseSearchParams();
    (mockSearchParams.get as jest.Mock).mockReturnValue('valid-token');
    mockAuth.resetPassword.mockResolvedValue({ message: 'Password reset successful' });

    render(<ResetPasswordForm />);

    // Submit form first
    const inputs = screen.getAllByDisplayValue('');
    const passwordInput = inputs[0]; // First password input
    const confirmPasswordInput = inputs[1]; // Second password input
    const submitButton = screen.getByRole('button', { name: /reset password/i });

    await user.type(passwordInput, 'NewPassword123');
    await user.type(confirmPasswordInput, 'NewPassword123');
    await user.click(submitButton);

    // Wait for success state
    await waitFor(() => {
      expect(screen.getByText('Password Reset Successful')).toBeInTheDocument();
    });

    // Test navigation
    const signInButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(signInButton);

    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('should navigate to forgot password from error state', async () => {
    const mockSearchParams = mockUseSearchParams();
    (mockSearchParams.get as jest.Mock).mockReturnValue(null);

    render(<ResetPasswordForm />);

    const requestNewButton = screen.getByText(/request new reset link/i);
    await user.click(requestNewButton);

    expect(mockPush).toHaveBeenCalledWith('/forgot-password');
  });
});