import React from 'react';
import { render, screen } from '@/test-utils/render';
import HomePage from '../page';
import { hu } from '@/lib/i18n/hu';

describe('HomePage', () => {
  it('renders localized landing content exactly once without client-only side effects', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    render(<HomePage />);

    // Headline and tagline appear
    expect(screen.getByRole('heading', { name: hu.common.appName })).toBeInTheDocument();
    expect(screen.getByText(hu.common.tagline)).toBeInTheDocument();

    // Buttons appear
    expect(screen.getByRole('link', { name: hu.common.buttons.signIn })).toHaveAttribute('href', '/login');
    expect(screen.getByRole('link', { name: hu.common.buttons.signUp })).toHaveAttribute('href', '/register');

    // Assert they appear once
    expect(screen.getAllByText(hu.common.appName)).toHaveLength(1);
    expect(screen.getAllByText(hu.common.tagline)).toHaveLength(1);

    // No client-only side-effect logs expected from the page itself
    expect(consoleSpy).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});