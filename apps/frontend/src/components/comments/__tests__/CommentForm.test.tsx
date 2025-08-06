import React from 'react';
import { render, screen } from '@/test-utils/render';
import userEvent from '@testing-library/user-event';
import { CommentForm } from '../CommentForm';

// CommentForm uses useAuth from '@/lib/auth'
jest.mock('@/lib/auth', () => ({
  useAuth: () => ({
    user: { id: 'u1', username: 'user1', displayName: 'User One' },
  }),
}));

describe('CommentForm', () => {
  it('types into textarea and submits, calling onSubmit with typed text', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    const onCancel = jest.fn();

    render(
      <CommentForm
        postId="post-1"
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    );

    const textarea = screen.getByPlaceholderText('Write a comment...');
    await user.type(textarea, 'Hello comment');

    const submitBtn = screen.getByRole('button', { name: /post comment/i });
    await user.click(submitBtn);

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({
      content: 'Hello comment',
      postId: 'post-1',
      parentId: undefined,
    });
  });
});