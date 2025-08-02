// E2E setup for frontend auth happy-path tests.
// Requirements:
// - Frontend dev server running (Next.js) and reachable at PLAYWRIGHT_BASE_URL or http://localhost:3000
// - Backend API reachable with CORS credentials and cookie-based auth enabled
// - In Docker Compose, ensure FRONTEND_ORIGIN and NEXT_PUBLIC_API_BASE_URL align
//   e.g. FRONTEND_ORIGIN=http://localhost:3000 and NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api/v1
// Notes:
// - Test emails are unique per run and will accumulate in the DB unless cleanup logic is added.

import { defineConfig, devices } from '@playwright/test';

const envBase =
  (process.env.PLAYWRIGHT_BASE_URL && process.env.PLAYWRIGHT_BASE_URL.trim()) ||
  (process.env.BASE_URL && process.env.BASE_URL.trim()) ||
  (process.env.E2E_BASE_URL && process.env.E2E_BASE_URL.trim()) ||
  'http://localhost:3000';

// Validate and normalize base URL; throw early if invalid to avoid "invalid URL" at runtime
if (!envBase || !/^https?:\/\//i.test(envBase)) {
  // eslint-disable-next-line no-console
  console.error('Resolved PLAYWRIGHT base URL value:', JSON.stringify(envBase));
  throw new Error(
    'E2E baseURL is not set to a valid absolute URL. Provide PLAYWRIGHT_BASE_URL / BASE_URL / E2E_BASE_URL. Example: http://localhost:3000'
  );
}
const baseURL = new URL('/', envBase).toString();
// eslint-disable-next-line no-console
console.info('[playwright] Using baseURL:', baseURL);

export default defineConfig({
  // Point to the e2e directory explicitly without using __dirname (ESM-safe)
  testDir: 'e2e',
  // Increase default timeout for container cold start and first navigation
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  use: {
    // Ensure relative page.goto('/path') navigations work
    baseURL,
    headless: true,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  reporter: [['list']],
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // webServer config is not supported in this Playwright version/types here; omit to avoid TS error.
});