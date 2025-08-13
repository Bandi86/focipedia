import { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean };

export function Button({ className, loading, children, ...rest }: Props) {
  return (
    <button
      {...rest}
      className={twMerge(
        "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-black text-white hover:bg-neutral-800 disabled:opacity-60",
        className
      )}
    >
      {loading ? "..." : children}
    </button>
  );
}


