import { test, expect } from '@playwright/test';

const DEV_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3NmIxNDhjZS01MDAzLTQ5ODktOGRmNi03ZWU5OWE4NGM1ZGYiLCJyb2xlIjoiT2ZmaWNlciIsImV4cCI6MTc4NzMyNzc2MSwidHlwZSI6ImFjY2VzcyJ9.8GFPzJzOrYc4YthxDhDdqw3vBqpTrWyQQ_I2x9FCQjA';
const EXPIRED_INVALID_JWT = 'invalid-token';

test.describe('NagarDrishti Smoke and Security Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Avoid hitting backend 429 Rate Limiter
    await page.waitForTimeout(3000);
  });

  test('Citizen Portal loads and complaint form renders', async ({ page }) => {
    await page.goto('/');
    
    // Check Citizen Portal banner
    await expect(page.locator('h2', { hasText: 'CITIZEN COMPLAINT INTAKE' })).toBeVisible();
    
    // Verify required fields render correctly
    await expect(page.locator('textarea[required]')).toBeVisible();
    await expect(page.locator('input[placeholder*="Apollo"]')).toBeVisible();
    
    // Verify submit button is present
    await expect(page.locator('button', { hasText: 'SUBMIT COMPLAINT TO CITY ENGINE' })).toBeVisible();
  });

  test('Unauthenticated access to Officer Dashboard is protected', async ({ page }) => {
    await page.goto('/');
    // Without logging in, the Officer Dashboard nav link should not be present
    await expect(page.locator('button', { hasText: 'Officer Dashboard' })).not.toBeVisible();
  });

  test('Health Monitor reflects the REAL backend readiness state', async ({ page }) => {
    await page.goto('/');
    
    // Login as Officer first to see Health Monitor
    await page.locator('button', { hasText: 'Log In' }).click();
    await page.locator('summary', { hasText: 'ADVANCED / DEVELOPER JWT ENTRY' }).click();
    await page.locator('textarea[placeholder*="Bearer eyJhbGciOi"]').fill(DEV_JWT);
    await page.locator('button', { hasText: 'Inject Custom Token' }).click();
    
    // Wait for auth to complete
    await expect(page.locator('button', { hasText: 'System Health' })).toBeVisible();
    await page.locator('button', { hasText: 'System Health' }).click();
    
    // The health monitor should show the real backend data
    await expect(page.locator('h3', { hasText: 'INFRASTRUCTURE & DEPENDENCY PIPELINE MAP' })).toBeVisible();
    await expect(page.locator('text=SYSTEM STATUS: READY').first()).toBeVisible();
  });

  test('Officer login works and Officer Dashboard loads data without mock fallbacks', async ({ page }) => {
    await page.goto('/');
    
    // Click login
    await page.locator('button', { hasText: 'Log In' }).click();
    
    // Expand advanced login
    await page.locator('summary', { hasText: 'ADVANCED / DEVELOPER JWT ENTRY' }).click();
    
    // Inject token
    await page.locator('textarea[placeholder*="Bearer eyJhbGciOi"]').fill(DEV_JWT);
    
    // Authenticate
    await page.locator('button', { hasText: 'Inject Custom Token' }).click();
    
    // Verify logged in by checking that Officer Dashboard button is visible
    const dashboardBtn = page.getByRole('button', { name: 'Officer Dashboard' });
    await expect(dashboardBtn).toBeVisible();
    
    // Click Officer Dashboard
    await dashboardBtn.click();
    
    // Wait for the dashboard heading to appear, confirming navigation
    await expect(page.getByRole('heading', { name: 'Officer Dashboard' })).toBeVisible({ timeout: 15000 });
    
    // Ensure the Refresh Data button is visible before interacting with the dashboard
    const refreshBtn = page.locator('button', { hasText: 'Refresh Data' });
    await expect(refreshBtn).toBeVisible({ timeout: 15000 });
    
    // The officer dashboard should load data from the real backend.
    await expect(page.locator('text=Unable to reach the server to fetch incidents')).not.toBeVisible();
    
    // Wait for either empty state or any incident card to appear (more robust)
    const emptyState = page.locator('text=NO ACTIVE INCIDENTS');
    const incidentCard = page.locator('.neo-card');
    // Wait up to 15 seconds for one of the conditions
    await Promise.race([
      emptyState.waitFor({ timeout: 15000 }).catch(() => {}),
      incidentCard.first().waitFor({ timeout: 15000 }).catch(() => {}),
    ]);
    
    const isEmpty = await emptyState.isVisible();
    const hasIncidents = await incidentCard.first().isVisible();
    
    expect(isEmpty || hasIncidents).toBeTruthy();
  });

  // Targeted Security Fix Verifications

  test('Invalid or expired JWT forces session clearance and returns to CITIZEN state', async ({ page }) => {
    await page.goto('/');
    
    // Set invalid token in localStorage
    await page.evaluate((token) => {
      localStorage.setItem('nagardrishti_token', token);
      localStorage.setItem('nagardrishti_role', 'OFFICER');
      localStorage.setItem('nagardrishti_username', 'Malicious User');
    }, EXPIRED_INVALID_JWT);

    // Reload page once manually to boot React with these localStorage values.
    // This will trigger the API request, which fails and gets intercepted to clear storage.
    await page.reload();
    // After reload, trigger a protected API request (incidents list) to cause 401 and invoke interceptor
    await page.waitForResponse(response => response.url().includes('/api/v1/incidents') && response.status() === 401);


    // The application automatically switches to OfficerDashboard due to stored role,
    // triggers listIncidents, gets 401, clears auth state, and reloads.
    // We simply wait for this automatic sequence to complete.
    await page.waitForTimeout(3000);

    // Verify localStorage is cleared
    const storedToken = await page.evaluate(() => localStorage.getItem('nagardrishti_token'));
    const storedRole = await page.evaluate(() => localStorage.getItem('nagardrishti_role'));
    expect(storedToken).toBeNull();
    expect(storedRole).toBeNull();

    // Verify application returned to Citizen portal view and Officer Dashboard button is gone
    await expect(page.locator('h2', { hasText: 'CITIZEN COMPLAINT INTAKE' })).toBeVisible();
    await expect(page.locator('button', { hasText: 'Officer Dashboard' })).not.toBeVisible();
  });

  test('Logout clears all nagardrishti_* auth state and updates UI state', async ({ page }) => {
    await page.goto('/');
    
    // Log in
    await page.locator('button', { hasText: 'Log In' }).click();
    await page.locator('summary', { hasText: 'ADVANCED / DEVELOPER JWT ENTRY' }).click();
    await page.locator('textarea[placeholder*="Bearer eyJhbGciOi"]').fill(DEV_JWT);
    await page.locator('button', { hasText: 'Inject Custom Token' }).click();
    
    // Verify logged in
    await expect(page.locator('button', { hasText: 'Officer Dashboard' })).toBeVisible();
    
    // Click Log Out
    await page.locator('button', { hasText: 'Log Out' }).click();

    // Wait for reload
    await page.waitForTimeout(1000);

    // Verify state removed from localStorage
    const storedToken = await page.evaluate(() => localStorage.getItem('nagardrishti_token'));
    const storedRole = await page.evaluate(() => localStorage.getItem('nagardrishti_role'));
    expect(storedToken).toBeNull();
    expect(storedRole).toBeNull();

    // Verify Officer Dashboard is no longer visible
    await expect(page.locator('button', { hasText: 'Officer Dashboard' })).not.toBeVisible();
    await expect(page.locator('button', { hasText: 'Log In' })).toBeVisible();
  });

  test('Demo/evaluator bypasses are completely absent from DOM', async ({ page }) => {
    await page.goto('/');
    
    // Click Log In
    await page.locator('button', { hasText: 'Log In' }).click();

    // Verify 1-click evaluator / quick login buttons are not present
    await expect(page.locator('text=1-CLICK EVALUATOR MODE')).not.toBeVisible();
    await expect(page.locator('text=OFFICER ROLE')).not.toBeVisible();
    await expect(page.locator('text=CITIZEN ROLE')).not.toBeVisible();
  });

  test('E2E Flow: Citizen submits complaint, Gemini clusters it, and Officer inspects it on dashboard', async ({ page }) => {
    test.setTimeout(120000);
    // Generate a unique complaint text to avoid semantic matches from previous test runs
    const uniqueId = Math.floor(Math.random() * 100000);
    const complaintText = `E2E TEST COMPLAINT: Huge pipeline burst and water flooding onto the main road near Apollo Hospital at Ward 4. Reference ID: ${uniqueId}.`;

    await page.goto('/');

    // 1. Submit complaint
    await page.locator('textarea[required]').fill(complaintText);
    await page.locator('input[placeholder*="Apollo"]').fill('Ward 4, Near Apollo Hospital');
    await page.locator('button', { hasText: 'SUBMIT COMPLAINT TO CITY ENGINE' }).click();

    // 2. Wait for submission receipt to render (increased timeout due to backend AI extraction retries)
    await expect(page.locator('h3', { hasText: 'SUBMISSION RECEIPT & INCIDENT LINK' })).toBeVisible({ timeout: 25000 });

    // 3. Log in as an officer to verify the incident is clustered and visible on dashboard
    await page.locator('button', { hasText: 'Log In' }).click();
    await page.locator('summary', { hasText: 'ADVANCED / DEVELOPER JWT ENTRY' }).click();
    await page.locator('textarea[placeholder*="Bearer eyJhbGciOi"]').fill(DEV_JWT);
    await page.locator('button', { hasText: 'Inject Custom Token' }).click();

    // Wait for login to complete and dashboard to become accessible
    await expect(page.locator('button', { hasText: 'Officer Dashboard' })).toBeVisible();
    // Refresh incident list to ensure newly created incident is fetched
    await page.locator('button', { hasText: 'Refresh Data' }).click();
    // Search for the unique ID using the correct placeholder text
    await page.locator('input[placeholder*="Search master incidents"]').fill(uniqueId.toString());
    await expect(page.locator('text=CLUSTER STATUS')).toBeVisible();
    await expect(page.locator('h3', { hasText: 'CLUSTERED COMPLAINTS' })).toBeVisible();
    await expect(page.locator(`text=${uniqueId}`).first()).toBeVisible({ timeout: 30000 });
  });
});
