'use client';

import React from 'react';
import { Post } from '@/types';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TrendingUp,
  Hash,
  Plus,
  MessageCircle,
  Heart,
  Eye,
  Calendar
} from 'lucide-react';
import { useAuth } from '@/lib/auth-hooks';


import { formatDistanceToNow } from 'date-fns';

interface FeedWidgetProps {
  posts?: Post[];
}

const FeedWidget: React.FC<FeedWidgetProps> = ({ posts = [] }) => {
  const { user } = useAuth();


  const handleCreatePost = async () => {
    // Navigate to feed page with create form open
    window.location.href = '/feed?create=true';
  };

  const handleViewAll = () => {
    window.location.href = '/feed';
  };

  // Extract hashtags from posts
  const extractHashtags = (content: string) => {
    const hashtagRegex = /#[\w\u00C0-\u017F]+/g;
    return content.match(hashtagRegex) || [];
  };

  // Get trending hashtags
  const getTrendingHashtags = () => {
    const hashtagCount: Record<string, number> = {};
    
    posts.forEach(post => {
      const hashtags = extractHashtags(post.content);
      hashtags.forEach(hashtag => {
        hashtagCount[hashtag] = (hashtagCount[hashtag] || 0) + 1;
      });
    });

    return Object.entries(hashtagCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([hashtag, count]) => ({ hashtag, count }));
  };

  const trendingHashtags = getTrendingHashtags();

  return (
    <div className="space-y-6">
      {/* Quick Post Creation */}
      {user && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Gyors bejegyzés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {user.displayName.charAt(0).toUpperCase()}
                </span>
              </div>
              <Button
                variant="outline"
                className="flex-1 justify-start text-left text-gray-500"
                onClick={handleCreatePost}
              >
                Mi történik veled?
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Latest Posts */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Legfrissebb hírek
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={handleViewAll}>
              Összes megtekintése
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {posts.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <MessageCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p>Még nincsenek bejegyzések</p>
              {user && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={handleCreatePost}
                >
                  Első bejegyzés létrehozása
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {posts.slice(0, 3).map((post) => (
                <div key={post.id} className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-b-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white line-clamp-2">
                        {post.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                        {post.content}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          {post.commentCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          0
                        </span>
                      </div>
                    </div>
                    {!post.isPublished && (
                      <div className="ml-2">
                        <Eye className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Trending Hashtags */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Hash className="w-5 h-5" />
            Trendelő hashtag-ek
          </CardTitle>
        </CardHeader>
        <CardContent>
          {trendingHashtags.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              <p>Még nincsenek trendelő hashtag-ek</p>
            </div>
          ) : (
            <div className="space-y-2">
              {trendingHashtags.map(({ hashtag, count }) => (
                <div key={hashtag} className="flex items-center justify-between">
                  <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer text-sm">
                    {hashtag}
                  </span>
                  <span className="text-xs text-gray-500">{count} poszt</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Activity Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Aktivitás összefoglaló</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {posts.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Bejegyzés
              </div>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {posts.reduce((sum, post) => sum + post.commentCount, 0)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Komment
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedWidget; 