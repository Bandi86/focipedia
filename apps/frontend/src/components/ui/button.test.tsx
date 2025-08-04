import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Simple test to verify the test setup works
describe('Test Setup', () => {
  const user = userEvent.setup();

  it('should render a simple button', () => {
    render(<button>Test Button</button>);
    
    const button = screen.getByRole('button', { name: /test button/i });
    expect(button).toBeInTheDocument();
  });

  it('should handle click events', async () => {
    const handleClick = jest.fn();
    render(<button onClick={handleClick}>Click me</button>);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should support disabled state', () => {
    render(<button disabled>Disabled</button>);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should support custom className', () => {
    render(<button className="custom-class">Custom</button>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });
}); 