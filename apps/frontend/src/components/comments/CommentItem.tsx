'use client';

import React, { useState } from 'react';
import { Comment } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Edit, 
  Trash2, 
  Reply, 
  ChevronDown, 
  ChevronRight,
  MessageCircle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/lib/auth';

interface CommentItemProps {
  comment: Comment;
  onEdit?: (comment: Comment) => void;
  onDelete?: (commentId: string) => void;
  onReply?: (commentId: string) => void;
  onLoadReplies?: (commentId: string) => Promise<Comment[]>;
  depth?: number;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onEdit,
  onDelete,
  onReply,
  onLoadReplies,
  depth = 0,
}) => {
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [replies, setReplies] = useState<Comment[]>([]);
  const [showReplies, setShowReplies] = useState(false);
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);

  
  const isAuthor = user?.id === comment.authorId;
  const maxDepth = 3; // Prevent infinite nesting

  const handleDelete = async () => {
    if (!onDelete) return;
    
    if (window.confirm('Are you sure you want to delete this comment?')) {
      setIsDeleting(true);
      try {
        await onDelete(comment.id);
      } catch (error) {
        console.error('Failed to delete comment:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(comment);
    }
  };

  const handleReply = () => {
    if (onReply) {
      onReply(comment.id);
    }
  };

  const handleLoadReplies = async () => {
    if (!onLoadReplies || showReplies) return;
    
    setIsLoadingReplies(true);
    try {
      const replyComments = await onLoadReplies(comment.id);
      setReplies(replyComments);
      setShowReplies(true);
    } catch (error) {
      console.error('Failed to load replies:', error);
    } finally {
      setIsLoadingReplies(false);
    }
  };

  const handleToggleReplies = () => {
    if (showReplies) {
      setShowReplies(false);
    } else {
      handleLoadReplies();
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

  return (
    <div className={`${depth > 0 ? 'ml-6 border-l-2 border-gray-200 dark:border-gray-700 pl-4' : ''}`}>
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="text-xs">
                {getInitials(comment.authorDisplayName)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-sm">
                  {comment.authorDisplayName}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </span>
              </div>
              
              <div className="prose prose-sm max-w-none mb-3">
                <p className="text-gray-700 dark:text-gray-300">
                  {comment.content}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReply}
                  disabled={depth >= maxDepth}
                  className="flex items-center gap-1 text-xs"
                >
                  <Reply className="w-3 h-3" />
                  Reply
                </Button>
                
                {comment.replyCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleToggleReplies}
                    className="flex items-center gap-1 text-xs"
                  >
                    {showReplies ? (
                      <ChevronDown className="w-3 h-3" />
                    ) : (
                      <ChevronRight className="w-3 h-3" />
                    )}
                    {comment.replyCount} {comment.replyCount === 1 ? 'reply' : 'replies'}
                  </Button>
                )}
                
                {isAuthor && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleEdit}
                      className="flex items-center gap-1 text-xs"
                    >
                      <Edit className="w-3 h-3" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Replies */}
      {showReplies && (
        <div className="space-y-2">
          {isLoadingReplies ? (
            <div className="flex items-center justify-center py-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MessageCircle className="w-4 h-4 animate-pulse" />
                Loading replies...
              </div>
            </div>
          ) : (
            replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                onEdit={onEdit}
                onDelete={onDelete}
                onReply={onReply}
                onLoadReplies={onLoadReplies}
                depth={depth + 1}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}; 