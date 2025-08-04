import { z } from 'zod';

/**
 * Isomorphic environment loader using zod.
 * - On server (Node/Nest): reads from process.env
 * - On client (Next): expects variables to be inlined at build time (NEXT_PUBLIC_*)
 *
 * Keep usage minimal and framework-agnostic.
 */

export type EnvSchema = Record<string, z.ZodTypeAny>;

export function loadEnv<T extends EnvSchema>(schema: T) {
  // Build an object from process.env where available; in browsers this is undefined
  const source: Record<string, unknown> =
    typeof process !== 'undefined' && (process as any).env
      ? (process as any).env
      : ({} as Record<string, unknown>);

  const zodObject = z.object(schema as any);

  // Prefer safeParse to avoid throwing at import time; let caller handle errors
  const result = zodObject.safeParse(source);
  return result;
}

/**
 * Helper to assert env at startup and get a typed value.
 * Will throw with a readable error if validation fails.
 */
export function getEnvOrThrow<T extends EnvSchema>(schema: T): z.infer<z.ZodObject<T>> {
  const parsed = loadEnv(schema);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
    throw new Error(`Invalid environment configuration: ${issues}`);
  }
  return parsed.data as any;
}