// dashboard_measure.spec.ts
import { test, expect } from '@playwright/test';

test('Measure OfficerDashboard render timings', async ({ page }) => {
  const messages: string[] = [];
  page.on('console', msg => messages.push(msg.text()));

  await page.goto('/');
  await page.locator('button', { hasText: 'Log In' }).click();
  await page.locator('summary', { hasText: 'ADVANCED / DEVELOPER JWT ENTRY' }).click();
  await page.locator('textarea[placeholder*="Bearer eyJhbGciOi"]').fill(process.env.DEV_JWT || '');
  await page.locator('button', { hasText: 'Inject Custom Token' }).click();
  await page.locator('button', { hasText: 'Officer Dashboard' }).click();

  // Wait for heading
  await page.waitForSelector('text=Officer Dashboard', { timeout: 30000 });
  // Wait for refresh button
  await page.waitForSelector('button:has-text("Refresh Data")', { timeout: 15000 });

  console.log('Captured console messages:', messages);
});
