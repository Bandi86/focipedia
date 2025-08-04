import { z } from 'zod';

// Email per PRD: valid email format
export const emailSchema = z
  .string()
  .trim()
  .email('Invalid email address');

// Password skeleton per PRD: at least 8 chars, include letters and numbers (tune as PRD evolves)
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .refine((val) => /[A-Za-z]/.test(val), 'Password must include a letter')
  .refine((val) => /\d/.test(val), 'Password must include a number');

// Username skeleton: 3-32, alphanumeric plus underscores/dots (adjust per PRD)
export const usernameSchema = z
  .string()
  .trim()
  .min(3)
  .max(32)
  .regex(/^[a-zA-Z0-9._]+$/, 'Only letters, numbers, underscores and dots allowed');

// Generic helpers
export type InferSchema<T extends z.ZodTypeAny> = z.infer<T>;

export function parseOrThrow<T extends z.ZodTypeAny>(schema: T, data: unknown): z.infer<T> {
  return schema.parse(data);
}

export function safeParse<T extends z.ZodTypeAny>(schema: T, data: unknown) {
  return schema.safeParse(data);
}