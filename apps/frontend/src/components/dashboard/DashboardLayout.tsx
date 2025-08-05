'use client';

import React, { useState, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from '@/lib/auth';
import { hu } from '@/lib/i18n/hu';
import ThemeToggle from './ThemeToggle';
import {
  Home,
  User,
  Users,
  Settings,
  BarChart3,
  Menu,
  X,
  ChevronRight,
  Newspaper,
  Trophy,
  Bell,
  Heart,
  TrendingUp,
  Search
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navigation: NavigationItem[] = [
  { name: hu.dashboard.navigation.dashboard, href: '/dashboard', icon: Home },
  { name: hu.dashboard.navigation.newsfeed, href: '/dashboard/newsfeed', icon: Newspaper },
  { name: hu.dashboard.navigation.matches, href: '/dashboard/matches', icon: Trophy },
  { name: hu.dashboard.navigation.community, href: '/dashboard/community', icon: Users },
  { name: hu.dashboard.navigation.notifications, href: '/dashboard/notifications', icon: Bell },
  { name: hu.dashboard.navigation.favorites, href: '/dashboard/favorites', icon: Heart },
  { name: hu.dashboard.navigation.trends, href: '/dashboard/trends', icon: TrendingUp },
  { name: hu.dashboard.navigation.profile, href: '/dashboard/profile', icon: User },
  { name: hu.dashboard.navigation.analytics, href: '/dashboard/analytics', icon: BarChart3 },
  { name: hu.dashboard.navigation.settings, href: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const user = auth.getCurrentUser();

  const handleLogout = async () => {
    await auth.logout();
    router.push('/login');
  };

  const breadcrumbs = useMemo(() => {
    const paths = pathname.split('/').filter(Boolean);
    return paths.map((path, index) => {
      const href = '/' + paths.slice(0, index + 1).join('/');
      const name = path.charAt(0).toUpperCase() + path.slice(1);
      return { name, href };
    });
  }, [pathname]);

  // Accessible NavItem
  const NavItem = ({ item }: { item: NavigationItem }) => {
    const isActive = pathname === item.href;
    return (
      <button
        onClick={() => {
          router.push(item.href);
          setSidebarOpen(false);
        }}
        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500 dark:focus-visible:ring-offset-gray-800 ${
          isActive
            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
        }`}
        aria-current={isActive ? 'page' : undefined}
      >
        <item.icon className="mr-3 h-5 w-5" aria-hidden="true" />
        {item.name}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Skip to main content link for in-layout keyboard access */}
      <a href="#dashboard-main" className="skip-to-content">Skip to main content</a>

      {/* Off-canvas mobile sidebar */}
      <div className="lg:hidden" aria-hidden={!sidebarOpen}>
        <div
          className={`fixed inset-0 z-40 ${sidebarOpen ? 'block' : 'hidden'}`}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="fixed inset-0 bg-gray-900/50"
            onClick={() => setSidebarOpen(false)}
          />
          <nav
            className="fixed inset-y-0 left-0 z-50 w-72 max-w-[80%] bg-white dark:bg-gray-800 shadow-xl focus:outline-none"
            aria-label="Sidebar"
          >
            <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
              <h1 className="text-xl font-bold text-green-800 dark:text-green-200">
                {hu.common.appName}
              </h1>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500 dark:focus-visible:ring-offset-gray-800"
                aria-label="Close sidebar"
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <ul className="space-y-2 px-4 py-4">
              {navigation.map((item) => (
                <li key={item.name}>
                  <NavItem item={item} />
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Responsive layout grid: sidebar + content */}
      <div className="grid grid-cols-1 lg:grid-cols-[16rem_1fr]">
        {/* Persistent sidebar on desktop */}
        <nav
          className="hidden lg:flex lg:flex-col lg:min-h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg"
          aria-label="Sidebar"
        >
          <div className="flex h-16 items-center px-4 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl font-bold text-green-800 dark:text-green-200">
              {hu.common.appName}
            </h1>
          </div>
          <ul className="space-y-2 px-4 py-4">
            {navigation.map((item) => (
              <li key={item.name}>
                <NavItem item={item} />
              </li>
            ))}
          </ul>
        </nav>

        {/* Header + Main */}
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <header className="sticky top-0 z-30 bg-white/90 dark:bg-gray-800/90 backdrop-blur border-b border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500 dark:focus-visible:ring-offset-gray-800"
                  aria-label="Open sidebar"
                >
                  <Menu className="h-6 w-6" aria-hidden="true" />
                </button>

                {/* Breadcrumbs with aria-label and proper separators */}
                <nav className="flex" aria-label="Breadcrumb">
                  <ol className="flex items-center flex-wrap">
                    {breadcrumbs.map((breadcrumb, index) => {
                      const isLast = index === breadcrumbs.length - 1;
                      return (
                        <li key={breadcrumb.href} className="flex items-center">
                          {index > 0 && (
                            <span
                              className="mx-2 text-gray-400"
                              aria-hidden="true"
                            >
                              /
                            </span>
                          )}
                          <button
                            onClick={() => router.push(breadcrumb.href)}
                            className={`text-sm font-medium transition-colors focus:outline-none focus-visible:underline ${
                              isLast
                                ? 'text-gray-900 dark:text-white'
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                            }`}
                            aria-current={isLast ? 'page' : undefined}
                          >
                            {breadcrumb.name}
                          </button>
                        </li>
                      );
                    })}
                  </ol>
                </nav>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Üdvözöl, {user?.displayName || user?.username || 'Felhasználó'}
                </span>
                <ThemeToggle />
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500 dark:focus-visible:ring-offset-gray-800 transition-colors"
                >
                  {hu.common.buttons.logout}
                </button>
              </div>
            </div>
          </header>

          {/* Main content landmark with consistent container and spacing */}
          <main id="dashboard-main" className="flex-1">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}