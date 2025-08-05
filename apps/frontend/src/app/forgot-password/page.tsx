'use client';

import React from 'react';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { hu } from '@/lib/i18n/hu';

export default function ForgotPasswordPage() {
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
        <ForgotPasswordForm
          onSuccess={() => {
            console.log('Password reset email sent successfully');
          }}
          onError={(error) => {
            console.error('Password reset error:', error);
          }}
        />
      </div>
    </div>
  );
}