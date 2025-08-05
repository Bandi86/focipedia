'use client';

import React, { Suspense, useMemo } from 'react';
import { auth } from '@/lib/auth';
import { hu } from '@/lib/i18n/hu';
import { User, Calendar, Clock } from 'lucide-react';

interface WelcomeWidgetProps {
  className?: string;
}

function WelcomeContent() {
  const user = auth.getCurrentUser();

  const { greeting, icon, message } = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return {
        greeting: hu.dashboard.welcome.morning,
        icon: '🌅',
        message: hu.dashboard.welcome.messages.morning,
      };
    } else if (hour < 17) {
      return {
        greeting: hu.dashboard.welcome.afternoon,
        icon: '☀️',
        message: hu.dashboard.welcome.messages.afternoon,
      };
    }
    return {
      greeting: hu.dashboard.welcome.evening,
      icon: '🌙',
      message: hu.dashboard.welcome.messages.evening,
    };
  }, []);

  const currentDate = useMemo(
    () =>
      new Date().toLocaleDateString('hu-HU', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    []
  );

  const displayName = user?.displayName || user?.username || 'Futball Rajongó';
  const avatarUrl = null; // user?.profile?.avatarUrl;

  return (
    <section
      aria-labelledby="welcome-heading"
      className="bg-gradient-to-br from-green-600 to-emerald-700 dark:from-green-700 dark:to-emerald-800 rounded-lg p-6 text-white shadow-lg"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-shrink-0">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={`${displayName} avatar`}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full border-2 border-white/20 object-cover"
                />
              ) : (
                <div
                  role="img"
                  aria-label={`${displayName} avatar placeholder`}
                  className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
                >
                  <User className="w-6 h-6 text-white" aria-hidden="true" />
                </div>
              )}
            </div>
            <div>
              <h2 id="welcome-heading" className="text-xl font-bold leading-snug">
                {greeting}, {displayName}! <span aria-hidden="true">{icon}</span>
              </h2>
              <p className="text-green-100 text-sm">{message}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-green-100">
              <Calendar className="w-4 h-4" aria-hidden="true" />
              <time className="text-sm" aria-label={`Today is ${currentDate}`}>
                {currentDate}
              </time>
            </div>

            <div className="flex items-center gap-2 text-green-100">
              <Clock className="w-4 h-4" aria-hidden="true" />
              <span className="text-sm">Utolsó bejelentkezés: Ma</span>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 ml-4 text-right" aria-hidden="true">
          <div className="text-2xl font-bold">⚽</div>
          <div className="text-xs text-green-100 mt-1">Futball</div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-white/20">
        <ul className="grid grid-cols-3 gap-4 text-center">
          <li>
            <div className="text-lg font-bold" aria-label="Posts count">
              0
            </div>
            <div className="text-xs text-green-100">{hu.dashboard.welcome.stats.posts}</div>
          </li>
          <li>
            <div className="text-lg font-bold" aria-label="Followers count">
              0
            </div>
            <div className="text-xs text-green-100">{hu.dashboard.welcome.stats.followers}</div>
          </li>
          <li>
            <div className="text-lg font-bold" aria-label="Following count">
              0
            </div>
            <div className="text-xs text-green-100">{hu.dashboard.welcome.stats.following}</div>
          </li>
        </ul>
      </div>
    </section>
  );
}

function WelcomeSkeleton() {
  return (
    <section
      className="rounded-lg p-6 bg-gradient-to-br from-green-600 to-emerald-700 dark:from-green-700 dark:to-emerald-800 text-white"
      aria-label="Loading welcome section"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-white/30 animate-pulse" />
            <div>
              <div className="h-4 w-48 bg-white/30 rounded animate-pulse" />
              <div className="mt-2 h-3 w-64 bg-white/20 rounded animate-pulse" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-3 w-40 bg-white/20 rounded animate-pulse" />
            <div className="h-3 w-32 bg-white/20 rounded animate-pulse" />
          </div>
        </div>
        <div className="w-10 h-8 bg-white/20 rounded animate-pulse" />
      </div>

      <div className="mt-6 pt-4 border-t border-white/20">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="h-10 bg-white/10 rounded animate-pulse" />
          <div className="h-10 bg-white/10 rounded animate-pulse" />
          <div className="h-10 bg-white/10 rounded animate-pulse" />
        </div>
      </div>
    </section>
  );
}

export default function WelcomeWidget({ className = '' }: WelcomeWidgetProps) {
  // Reserve height to prevent CLS
  return (
    <div className={className} style={{ minHeight: 220 }}>
      <Suspense fallback={<WelcomeSkeleton />}>
        <WelcomeContent />
      </Suspense>
    </div>
  );
}