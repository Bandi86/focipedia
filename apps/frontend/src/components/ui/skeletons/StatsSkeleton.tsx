import React from 'react';

export const StatsSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-12 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 mx-auto mb-1"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 mx-auto"></div>
        </div>
        <div className="text-center">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-12 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 mx-auto mb-1"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 mx-auto"></div>
        </div>
        <div className="text-center">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-12 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 mx-auto mb-1"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 mx-auto"></div>
        </div>
        <div className="text-center">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-12 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 mx-auto mb-1"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export const UserStatsSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-8 mx-auto mb-1"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 mx-auto"></div>
        </div>
        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-8 mx-auto mb-1"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export const PlatformStatsSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4"></div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="text-center">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-16 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mx-auto mb-1"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24 mx-auto"></div>
        </div>
        <div className="text-center">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-16 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mx-auto mb-1"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24 mx-auto"></div>
        </div>
        <div className="text-center">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-16 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mx-auto mb-1"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24 mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export const EngagementStatsSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
        </div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
      </div>
    </div>
  );
}; 