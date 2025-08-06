'use client';

import React, { useState } from 'react';
import { Post, CreatePostRequest, UpdatePostRequest } from '@/types';
import { postAPI } from '@/lib/api';
import { FeedPostCard } from '@/components/feed/FeedPostCard';
import { FeedPostForm } from '@/components/feed/FeedPostForm';
import { FeedSidebar } from '@/components/feed/FeedSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter,
  RefreshCw,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '@/lib/auth-hooks';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';

interface FeedClientWrapperProps {
  posts: Post[];
  totalPages: number;
  searchTerm?: string;
  filterStatus?: string;

}

export const FeedClientWrapper: React.FC<FeedClientWrapperProps> = ({
  posts,
  totalPages,
  searchTerm = '',
  filterStatus = 'all',
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
    router.push(`/feed?${params.toString()}`);
  };

  const handleFilterChange = (value: string) => {
    setLocalFilterStatus(value);
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      params.set('filter', value);
    } else {
      params.delete('filter');
    }
    router.push(`/feed?${params.toString()}`);
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
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Left Sidebar */}
      <div className="lg:col-span-1">
        <FeedSidebar />
      </div>

      {/* Main Feed Content */}
      <div className="lg:col-span-2">
        {/* Quick Post Form */}
        {user && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {user.displayName.charAt(0).toUpperCase()}
                </span>
              </div>
              <Button
                variant="outline"
                className="flex-1 justify-start text-left text-gray-500"
                onClick={() => setShowForm(true)}
              >
                Mi történik veled?
              </Button>
            </div>
          </div>
        )}

        {/* Post Form */}
        {(showForm || editingPost) && (
          <div className="mb-6">
            <FeedPostForm
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

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Keresés a hírfolyamban..."
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
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {filteredPosts.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
              <div className="text-gray-500">
                {localSearchTerm ? 'Nem található bejegyzés a keresésnek megfelelően.' : 'Még nincsenek bejegyzések a hírfolyamban.'}
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
                <FeedPostCard
                  key={post.id}
                  post={post}
                  onEdit={handleEditPost}
                  onDelete={handleDeletePost}
                />
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

      {/* Right Sidebar */}
      <div className="lg:col-span-1">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Trendelő hashtag-ek
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-600 dark:text-blue-400">#futball</span>
              <span className="text-xs text-gray-500">42 poszt</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-600 dark:text-blue-400">#bajnokság</span>
              <span className="text-xs text-gray-500">28 poszt</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-600 dark:text-blue-400">#transfer</span>
              <span className="text-xs text-gray-500">15 poszt</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            Aktivitás
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">Új bejegyzés</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">Új komment</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">Új like</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 