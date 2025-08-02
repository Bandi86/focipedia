// Auth E2E happy-path: register → logout → login → dashboard
// Requirements to run:
// - Frontend dev server (Next.js) running and reachable at PLAYWRIGHT_BASE_URL or http://localhost:3000
// - Backend API reachable with CORS credentials and cookies enabled
// - In Docker Compose, align FRONTEND_ORIGIN=http://localhost:3000 and NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api/v1
// - Test users are unique per run (email seeded with Date.now); DB will accumulate entries.

import { test, expect } from '@playwright/test';

const BASE =
  (process.env.PLAYWRIGHT_BASE_URL && process.env.PLAYWRIGHT_BASE_URL.trim()) ||
  (process.env.BASE_URL && process.env.BASE_URL.trim()) ||
  (process.env.E2E_BASE_URL && process.env.E2E_BASE_URL.trim()) ||
  'http://localhost:3000';
const abs = (path: string) => new URL(path, BASE).toString();

test.describe('Auth happy path', () => {
  const password = 'Password_123';
  const ts = Date.now();
  const email = `e2e.${ts}@example.com`;
  const name = `E2E Felhasználó ${ts}`;

  test('Register → Logout → Login → Dashboard', async ({ page, context }) => {
    // Register
    await page.goto(abs('/register'));

    // Use resilient selectors: labels are Hungarian and present in the app
    await page.getByLabel(/Név/i).fill(name);
    await page.getByLabel(/E-mail/i).fill(email);
    await page.getByLabel(/^Jelszó$/i).fill(password);
    await page.getByLabel(/Jelszó megerősítése/i).fill(password);

    await Promise.all([
      page.waitForURL((url) => /\/($|dashboard)/.test(url.pathname)),
      page.getByRole('button', { name: /Regisztráció/i }).click(),
    ]);

    // Header reflects logged-in state: greeting or logout button present
    const logoutButton = page.getByRole('button', { name: /Kijelentkezés|Kilépés/i });
    await expect(logoutButton).toBeVisible();

    // Auth cookie check: httpOnly cookie cannot be read via document.cookie; instead assert UI + protected access
    // Try visiting dashboard
    await page.goto(abs('/dashboard'));
    await expect(page.getByRole('heading', { name: /Irányítópult/i })).toBeVisible();

    // Logout
    await page.goto(abs('/'));
    await logoutButton.click();

    // After logout: landing page header shows login/register links
    await expect(page.getByRole('link', { name: /Bejelentkezés/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Regisztráció/i })).toBeVisible();

    // Accessing protected route should redirect to /login or block content
    await page.goto(abs('/dashboard'));
    // Expect either login page title or absence of dashboard heading
    const loginHeading = page.getByRole('heading', { name: /Bejelentkezés/i });
    const dashboardHeading = page.getByRole('heading', { name: /Irányítópult/i });

    // One of the expectations: login heading visible OR dashboard not visible
    const loginVisible = await loginHeading.isVisible().catch(() => false);
    if (!loginVisible) {
      await expect(dashboardHeading).not.toBeVisible();
    }

    // Login with the same credentials
    await page.goto(abs('/login'));
    await page.getByLabel(/E-mail/i).fill(email);
    await page.getByLabel(/^Jelszó$/i).fill(password);

    await Promise.all([
      page.waitForURL((url) => /\/($|dashboard)/.test(url.pathname)),
      page.getByRole('button', { name: /Bejelentkezés/i }).click(),
    ]);

    // Authenticated header visible again
    await expect(page.getByRole('button', { name: /Kijelentkezés|Kilépés/i })).toBeVisible();

    // Visit dashboard and verify content
    await page.goto(abs('/dashboard'));
    await expect(page.getByRole('heading', { name: /Irányítópult/i })).toBeVisible();

    // Optional: verify some friendly text on dashboard
    await expect(page.getByText(/védett oldal/i)).toBeVisible();
  });
});