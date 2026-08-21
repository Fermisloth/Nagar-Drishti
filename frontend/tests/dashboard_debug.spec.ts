// dashboard_debug.spec.ts
import { test, expect } from '@playwright/test';

test('Debug Officer Dashboard rendering', async ({ page }) => {
  const messages: string[] = [];
  page.on('console', msg => messages.push(`${msg.type()}: ${msg.text()}`));
  page.on('pageerror', err => messages.push(`PAGE ERROR: ${err.message}`));

  await page.goto('/');
  await page.locator('button', { hasText: 'Log In' }).click();
  await page.locator('summary', { hasText: 'ADVANCED / DEVELOPER JWT ENTRY' }).click();
  await page.locator('textarea[placeholder*=\"Bearer eyJhbGciOi\"]').fill('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwi...'); // token placeholder
  await page.locator('button', { hasText: 'Inject Custom Token' }).click();
  const dashboardBtn = page.locator('button', { hasText: 'Officer Dashboard' });
  await expect(dashboardBtn).toBeVisible();
  await dashboardBtn.click();
  // Wait a bit for component to mount
  await page.waitForTimeout(2000);
  // Try to locate heading
  const heading = page.locator('text=Officer Dashboard');
  const isVisible = await heading.isVisible();
  console.log('Heading visible?', isVisible);
  console.log('Collected console messages:', messages);
});
