'use client';

import React, { useState } from 'react';
import { Post } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreHorizontal,
  Edit,
  Trash2,

  EyeOff,
  Calendar,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/lib/auth-hooks';

interface FeedPostCardProps {
  post: Post;
  onEdit?: (post: Post) => void;
  onDelete?: (postId: string) => void;
}

export const FeedPostCard: React.FC<FeedPostCardProps> = ({
  post,
  onEdit,
  onDelete,
}) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isAuthor = user?.id === post.authorId;

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    // TODO: Implement like API call
  };

  const handleComment = () => {
    setShowComments(!showComments);
    // TODO: Implement comment functionality
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    console.log('Share post:', post.id);
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    
    if (window.confirm('Biztosan törölni szeretnéd ezt a bejegyzést?')) {
      setIsDeleting(true);
      try {
        await onDelete(post.id);
      } catch (error) {
        console.error('Failed to delete post:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(post);
    }
  };

  // Extract hashtags from content
  const extractHashtags = (content: string) => {
    const hashtagRegex = /#[\w\u00C0-\u017F]+/g;
    return content.match(hashtagRegex) || [];
  };

  const hashtags = extractHashtags(post.content);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Post Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {post.authorDisplayName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {post.authorDisplayName}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-3 h-3" />
                <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                {!post.isPublished && (
                  <Badge variant="secondary" className="text-xs">
                    <EyeOff className="w-3 h-3 mr-1" />
                    Vázlat
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          {isAuthor && (
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
              <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEdit}
                  className="w-full justify-start px-3 py-2"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Szerkesztés
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full justify-start px-3 py-2 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {isDeleting ? 'Törlés...' : 'Törlés'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Post Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {post.title}
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-3 whitespace-pre-wrap">
          {post.content}
        </p>
        
        {/* Hashtags */}
        {hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {hashtags.map((hashtag, index) => (
              <span
                key={index}
                className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer text-sm"
                onClick={() => {
                  // TODO: Navigate to hashtag page
                  console.log('Navigate to hashtag:', hashtag);
                }}
              >
                {hashtag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`flex items-center gap-2 ${
                isLiked ? 'text-red-600' : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{likeCount}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleComment}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{post.commentCount}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400"
            >
              <Share2 className="w-4 h-4" />
              <span>Megosztás</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="text-sm text-gray-500 mb-2">
            Kommentek ({post.commentCount})
          </div>
          <div className="text-center py-4 text-gray-500">
            Komment funkció hamarosan elérhető...
          </div>
        </div>
      )}
    </div>
  );
}; 