import React, { Suspense } from 'react';
import { Post, PostListResponse } from '@/types';
import { postAPI } from '@/lib/api';
import { PostSkeleton } from '@/components/ui/skeletons/PostSkeleton';

interface PostDataLoaderProps {
  params?: {
    page?: number;
    limit?: number;
    authorId?: string;
    isPublished?: boolean;
    hashtag?: string;
    search?: string;
  };
  children: (data: PostListResponse) => React.ReactNode;
  fallback?: React.ReactNode;
}

// Server-side data fetching function
async function fetchPosts(params: PostDataLoaderProps['params'] = {}) {
  try {
    const defaultParams = {
      page: 1,
      limit: 10,
      ...params,
    };

    const response = await postAPI.getPosts(defaultParams);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return {
      posts: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    };
  }
}

// Server Component for post data loading
async function PostDataLoaderServer({ params, children }: PostDataLoaderProps) {
  const data = await fetchPosts(params);
  return <>{children(data)}</>;
}

// Client wrapper with Suspense
export function PostDataLoader({ params, children, fallback }: PostDataLoaderProps) {
  return (
    <Suspense fallback={fallback || <PostSkeleton />}>
      <PostDataLoaderServer params={params}>
        {children}
      </PostDataLoaderServer>
    </Suspense>
  );
}

// Single post loader
interface SinglePostDataLoaderProps {
  postId: string;
  children: (post: Post) => React.ReactNode;
  fallback?: React.ReactNode;
}

async function fetchSinglePost(postId: string): Promise<Post> {
  try {
    const response = await postAPI.getPost(postId);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch post:', error);
    throw new Error('Post not found');
  }
}

async function SinglePostDataLoaderServer({ postId, children }: SinglePostDataLoaderProps) {
  const post = await fetchSinglePost(postId);
  return <>{children(post)}</>;
}

export function SinglePostDataLoader({ postId, children, fallback }: SinglePostDataLoaderProps) {
  return (
    <Suspense fallback={fallback || <PostSkeleton />}>
      <SinglePostDataLoaderServer postId={postId}>
        {children}
      </SinglePostDataLoaderServer>
    </Suspense>
  );
}

// Trending posts loader
interface TrendingPostsDataLoaderProps {
  limit?: number;
  children: (posts: Post[]) => React.ReactNode;
  fallback?: React.ReactNode;
}

async function fetchTrendingPosts(limit: number = 5): Promise<Post[]> {
  try {
    const response = await postAPI.getPosts({
      page: 1,
      limit,
      isPublished: true,
    });
    return response.data.posts;
  } catch (error) {
    console.error('Failed to fetch trending posts:', error);
    return [];
  }
}

async function TrendingPostsDataLoaderServer({ limit, children }: TrendingPostsDataLoaderProps) {
  const posts = await fetchTrendingPosts(limit);
  return <>{children(posts)}</>;
}

export function TrendingPostsDataLoader({ limit, children, fallback }: TrendingPostsDataLoaderProps) {
  return (
    <Suspense fallback={fallback || <PostSkeleton />}>
      <TrendingPostsDataLoaderServer limit={limit}>
        {children}
      </TrendingPostsDataLoaderServer>
    </Suspense>
  );
} 