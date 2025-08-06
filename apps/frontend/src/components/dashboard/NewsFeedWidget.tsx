'use client';

import React, { useState } from 'react';
import { hu } from '@/lib/i18n/hu';
import { Widget, WidgetHeader, WidgetContent } from './WidgetGrid';
import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal } from 'lucide-react';

interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    username: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isSaved: boolean;
  hashtags?: string[];
}

export default function NewsFeedWidget() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: {
        name: 'Kovács Péter',
        avatar: 'KP',
        username: 'kovacsp'
      },
      content: 'Fantasztikus meccs volt ma! A Ferencváros ismét megmutatta, hogy miért a legjobb csapat Magyarországon! 🔴⚪ #Fradi #NB1',
      timestamp: '2 órával ezelőtt',
      likes: 24,
      comments: 8,
      shares: 3,
      isLiked: false,
      isSaved: false,
      hashtags: ['#Fradi', '#NB1']
    },
    {
      id: '2',
      author: {
        name: 'Nagy Anna',
        avatar: 'NA',
        username: 'nagyanna'
      },
      content: 'Végre megtörtént! A magyar válogatott kvalifikálta magát az Európa-bajnokságra! 🇭🇺⚽ #MagyarVálogatott #EURO2024',
      timestamp: '5 órával ezelőtt',
      likes: 156,
      comments: 23,
      shares: 45,
      isLiked: true,
      isSaved: true,
      hashtags: ['#MagyarVálogatott', '#EURO2024']
    },
    {
      id: '3',
      author: {
        name: 'Szabó Gábor',
        avatar: 'SG',
        username: 'szabog'
      },
      content: 'Ma este a Champions League döntő! Ki nyeri meg? Real Madrid vagy Dortmund? 🤔 #UCL #ChampionsLeague',
      timestamp: '1 nappal ezelőtt',
      likes: 89,
      comments: 67,
      shares: 12,
      isLiked: false,
      isSaved: false,
      hashtags: ['#UCL', '#ChampionsLeague']
    }
  ]);

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  const handleSave = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isSaved: !post.isSaved
        };
      }
      return post;
    }));
  };



  return (
    <Widget>
      <WidgetHeader title="Hírfolyam" />
      <WidgetContent>
        <div className="space-y-6">
          {posts.length > 0 ? (
            posts.map((post) => (
              <article key={post.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 dark:text-green-400 font-semibold text-sm">
                      {post.author.avatar}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {post.author.name}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          @{post.author.username} • {post.timestamp}
                        </p>
                      </div>
                      <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <p className="text-gray-900 dark:text-white mb-3 leading-relaxed">
                      {post.content}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <button
                          onClick={() => handleLike(post.id)}
                          className={`flex items-center gap-2 text-sm transition-colors ${
                            post.isLiked 
                              ? 'text-red-500 dark:text-red-400' 
                              : 'text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                          {post.likes}
                        </button>
                        
                        <button className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          {post.comments}
                        </button>
                        
                        <button className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                          <Share className="w-4 h-4" />
                          {post.shares}
                        </button>
                      </div>
                      
                      <button
                        onClick={() => handleSave(post.id)}
                        className={`p-1 rounded-full transition-colors ${
                          post.isSaved 
                            ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20' 
                            : 'text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <Bookmark className={`w-4 h-4 ${post.isSaved ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 dark:text-gray-600 mb-4">
                <MessageCircle className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {hu.dashboard.newsfeed.empty.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {hu.dashboard.newsfeed.empty.description}
              </p>
            </div>
          )}
        </div>
      </WidgetContent>
    </Widget>
  );
} 