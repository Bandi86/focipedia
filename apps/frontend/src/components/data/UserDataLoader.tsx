import React, { Suspense } from 'react';
import { User } from '@/types';
import { userAPI } from '@/lib/api';
import { UserSkeleton } from '@/components/ui/skeletons/UserSkeleton';

interface UserDataLoaderProps {
  userId: string;
  children: (user: User) => React.ReactNode;
  fallback?: React.ReactNode;
}

// Server-side data fetching function for user
async function fetchUser(_userId: string): Promise<User> {
  try {
    const response = await userAPI.getProfile();
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('User not found');
  }
}

// Server Component for user data loading
async function UserDataLoaderServer({ userId, children }: UserDataLoaderProps) {
  const user = await fetchUser(userId);
  return <>{children(user)}</>;
}

// Client wrapper with Suspense
export function UserDataLoader({ userId, children, fallback }: UserDataLoaderProps) {
  return (
    <Suspense fallback={fallback || <UserSkeleton />}>
      <UserDataLoaderServer userId={userId}>
        {children}
      </UserDataLoaderServer>
    </Suspense>
  );
}

// Current user loader
interface CurrentUserDataLoaderProps {
  children: (user: User | null) => React.ReactNode;
  fallback?: React.ReactNode;
}

async function fetchCurrentUser(): Promise<User | null> {
  try {
    const response = await userAPI.getProfile();
    return response.data;
  } catch (error) {
    console.error('Failed to fetch current user:', error);
    return null;
  }
}

async function CurrentUserDataLoaderServer({ children }: CurrentUserDataLoaderProps) {
  const user = await fetchCurrentUser();
  return <>{children(user)}</>;
}

export function CurrentUserDataLoader({ children, fallback }: CurrentUserDataLoaderProps) {
  return (
    <Suspense fallback={fallback || <UserSkeleton />}>
      <CurrentUserDataLoaderServer>
        {children}
      </CurrentUserDataLoaderServer>
    </Suspense>
  );
}

// User profile loader (with extended data)
interface UserProfileDataLoaderProps {
  userId: string;
  children: (profile: UserProfile) => React.ReactNode;
  fallback?: React.ReactNode;
}

interface UserProfile extends User {
  stats: {
    postsCount: number;
    commentsCount: number;
    followersCount: number;
    followingCount: number;
  };
  recentActivity: Array<{
    id: string;
    type: 'post' | 'comment' | 'like';
    title: string;
    createdAt: string;
  }>;
}

async function fetchUserProfile(_userId: string): Promise<UserProfile> {
  try {
    const [userResponse] = await Promise.all([
      userAPI.getProfile(),
    ]);

    return {
      ...userResponse.data,
      stats: {
        postsCount: 0,
        commentsCount: 0,
        followersCount: 0,
        followingCount: 0,
      },
      recentActivity: [],
    };
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    throw new Error('User profile not found');
  }
}

async function UserProfileDataLoaderServer({ userId, children }: UserProfileDataLoaderProps) {
  const profile = await fetchUserProfile(userId);
  return <>{children(profile)}</>;
}

export function UserProfileDataLoader({ userId, children, fallback }: UserProfileDataLoaderProps) {
  return (
    <Suspense fallback={fallback || <UserSkeleton />}>
      <UserProfileDataLoaderServer userId={userId}>
        {children}
      </UserProfileDataLoaderServer>
    </Suspense>
  );
}

// User followers loader
interface UserFollowersDataLoaderProps {
  userId: string;
  params?: {
    page?: number;
    limit?: number;
  };
  children: (followers: User[]) => React.ReactNode;
  fallback?: React.ReactNode;
}

async function fetchUserFollowers(_userId: string, _params: UserFollowersDataLoaderProps['params'] = {}) {
  // TODO: Implement when API is available
  return [];
}

async function UserFollowersDataLoaderServer({ userId, params, children }: UserFollowersDataLoaderProps) {
  const followers = await fetchUserFollowers(userId, params);
  return <>{children(followers)}</>;
}

export function UserFollowersDataLoader({ userId, params, children, fallback }: UserFollowersDataLoaderProps) {
  return (
    <Suspense fallback={fallback || <UserSkeleton />}>
      <UserFollowersDataLoaderServer userId={userId} params={params}>
        {children}
      </UserFollowersDataLoaderServer>
    </Suspense>
  );
}

// User following loader
interface UserFollowingDataLoaderProps {
  userId: string;
  params?: {
    page?: number;
    limit?: number;
  };
  children: (following: User[]) => React.ReactNode;
  fallback?: React.ReactNode;
}

async function fetchUserFollowing(_userId: string, _params: UserFollowingDataLoaderProps['params'] = {}) {
  // TODO: Implement when API is available
  return [];
}

async function UserFollowingDataLoaderServer({ userId, params, children }: UserFollowingDataLoaderProps) {
  const following = await fetchUserFollowing(userId, params);
  return <>{children(following)}</>;
}

export function UserFollowingDataLoader({ userId, params, children, fallback }: UserFollowingDataLoaderProps) {
  return (
    <Suspense fallback={fallback || <UserSkeleton />}>
      <UserFollowingDataLoaderServer userId={userId} params={params}>
        {children}
      </UserFollowingDataLoaderServer>
    </Suspense>
  );
} 