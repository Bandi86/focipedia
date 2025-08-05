'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/auth';
import { hu } from '@/lib/i18n/hu';

interface EmailVerificationProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const EmailVerification: React.FC<EmailVerificationProps> = ({ 
  onSuccess, 
  onError 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error' | 'expired'>('pending');
  const [message, setMessage] = useState('');
  const [canResend, setCanResend] = useState(true);
  const [resendCooldown, setResendCooldown] = useState(0);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const currentUser = auth.getCurrentUser();

  useEffect(() => {
    if (token) {
      handleVerifyEmail(token);
    }
  }, [token]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleVerifyEmail = async (verificationToken: string) => {
    setIsVerifying(true);
    try {
      const result = await auth.verifyEmail(verificationToken);
      setVerificationStatus('success');
      setMessage(result.message || hu.auth.verify.messages.success);
      onSuccess?.();
      
      // Sikeres megerősítés után átirányítás a vezérlőpultra
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error: any) {
      const raw = error.response?.data?.message;
      // Egységes, magyar hibaüzenet
      const errorMessage = raw && typeof raw === 'string' ? raw : hu.auth.verify.errorTitle + '.';
      setVerificationStatus('error');
      setMessage(errorMessage);
      onError?.(errorMessage);
      
      // Lejárt token felismerése (angol/hun kulcsszavak)
      const lower = String(errorMessage).toLowerCase();
      if (lower.includes('expired') || lower.includes('lejárt') || lower.includes('lejart')) {
        setVerificationStatus('expired');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendVerification = async () => {
    if (!currentUser?.email || !canResend) return;
    
    setIsLoading(true);
    setCanResend(false);
    setResendCooldown(60); // 60 másodperces várakozás
    
    try {
      const result = await auth.resendEmailVerification(currentUser.email);
      setMessage(result.message || hu.auth.register.success.resend);
      setVerificationStatus('pending');
    } catch (error: any) {
      const raw = error.response?.data?.message;
      const errorMessage = raw && typeof raw === 'string' ? raw : hu.auth.forgot.errors.generic;
      setMessage(errorMessage);
      setVerificationStatus('error');
      onError?.(errorMessage);
      setCanResend(true);
      setResendCooldown(0);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = () => {
    switch (verificationStatus) {
      case 'success':
        return (
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'error':
      case 'expired':
        return (
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        );
    }
  };

  const getStatusTitle = () => {
    switch (verificationStatus) {
      case 'success':
        return hu.auth.verify.successTitle;
      case 'error':
        return hu.auth.verify.errorTitle;
      case 'expired':
        return hu.auth.verify.expiredTitle;
      default:
        return isVerifying ? hu.auth.verify.verifying : hu.auth.verify.title;
    }
  };

  const getStatusMessage = () => {
    if (message) return message;
    
    switch (verificationStatus) {
      case 'success':
        return hu.auth.verify.messages.success;
      case 'error':
        return hu.auth.verify.messages.error;
      case 'expired':
        return hu.auth.verify.messages.expired;
      default:
        return isVerifying
          ? hu.auth.verify.messages.verifying
          : hu.auth.verify.messages.pending;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
        <div className="text-center">
          {getStatusIcon()}
          
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            {getStatusTitle()}
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {getStatusMessage()}
          </p>

          {isVerifying && (
            <div className="flex justify-center mb-6" role="status" aria-live="polite" aria-busy="true">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" aria-label="Ellenőrzés folyamatban"></div>
            </div>
          )}

          {(verificationStatus === 'error' || verificationStatus === 'expired' || (!token && currentUser && !currentUser.isVerified)) && (
            <div className="space-y-4">
              <Button
                onClick={handleResendVerification}
                className="w-full"
                variant="default"
                loading={isLoading}
                aria-label={isLoading ? 'Megerősítő e-mail küldése folyamatban' : (canResend ? 'Megerősítő e-mail újraküldése' : `Újraküldés ${resendCooldown} másodperc múlva`)}
              >
                {isLoading
                  ? hu.auth.verify.resend.sending
                  : canResend
                    ? hu.auth.verify.resend.button
                    : hu.auth.verify.resend.cooldown(resendCooldown)
                }
              </Button>
              
              {currentUser?.email && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {hu.auth.verify.resend.target(currentUser.email)}
                </p>
              )}
            </div>
          )}

          {verificationStatus === 'success' && (
            <div className="space-y-4">
              <Button
                onClick={() => router.push('/dashboard')}
                className="w-full"
                variant="default"
                aria-label="Ugrás a vezérlőpultra"
              >
                {hu.common.buttons.goToDashboard}
              </Button>
            </div>
          )}

          {!token && !currentUser && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {hu.auth.verify.actions.loginRequired}
              </p>
              <Button
                onClick={() => router.push('/login')}
                className="w-full"
                variant="outline"
                aria-label="Ugrás a bejelentkezéshez"
              >
                {hu.common.buttons.goToLogin}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};