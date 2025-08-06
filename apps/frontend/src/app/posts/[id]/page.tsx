'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Post, Comment, CreateCommentRequest, UpdateCommentRequest } from '@/types';
import { postAPI, commentAPI } from '@/lib/api';
import { PostCard } from '@/components/posts/PostCard';
import { CommentItem } from '@/components/comments/CommentItem';
import { CommentForm } from '@/components/comments/CommentForm';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Loader2,
  MessageCircle
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const postId = params.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadPost = useCallback(async () => {
    try {
      setLoading(true);
      const response = await postAPI.getPost(postId);
      setPost(response.data);
    } catch (error) {
      console.error('Failed to load post:', error);
      toast.error('Failed to load post');
      router.push('/posts');
    } finally {
      setLoading(false);
    }
  }, [postId, router]);

  const loadComments = useCallback(async () => {
    try {
      setCommentsLoading(true);
      const response = await commentAPI.getCommentsByPost(postId);
      setComments(response.data.comments);
    } catch (error) {
      console.error('Failed to load comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setCommentsLoading(false);
    }
  }, [postId]);

  const loadReplies = async (commentId: string): Promise<Comment[]> => {
    try {
      const response = await commentAPI.getRepliesByComment(commentId);
      return response.data.comments;
    } catch (error) {
      console.error('Failed to load replies:', error);
      return [];
    }
  };

  useEffect(() => {
    if (postId) {
      loadPost();
      loadComments();
    }
  }, [postId, loadPost, loadComments]);

  const handleCreateComment = async (data: CreateCommentRequest) => {
    try {
      setSubmitting(true);
      await commentAPI.createComment(data);
      toast.success('Comment posted successfully');
      setShowCommentForm(false);
      setReplyingTo(null);
      loadComments(); // Reload comments
    } catch (error) {
      console.error('Failed to create comment:', error);
      toast.error('Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateComment = async (data: UpdateCommentRequest) => {
    if (!editingComment) return;

    try {
      setSubmitting(true);
      await commentAPI.updateComment(editingComment.id, data);
      toast.success('Comment updated successfully');
      setEditingComment(null);
      loadComments(); // Reload comments
    } catch (error) {
      console.error('Failed to update comment:', error);
      toast.error('Failed to update comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await commentAPI.deleteComment(commentId);
      toast.success('Comment deleted successfully');
      setComments(prev => prev.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error('Failed to delete comment:', error);
      toast.error('Failed to delete comment');
    }
  };

  const handleEditComment = (comment: Comment) => {
    setEditingComment(comment);
  };

  const handleReplyToComment = (commentId: string) => {
    setReplyingTo(commentId);
    setShowCommentForm(true);
  };

  const handleCancelCommentForm = () => {
    setShowCommentForm(false);
    setEditingComment(null);
    setReplyingTo(null);
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await postAPI.deletePost(postId);
      toast.success('Post deleted successfully');
      router.push('/posts');
    } catch (error) {
      console.error('Failed to delete post:', error);
      toast.error('Failed to delete post');
    }
  };

  const handleEditPost = (post: Post) => {
    router.push(`/posts/${post.id}/edit`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 className="w-6 h-6 animate-spin" />
              Loading post...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Post not found
            </h2>
            <Button onClick={() => router.push('/posts')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Posts
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push('/posts')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Posts
        </Button>

        {/* Post */}
        <div className="mb-8">
          <PostCard
            post={post}
            onEdit={handleEditPost}
            onDelete={handleDeletePost}
            showActions={false}
          />
        </div>

        {/* Comments Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Comments ({comments.length})
            </h2>
            {user && (
              <Button
                onClick={() => setShowCommentForm(true)}
                className="flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Add Comment
              </Button>
            )}
          </div>

          {/* Comment Form */}
          {showCommentForm && (
            <div className="mb-6">
              <CommentForm
                postId={postId}
                parentId={replyingTo || undefined}
                onSubmit={async (data) => {
                  if (editingComment) {
                    await handleUpdateComment(data as UpdateCommentRequest);
                  } else {
                    await handleCreateComment(data as CreateCommentRequest);
                  }
                }}
                onCancel={handleCancelCommentForm}
                isLoading={submitting}
                placeholder={
                  replyingTo 
                    ? 'Write a reply...' 
                    : editingComment 
                    ? 'Edit your comment...'
                    : 'Write a comment...'
                }
              />
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {commentsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center gap-2 text-gray-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading comments...
                </div>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-500">
                  No comments yet.
                  {user && (
                    <p className="mt-2">
                      Be the first to leave a comment!
                    </p>
                  )}
                </div>
              </div>
            ) : (
              comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  onEdit={handleEditComment}
                  onDelete={handleDeleteComment}
                  onReply={handleReplyToComment}
                  onLoadReplies={loadReplies}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 