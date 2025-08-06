import React, { Suspense } from 'react';
import { StatsSkeleton } from '@/components/ui/skeletons/StatsSkeleton';

interface PlatformStats {
  totalUsers: number;
  totalPosts: number;
  totalComments: number;
  totalLikes: number;
  activeUsers: number;
  growthRate: number;
}

interface UserStats {
  postsCount: number;
  commentsCount: number;
  likesReceived: number;
  followersCount: number;
  followingCount: number;
  engagementRate: number;
}

interface EngagementStats {
  likes: number;
  comments: number;
  shares: number;
  bookmarks: number;
  views: number;
}

interface StatsDataLoaderProps {
  children: (stats: PlatformStats) => React.ReactNode;
  fallback?: React.ReactNode;
}

// Server-side data fetching function for platform stats
async function fetchPlatformStats(): Promise<PlatformStats> {
  try {
    // This would be implemented in the backend
    // For now, we'll simulate the data
    const response = await fetch('/api/stats/platform');
    if (!response.ok) {
      throw new Error('Failed to fetch platform stats');
    }
    return response.json();
  } catch (error) {
    console.error('Failed to fetch platform stats:', error);
    return {
      totalUsers: 0,
      totalPosts: 0,
      totalComments: 0,
      totalLikes: 0,
      activeUsers: 0,
      growthRate: 0,
    };
  }
}

// Server Component for platform stats loading
async function PlatformStatsDataLoaderServer({ children }: StatsDataLoaderProps) {
  const stats = await fetchPlatformStats();
  return <>{children(stats)}</>;
}

// Client wrapper with Suspense
export function PlatformStatsDataLoader({ children, fallback }: StatsDataLoaderProps) {
  return (
    <Suspense fallback={fallback || <StatsSkeleton />}>
      <PlatformStatsDataLoaderServer>
        {children}
      </PlatformStatsDataLoaderServer>
    </Suspense>
  );
}

// User stats loader
interface UserStatsDataLoaderProps {
  userId: string;
  children: (stats: UserStats) => React.ReactNode;
  fallback?: React.ReactNode;
}

async function fetchUserStats(userId: string): Promise<UserStats> {
  try {
    // This would be implemented in the backend
    // For now, we'll simulate the data
    const response = await fetch(`/api/stats/users/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user stats');
    }
    return response.json();
  } catch (error) {
    console.error('Failed to fetch user stats:', error);
    return {
      postsCount: 0,
      commentsCount: 0,
      likesReceived: 0,
      followersCount: 0,
      followingCount: 0,
      engagementRate: 0,
    };
  }
}

async function UserStatsDataLoaderServer({ userId, children }: UserStatsDataLoaderProps) {
  const stats = await fetchUserStats(userId);
  return <>{children(stats)}</>;
}

export function UserStatsDataLoader({ userId, children, fallback }: UserStatsDataLoaderProps) {
  return (
    <Suspense fallback={fallback || <StatsSkeleton />}>
      <UserStatsDataLoaderServer userId={userId}>
        {children}
      </UserStatsDataLoaderServer>
    </Suspense>
  );
}

// Post engagement stats loader
interface PostEngagementDataLoaderProps {
  postId: string;
  children: (stats: EngagementStats) => React.ReactNode;
  fallback?: React.ReactNode;
}

async function fetchPostEngagement(postId: string): Promise<EngagementStats> {
  try {
    // This would be implemented in the backend
    // For now, we'll simulate the data
    const response = await fetch(`/api/stats/posts/${postId}/engagement`);
    if (!response.ok) {
      throw new Error('Failed to fetch post engagement');
    }
    return response.json();
  } catch {
    return {
      likes: 0,
      comments: 0,
      shares: 0,
      bookmarks: 0,
      views: 0,
    };
  }
}

async function PostEngagementDataLoaderServer({ postId, children }: PostEngagementDataLoaderProps) {
  const stats = await fetchPostEngagement(postId);
  return <>{children(stats)}</>;
}

export function PostEngagementDataLoader({ postId, children, fallback }: PostEngagementDataLoaderProps) {
  return (
    <Suspense fallback={fallback || <StatsSkeleton />}>
      <PostEngagementDataLoaderServer postId={postId}>
        {children}
      </PostEngagementDataLoaderServer>
    </Suspense>
  );
}

// Real-time stats loader (for dashboard)
interface RealTimeStatsDataLoaderProps {
  children: (stats: {
    platform: PlatformStats;
    user: UserStats | null;
  }) => React.ReactNode;
  fallback?: React.ReactNode;
}

async function fetchRealTimeStats(): Promise<{
  platform: PlatformStats;
  user: UserStats | null;
}> {
  try {
    // Fetch platform stats
    const platformResponse = await fetch('/api/stats/platform');
    const platform = platformResponse.ok ? await platformResponse.json() : {
      totalUsers: 0,
      totalPosts: 0,
      totalComments: 0,
      totalLikes: 0,
      activeUsers: 0,
      growthRate: 0,
    };

    // Try to fetch current user stats (if authenticated)
    let user: UserStats | null = null;
    try {
      const userResponse = await fetch('/api/stats/users/me');
      if (userResponse.ok) {
        user = await userResponse.json();
      }
    } catch (error) {
      // User not authenticated or stats not available
      console.log('User stats not available');
    }

    return { platform, user };
  } catch (error) {
    console.error('Failed to fetch real-time stats:', error);
    return {
      platform: {
        totalUsers: 0,
        totalPosts: 0,
        totalComments: 0,
        totalLikes: 0,
        activeUsers: 0,
        growthRate: 0,
      },
      user: null,
    };
  }
}

async function RealTimeStatsDataLoaderServer({ children }: RealTimeStatsDataLoaderProps) {
  const stats = await fetchRealTimeStats();
  return <>{children(stats)}</>;
}

export function RealTimeStatsDataLoader({ children, fallback }: RealTimeStatsDataLoaderProps) {
  return (
    <Suspense fallback={fallback || <StatsSkeleton />}>
      <RealTimeStatsDataLoaderServer>
        {children}
      </RealTimeStatsDataLoaderServer>
    </Suspense>
  );
} 