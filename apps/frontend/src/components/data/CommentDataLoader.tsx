import React, { Suspense } from 'react';
import { Comment, CommentListResponse } from '@/types';
import { commentAPI } from '@/lib/api';
import { CommentSkeleton } from '@/components/ui/skeletons/CommentSkeleton';

interface CommentDataLoaderProps {
  postId: string;
  params?: {
    page?: number;
    limit?: number;
    parentId?: string;
  };
  children: (data: CommentListResponse) => React.ReactNode;
  fallback?: React.ReactNode;
}

// Server-side data fetching function for comments
async function fetchComments(postId: string, params: CommentDataLoaderProps['params'] = {}) {
  try {
    const defaultParams = {
      page: 1,
      limit: 20,
      ...params,
    };

    const response = await commentAPI.getCommentsByPost(postId, defaultParams);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch comments:', error);
    return {
      comments: [],
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 0,
    };
  }
}

// Server Component for comment data loading
async function CommentDataLoaderServer({ postId, params, children }: CommentDataLoaderProps) {
  const data = await fetchComments(postId, params);
  return <>{children(data)}</>;
}

// Client wrapper with Suspense
export function CommentDataLoader({ postId, params, children, fallback }: CommentDataLoaderProps) {
  return (
    <Suspense fallback={fallback || <CommentSkeleton />}>
      <CommentDataLoaderServer postId={postId} params={params}>
        {children}
      </CommentDataLoaderServer>
    </Suspense>
  );
}

// Single comment loader
interface SingleCommentDataLoaderProps {
  commentId: string;
  children: (comment: Comment) => React.ReactNode;
  fallback?: React.ReactNode;
}

async function fetchSingleComment(commentId: string): Promise<Comment> {
  try {
    // Note: This assumes we have a getComment endpoint
    // If not, we'll need to implement it in the backend
    const response = await commentAPI.getComment(commentId);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch comment:', error);
    throw new Error('Comment not found');
  }
}

async function SingleCommentDataLoaderServer({ commentId, children }: SingleCommentDataLoaderProps) {
  const comment = await fetchSingleComment(commentId);
  return <>{children(comment)}</>;
}

export function SingleCommentDataLoader({ commentId, children, fallback }: SingleCommentDataLoaderProps) {
  return (
    <Suspense fallback={fallback || <CommentSkeleton />}>
      <SingleCommentDataLoaderServer commentId={commentId}>
        {children}
      </SingleCommentDataLoaderServer>
    </Suspense>
  );
}

// Comment replies loader
interface CommentRepliesDataLoaderProps {
  commentId: string;
  params?: {
    page?: number;
    limit?: number;
  };
  children: (replies: Comment[]) => React.ReactNode;
  fallback?: React.ReactNode;
}

async function fetchCommentReplies(commentId: string, params: CommentRepliesDataLoaderProps['params'] = {}) {
  try {
    const defaultParams = {
      page: 1,
      limit: 10,
      ...params,
    };

    const response = await commentAPI.getRepliesByComment(commentId, defaultParams);
    return response.data.comments || [];
  } catch (error) {
    console.error('Failed to fetch comment replies:', error);
    return [];
  }
}

async function CommentRepliesDataLoaderServer({ commentId, params, children }: CommentRepliesDataLoaderProps) {
  const replies = await fetchCommentReplies(commentId, params);
  return <>{children(replies)}</>;
}

export function CommentRepliesDataLoader({ commentId, params, children, fallback }: CommentRepliesDataLoaderProps) {
  return (
    <Suspense fallback={fallback || <CommentSkeleton />}>
      <CommentRepliesDataLoaderServer commentId={commentId} params={params}>
        {children}
      </CommentRepliesDataLoaderServer>
    </Suspense>
  );
}

// Hierarchical comments loader (with nested replies)
interface HierarchicalCommentsDataLoaderProps {
  postId: string;
  params?: {
    page?: number;
    limit?: number;
  };
  children: (comments: Comment[]) => React.ReactNode;
  fallback?: React.ReactNode;
}

async function fetchHierarchicalComments(postId: string, params: HierarchicalCommentsDataLoaderProps['params'] = {}) {
  try {
    const defaultParams = {
      page: 1,
      limit: 50,
      ...params,
    };

    // Fetch top-level comments
    const response = await commentAPI.getCommentsByPost(postId, defaultParams);
    const topLevelComments = response.data.comments;

    // Fetch replies for each top-level comment
    const commentsWithReplies = await Promise.all(
      topLevelComments.map(async (comment: Comment) => {
        try {
          const repliesResponse = await commentAPI.getRepliesByComment(comment.id, { page: 1, limit: 5 });
          return {
            ...comment,
            replies: repliesResponse.data.comments || [],
          };
        } catch (error) {
          console.error('Failed to fetch replies for comment:', comment.id, error);
          return {
            ...comment,
            replies: [],
          };
        }
      })
    );

    return commentsWithReplies;
  } catch (error) {
    console.error('Failed to fetch hierarchical comments:', error);
    return [];
  }
}

async function HierarchicalCommentsDataLoaderServer({ postId, params, children }: HierarchicalCommentsDataLoaderProps) {
  const comments = await fetchHierarchicalComments(postId, params);
  return <>{children(comments)}</>;
}

export function HierarchicalCommentsDataLoader({ postId, params, children, fallback }: HierarchicalCommentsDataLoaderProps) {
  return (
    <Suspense fallback={fallback || <CommentSkeleton />}>
      <HierarchicalCommentsDataLoaderServer postId={postId} params={params}>
        {children}
      </HierarchicalCommentsDataLoaderServer>
    </Suspense>
  );
} 