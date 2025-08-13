import { InputHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

type Props = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...rest }: Props) {
  return (
    <input
      {...rest}
      className={twMerge(
        "block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400",
        className
      )}
    />
  );
}


