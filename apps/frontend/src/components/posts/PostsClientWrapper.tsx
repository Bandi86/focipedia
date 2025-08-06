'use client';

import React, { useState } from 'react';
import { Post, CreatePostRequest, UpdatePostRequest } from '@/types';
import { postAPI } from '@/lib/api';
import { PostForm } from '@/components/posts/PostForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Search, 
  Filter,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/lib/auth-hooks';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';

interface PostsClientWrapperProps {
  posts: Post[];
  totalPages: number;
  searchTerm?: string;
  filterStatus?: string;
}

export const PostsClientWrapper: React.FC<PostsClientWrapperProps> = ({
  posts,
  totalPages,
  searchTerm = '',
  filterStatus = 'all'
}) => {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [localFilterStatus, setLocalFilterStatus] = useState(filterStatus);

  const handleCreatePost = async (data: CreatePostRequest) => {
    try {
      setCreating(true);
      await postAPI.createPost(data);
      toast.success('Bejegyzés sikeresen létrehozva');
      setShowForm(false);
      // Refresh the page to get updated data
      router.refresh();
    } catch (error) {
      console.error('Failed to create post:', error);
      toast.error('Nem sikerült létrehozni a bejegyzést');
    } finally {
      setCreating(false);
    }
  };

  const handleUpdatePost = async (data: UpdatePostRequest) => {
    if (!editingPost) return;

    try {
      setCreating(true);
      await postAPI.updatePost(editingPost.id, data);
      toast.success('Bejegyzés sikeresen frissítve');
      setEditingPost(null);
      // Refresh the page to get updated data
      router.refresh();
    } catch (error) {
      console.error('Failed to update post:', error);
      toast.error('Nem sikerült frissíteni a bejegyzést');
    } finally {
      setCreating(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await postAPI.deletePost(postId);
      toast.success('Bejegyzés sikeresen törölve');
      // Refresh the page to get updated data
      router.refresh();
    } catch (error) {
      console.error('Failed to delete post:', error);
      toast.error('Nem sikerült törölni a bejegyzést');
    }
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingPost(null);
  };

  const handleSearch = (value: string) => {
    setLocalSearchTerm(value);
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    router.push(`/posts?${params.toString()}`);
  };

  const handleFilterChange = (value: string) => {
    setLocalFilterStatus(value);
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      params.set('filter', value);
    } else {
      params.delete('filter');
    }
    router.push(`/posts?${params.toString()}`);
  };

  const handleRefresh = () => {
    router.refresh();
  };

  const filteredPosts = posts.filter(post => {
    if (localSearchTerm) {
      return post.title.toLowerCase().includes(localSearchTerm.toLowerCase()) ||
             post.content.toLowerCase().includes(localSearchTerm.toLowerCase());
    }
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Bejegyzések
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Oszd meg gondolataidat és kapcsolódj be a közösségbe
            </p>
          </div>
          
          {user && (
            <Button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Új bejegyzés
            </Button>
          )}
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Bejegyzések keresése..."
                value={localSearchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <Select value={localFilterStatus} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Összes bejegyzés</SelectItem>
                <SelectItem value="published">Közzétett</SelectItem>
                <SelectItem value="draft">Vázlatok</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Post Form */}
        {(showForm || editingPost) && (
          <div className="mb-8">
            <PostForm
              post={editingPost || undefined}
              onSubmit={async (data) => {
                if (editingPost) {
                  await handleUpdatePost(data as UpdatePostRequest);
                } else {
                  await handleCreatePost(data as CreatePostRequest);
                }
              }}
              onCancel={handleCancelForm}
              isLoading={creating}
            />
          </div>
        )}

        {/* Posts List */}
        <div className="space-y-6">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500">
                {localSearchTerm ? 'Nem található bejegyzés a keresésnek megfelelően.' : 'Még nincsenek bejegyzések.'}
                {user && !localSearchTerm && (
                  <p className="mt-2">
                    Te lehetsz az első, aki bejegyzést hoz létre!
                  </p>
                )}
              </div>
            </div>
          ) : (
            <>
              {filteredPosts.map((post) => (
                <div key={post.id} className="border rounded-lg p-4">
                  <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4">{post.content}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Szerző: {post.authorDisplayName}</span>
                    <span>{new Date(post.createdAt).toLocaleDateString('hu-HU')}</span>
                  </div>
                  {user?.id === post.authorId && (
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditPost(post)}
                      >
                        Szerkesztés
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeletePost(post.id)}
                      >
                        Törlés
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>

        {/* Load More */}
        {totalPages > 1 && (
          <div className="flex justify-center pt-6">
            <Button
              variant="outline"
              onClick={() => {
                // TODO: Implement load more functionality
                console.log('Load more clicked');
              }}
            >
              További bejegyzések betöltése
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}; 