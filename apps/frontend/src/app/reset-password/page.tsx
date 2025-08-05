'use client';

import React, { Suspense } from 'react';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import { hu } from '@/lib/i18n/hu';

function ResetPasswordContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            ⚽ {hu.common.appName}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {hu.common.tagline}
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <ResetPasswordForm
          onSuccess={() => {
            console.log('Password reset successful');
          }}
          onError={(error) => {
            console.error('Password reset error:', error);
          }}
        />
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600" aria-label={hu.common.loading}></div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}