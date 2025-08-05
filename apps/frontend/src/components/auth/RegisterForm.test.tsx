import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RegisterForm } from './RegisterForm';
import { auth } from '@/lib/auth';

// Mock the auth module
jest.mock('@/lib/auth', () => ({
  auth: {
    register: jest.fn(),
    resendEmailVerification: jest.fn(),
  },
}));

// Mock Next.js router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('RegisterForm', () => {
  const mockAuth = auth as jest.Mocked<typeof auth>;
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render registration form with all required elements', () => {
      render(<RegisterForm />);

      // Check for form elements
      expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/email address/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/display name/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/^password$/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/confirm password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
      expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
      expect(screen.getByText(/sign in/i)).toBeInTheDocument();
    });

    it('should have proper form accessibility attributes', () => {
      render(<RegisterForm />);

      const emailInput = screen.getByPlaceholderText(/email address/i);
      const usernameInput = screen.getByPlaceholderText(/username/i);

      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toHaveAttribute('name', 'email');
      expect(usernameInput).toHaveAttribute('type', 'text');
      expect(usernameInput).toHaveAttribute('name', 'username');
    });

    it('should display loading state when submitting', async () => {
      mockAuth.register.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

      render(<RegisterForm />);

      const emailInput = screen.getByPlaceholderText(/email address/i);
      const usernameInput = screen.getByPlaceholderText(/username/i);
      const displayNameInput = screen.getByPlaceholderText(/display name/i);
      const passwordInput = screen.getByPlaceholderText(/^password$/i);
      const confirmPasswordInput = screen.getByPlaceholderText(/confirm password/i);
      const submitButton = screen.getByRole('button', { name: /create account/i });

      // Fill out the form
      await user.type(emailInput, 'test@example.com');
      await user.type(usernameInput, 'testuser');
      await user.type(displayNameInput, 'Test User');
      await user.type(passwordInput, 'Password123');
      await user.type(confirmPasswordInput, 'Password123');

      // Submit the form
      await user.click(submitButton);

      // Check loading state
      expect(screen.getByText(/creating account/i)).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Form Validation', () => {
    it('should show validation errors for empty fields', async () => {
      render(<RegisterForm />);

      const submitButton = screen.getByRole('button', { name: /create account/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
        expect(screen.getByText(/username is required/i)).toBeInTheDocument();
        expect(screen.getByText(/display name is required/i)).toBeInTheDocument();
        expect(screen.getAllByText(/password is required/i)).toHaveLength(2);
        expect(screen.getByText(/confirm password is required/i)).toBeInTheDocument();
      });
    });

    it('should show validation error for invalid email', async () => {
      render(<RegisterForm />);

      const emailInput = screen.getByPlaceholderText(/email address/i);
      const submitButton = screen.getByRole('button', { name: /create account/i });

      await user.type(emailInput, 'invalid-email');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
      });
    });

    it('should show validation error for weak password', async () => {
      render(<RegisterForm />);

      const passwordInput = screen.getByPlaceholderText(/^password$/i);
      const submitButton = screen.getByRole('button', { name: /create account/i });

      await user.type(passwordInput, 'weak');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
      });
    });

    it('should show validation error for password mismatch', async () => {
      render(<RegisterForm />);

      const passwordInput = screen.getByPlaceholderText(/^password$/i);
      const confirmPasswordInput = screen.getByPlaceholderText(/confirm password/i);
      const submitButton = screen.getByRole('button', { name: /create account/i });

      await user.type(passwordInput, 'Password123');
      await user.type(confirmPasswordInput, 'DifferentPassword123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/passwords must match/i)).toBeInTheDocument();
      });
    });

    it('should show validation error for invalid username', async () => {
      render(<RegisterForm />);

      const usernameInput = screen.getByPlaceholderText(/username/i);
      const submitButton = screen.getByRole('button', { name: /create account/i });

      await user.type(usernameInput, 'ab');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/username must be at least 3 characters/i)).toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    const validFormData = {
      email: 'test@example.com',
      username: 'testuser',
      displayName: 'Test User',
      password: 'Password123',
      confirmPassword: 'Password123',
    };

    it('should submit form with valid data and show success message', async () => {
      const mockAuthResponse = {
        accessToken: 'token',
        refreshToken: 'refresh',
        tokenType: 'Bearer',
        expiresIn: 3600,
        user: {
          id: '1',
          email: 'test@example.com',
          username: 'testuser',
          displayName: 'Test User',
          isVerified: false,
        },
      };

      mockAuth.register.mockResolvedValue(mockAuthResponse);

      render(<RegisterForm />);

      // Fill out the form
      await user.type(screen.getByPlaceholderText(/email address/i), validFormData.email);
      await user.type(screen.getByPlaceholderText(/username/i), validFormData.username);
      await user.type(screen.getByPlaceholderText(/display name/i), validFormData.displayName);
      await user.type(screen.getByPlaceholderText(/^password$/i), validFormData.password);
      await user.type(screen.getByPlaceholderText(/confirm password/i), validFormData.confirmPassword);

      // Submit the form
      await user.click(screen.getByRole('button', { name: /create account/i }));

      await waitFor(() => {
        expect(mockAuth.register).toHaveBeenCalledWith({
          email: validFormData.email,
          username: validFormData.username,
          displayName: validFormData.displayName,
          password: validFormData.password,
        });
      });

      // Should show success message
      await waitFor(() => {
        expect(screen.getByText(/account created/i)).toBeInTheDocument();
        expect(screen.getByText(/we've sent a verification email/i)).toBeInTheDocument();
      });
    });

    it('should handle registration error and call onError callback', async () => {
      const onError = jest.fn();
      mockAuth.register.mockRejectedValue({
        response: { data: { message: 'User already exists' } }
      });

      render(<RegisterForm onError={onError} />);

      const emailInput = screen.getByPlaceholderText(/email address/i);
      const usernameInput = screen.getByPlaceholderText(/username/i);
      const displayNameInput = screen.getByPlaceholderText(/display name/i);
      const passwordInput = screen.getByPlaceholderText(/^password$/i);
      const confirmPasswordInput = screen.getByPlaceholderText(/confirm password/i);

      await user.type(emailInput, validFormData.email);
      await user.type(usernameInput, validFormData.username);
      await user.type(displayNameInput, validFormData.displayName);
      await user.type(passwordInput, validFormData.password);
      await user.type(confirmPasswordInput, validFormData.confirmPassword);

      await user.click(screen.getByRole('button', { name: /create account/i }));

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith('User already exists');
      });
    });

    it('should handle registration error without response data', async () => {
      const onError = jest.fn();
      mockAuth.register.mockRejectedValue(new Error('Network error'));

      render(<RegisterForm onError={onError} />);

      const emailInput = screen.getByPlaceholderText(/email address/i);
      const usernameInput = screen.getByPlaceholderText(/username/i);
      const displayNameInput = screen.getByPlaceholderText(/display name/i);
      const passwordInput = screen.getByPlaceholderText(/^password$/i);
      const confirmPasswordInput = screen.getByPlaceholderText(/confirm password/i);

      await user.type(emailInput, validFormData.email);
      await user.type(usernameInput, validFormData.username);
      await user.type(displayNameInput, validFormData.displayName);
      await user.type(passwordInput, validFormData.password);
      await user.type(confirmPasswordInput, validFormData.confirmPassword);

      await user.click(screen.getByRole('button', { name: /create account/i }));

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith('Registration failed');
      });
    });
  });

  describe('Success State', () => {
    it('should show success state and allow resending verification email', async () => {
      const mockAuthResponse = {
        accessToken: 'token',
        refreshToken: 'refresh',
        tokenType: 'Bearer',
        expiresIn: 3600,
        user: {
          id: '1',
          email: 'test@example.com',
          username: 'testuser',
          displayName: 'Test User',
          isVerified: false,
        },
      };

      mockAuth.register.mockResolvedValue(mockAuthResponse);
      mockAuth.resendEmailVerification.mockResolvedValue({ message: 'Email sent' });

      render(<RegisterForm />);

      // Fill out and submit the form
      await user.type(screen.getByPlaceholderText(/email address/i), 'test@example.com');
      await user.type(screen.getByPlaceholderText(/username/i), 'testuser');
      await user.type(screen.getByPlaceholderText(/display name/i), 'Test User');
      await user.type(screen.getByPlaceholderText(/^password$/i), 'Password123');
      await user.type(screen.getByPlaceholderText(/confirm password/i), 'Password123');
      await user.click(screen.getByRole('button', { name: /create account/i }));

      // Wait for success state
      await waitFor(() => {
        expect(screen.getByText(/account created/i)).toBeInTheDocument();
      });

      // Test resend verification email
      const resendButton = screen.getByText(/resend verification email/i);
      await user.click(resendButton);

      await waitFor(() => {
        expect(mockAuth.resendEmailVerification).toHaveBeenCalledWith('test@example.com');
      });
    });

    it('should navigate to verification page', async () => {
      const mockAuthResponse = {
        accessToken: 'token',
        refreshToken: 'refresh',
        tokenType: 'Bearer',
        expiresIn: 3600,
        user: {
          id: '1',
          email: 'test@example.com',
          username: 'testuser',
          displayName: 'Test User',
          isVerified: false,
        },
      };

      mockAuth.register.mockResolvedValue(mockAuthResponse);

      render(<RegisterForm />);

      // Fill out and submit the form
      await user.type(screen.getByPlaceholderText(/email address/i), 'test@example.com');
      await user.type(screen.getByPlaceholderText(/username/i), 'testuser');
      await user.type(screen.getByPlaceholderText(/display name/i), 'Test User');
      await user.type(screen.getByPlaceholderText(/^password$/i), 'Password123');
      await user.type(screen.getByPlaceholderText(/confirm password/i), 'Password123');
      await user.click(screen.getByRole('button', { name: /create account/i }));

      // Wait for success state
      await waitFor(() => {
        expect(screen.getByText(/account created/i)).toBeInTheDocument();
      });

      // Test navigation to verification page
      const verificationButton = screen.getByText(/go to verification page/i);
      await user.click(verificationButton);

      expect(mockPush).toHaveBeenCalledWith('/verify-email');
    });
  });
});