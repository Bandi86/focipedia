"use client";

/**
 * Button
 * Egyszerű, SSR-biztos gomb komponens shadcn-szerű API-val.
 *
 * Props:
 * - variant: "default" | "outline" | "ghost" (alapértelmezett: "default")
 * - size: "sm" | "md" (alapértelmezett: "md")
 * - loading: betöltési állapot; aria-busy beállítva
 * - disabled: letiltott állapot
 * - className: extra osztályok mergelve
 *
 * Használat:
 *   <Button type="submit" variant="outline" size="sm">Mentés</Button>
 */

import * as React from "react";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md";
  loading?: boolean;
};

// Minimal, dependency-mentes className merge helper
function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const base =
  "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  default: "bg-black text-white hover:opacity-90 focus:ring-black/40",
  outline:
    "border border-gray-300 text-gray-900 hover:bg-gray-50 focus:ring-gray-400",
  ghost:
    "bg-transparent text-gray-900 hover:bg-gray-100 focus:ring-gray-300",
};

const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", loading, disabled, children, ...props }, ref) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        aria-busy={loading || undefined}
        disabled={isDisabled}
        className={cx(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading ? (
          <span className="pointer-events-none inline-flex items-center gap-2">
            <span
              aria-hidden
              className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
              style={{ borderRightColor: "transparent" }}
            />
            <span>Betöltés...</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";