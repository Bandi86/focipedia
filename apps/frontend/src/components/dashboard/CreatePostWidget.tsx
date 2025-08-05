'use client';

import React, { useState } from 'react';
import { auth } from '@/lib/auth';
import { hu } from '@/lib/i18n/hu';
import { Widget, WidgetHeader, WidgetContent } from './WidgetGrid';
import { Button } from '@/components/ui/button';
import { Image, Smile, Hash } from 'lucide-react';

export default function CreatePostWidget() {
  const [content, setContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const user = auth.getCurrentUser();

  const handlePost = async () => {
    if (!content.trim()) return;
    
    setIsPosting(true);
    // Mock API call - később valós API hívás lesz
    await new Promise(resolve => setTimeout(resolve, 1000));
    setContent('');
    setIsPosting(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handlePost();
    }
  };

  return (
    <Widget>
      <WidgetHeader title={hu.dashboard.newsfeed.createPost} />
      <WidgetContent>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-green-600 dark:text-green-400 font-semibold text-sm">
                {user?.displayName?.charAt(0) || user?.username?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={hu.dashboard.newsfeed.placeholder}
                className="w-full min-h-[100px] p-3 border border-gray-200 dark:border-gray-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                maxLength={500}
              />
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-500 hover:text-green-600 dark:hover:text-green-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <Image className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-green-600 dark:hover:text-green-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <Smile className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-green-600 dark:hover:text-green-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <Hash className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    {content.length}/500
                  </span>
                  <Button
                    onClick={handlePost}
                    disabled={!content.trim() || isPosting}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isPosting ? 'Posztolás...' : hu.dashboard.newsfeed.post}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </WidgetContent>
    </Widget>
  );
} 