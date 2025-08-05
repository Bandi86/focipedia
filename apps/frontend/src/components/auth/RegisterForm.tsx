'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Formik, Form, Field, ErrorMessage, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { auth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { hu } from '@/lib/i18n/hu';
import { PasswordInput } from '@/components/auth/PasswordInput';

/**
 * Small util to generate strong random passwords using Web Crypto.
 */
function generateStrongPassword(length = 16) {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';
  const symbols = '!@#$%^&*()-_=+[]{};:,.?/';

  const all = alphabet + ALPHABET + digits + symbols;
  const arr = new Uint32Array(length);
  if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(arr);
  } else {
    for (let i = 0; i < length; i++) arr[i] = Math.floor(Math.random() * 0xffffffff);
  }
  const chars = Array.from(arr, (n) => all[n % all.length]);

  // Ensure at least one of each required type
  const ensure = [
    alphabet[Math.floor(arr[0] % alphabet.length)],
    ALPHABET[Math.floor(arr[1] % ALPHABET.length)],
    digits[Math.floor(arr[2] % digits.length)],
  ];
  // Insert ensures
  for (let i = 0; i < ensure.length && i < chars.length; i++) chars[i] = ensure[i];
  return chars.join('');
}

/**
 * Estimate password strength score 0-4
 */
function estimateStrength(pw: string): number {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(score, 4);
}

/**
 * Debounced value hook for async availability checks
 */
function useDebouncedValue<T>(value: T, delay = 500): T {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v as T;
}

const registerSchema = Yup.object().shape({
  email: Yup.string()
    .email(hu.auth.register.errors.emailInvalid)
    .required(hu.auth.register.errors.emailRequired),
  password: Yup.string()
    .min(8, hu.auth.register.errors.passwordMin)
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      hu.auth.register.errors.passwordComplexity
    )
    .required(hu.auth.register.errors.passwordRequired),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], hu.auth.register.errors.passwordsMustMatch)
    .required(hu.auth.register.errors.passwordsMustMatch),
  username: Yup.string()
    .min(3, hu.auth.register.errors.usernameMin)
    .max(20, hu.auth.register.errors.usernameMax)
    .matches(/^[a-zA-Z0-9_]+$/, 'A felhasználónév csak betűket, számokat és aláhúzást tartalmazhat')
    .required(hu.auth.register.errors.usernameRequired),
  displayName: Yup.string()
    .min(2, 'A megjelenített névnek legalább 2 karakter hosszúnak kell lennie')
    .max(50, 'A megjelenített név legfeljebb 50 karakter lehet')
    .required(hu.auth.register.errors.displayNameRequired),
});

interface RegisterFormProps {
  onSuccess?: (userData?: { email: string; password: string }) => void;
  onError?: (error: string) => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onError }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const router = useRouter();

  const handleSubmit = async (values: {
    email: string;
    password: string;
    confirmPassword: string;
    username: string;
    displayName: string;
  }) => {
    setIsLoading(true);
    try {
      const { confirmPassword, ...registerData } = values;
      await auth.register(registerData);
      setUserEmail(values.email);
      // Always call onSuccess when registration is successful
      onSuccess?.({ email: values.email, password: values.password });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || hu.auth.register.errors.generic;
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!userEmail) return;
    
    setIsLoading(true);
    try {
      await auth.resendEmailVerification(userEmail);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to resend verification email';
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (registrationSuccess) {
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
              {hu.auth.register.success.title}
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {hu.auth.register.success.message}{' '}<strong>{userEmail}</strong>
            </p>

            <div className="space-y-4">
              <Button
                onClick={handleResendVerification}
                disabled={isLoading}
                className="w-full"
                variant="outline"
                aria-busy={isLoading}
              >
                {isLoading ? hu.common.buttons.resending : hu.auth.register.success.resend}
              </Button>
              
              <Button
                onClick={() => router.push('/verify-email')}
                className="w-full"
                variant="default"
              >
                {hu.auth.register.success.goToVerify}
              </Button>
            </div>

            <div className="text-center mt-6">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {hu.auth.register.success.alreadyVerified}{' '}
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
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          {hu.auth.register.title}
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
          {({ errors, touched, values, setFieldValue }) => {
            const strength = useMemo(() => estimateStrength(values.password), [values.password]);
            const confirmRef = useRef<HTMLInputElement | null>(null);

            // Debounced inputs for availability
            const debouncedEmail = useDebouncedValue(values.email, 500);
            const debouncedUsername = useDebouncedValue(values.username, 500);

            const [emailAvailability, setEmailAvailability] = useState<{status: 'idle'|'checking'|'available'|'taken'}>({ status: 'idle' });
            const [usernameAvailability, setUsernameAvailability] = useState<{status: 'idle'|'checking'|'available'|'taken'}>({ status: 'idle' });

            useEffect(() => {
              let cancelled = false;
              async function checkEmail() {
                if (!debouncedEmail) {
                  if (!cancelled) setEmailAvailability({ status: 'idle' });
                  return;
                }
                if (!cancelled) setEmailAvailability({ status: 'checking' });
                try {
                  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
                  const res = await fetch(`${base}/auth/check-email?email=${encodeURIComponent(debouncedEmail)}`, {
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                  });
                  const data = await res.json();
                  if (!cancelled) setEmailAvailability({ status: data.available ? 'available' : 'taken' });
                } catch {
                  if (!cancelled) setEmailAvailability({ status: 'idle' });
                }
              }
              checkEmail();
              return () => { cancelled = true; };
            }, [debouncedEmail]);

            useEffect(() => {
              let cancelled = false;
              async function checkUsername() {
                if (!debouncedUsername) {
                  if (!cancelled) setUsernameAvailability({ status: 'idle' });
                  return;
                }
                if (!cancelled) setUsernameAvailability({ status: 'checking' });
                try {
                  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
                  const res = await fetch(`${base}/auth/check-username?username=${encodeURIComponent(debouncedUsername)}`, {
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                  });
                  const data = await res.json();
                  if (!cancelled) setUsernameAvailability({ status: data.available ? 'available' : 'taken' });
                } catch {
                  if (!cancelled) setUsernameAvailability({ status: 'idle' });
                }
              }
              checkUsername();
              return () => { cancelled = true; };
            }, [debouncedUsername]);

            return (
              <Form className="space-y-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Field
                      as={Input}
                      name="email"
                      type="email"
                      placeholder={hu.auth.register.placeholder.email}
                      className={`w-full ${errors.email && touched.email ? 'border-red-500' : ''}`}
                    />
                    <span className="text-xs min-w-24 text-right">
                      {emailAvailability.status === 'checking' && 'Ellenőrzés...'}
                      {emailAvailability.status === 'available' && 'Szabad ✅'}
                      {emailAvailability.status === 'taken' && 'Foglalt ❌'}
                    </span>
                  </div>
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <Field
                      as={Input}
                      name="username"
                      type="text"
                      placeholder={hu.auth.register.username}
                      className={`w-full ${errors.username && touched.username ? 'border-red-500' : ''}`}
                    />
                    <span className="text-xs min-w-24 text-right">
                      {usernameAvailability.status === 'checking' && 'Ellenőrzés...'}
                      {usernameAvailability.status === 'available' && 'Szabad ✅'}
                      {usernameAvailability.status === 'taken' && 'Foglalt ❌'}
                    </span>
                  </div>
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
                    placeholder={hu.auth.register.displayName}
                    className={`w-full ${errors.displayName && touched.displayName ? 'border-red-500' : ''}`}
                  />
                  <ErrorMessage
                    name="displayName"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Password with generator + strength */}
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <Field
                        as={PasswordInput}
                        name="password"
                        placeholder={hu.auth.register.placeholder.password}
                        className={`w-full ${errors.password && touched.password ? 'border-red-500' : ''}`}
                        autoComplete="new-password"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setFieldValue('password', generateStrongPassword())}
                      title="Erős jelszó generálása"
                    >
                      Generál
                    </Button>
                  </div>
                  <div className="mt-2" aria-live="polite">
                    <div className="h-2 w-full bg-gray-200 rounded">
                      <div
                        className={`h-2 rounded ${strength <= 1 ? 'bg-red-500 w-1/4' : strength === 2 ? 'bg-yellow-500 w-2/4' : strength === 3 ? 'bg-blue-500 w-3/4' : 'bg-green-600 w-full'}`}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {strength <= 1 ? 'Gyenge' : strength === 2 ? 'Közepes' : strength === 3 ? 'Jó' : 'Erős'}
                    </p>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Confirm with copy-from-password */}
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <Field
                        as={PasswordInput}
                        name="confirmPassword"
                        placeholder={hu.auth.register.placeholder.confirmPassword}
                        className={`w-full ${errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : ''}`}
                        autoComplete="new-password"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setFieldValue('confirmPassword', values.password)}
                      title="Másolás a megerősítéshez"
                    >
                      Másol
                    </Button>
                  </div>
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
                  {isLoading ? hu.common.buttons.signingUp : hu.common.buttons.signUp}
                </Button>
              </Form>
            );
          }}
        </Formik>

        <div className="text-center mt-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Már van fiókod?{' '}
          </span>
          <a
            href="/login"
            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Bejelentkezés
          </a>
        </div>
      </div>
    </div>
  );
};