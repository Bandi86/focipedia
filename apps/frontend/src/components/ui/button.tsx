import React, { ButtonHTMLAttributes, forwardRef } from 'react';

type Variant = 'default' | 'destructive' | 'outline';
type Size = 'default' | 'sm' | 'lg';

const variantClasses: Record<Variant, string> = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
};

const sizeClasses: Record<Size, string> = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 px-3 rounded-md',
  lg: 'h-11 px-8 rounded-md',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
}

/**
 * Minimal Button component to satisfy tests:
 * - Supports variants and sizes (class expectations in tests)
 * - Supports asChild to render child element with merged classes
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'default', size = 'default', asChild = false, children, ...props },
  ref
) {
  const classes = [
    'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50',
    variantClasses[variant],
    sizeClasses[size],
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  if (asChild && React.isValidElement(children)) {
    // Clone the child and merge className
    const prev = (children.props as any).className ?? '';
    return React.cloneElement(children as any, {
      className: [prev, classes].filter(Boolean).join(' '),
      ref,
      ...props,
    });
  }

  return (
    <button ref={ref} className={classes} {...props}>
      {children}
    </button>
  );
});

export default Button;