import React from 'react';
import { render, screen } from '@/test-utils/render';
import { CommentItem } from '../CommentItem';

// CommentItem uses useAuth from '@/lib/auth'
jest.mock('@/lib/auth', () => ({
  useAuth: () => ({ user: { id: 'c-author' } }),
}));

// Keep date deterministic
jest.mock('date-fns', () => ({
  ...jest.requireActual('date-fns'),
  formatDistanceToNow: () => 'just now',
}));

describe('CommentItem', () => {
  it('renders author and content', () => {
    const comment = {
      id: 'c1',
      authorId: 'c-author',
      authorDisplayName: 'Alice Smith',
      content: 'This is a sample comment',
      createdAt: new Date().toISOString(),
      replyCount: 0,
    } as any;

    render(<CommentItem comment={comment} />);

    expect(screen.getByText('Alice Smith')).toBeInTheDocument();
    expect(screen.getByText('This is a sample comment')).toBeInTheDocument();
    expect(screen.getByText('just now')).toBeInTheDocument();
  });
});