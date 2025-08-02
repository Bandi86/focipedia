"use client";

/**
 * Input
 * Egyszerű, SSR-biztos input komponens.
 *
 * Props:
 * - invalid: kézi érvénytelen állapot (aria-invalid is)
 * - disabled: letiltott állapot
 * - className: extra osztályok mergelve
 *
 * Használat:
 *   <Input type="email" placeholder="te@pelda.hu" invalid={!!error}>
 */

import * as React from "react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

// Minimal className merge helper
function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const base =
  "flex h-10 w-full rounded-md border px-3 py-2 text-sm outline-none transition focus:ring-2 disabled:opacity-60 disabled:cursor-not-allowed";
const normal =
  "border-gray-300 focus:ring-primary";
const invalidCls =
  "border-red-500 focus:ring-red-500";

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid, "aria-invalid": ariaInvalidProp, disabled, ...props }: InputProps,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  const ariaInvalid = ariaInvalidProp ?? (invalid ? true : undefined);

  return (
    <input
      ref={ref}
      aria-invalid={ariaInvalid}
      disabled={disabled}
      className={cx(base, invalid ? invalidCls : normal, className)}
      {...props}
    />
  );
});