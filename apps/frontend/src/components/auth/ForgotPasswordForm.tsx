'use client';

import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { auth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { hu } from '@/lib/i18n/hu';

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email(hu.auth.forgot.errors.emailInvalid)
    .required(hu.auth.forgot.errors.emailRequired),
});

interface ForgotPasswordFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ 
  onSuccess, 
  onError 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const router = useRouter();

  const handleSubmit = async (values: { email: string }) => {
    setIsLoading(true);
    try {
      await auth.forgotPassword(values.email);
      setSubmittedEmail(values.email);
      setIsSubmitted(true);
      onSuccess?.();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || hu.auth.forgot.errors.generic;
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!submittedEmail) return;
    
    setIsLoading(true);
    try {
      await auth.forgotPassword(submittedEmail);
      onSuccess?.();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || hu.auth.forgot.errors.generic;
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              {hu.auth.forgot.success.title}
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {hu.auth.forgot.success.message}{' '}<strong>{submittedEmail}</strong>
            </p>

            <div className="space-y-4">
              <Button
                onClick={handleResendEmail}
                className="w-full"
                variant="outline"
                loading={isLoading}
              >
                {isLoading ? hu.common.buttons.resending : hu.auth.forgot.success.resend}
              </Button>
              
              <Button
                onClick={() => router.push('/login')}
                className="w-full"
                variant="default"
              >
                {hu.auth.forgot.success.backToLogin}
              </Button>
            </div>

            <div className="text-center mt-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {hu.auth.forgot.success.spamNotice}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          {hu.auth.forgot.title}
        </h2>
        
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
          {hu.auth.forgot.subtitle}
        </p>
        
        <Formik
          initialValues={{ email: '' }}
          validationSchema={forgotPasswordSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form className="space-y-4">
              <div>
                <Field
                  as={Input}
                  name="email"
                  type="email"
                  placeholder={hu.auth.forgot.placeholder.email}
                  className={`w-full ${errors.email && touched.email ? 'border-red-500' : ''}`}
                />
                <ErrorMessage
                  name="email"
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
          )}
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