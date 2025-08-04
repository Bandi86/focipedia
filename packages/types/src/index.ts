// Base branded ID type for stronger nominal typing
export type BrandedId<TBrand extends string> = string & { readonly __brand: TBrand };

// Simple Result type for success/error flows
export type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

// Generic pagination structure
export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// Convenience helper constructors
export const ok = <T>(value: T): Result<T, never> => ({ ok: true, value });
export const err = <E = Error>(error: E): Result<never, E> => ({ ok: false, error });

// Example common ids
export type UserId = BrandedId<'UserId'>;
export type TeamId = BrandedId<'TeamId'>;