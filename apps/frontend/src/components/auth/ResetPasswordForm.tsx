'use client';

import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { auth } from '@/lib/auth';
import { hu } from '@/lib/i18n/hu';
import { PasswordInput } from '@/components/auth/PasswordInput';

const resetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, hu.auth.reset.errors.passwordMin)
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      hu.auth.register.errors.passwordComplexity
    )
    .required(hu.auth.reset.errors.passwordRequired),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], hu.auth.reset.errors.passwordsMustMatch)
    .required(hu.auth.reset.errors.passwordsMustMatch),
});

interface ResetPasswordFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ 
  onSuccess, 
  onError 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setTokenError('Érvénytelen vagy hiányzó visszaállítási token. Kérlek, kérj új jelszó-visszaállítást.');
    }
  }, [token]);

  const handleSubmit = async (values: { password: string; confirmPassword: string }) => {
    if (!token) {
      onError?.(hu.auth.reset.invalid.title);
      return;
    }

    setIsLoading(true);
    try {
      await auth.resetPassword(token, values.password);
      setIsSuccess(true);
      onSuccess?.();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || hu.auth.reset.errors.generic;
      onError?.(errorMessage);
      
      // Check if token is expired or invalid
      if (errorMessage.toLowerCase().includes('expired') || errorMessage.toLowerCase().includes('invalid')) {
        setTokenError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    
    return strength;
  };

  const getPasswordStrengthText = (strength: number) => {
    switch (strength) {
      case 0:
      case 1:
        return { text: 'Nagyon gyenge', color: 'text-red-500' };
      case 2:
        return { text: 'Gyenge', color: 'text-orange-500' };
      case 3:
        return { text: 'Közepes', color: 'text-yellow-500' };
      case 4:
        return { text: 'Jó', color: 'text-blue-500' };
      case 5:
        return { text: 'Erős', color: 'text-green-500' };
      default:
        return { text: '', color: '' };
    }
  };

  if (tokenError) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              {hu.auth.reset.invalid.title}
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {tokenError || hu.auth.reset.invalid.message}
            </p>

            <div className="space-y-4">
              <Button
                onClick={() => router.push('/forgot-password')}
                className="w-full"
                variant="default"
              >
                {hu.auth.reset.invalid.message}
              </Button>
              
              <Button
                onClick={() => router.push('/login')}
                className="w-full"
                variant="outline"
              >
                {hu.auth.reset.success.goToLogin}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              {hu.auth.reset.success.title}
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {hu.auth.reset.success.message}
            </p>

            <Button
              onClick={() => router.push('/login')}
              className="w-full"
              variant="default"
            >
              {hu.auth.reset.success.goToLogin}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          {hu.auth.reset.title}
        </h2>
        
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
          {hu.auth.reset.placeholder.password}
        </p>
        
        <Formik
          initialValues={{ password: '', confirmPassword: '' }}
          validationSchema={resetPasswordSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, values }) => {
            const passwordStrength = getPasswordStrength(values.password);
            const strengthInfo = getPasswordStrengthText(passwordStrength);
            
            return (
              <Form className="space-y-4">
                <div>
                  <Field
                    as={PasswordInput}
                    name="password"
                    placeholder={hu.auth.reset.password}
                    className={`w-full ${errors.password && touched.password ? 'border-red-500' : ''}`}
                  />
                  {values.password && (
                    <div className="mt-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              passwordStrength <= 1 ? 'bg-red-500' :
                              passwordStrength === 2 ? 'bg-orange-500' :
                              passwordStrength === 3 ? 'bg-yellow-500' :
                              passwordStrength === 4 ? 'bg-blue-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${(passwordStrength / 5) * 100}%` }}
                          />
                        </div>
                        <span className={`text-xs ${strengthInfo.color}`}>
                          {strengthInfo.text}
                        </span>
                      </div>
                    </div>
                  )}
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <Field
                    as={PasswordInput}
                    name="confirmPassword"
                    placeholder={hu.auth.reset.confirmPassword}
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
                  loading={isLoading}
                >
                  {isLoading ? hu.common.buttons.submitting : hu.common.buttons.submit}
                </Button>
              </Form>
            );
          }}
        </Formik>

        <div className="text-center mt-6">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {hu.auth.login.noAccount?.replace('Nincs', 'Mégis emlékszel a jelszóra?') || 'Mégis emlékszel a jelszóra?'}{' '}
          </span>
          <a
            href="/login"
            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {hu.auth.register.success.signIn}
          </a>
        </div>
      </div>
    </div>
  );
};