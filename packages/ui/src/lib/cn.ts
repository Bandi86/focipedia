import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge conditional classnames with Tailwind-aware deduplication.
 * shadcn-style utility.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}