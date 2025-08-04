'use client';

import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { auth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

interface LoginFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onError }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (values: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      await auth.login(values.email, values.password);
      onSuccess?.();
      router.push('/dashboard');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          Sign In
        </h2>
        
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={loginSchema}
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

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </Form>
          )}
        </Formik>

        <div className="text-center mt-4">
          <a
            href="/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Forgot your password?
          </a>
        </div>

        <div className="text-center mt-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
          </span>
          <a
            href="/register"
            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}; 