import React from 'react';

export const UserSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        <div className="flex-1">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
        </div>
      </div>
    </div>
  );
};

export const UserCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-28 mb-1"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-8 mx-auto mb-1"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 mx-auto"></div>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-8 mx-auto mb-1"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export const UserProfileSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        <div className="flex-1">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-12 mx-auto mb-1"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 mx-auto"></div>
        </div>
        <div className="text-center">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-12 mx-auto mb-1"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 mx-auto"></div>
        </div>
        <div className="text-center">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-12 mx-auto mb-1"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 mx-auto"></div>
        </div>
        <div className="text-center">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-12 mx-auto mb-1"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 mx-auto"></div>
        </div>
      </div>

      {/* Bio */}
      <div className="space-y-2 mb-6">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      </div>

      {/* Activity */}
      <div>
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-3"></div>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-1"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-36 mb-1"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const UserListSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <UserSkeleton key={index} />
      ))}
    </div>
  );
}; 