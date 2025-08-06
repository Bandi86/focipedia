'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Home,
  TrendingUp,
  Users,
  Bookmark,
  Settings,
  Plus
} from 'lucide-react';
import { useAuth } from '@/lib/auth-hooks';
import Link from 'next/link';

export const FeedSidebar: React.FC = () => {
  const { user } = useAuth();

  const navigationItems = [
    {
      icon: Home,
      label: 'Főoldal',
      href: '/feed',
      active: true
    },
    {
      icon: TrendingUp,
      label: 'Trendek',
      href: '/trends'
    },
    {
      icon: Users,
      label: 'Közösség',
      href: '/community'
    },
    {
      icon: Bookmark,
      label: 'Könyvjelzők',
      href: '/bookmarks'
    }
  ];

  return (
    <div className="space-y-4">
      {/* User Profile Card */}
      {user && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
                  {user.displayName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {user.displayName}
                </div>
                <div className="text-sm text-gray-500">
                  @{user.username}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <Card>
        <CardContent className="p-2">
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={item.active ? "default" : "ghost"}
                    className="w-full justify-start"
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Gyors műveletek</CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <div className="space-y-1">
            <Button variant="outline" className="w-full justify-start">
              <Plus className="w-4 h-4 mr-3" />
              Új bejegyzés
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Settings className="w-4 h-4 mr-3" />
              Beállítások
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Statisztikák</CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Bejegyzések</span>
              <span className="font-medium">0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Követők</span>
              <span className="font-medium">0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Követett</span>
              <span className="font-medium">0</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 