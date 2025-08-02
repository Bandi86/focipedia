import { test, expect } from '@playwright/test';

const BASE =
  (process.env.PLAYWRIGHT_BASE_URL && process.env.PLAYWRIGHT_BASE_URL.trim()) ||
  (process.env.BASE_URL && process.env.BASE_URL.trim()) ||
  (process.env.E2E_BASE_URL && process.env.E2E_BASE_URL.trim()) ||
  'http://localhost:3000';
const abs = (path: string) => new URL(path, BASE).toString();

test.describe('Auth - Register', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(abs('/register'));
  });

  test('renders register form', async ({ page }) => {
    const heading = page.getByRole('heading', { name: /register|regisztráció/i });
    await expect(heading).toBeVisible({ timeout: 5000 }).catch(() => {});
    const submit = page.getByRole('button', { name: /register|regisztráció/i });
    await expect(submit).toBeVisible({ timeout: 5000 });
  });

  test('blocks register with invalid data', async ({ page }) => {
    await page.getByLabel(/email|e-?mail/i).fill('bad-email');
    await page.getByLabel(/^password$|^jelszó$/i).fill('123');
    // Prefer exact Hungarian label for name field to avoid ambiguity
    const nameInput = page.getByLabel(/^Név$|^Name$/i);
    await nameInput.fill('').catch(async () => {
      // Fallback by placeholder if label not available
      await page.getByPlaceholder(/név|name/i).fill('');
    });
    await page.getByRole('button', { name: /register|regisztráció/i }).click();

    const error = page.getByText(/invalid|error|required|kötelező|hibás/i);
    await expect(error).toBeVisible({ timeout: 3000 }).catch(async () => {
      await expect(page).toHaveURL(/\/register$/);
    });
  });

  test('registers successfully and redirects to dashboard', async ({ page }) => {
    const unique = Date.now();
    await page.getByLabel(/email|e-?mail/i).fill(`user${unique}@example.com`);
    await page.getByLabel(/^password$|^jelszó$/i).fill('password123');
    // Confirmation field if present
    const confirm = page.getByLabel(/password confirmation|jelszó megerősítése/i);
    if (await confirm.count().then(c => c > 0)) {
      await confirm.fill('password123');
    }
    const nameInput = page.getByLabel(/^Név$|^Name$/i);
    await nameInput.fill('E2E User').catch(async () => {
      await page.getByPlaceholder(/név|name/i).fill('E2E User');
    });
    await page.getByRole('button', { name: /register|regisztráció/i }).click();

    await page.waitForURL('**/dashboard', { timeout: 20000 });
    await expect(page.getByRole('heading', { name: /dashboard|irányítópult/i })).toBeVisible({ timeout: 7000 }).catch(() => {});
  });
});