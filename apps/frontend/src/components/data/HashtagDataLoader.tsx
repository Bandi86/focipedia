import React, { Suspense } from 'react';
import { HashtagSkeleton } from '@/components/ui/skeletons/HashtagSkeleton';

interface Hashtag {
  tag: string;
  count: number;
  posts: Array<{
    id: string;
    title: string;
    content: string;
    authorId: string;
    authorDisplayName: string;
    createdAt: string;
  }>;
}

interface HashtagDataLoaderProps {
  tag: string;
  children: (hashtag: Hashtag) => React.ReactNode;
  fallback?: React.ReactNode;
}

// Server-side data fetching function for hashtag
async function fetchHashtag(tag: string): Promise<Hashtag> {
  try {
    // This would be implemented in the backend
    // For now, we'll simulate the data
    const response = await fetch(`/api/hashtags/${encodeURIComponent(tag)}`);
    if (!response.ok) {
      throw new Error('Hashtag not found');
    }
    return response.json();
  } catch (error) {
    console.error('Failed to fetch hashtag:', error);
    throw new Error('Hashtag not found');
  }
}

// Server Component for hashtag data loading
async function HashtagDataLoaderServer({ tag, children }: HashtagDataLoaderProps) {
  const hashtag = await fetchHashtag(tag);
  return <>{children(hashtag)}</>;
}

// Client wrapper with Suspense
export function HashtagDataLoader({ tag, children, fallback }: HashtagDataLoaderProps) {
  return (
    <Suspense fallback={fallback || <HashtagSkeleton />}>
      <HashtagDataLoaderServer tag={tag}>
        {children}
      </HashtagDataLoaderServer>
    </Suspense>
  );
}

// Trending hashtags loader
interface TrendingHashtagsDataLoaderProps {
  limit?: number;
  children: (hashtags: Array<{ tag: string; count: number }>) => React.ReactNode;
  fallback?: React.ReactNode;
}

async function fetchTrendingHashtags(limit: number = 10): Promise<Array<{ tag: string; count: number }>> {
  try {
    // This would be implemented in the backend
    // For now, we'll simulate the data
    const response = await fetch(`/api/hashtags/trending?limit=${limit}`);
    if (!response.ok) {
      return [];
    }
    return response.json();
  } catch (error) {
    console.error('Failed to fetch trending hashtags:', error);
    return [];
  }
}

async function TrendingHashtagsDataLoaderServer({ limit, children }: TrendingHashtagsDataLoaderProps) {
  const hashtags = await fetchTrendingHashtags(limit);
  return <>{children(hashtags)}</>;
}

export function TrendingHashtagsDataLoader({ limit, children, fallback }: TrendingHashtagsDataLoaderProps) {
  return (
    <Suspense fallback={fallback || <HashtagSkeleton />}>
      <TrendingHashtagsDataLoaderServer limit={limit}>
        {children}
      </TrendingHashtagsDataLoaderServer>
    </Suspense>
  );
}

// Hashtag search/autocomplete loader
interface HashtagSearchDataLoaderProps {
  query: string;
  limit?: number;
  children: (hashtags: Array<{ tag: string; count: number }>) => React.ReactNode;
  fallback?: React.ReactNode;
}

async function fetchHashtagSearch(query: string, limit: number = 5): Promise<Array<{ tag: string; count: number }>> {
  try {
    if (!query.trim()) {
      return [];
    }

    // This would be implemented in the backend
    // For now, we'll simulate the data
    const response = await fetch(`/api/hashtags/search?q=${encodeURIComponent(query)}&limit=${limit}`);
    if (!response.ok) {
      return [];
    }
    return response.json();
  } catch (error) {
    console.error('Failed to search hashtags:', error);
    return [];
  }
}

async function HashtagSearchDataLoaderServer({ query, limit, children }: HashtagSearchDataLoaderProps) {
  const hashtags = await fetchHashtagSearch(query, limit);
  return <>{children(hashtags)}</>;
}

export function HashtagSearchDataLoader({ query, limit, children, fallback }: HashtagSearchDataLoaderProps) {
  return (
    <Suspense fallback={fallback || <HashtagSkeleton />}>
      <HashtagSearchDataLoaderServer query={query} limit={limit}>
        {children}
      </HashtagSearchDataLoaderServer>
    </Suspense>
  );
}

// Hashtag posts loader
interface HashtagPostsDataLoaderProps {
  tag: string;
  params?: {
    page?: number;
    limit?: number;
  };
  children: (posts: Array<{
    id: string;
    title: string;
    content: string;
    authorId: string;
    authorDisplayName: string;
    createdAt: string;
  }>) => React.ReactNode;
  fallback?: React.ReactNode;
}

async function fetchHashtagPosts(tag: string, params: HashtagPostsDataLoaderProps['params'] = {}) {
  try {
    const defaultParams = {
      page: 1,
      limit: 20,
      ...params,
    };

    // This would be implemented in the backend
    // For now, we'll simulate the data
    const response = await fetch(
      `/api/hashtags/${encodeURIComponent(tag)}/posts?${new URLSearchParams(Object.fromEntries(Object.entries(defaultParams).map(([k, v]) => [k, String(v)])))}`
    );
    if (!response.ok) {
      return [];
    }
    const data = await response.json();
    return data.posts || [];
  } catch (error) {
    console.error('Failed to fetch hashtag posts:', error);
    return [];
  }
}

async function HashtagPostsDataLoaderServer({ tag, params, children }: HashtagPostsDataLoaderProps) {
  const posts = await fetchHashtagPosts(tag, params);
  return <>{children(posts)}</>;
}

export function HashtagPostsDataLoader({ tag, params, children, fallback }: HashtagPostsDataLoaderProps) {
  return (
    <Suspense fallback={fallback || <HashtagSkeleton />}>
      <HashtagPostsDataLoaderServer tag={tag} params={params}>
        {children}
      </HashtagPostsDataLoaderServer>
    </Suspense>
  );
} 