'use client';

import React, { useState } from 'react';
import { Post } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Edit, 
  Trash2, 
  MessageCircle, 
  Eye, 
  EyeOff,
  Calendar,
  User
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/lib/auth';

interface PostCardProps {
  post: Post;
  onEdit?: (post: Post) => void;
  onDelete?: (postId: string) => void;
  onViewComments?: (postId: string) => void;
  showActions?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onEdit,
  onDelete,
  onViewComments,
  showActions = true,
}) => {
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const isAuthor = user?.id === post.authorId;

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

  const handleViewComments = () => {
    if (onViewComments) {
      onViewComments(post.id);
    }
  };

  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl font-semibold mb-2">
              {post.title}
            </CardTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{post.authorDisplayName}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                <span>{post.commentCount} hozzászólás</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!post.isPublished && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <EyeOff className="w-3 h-3" />
                Vázlat
              </Badge>
            )}
            {post.isPublished && (
              <Badge variant="default" className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                Közzétett
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="prose prose-sm max-w-none mb-4">
          <p className="text-gray-700 dark:text-gray-300 line-clamp-3">
            {post.content}
          </p>
        </div>
        
        {showActions && (
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewComments}
                className="flex items-center gap-1"
              >
                <MessageCircle className="w-4 h-4" />
                Hozzászólások ({post.commentCount})
              </Button>
            </div>
            
            {isAuthor && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEdit}
                  className="flex items-center gap-1"
                >
                  <Edit className="w-4 h-4" />
                  Szerkesztés
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                  {isDeleting ? 'Törlés...' : 'Törlés'}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 