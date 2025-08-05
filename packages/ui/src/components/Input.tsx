import * as React from 'react';
import { cn } from '../lib/cn';

/**
 * Input uses token-driven classes:
 * - Colors use Tailwind tokens mapped to CSS variables (background, input, ring, muted-foreground).
 * - Focus state standardized with focus-visible:ring-2 + ring-ring + ring-offset.
 * - Preserves reduced-motion via global utilities; no custom animations here.
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      className={cn(
        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
        'ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium',
        'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
});