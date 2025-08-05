'use client';

import React, { useState } from 'react';
import { hu } from '@/lib/i18n/hu';
import { Widget, WidgetHeader, WidgetContent } from './WidgetGrid';
import { Heart, MessageCircle, UserPlus, AtSign, Bell, Check } from 'lucide-react';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'match';
  user: {
    name: string;
    avatar: string;
    username: string;
  };
  content: string;
  timestamp: string;
  isRead: boolean;
  postId?: string;
}

export default function NotificationsWidget() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'like',
      user: {
        name: 'Kovács Péter',
        avatar: 'KP',
        username: 'kovacsp'
      },
      content: hu.dashboard.notifications.types.like,
      timestamp: '2 perce',
      isRead: false,
      postId: 'post-123'
    },
    {
      id: '2',
      type: 'comment',
      user: {
        name: 'Nagy Anna',
        avatar: 'NA',
        username: 'nagyanna'
      },
      content: hu.dashboard.notifications.types.comment,
      timestamp: '15 perce',
      isRead: false,
      postId: 'post-456'
    },
    {
      id: '3',
      type: 'follow',
      user: {
        name: 'Szabó Gábor',
        avatar: 'SG',
        username: 'szabog'
      },
      content: hu.dashboard.notifications.types.follow,
      timestamp: '1 órával ezelőtt',
      isRead: true
    },
    {
      id: '4',
      type: 'mention',
      user: {
        name: 'Tóth Eszter',
        avatar: 'TE',
        username: 'totheszter'
      },
      content: hu.dashboard.notifications.types.mention,
      timestamp: '3 órával ezelőtt',
      isRead: true,
      postId: 'post-789'
    },
    {
      id: '5',
      type: 'match',
      user: {
        name: 'Focipedia',
        avatar: 'F',
        username: 'focipedia'
      },
      content: hu.dashboard.notifications.types.match,
      timestamp: '1 nappal ezelőtt',
      isRead: true
    }
  ]);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'like':
        return <Heart className="w-5 h-5 text-red-500" />;
      case 'comment':
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'follow':
        return <UserPlus className="w-5 h-5 text-green-500" />;
      case 'mention':
        return <AtSign className="w-5 h-5 text-purple-500" />;
      case 'match':
        return <Bell className="w-5 h-5 text-orange-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'like':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'comment':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      case 'follow':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'mention':
        return 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800';
      case 'match':
        return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
      default:
        return 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600';
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(notifications.map(notification => {
      if (notification.id === notificationId) {
        return { ...notification, isRead: true };
      }
      return notification;
    }));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      isRead: true
    })));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <Widget>
      <WidgetHeader 
        title={hu.dashboard.notifications.title}
        action={
          unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium"
            >
              {hu.dashboard.notifications.markAllRead}
            </button>
          )
        }
      />
      <WidgetContent>
        <div className="space-y-3">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border transition-colors ${
                  notification.isRead 
                    ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700' 
                    : getNotificationColor(notification.type)
                } ${!notification.isRead ? 'hover:shadow-sm' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                          <span className="text-green-600 dark:text-green-400 font-semibold text-xs">
                            {notification.user.avatar}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white text-sm">
                            {notification.user.name}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400 text-sm ml-1">
                            {notification.content}
                          </span>
                        </div>
                      </div>
                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-1 text-gray-400 hover:text-green-600 dark:hover:text-green-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {notification.timestamp}
                      </span>
                      {notification.postId && (
                        <button className="text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium">
                          Megtekintés
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 dark:text-gray-600 mb-4">
                <Bell className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {hu.dashboard.notifications.empty.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {hu.dashboard.notifications.empty.description}
              </p>
            </div>
          )}
        </div>
      </WidgetContent>
    </Widget>
  );
} 