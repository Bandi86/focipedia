'use client';

import React, { Suspense } from 'react';
import { EmailVerification } from '@/components/auth/EmailVerification';

function EmailVerificationContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            ⚽ Focipedia
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Magyar futball közösség
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <EmailVerification
          onSuccess={() => {
            console.log('Email verification successful');
          }}
          onError={(error) => {
            console.error('Email verification error:', error);
          }}
        />
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600" aria-label="Betöltés"></div>
      </div>
    }>
      <EmailVerificationContent />
    </Suspense>
  );
}