import React from 'react';
import { render, screen } from '@/test-utils/render';
import { FeedPostCard } from '../FeedPostCard';

// Mock auth hook used by FeedPostCard
jest.mock('@/lib/auth-hooks', () => ({
  useAuth: () => ({ user: { id: 'u1' } }),
}));

// date-fns formatDistanceToNow is used; keep output deterministic by mocking
jest.mock('date-fns', () => ({
  ...jest.requireActual('date-fns'),
  formatDistanceToNow: () => '5 minutes ago',
}));

describe('FeedPostCard', () => {
  it('renders title, author and relative date', () => {
    const post = {
      id: 'p1',
      authorId: 'u1',
      authorDisplayName: 'John Doe',
      title: 'Test Title',
      content: 'Hello world #tag',
      createdAt: new Date().toISOString(),
      isPublished: true,
      commentCount: 3,
    } as any;

    render(<FeedPostCard post={post} />);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('5 minutes ago')).toBeInTheDocument();
  });
});