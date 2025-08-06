import React from 'react';

export const CommentSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0"></div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
          <div className="flex items-center gap-4 mt-3">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-14"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CommentListSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <CommentSkeleton key={index} />
      ))}
    </div>
  );
};

export const CommentReplySkeleton: React.FC = () => {
  return (
    <div className="ml-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 animate-pulse">
      <div className="flex items-start gap-2">
        <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0"></div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
          </div>
          <div className="space-y-1">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CommentFormSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0"></div>
        <div className="flex-1">
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
          <div className="flex items-center justify-between">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
          </div>
        </div>
      </div>
    </div>
  );
}; 