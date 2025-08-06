import React from 'react';
import { PostDataLoader } from '@/components/data';
import { FeedClientWrapper } from '@/components/feed/FeedClientWrapper';
import { PostListSkeleton } from '@/components/ui/skeletons';

// Main feed page component
export default async function FeedPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const searchTerm = resolvedSearchParams.search as string || '';
  const filterStatus = resolvedSearchParams.filter as string || 'all';
  const hashtag = resolvedSearchParams.hashtag as string || '';

  // Build params for PostDataLoader
  const params: any = {
    page: 1,
    limit: 20, // More posts for feed
  };

  if (filterStatus === 'published') {
    params.isPublished = true;
  } else if (filterStatus === 'draft') {
    params.isPublished = false;
  }

  if (hashtag) {
    params.hashtag = hashtag;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Hírfolyam
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Kövesd a közösség legfrissebb híreit és aktivitásait
            </p>
          </div>

          {/* Feed Content with Server Component Data Loading */}
          <PostDataLoader 
            params={params}
            fallback={<PostListSkeleton count={3} />}
          >
            {(data) => (
              <FeedClientWrapper 
                posts={data.posts} 
                totalPages={data.totalPages}
                searchTerm={searchTerm} 
                filterStatus={filterStatus}

              />
            )}
          </PostDataLoader>
        </div>
      </div>
    </div>
  );
} 