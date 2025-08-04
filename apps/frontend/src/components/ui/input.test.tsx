import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './input';

describe('Input', () => {
  const user = userEvent.setup();

  describe('Rendering', () => {
    it('should render input with default props', () => {
      render(<Input />);

      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
      expect(input).toHaveClass('flex', 'h-10', 'w-full', 'rounded-md', 'border');
    });

    it('should render input with placeholder', () => {
      render(<Input placeholder="Enter text" />);

      const input = screen.getByPlaceholderText('Enter text');
      expect(input).toBeInTheDocument();
    });

    it('should render input with label', () => {
      render(<Input aria-label="Email address" />);

      const input = screen.getByLabelText('Email address');
      expect(input).toBeInTheDocument();
    });

    it('should render input with different types', () => {
      const { rerender } = render(<Input type="email" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');

      rerender(<Input type="password" />);
      expect(screen.getByDisplayValue('')).toHaveAttribute('type', 'password');

      rerender(<Input type="number" />);
      expect(screen.getByRole('spinbutton')).toHaveAttribute('type', 'number');

      rerender(<Input type="tel" />);
      expect(screen.getByDisplayValue('')).toHaveAttribute('type', 'tel');

      rerender(<Input type="url" />);
      expect(screen.getByDisplayValue('')).toHaveAttribute('type', 'url');
    });

    it('should render input with value', () => {
      render(<Input value="test value" readOnly />);

      const input = screen.getByDisplayValue('test value');
      expect(input).toBeInTheDocument();
    });

    it('should render input with defaultValue', () => {
      render(<Input defaultValue="default value" />);

      const input = screen.getByDisplayValue('default value');
      expect(input).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<Input className="custom-class" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('custom-class');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<Input aria-label="Search" aria-describedby="search-help" />);

      const input = screen.getByLabelText('Search');
      expect(input).toHaveAttribute('aria-describedby', 'search-help');
    });

    it('should support disabled state', () => {
      render(<Input disabled />);

      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
      expect(input).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50');
    });

    it('should support readOnly state', () => {
      render(<Input readOnly />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('readonly');
    });

    it('should support required state', () => {
      render(<Input required />);

      const input = screen.getByRole('textbox');
      expect(input).toBeRequired();
    });

    it('should support autoComplete attribute', () => {
      render(<Input autoComplete="email" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('autocomplete', 'email');
    });

    it('should support autoFocus attribute', () => {
      render(<Input autoFocus />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('autofocus');
    });

    it('should support spellCheck attribute', () => {
      render(<Input spellCheck={false} />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('spellcheck', 'false');
    });
  });

  describe('User Interactions', () => {
    it('should handle text input', async () => {
      render(<Input />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'Hello, World!');

      expect(input).toHaveValue('Hello, World!');
    });

    it('should handle onChange events', async () => {
      const handleChange = jest.fn();
      render(<Input onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'test');

      expect(handleChange).toHaveBeenCalledTimes(4); // One for each character
    });

    it('should handle onFocus events', async () => {
      const handleFocus = jest.fn();
      render(<Input onFocus={handleFocus} />);

      const input = screen.getByRole('textbox');
      await user.click(input);

      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('should handle onBlur events', async () => {
      const handleBlur = jest.fn();
      render(<Input onBlur={handleBlur} />);

      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.tab();

      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it('should handle onKeyDown events', async () => {
      const handleKeyDown = jest.fn();
      render(<Input onKeyDown={handleKeyDown} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'a');

      expect(handleKeyDown).toHaveBeenCalledTimes(1);
    });

    it('should handle onKeyUp events', async () => {
      const handleKeyUp = jest.fn();
      render(<Input onKeyUp={handleKeyUp} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'a');

      expect(handleKeyUp).toHaveBeenCalledTimes(1);
    });

    it('should not allow input when disabled', async () => {
      render(<Input disabled />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'test');

      expect(input).toHaveValue('');
    });

    it('should handle paste events', async () => {
      const handlePaste = jest.fn();
      render(<Input onPaste={handlePaste} />);

      const input = screen.getByRole('textbox');
      await user.click(input);
      
      // Simulate paste event
      const pasteData = new DataTransfer();
      pasteData.setData('text/plain', 'pasted text');
      const pasteEvent = new ClipboardEvent('paste', {
        clipboardData: pasteData,
        bubbles: true,
      });
      
      input.dispatchEvent(pasteEvent);

      expect(handlePaste).toHaveBeenCalledTimes(1);
    });
  });

  describe('Form Integration', () => {
    it('should work with form submission', async () => {
      const handleSubmit = jest.fn((e) => e.preventDefault());
      
      render(
        <form onSubmit={handleSubmit}>
          <Input name="test" />
          <button type="submit">Submit</button>
        </form>
      );

      const input = screen.getByRole('textbox');
      const submitButton = screen.getByRole('button');

      await user.type(input, 'test value');
      await user.click(submitButton);

      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });

    it('should work with form validation', () => {
      render(<Input required minLength={3} maxLength={10} />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('required');
      expect(input).toHaveAttribute('minlength', '3');
      expect(input).toHaveAttribute('maxlength', '10');
    });

    it('should work with form reset', async () => {
      render(
        <form>
          <Input defaultValue="initial value" />
          <button type="reset">Reset</button>
        </form>
      );

      const input = screen.getByDisplayValue('initial value');
      const resetButton = screen.getByRole('button');

      await user.type(input, ' additional text');
      expect(input).toHaveValue('initial value additional text');

      await user.click(resetButton);
      expect(input).toHaveValue('initial value');
    });
  });

  describe('Styling and States', () => {
    it('should apply focus styles', async () => {
      render(<Input />);

      const input = screen.getByRole('textbox');
      await user.click(input);

      expect(input).toHaveClass('focus-visible:outline-none', 'focus-visible:ring-2');
    });

    it('should apply disabled styles', () => {
      render(<Input disabled />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50');
    });

    it('should apply file input styles', () => {
      render(<Input type="file" />);

      const input = screen.getByDisplayValue('');
      expect(input).toHaveClass('file:border-0', 'file:bg-transparent');
    });

    it('should apply placeholder styles', () => {
      render(<Input placeholder="Enter text" />);

      const input = screen.getByPlaceholderText('Enter text');
      expect(input).toHaveClass('placeholder:text-muted-foreground');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty value', () => {
      render(<Input value="" />);

      const input = screen.getByDisplayValue('');
      expect(input).toBeInTheDocument();
    });

    it('should handle null value', () => {
      render(<Input value={null as any} />);

      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('should handle undefined value', () => {
      render(<Input value={undefined as any} />);

      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('should handle very long text', async () => {
      render(<Input />);

      const input = screen.getByRole('textbox');
      const longText = 'a'.repeat(1000);
      await user.type(input, longText);

      expect(input).toHaveValue(longText);
    });

    it('should handle special characters', async () => {
      render(<Input />);

      const input = screen.getByRole('textbox');
      const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      await user.type(input, specialChars);

      expect(input).toHaveValue(specialChars);
    });

    it('should handle unicode characters', async () => {
      render(<Input />);

      const input = screen.getByRole('textbox');
      const unicodeText = 'Hello 世界 🌍';
      await user.type(input, unicodeText);

      expect(input).toHaveValue(unicodeText);
    });

    it('should handle ref forwarding', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<Input ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });
  });

  describe('Performance', () => {
    it('should not re-render unnecessarily', () => {
      const { rerender } = render(<Input />);
      const input = screen.getByRole('textbox');

      rerender(<Input />);
      expect(input).toBe(screen.getByRole('textbox')); // Same element reference
    });

    it('should handle rapid typing', async () => {
      render(<Input />);

      const input = screen.getByRole('textbox');
      const rapidText = 'abcdefghijklmnopqrstuvwxyz';
      
      await user.type(input, rapidText);

      expect(input).toHaveValue(rapidText);
    });
  });

  describe('Input Types', () => {
    it('should handle email input validation', () => {
      render(<Input type="email" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('should handle number input with min/max', () => {
      render(<Input type="number" min={0} max={100} step={1} />);

      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('type', 'number');
      expect(input).toHaveAttribute('min', '0');
      expect(input).toHaveAttribute('max', '100');
      expect(input).toHaveAttribute('step', '1');
    });

    it('should handle search input', () => {
      render(<Input type="search" />);

      const input = screen.getByRole('searchbox');
      expect(input).toHaveAttribute('type', 'search');
    });

    it('should handle tel input', () => {
      render(<Input type="tel" />);

      const input = screen.getByDisplayValue('');
      expect(input).toHaveAttribute('type', 'tel');
    });

    it('should handle url input', () => {
      render(<Input type="url" />);

      const input = screen.getByDisplayValue('');
      expect(input).toHaveAttribute('type', 'url');
    });

    it('should handle date input', () => {
      render(<Input type="date" />);

      const input = screen.getByDisplayValue('');
      expect(input).toHaveAttribute('type', 'date');
    });

    it('should handle time input', () => {
      render(<Input type="time" />);

      const input = screen.getByDisplayValue('');
      expect(input).toHaveAttribute('type', 'time');
    });

    it('should handle datetime-local input', () => {
      render(<Input type="datetime-local" />);

      const input = screen.getByDisplayValue('');
      expect(input).toHaveAttribute('type', 'datetime-local');
    });
  });
}); 