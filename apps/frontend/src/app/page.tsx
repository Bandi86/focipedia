import React from 'react';
import { hu } from '@/lib/i18n/hu';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {hu.common.appName}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          {hu.common.tagline}
        </p>
        <div className="space-x-4">
          <a
            href="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
          >
            {hu.common.buttons.signIn}
          </a>
          <a
            href="/register"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors inline-block"
          >
            {hu.common.buttons.signUp}
          </a>
        </div>
      </div>
    </div>
  );
}
