import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RegisterForm } from './RegisterForm';
import { auth } from '@/lib/auth';

// Mock the auth module
jest.mock('@/lib/auth', () => ({
  auth: {
    register: jest.fn(),
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
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/display name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
      expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
      expect(screen.getByText(/sign in/i)).toBeInTheDocument();
    });

    it('should have proper form accessibility attributes', () => {
      render(<RegisterForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      const usernameInput = screen.getByLabelText(/username/i);
      const displayNameInput = screen.getByLabelText(/display name/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const submitButton = screen.getByRole('button', { name: /create account/i });

      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toHaveAttribute('placeholder', 'Email address');
      expect(usernameInput).toHaveAttribute('type', 'text');
      expect(usernameInput).toHaveAttribute('placeholder', 'Username');
      expect(displayNameInput).toHaveAttribute('type', 'text');
      expect(displayNameInput).toHaveAttribute('placeholder', 'Display name');
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(passwordInput).toHaveAttribute('placeholder', 'Password');
      expect(confirmPasswordInput).toHaveAttribute('type', 'password');
      expect(confirmPasswordInput).toHaveAttribute('placeholder', 'Confirm password');
      expect(submitButton).toHaveAttribute('type', 'submit');
    });
  });

  describe('Form Validation', () => {
    describe('Email Validation', () => {
      it('should show validation error for invalid email format', async () => {
        render(<RegisterForm />);

        const emailInput = screen.getByLabelText(/email address/i);
        await user.type(emailInput, 'invalid-email');
        await user.tab();

        await waitFor(() => {
          expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
        });
      });

      it('should show validation error for empty email', async () => {
        render(<RegisterForm />);

        const emailInput = screen.getByLabelText(/email address/i);
        await user.click(emailInput);
        await user.tab();

        await waitFor(() => {
          expect(screen.getByText(/email is required/i)).toBeInTheDocument();
        });
      });
    });

    describe('Username Validation', () => {
      it('should show validation error for username too short', async () => {
        render(<RegisterForm />);

        const usernameInput = screen.getByLabelText(/username/i);
        await user.type(usernameInput, 'ab');
        await user.tab();

        await waitFor(() => {
          expect(screen.getByText(/username must be at least 3 characters/i)).toBeInTheDocument();
        });
      });

      it('should show validation error for username too long', async () => {
        render(<RegisterForm />);

        const usernameInput = screen.getByLabelText(/username/i);
        await user.type(usernameInput, 'a'.repeat(21));
        await user.tab();

        await waitFor(() => {
          expect(screen.getByText(/username must be less than 20 characters/i)).toBeInTheDocument();
        });
      });

      it('should show validation error for invalid username characters', async () => {
        render(<RegisterForm />);

        const usernameInput = screen.getByLabelText(/username/i);
        await user.type(usernameInput, 'user@name');
        await user.tab();

        await waitFor(() => {
          expect(screen.getByText(/username can only contain letters, numbers, and underscores/i)).toBeInTheDocument();
        });
      });

      it('should accept valid username', async () => {
        render(<RegisterForm />);

        const usernameInput = screen.getByLabelText(/username/i);
        await user.type(usernameInput, 'valid_username123');
        await user.tab();

        await waitFor(() => {
          expect(screen.queryByText(/username can only contain letters, numbers, and underscores/i)).not.toBeInTheDocument();
        });
      });
    });

    describe('Display Name Validation', () => {
      it('should show validation error for display name too short', async () => {
        render(<RegisterForm />);

        const displayNameInput = screen.getByLabelText(/display name/i);
        await user.type(displayNameInput, 'a');
        await user.tab();

        await waitFor(() => {
          expect(screen.getByText(/display name must be at least 2 characters/i)).toBeInTheDocument();
        });
      });

      it('should show validation error for display name too long', async () => {
        render(<RegisterForm />);

        const displayNameInput = screen.getByLabelText(/display name/i);
        await user.type(displayNameInput, 'a'.repeat(51));
        await user.tab();

        await waitFor(() => {
          expect(screen.getByText(/display name must be less than 50 characters/i)).toBeInTheDocument();
        });
      });
    });

    describe('Password Validation', () => {
      it('should show validation error for password too short', async () => {
        render(<RegisterForm />);

        const passwordInput = screen.getByLabelText(/password/i);
        await user.type(passwordInput, '123');
        await user.tab();

        await waitFor(() => {
          expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
        });
      });

      it('should show validation error for password without uppercase letter', async () => {
        render(<RegisterForm />);

        const passwordInput = screen.getByLabelText(/password/i);
        await user.type(passwordInput, 'password123');
        await user.tab();

        await waitFor(() => {
          expect(screen.getByText(/password must contain at least one uppercase letter, one lowercase letter, and one number/i)).toBeInTheDocument();
        });
      });

      it('should show validation error for password without lowercase letter', async () => {
        render(<RegisterForm />);

        const passwordInput = screen.getByLabelText(/password/i);
        await user.type(passwordInput, 'PASSWORD123');
        await user.tab();

        await waitFor(() => {
          expect(screen.getByText(/password must contain at least one uppercase letter, one lowercase letter, and one number/i)).toBeInTheDocument();
        });
      });

      it('should show validation error for password without number', async () => {
        render(<RegisterForm />);

        const passwordInput = screen.getByLabelText(/password/i);
        await user.type(passwordInput, 'Password');
        await user.tab();

        await waitFor(() => {
          expect(screen.getByText(/password must contain at least one uppercase letter, one lowercase letter, and one number/i)).toBeInTheDocument();
        });
      });

      it('should accept valid password', async () => {
        render(<RegisterForm />);

        const passwordInput = screen.getByLabelText(/password/i);
        await user.type(passwordInput, 'ValidPass123');
        await user.tab();

        await waitFor(() => {
          expect(screen.queryByText(/password must contain at least one uppercase letter, one lowercase letter, and one number/i)).not.toBeInTheDocument();
        });
      });
    });

    describe('Confirm Password Validation', () => {
      it('should show validation error when passwords do not match', async () => {
        render(<RegisterForm />);

        const passwordInput = screen.getByLabelText(/password/i);
        const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

        await user.type(passwordInput, 'ValidPass123');
        await user.type(confirmPasswordInput, 'DifferentPass123');
        await user.tab();

        await waitFor(() => {
          expect(screen.getByText(/passwords must match/i)).toBeInTheDocument();
        });
      });

      it('should accept matching passwords', async () => {
        render(<RegisterForm />);

        const passwordInput = screen.getByLabelText(/password/i);
        const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

        await user.type(passwordInput, 'ValidPass123');
        await user.type(confirmPasswordInput, 'ValidPass123');
        await user.tab();

        await waitFor(() => {
          expect(screen.queryByText(/passwords must match/i)).not.toBeInTheDocument();
        });
      });
    });
  });

  describe('Form Submission', () => {
    const validFormData = {
      email: 'test@example.com',
      username: 'testuser',
      displayName: 'Test User',
      password: 'ValidPass123',
      confirmPassword: 'ValidPass123',
    };

    it('should submit form with valid data successfully', async () => {
      const onSuccess = jest.fn();
      mockAuth.register.mockResolvedValue({} as any);

      render(<RegisterForm onSuccess={onSuccess} />);

      const emailInput = screen.getByLabelText(/email address/i);
      const usernameInput = screen.getByLabelText(/username/i);
      const displayNameInput = screen.getByLabelText(/display name/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const submitButton = screen.getByRole('button', { name: /create account/i });

      await user.type(emailInput, validFormData.email);
      await user.type(usernameInput, validFormData.username);
      await user.type(displayNameInput, validFormData.displayName);
      await user.type(passwordInput, validFormData.password);
      await user.type(confirmPasswordInput, validFormData.confirmPassword);
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockAuth.register).toHaveBeenCalledWith({
          email: validFormData.email,
          username: validFormData.username,
          displayName: validFormData.displayName,
          password: validFormData.password,
        });
        expect(onSuccess).toHaveBeenCalled();
        expect(mockPush).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('should show loading state during submission', async () => {
      mockAuth.register.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

      render(<RegisterForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      const usernameInput = screen.getByLabelText(/username/i);
      const displayNameInput = screen.getByLabelText(/display name/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const submitButton = screen.getByRole('button', { name: /create account/i });

      await user.type(emailInput, validFormData.email);
      await user.type(usernameInput, validFormData.username);
      await user.type(displayNameInput, validFormData.displayName);
      await user.type(passwordInput, validFormData.password);
      await user.type(confirmPasswordInput, validFormData.confirmPassword);
      await user.click(submitButton);

      expect(screen.getByRole('button', { name: /creating account/i })).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });

    it('should handle registration error and call onError callback', async () => {
      const onError = jest.fn();
      const errorMessage = 'User with this email already exists';
      mockAuth.register.mockRejectedValue({
        response: { data: { message: errorMessage } }
      });

      render(<RegisterForm onError={onError} />);

      const emailInput = screen.getByLabelText(/email address/i);
      const usernameInput = screen.getByLabelText(/username/i);
      const displayNameInput = screen.getByLabelText(/display name/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const submitButton = screen.getByRole('button', { name: /create account/i });

      await user.type(emailInput, validFormData.email);
      await user.type(usernameInput, validFormData.username);
      await user.type(displayNameInput, validFormData.displayName);
      await user.type(passwordInput, validFormData.password);
      await user.type(confirmPasswordInput, validFormData.confirmPassword);
      await user.click(submitButton);

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(errorMessage);
      });
    });

    it('should handle registration error without response data', async () => {
      const onError = jest.fn();
      mockAuth.register.mockRejectedValue(new Error('Network error'));

      render(<RegisterForm onError={onError} />);

      const emailInput = screen.getByLabelText(/email address/i);
      const usernameInput = screen.getByLabelText(/username/i);
      const displayNameInput = screen.getByLabelText(/display name/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const submitButton = screen.getByRole('button', { name: /create account/i });

      await user.type(emailInput, validFormData.email);
      await user.type(usernameInput, validFormData.username);
      await user.type(displayNameInput, validFormData.displayName);
      await user.type(passwordInput, validFormData.password);
      await user.type(confirmPasswordInput, validFormData.confirmPassword);
      await user.click(submitButton);

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith('Registration failed');
      });
    });

    it('should not submit form with invalid data', async () => {
      render(<RegisterForm />);

      const submitButton = screen.getByRole('button', { name: /create account/i });
      await user.click(submitButton);

      expect(mockAuth.register).not.toHaveBeenCalled();
    });

    it('should submit form on Enter key press', async () => {
      mockAuth.register.mockResolvedValue({} as any);

      render(<RegisterForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      const usernameInput = screen.getByLabelText(/username/i);
      const displayNameInput = screen.getByLabelText(/display name/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

      await user.type(emailInput, validFormData.email);
      await user.type(usernameInput, validFormData.username);
      await user.type(displayNameInput, validFormData.displayName);
      await user.type(passwordInput, validFormData.password);
      await user.type(confirmPasswordInput, validFormData.confirmPassword);
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(mockAuth.register).toHaveBeenCalledWith({
          email: validFormData.email,
          username: validFormData.username,
          displayName: validFormData.displayName,
          password: validFormData.password,
        });
      });
    });
  });

  describe('User Interactions', () => {
    it('should navigate to login page', async () => {
      render(<RegisterForm />);

      const signInLink = screen.getByText(/sign in/i);
      expect(signInLink).toHaveAttribute('href', '/login');
    });

    it('should handle keyboard navigation', async () => {
      render(<RegisterForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      const usernameInput = screen.getByLabelText(/username/i);
      const displayNameInput = screen.getByLabelText(/display name/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const submitButton = screen.getByRole('button', { name: /create account/i });

      // Tab through form elements
      await user.tab();
      expect(emailInput).toHaveFocus();

      await user.tab();
      expect(usernameInput).toHaveFocus();

      await user.tab();
      expect(displayNameInput).toHaveFocus();

      await user.tab();
      expect(passwordInput).toHaveFocus();

      await user.tab();
      expect(confirmPasswordInput).toHaveFocus();

      await user.tab();
      expect(submitButton).toHaveFocus();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels and roles', () => {
      render(<RegisterForm />);

      expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/display name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    });

    it('should announce validation errors to screen readers', async () => {
      render(<RegisterForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      await user.click(emailInput);
      await user.tab();

      await waitFor(() => {
        const errorMessage = screen.getByText(/email is required/i);
        expect(errorMessage).toHaveAttribute('role', 'alert');
      });
    });
  });

  describe('Error Handling', () => {
    it('should re-enable submit button after error', async () => {
      const onError = jest.fn();
      mockAuth.register.mockRejectedValue(new Error('Network error'));

      render(<RegisterForm onError={onError} />);

      const emailInput = screen.getByLabelText(/email address/i);
      const usernameInput = screen.getByLabelText(/username/i);
      const displayNameInput = screen.getByLabelText(/display name/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const submitButton = screen.getByRole('button', { name: /create account/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(usernameInput, 'testuser');
      await user.type(displayNameInput, 'Test User');
      await user.type(passwordInput, 'ValidPass123');
      await user.type(confirmPasswordInput, 'ValidPass123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
        expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
      });
    });
  });
}); 