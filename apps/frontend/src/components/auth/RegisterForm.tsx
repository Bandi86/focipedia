'use client';

import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { auth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

const registerSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .required('Username is required'),
  displayName: Yup.string()
    .min(2, 'Display name must be at least 2 characters')
    .max(50, 'Display name must be less than 50 characters')
    .required('Display name is required'),
});

interface RegisterFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onError }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (values: {
    email: string;
    password: string;
    username: string;
    displayName: string;
  }) => {
    setIsLoading(true);
    try {
      await auth.register(values);
      onSuccess?.();
      router.push('/dashboard');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          Create Account
        </h2>
        
        <Formik
          initialValues={{
            email: '',
            password: '',
            confirmPassword: '',
            username: '',
            displayName: '',
          }}
          validationSchema={registerSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form className="space-y-4">
              <div>
                <Field
                  as={Input}
                  name="email"
                  type="email"
                  placeholder="Email address"
                  className={`w-full ${errors.email && touched.email ? 'border-red-500' : ''}`}
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <Field
                  as={Input}
                  name="username"
                  type="text"
                  placeholder="Username"
                  className={`w-full ${errors.username && touched.username ? 'border-red-500' : ''}`}
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <Field
                  as={Input}
                  name="displayName"
                  type="text"
                  placeholder="Display name"
                  className={`w-full ${errors.displayName && touched.displayName ? 'border-red-500' : ''}`}
                />
                <ErrorMessage
                  name="displayName"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <Field
                  as={Input}
                  name="password"
                  type="password"
                  placeholder="Password"
                  className={`w-full ${errors.password && touched.password ? 'border-red-500' : ''}`}
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <Field
                  as={Input}
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  className={`w-full ${errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : ''}`}
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
            </Form>
          )}
        </Formik>

        <div className="text-center mt-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
          </span>
          <a
            href="/login"
            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
}; 