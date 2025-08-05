'use client';

import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { auth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { hu } from '@/lib/i18n/hu';
import PasswordInput from './PasswordInput';

const loginSchema = Yup.object().shape({
  emailOrUsername: Yup.string()
    .required(hu.auth.login.errors.emailOrUsernameRequired),
  password: Yup.string()
    .min(8, hu.auth.login.errors.passwordMin)
    .required(hu.auth.login.errors.passwordRequired),
});

interface LoginFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  prefillData?: { emailOrUsername: string; password: string };
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onError, prefillData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (values: { emailOrUsername: string; password: string }) => {
    setIsLoading(true);
    try {
      console.log('Attempting login with:', { emailOrUsername: values.emailOrUsername });
      const authData = await auth.login(values.emailOrUsername, values.password);
      console.log('Login successful:', authData);
      onSuccess?.();
      // Navigate to dashboard after successful login
      console.log('Navigating to dashboard...');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || hu.auth.login.errors.generic;
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          {hu.auth.login.title}
        </h2>
        
        <Formik
          initialValues={{ 
            emailOrUsername: prefillData?.emailOrUsername || '', 
            password: prefillData?.password || '' 
          }}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({ errors, touched }) => (
            <Form className="space-y-4">
              <div>
                <Field
                  as={Input}
                  name="emailOrUsername"
                  type="text"
                  placeholder="E-mail cím vagy felhasználónév"
                  aria-describedby="emailOrUsername-error"
                  className={`w-full ${errors.emailOrUsername && touched.emailOrUsername ? 'border-red-500' : ''}`}
                />
                <ErrorMessage
                  name="emailOrUsername"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <Field
                  as={PasswordInput}
                  name="password"
                  placeholder={hu.auth.login.placeholder.password}
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
                loading={isLoading}
              >
                {isLoading ? hu.common.buttons.signingIn : hu.common.buttons.signIn}
              </Button>
            </Form>
          )}
        </Formik>

        <div className="text-center mt-4">
          <a
            href="/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {hu.auth.login.forgot}
          </a>
        </div>

        <div className="text-center mt-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {hu.auth.login.noAccount}{' '}
          </span>
          <a
            href="/register"
            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {hu.auth.login.registerLink}
          </a>
        </div>
      </div>
    </div>
  );
}; 