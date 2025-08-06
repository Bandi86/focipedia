/**
 * Jest setup for React Testing Library and Next.js App Router client hooks.
 */
import '@testing-library/jest-dom';

// Safe mock for next/navigation's useRouter for tests that need router
jest.mock('next/navigation', () => {
  const actual = jest.requireActual('next/navigation');
  return {
    ...actual,
    useRouter: () => ({
      push: jest.fn(),
      replace: jest.fn(),
      refresh: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      prefetch: jest.fn(),
    }),
  };
});