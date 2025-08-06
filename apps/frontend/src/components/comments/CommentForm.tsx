'use client';

import React, { useState, useEffect } from 'react';
import { Comment, CreateCommentRequest, UpdateCommentRequest } from '@/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, Send, X } from 'lucide-react';
import { useAuth } from '@/lib/auth';

interface CommentFormProps {
  comment?: Comment;
  postId: string;
  parentId?: string;
  onSubmit: (data: CreateCommentRequest | UpdateCommentRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  placeholder?: string;
}

export const CommentForm: React.FC<CommentFormProps> = ({
  comment,
  postId,
  parentId,
  onSubmit,
  onCancel,
  isLoading = false,
  placeholder = 'Write a comment...',
}) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (comment) {
      setContent(comment.content);
    }
  }, [comment]);

  const validateForm = (): boolean => {
    if (!content.trim()) {
      setError('Comment content is required');
      return false;
    }
    
    if (content.length > 2000) {
      setError('Comment must be less than 2,000 characters');
      return false;
    }
    
    setError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (comment) {
        // Update existing comment
        await onSubmit({ content } as UpdateCommentRequest);
      } else {
        // Create new comment
        await onSubmit({
          content,
          postId,
          parentId,
        } as CreateCommentRequest);
      }
      
      // Clear form after successful submission
      if (!comment) {
        setContent('');
      }
    } catch (error) {
      console.error('Failed to submit comment:', error);
    }
  };

  const handleInputChange = (value: string) => {
    setContent(value);
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!user) {
    return (
      <Card className="mb-4">
        <CardContent className="p-4">
          <p className="text-center text-muted-foreground">
            Please log in to leave a comment.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit}>
          <div className="flex items-start gap-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="text-xs">
                {getInitials(user.displayName || user.username || 'U')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-3">
              <div className="space-y-2">
                <Textarea
                  value={content}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder={placeholder}
                  rows={3}
                  className={error ? 'border-red-500' : ''}
                  disabled={isLoading}
                />
                {error && (
                  <p className="text-sm text-red-500">{error}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  {content.length}/2,000 characters
                </p>
              </div>
              
              <div className="flex items-center justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onCancel}
                  disabled={isLoading}
                >
                  <X className="w-4 h-4" />
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isLoading || !content.trim()}
                  className="flex items-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {comment ? 'Update' : 'Post Comment'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}; 