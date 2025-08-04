import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './LoginForm';
import { auth } from '@/lib/auth';

// Mock the auth module
jest.mock('@/lib/auth', () => ({
  auth: {
    login: jest.fn(),
  },
}));

// Mock Next.js router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('LoginForm', () => {
  const mockAuth = auth as jest.Mocked<typeof auth>;
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render login form with all required elements', () => {
      render(<LoginForm />);

      // Check for form elements
      expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
      expect(screen.getByText(/forgot your password/i)).toBeInTheDocument();
      expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
      expect(screen.getByText(/sign up/i)).toBeInTheDocument();
    });

    it('should have proper form accessibility attributes', () => {
      render(<LoginForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toHaveAttribute('placeholder', 'Email address');
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(passwordInput).toHaveAttribute('placeholder', 'Password');
      expect(submitButton).toHaveAttribute('type', 'submit');
    });

    it('should render with dark mode classes', () => {
      render(<LoginForm />);

      const container = screen.getByRole('main') || document.querySelector('.bg-white');
      expect(container).toHaveClass('dark:bg-gray-800');
    });
  });

  describe('Form Validation', () => {
    it('should show validation error for invalid email format', async () => {
      render(<LoginForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'invalid-email');
      await user.tab(); // Trigger blur event

      await waitFor(() => {
        expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
      });
    });

    it('should show validation error for empty email', async () => {
      render(<LoginForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      await user.click(emailInput);
      await user.tab(); // Trigger blur event

      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      });
    });

    it('should show validation error for password too short', async () => {
      render(<LoginForm />);

      const passwordInput = screen.getByLabelText(/password/i);
      await user.type(passwordInput, '123');
      await user.tab(); // Trigger blur event

      await waitFor(() => {
        expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
      });
    });

    it('should show validation error for empty password', async () => {
      render(<LoginForm />);

      const passwordInput = screen.getByLabelText(/password/i);
      await user.click(passwordInput);
      await user.tab(); // Trigger blur event

      await waitFor(() => {
        expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      });
    });

    it('should clear validation errors when user starts typing', async () => {
      render(<LoginForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      await user.click(emailInput);
      await user.tab(); // Trigger validation error

      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      });

      await user.type(emailInput, 'test@example.com');

      await waitFor(() => {
        expect(screen.queryByText(/email is required/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('should submit form with valid data successfully', async () => {
      const onSuccess = jest.fn();
      mockAuth.login.mockResolvedValue({} as any);

      render(<LoginForm onSuccess={onSuccess} />);

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockAuth.login).toHaveBeenCalledWith('test@example.com', 'password123');
        expect(onSuccess).toHaveBeenCalled();
        expect(mockPush).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('should show loading state during submission', async () => {
      mockAuth.login.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

      render(<LoginForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      expect(screen.getByRole('button', { name: /signing in/i })).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });

    it('should handle login error and call onError callback', async () => {
      const onError = jest.fn();
      const errorMessage = 'Invalid credentials';
      mockAuth.login.mockRejectedValue({
        response: { data: { message: errorMessage } }
      });

      render(<LoginForm onError={onError} />);

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(errorMessage);
      });
    });

    it('should handle login error without response data', async () => {
      const onError = jest.fn();
      mockAuth.login.mockRejectedValue(new Error('Network error'));

      render(<LoginForm onError={onError} />);

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith('Login failed');
      });
    });

    it('should not submit form with invalid data', async () => {
      render(<LoginForm />);

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(submitButton);

      expect(mockAuth.login).not.toHaveBeenCalled();
    });

    it('should submit form on Enter key press', async () => {
      mockAuth.login.mockResolvedValue({} as any);

      render(<LoginForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(mockAuth.login).toHaveBeenCalledWith('test@example.com', 'password123');
      });
    });
  });

  describe('User Interactions', () => {
    it('should focus email input on first render', () => {
      render(<LoginForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      expect(emailInput).toHaveFocus();
    });

    it('should navigate to forgot password page', async () => {
      render(<LoginForm />);

      const forgotPasswordLink = screen.getByText(/forgot your password/i);
      expect(forgotPasswordLink).toHaveAttribute('href', '/forgot-password');
    });

    it('should navigate to register page', async () => {
      render(<LoginForm />);

      const signUpLink = screen.getByText(/sign up/i);
      expect(signUpLink).toHaveAttribute('href', '/register');
    });

    it('should handle keyboard navigation', async () => {
      render(<LoginForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      // Tab through form elements
      await user.tab();
      expect(emailInput).toHaveFocus();

      await user.tab();
      expect(passwordInput).toHaveFocus();

      await user.tab();
      expect(submitButton).toHaveFocus();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels and roles', () => {
      render(<LoginForm />);

      expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('should announce validation errors to screen readers', async () => {
      render(<LoginForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      await user.click(emailInput);
      await user.tab();

      await waitFor(() => {
        const errorMessage = screen.getByText(/email is required/i);
        expect(errorMessage).toHaveAttribute('role', 'alert');
      });
    });

    it('should maintain focus management during form submission', async () => {
      mockAuth.login.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

      render(<LoginForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      // Button should remain focused during loading
      expect(submitButton).toHaveFocus();
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      const onError = jest.fn();
      mockAuth.login.mockRejectedValue(new Error('Network error'));

      render(<LoginForm onError={onError} />);

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith('Login failed');
      });
    });

    it('should re-enable submit button after error', async () => {
      const onError = jest.fn();
      mockAuth.login.mockRejectedValue(new Error('Network error'));

      render(<LoginForm onError={onError} />);

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
      });
    });
  });
}); 