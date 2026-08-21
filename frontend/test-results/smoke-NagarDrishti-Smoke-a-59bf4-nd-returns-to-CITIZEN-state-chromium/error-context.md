# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: smoke.spec.ts >> NagarDrishti Smoke and Security Tests >> Invalid or expired JWT forces session clearance and returns to CITIZEN state
- Location: tests\smoke.spec.ts:99:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.waitForResponse: Test timeout of 30000ms exceeded.
```

# Page snapshot

```yaml
- generic [ref=f1e3]:
  - navigation [ref=f1e4]:
    - generic [ref=f1e5]:
      - link "NagarDrishti" [ref=f1e6] [cursor=pointer]:
        - /url: "#"
      - generic [ref=f1e11]:
        - button "Officer Dashboard" [ref=f1e12] [cursor=pointer]
        - button "System Analytics" [ref=f1e16] [cursor=pointer]
        - button "System Health" [ref=f1e21] [cursor=pointer]
      - generic [ref=f1e25]:
        - generic [ref=f1e26]: "ROLE: OFFICER"
        - button "Log Out" [ref=f1e31] [cursor=pointer]
  - main [ref=f1e33]:
    - generic [ref=f1e34]:
      - heading "Officer Dashboard" [level=1] [ref=f1e35]
      - generic [ref=f1e36]:
        - generic [ref=f1e37]: Officer Dashboard
        - button "Refresh Data" [ref=f1e42] [cursor=pointer]
      - generic [ref=f1e48]:
        - generic [ref=f1e49]:
          - generic [ref=f1e50]:
            - generic [ref=f1e51]:
              - generic [ref=f1e52]: Total Active Incidents
              - generic [ref=f1e53]: Live
            - generic [ref=f1e54]: "0"
          - generic [ref=f1e55]: Total consolidated civic issues
        - generic [ref=f1e56]:
          - generic [ref=f1e57]:
            - generic [ref=f1e58]:
              - generic [ref=f1e59]: Emergency Priority
              - generic [ref=f1e60]: Critical
            - generic [ref=f1e61]: "0"
          - generic [ref=f1e62]: Requires immediate attention
        - generic [ref=f1e63]:
          - generic [ref=f1e64]:
            - generic [ref=f1e65]:
              - generic [ref=f1e66]: High Priority
              - generic [ref=f1e67]: Urgent
            - generic [ref=f1e68]: "0"
          - generic [ref=f1e69]: Requires swift resolution
      - generic [ref=f1e71]:
        - textbox "Search master incidents by title, keyword, or location..." [ref=f1e73]
        - generic [ref=f1e77]:
          - generic [ref=f1e78]: "DEPT:"
          - button "ALL" [ref=f1e81] [cursor=pointer]
          - button "Water Supply & Sewerage" [ref=f1e82] [cursor=pointer]
          - button "Roads & Traffic" [ref=f1e83] [cursor=pointer]
          - button "Sanitation & Waste" [ref=f1e84] [cursor=pointer]
          - button "Electricity & Lighting" [ref=f1e85] [cursor=pointer]
          - button "Public Health" [ref=f1e86] [cursor=pointer]
        - generic [ref=f1e87]:
          - generic [ref=f1e88]: "URGENCY:"
          - button "ALL" [ref=f1e91] [cursor=pointer]
          - button "EMERGENCY" [ref=f1e92] [cursor=pointer]
          - button "HIGH" [ref=f1e93] [cursor=pointer]
          - button "MEDIUM" [ref=f1e94] [cursor=pointer]
          - button "LOW" [ref=f1e95] [cursor=pointer]
      - generic [ref=f1e96]:
        - heading "NO INCIDENTS MATCH CURRENT FILTERS" [level=3] [ref=f1e97]
        - paragraph [ref=f1e98]: Try clearing department or priority search filters to view active municipal incidents.
```

# Test source

```ts
  13  |     await page.goto('/');
  14  |     
  15  |     // Check Citizen Portal banner
  16  |     await expect(page.locator('h2', { hasText: 'CITIZEN COMPLAINT INTAKE' })).toBeVisible();
  17  |     
  18  |     // Verify required fields render correctly
  19  |     await expect(page.locator('textarea[required]')).toBeVisible();
  20  |     await expect(page.locator('input[placeholder*="Apollo"]')).toBeVisible();
  21  |     
  22  |     // Verify submit button is present
  23  |     await expect(page.locator('button', { hasText: 'SUBMIT COMPLAINT TO CITY ENGINE' })).toBeVisible();
  24  |   });
  25  | 
  26  |   test('Unauthenticated access to Officer Dashboard is protected', async ({ page }) => {
  27  |     await page.goto('/');
  28  |     // Without logging in, the Officer Dashboard nav link should not be present
  29  |     await expect(page.locator('button', { hasText: 'Officer Dashboard' })).not.toBeVisible();
  30  |   });
  31  | 
  32  |   test('Health Monitor reflects the REAL backend readiness state', async ({ page }) => {
  33  |     await page.goto('/');
  34  |     
  35  |     // Login as Officer first to see Health Monitor
  36  |     await page.locator('button', { hasText: 'Log In' }).click();
  37  |     await page.locator('summary', { hasText: 'ADVANCED / DEVELOPER JWT ENTRY' }).click();
  38  |     await page.locator('textarea[placeholder*="Bearer eyJhbGciOi"]').fill(DEV_JWT);
  39  |     await page.locator('button', { hasText: 'Inject Custom Token' }).click();
  40  |     
  41  |     // Wait for auth to complete
  42  |     await expect(page.locator('button', { hasText: 'System Health' })).toBeVisible();
  43  |     await page.locator('button', { hasText: 'System Health' }).click();
  44  |     
  45  |     // The health monitor should show the real backend data
  46  |     await expect(page.locator('h3', { hasText: 'INFRASTRUCTURE & DEPENDENCY PIPELINE MAP' })).toBeVisible();
  47  |     await expect(page.locator('text=SYSTEM STATUS: READY').first()).toBeVisible();
  48  |   });
  49  | 
  50  |   test('Officer login works and Officer Dashboard loads data without mock fallbacks', async ({ page }) => {
  51  |     await page.goto('/');
  52  |     
  53  |     // Click login
  54  |     await page.locator('button', { hasText: 'Log In' }).click();
  55  |     
  56  |     // Expand advanced login
  57  |     await page.locator('summary', { hasText: 'ADVANCED / DEVELOPER JWT ENTRY' }).click();
  58  |     
  59  |     // Inject token
  60  |     await page.locator('textarea[placeholder*="Bearer eyJhbGciOi"]').fill(DEV_JWT);
  61  |     
  62  |     // Authenticate
  63  |     await page.locator('button', { hasText: 'Inject Custom Token' }).click();
  64  |     
  65  |     // Verify logged in by checking that Officer Dashboard button is visible
  66  |     const dashboardBtn = page.getByRole('button', { name: 'Officer Dashboard' });
  67  |     await expect(dashboardBtn).toBeVisible();
  68  |     
  69  |     // Click Officer Dashboard
  70  |     await dashboardBtn.click();
  71  |     
  72  |     // Wait for the dashboard heading to appear, confirming navigation
  73  |     await expect(page.getByRole('heading', { name: 'Officer Dashboard' })).toBeVisible({ timeout: 15000 });
  74  |     
  75  |     // Ensure the Refresh Data button is visible before interacting with the dashboard
  76  |     const refreshBtn = page.locator('button', { hasText: 'Refresh Data' });
  77  |     await expect(refreshBtn).toBeVisible({ timeout: 15000 });
  78  |     
  79  |     // The officer dashboard should load data from the real backend.
  80  |     await expect(page.locator('text=Unable to reach the server to fetch incidents')).not.toBeVisible();
  81  |     
  82  |     // Wait for either empty state or any incident card to appear (more robust)
  83  |     const emptyState = page.locator('text=NO ACTIVE INCIDENTS');
  84  |     const incidentCard = page.locator('.neo-card');
  85  |     // Wait up to 15 seconds for one of the conditions
  86  |     await Promise.race([
  87  |       emptyState.waitFor({ timeout: 15000 }).catch(() => {}),
  88  |       incidentCard.first().waitFor({ timeout: 15000 }).catch(() => {}),
  89  |     ]);
  90  |     
  91  |     const isEmpty = await emptyState.isVisible();
  92  |     const hasIncidents = await incidentCard.first().isVisible();
  93  |     
  94  |     expect(isEmpty || hasIncidents).toBeTruthy();
  95  |   });
  96  | 
  97  |   // Targeted Security Fix Verifications
  98  | 
  99  |   test('Invalid or expired JWT forces session clearance and returns to CITIZEN state', async ({ page }) => {
  100 |     await page.goto('/');
  101 |     
  102 |     // Set invalid token in localStorage
  103 |     await page.evaluate((token) => {
  104 |       localStorage.setItem('nagardrishti_token', token);
  105 |       localStorage.setItem('nagardrishti_role', 'OFFICER');
  106 |       localStorage.setItem('nagardrishti_username', 'Malicious User');
  107 |     }, EXPIRED_INVALID_JWT);
  108 | 
  109 |     // Reload page once manually to boot React with these localStorage values.
  110 |     // This will trigger the API request, which fails and gets intercepted to clear storage.
  111 |     await page.reload();
  112 |     // After reload, trigger a protected API request (incidents list) to cause 401 and invoke interceptor
> 113 |     await page.waitForResponse(response => response.url().includes('/api/v1/incidents') && response.status() === 401);
      |                ^ Error: page.waitForResponse: Test timeout of 30000ms exceeded.
  114 | 
  115 | 
  116 |     // The application automatically switches to OfficerDashboard due to stored role,
  117 |     // triggers listIncidents, gets 401, clears auth state, and reloads.
  118 |     // We simply wait for this automatic sequence to complete.
  119 |     await page.waitForTimeout(3000);
  120 | 
  121 |     // Verify localStorage is cleared
  122 |     const storedToken = await page.evaluate(() => localStorage.getItem('nagardrishti_token'));
  123 |     const storedRole = await page.evaluate(() => localStorage.getItem('nagardrishti_role'));
  124 |     expect(storedToken).toBeNull();
  125 |     expect(storedRole).toBeNull();
  126 | 
  127 |     // Verify application returned to Citizen portal view and Officer Dashboard button is gone
  128 |     await expect(page.locator('h2', { hasText: 'CITIZEN COMPLAINT INTAKE' })).toBeVisible();
  129 |     await expect(page.locator('button', { hasText: 'Officer Dashboard' })).not.toBeVisible();
  130 |   });
  131 | 
  132 |   test('Logout clears all nagardrishti_* auth state and updates UI state', async ({ page }) => {
  133 |     await page.goto('/');
  134 |     
  135 |     // Log in
  136 |     await page.locator('button', { hasText: 'Log In' }).click();
  137 |     await page.locator('summary', { hasText: 'ADVANCED / DEVELOPER JWT ENTRY' }).click();
  138 |     await page.locator('textarea[placeholder*="Bearer eyJhbGciOi"]').fill(DEV_JWT);
  139 |     await page.locator('button', { hasText: 'Inject Custom Token' }).click();
  140 |     
  141 |     // Verify logged in
  142 |     await expect(page.locator('button', { hasText: 'Officer Dashboard' })).toBeVisible();
  143 |     
  144 |     // Click Log Out
  145 |     await page.locator('button', { hasText: 'Log Out' }).click();
  146 | 
  147 |     // Wait for reload
  148 |     await page.waitForTimeout(1000);
  149 | 
  150 |     // Verify state removed from localStorage
  151 |     const storedToken = await page.evaluate(() => localStorage.getItem('nagardrishti_token'));
  152 |     const storedRole = await page.evaluate(() => localStorage.getItem('nagardrishti_role'));
  153 |     expect(storedToken).toBeNull();
  154 |     expect(storedRole).toBeNull();
  155 | 
  156 |     // Verify Officer Dashboard is no longer visible
  157 |     await expect(page.locator('button', { hasText: 'Officer Dashboard' })).not.toBeVisible();
  158 |     await expect(page.locator('button', { hasText: 'Log In' })).toBeVisible();
  159 |   });
  160 | 
  161 |   test('Demo/evaluator bypasses are completely absent from DOM', async ({ page }) => {
  162 |     await page.goto('/');
  163 |     
  164 |     // Click Log In
  165 |     await page.locator('button', { hasText: 'Log In' }).click();
  166 | 
  167 |     // Verify 1-click evaluator / quick login buttons are not present
  168 |     await expect(page.locator('text=1-CLICK EVALUATOR MODE')).not.toBeVisible();
  169 |     await expect(page.locator('text=OFFICER ROLE')).not.toBeVisible();
  170 |     await expect(page.locator('text=CITIZEN ROLE')).not.toBeVisible();
  171 |   });
  172 | 
  173 |   test('E2E Flow: Citizen submits complaint, Gemini clusters it, and Officer inspects it on dashboard', async ({ page }) => {
  174 |     test.setTimeout(120000);
  175 |     // Generate a unique complaint text to avoid semantic matches from previous test runs
  176 |     const uniqueId = Math.floor(Math.random() * 100000);
  177 |     const complaintText = `E2E TEST COMPLAINT: Huge pipeline burst and water flooding onto the main road near Apollo Hospital at Ward 4. Reference ID: ${uniqueId}.`;
  178 | 
  179 |     await page.goto('/');
  180 | 
  181 |     // 1. Submit complaint
  182 |     await page.locator('textarea[required]').fill(complaintText);
  183 |     await page.locator('input[placeholder*="Apollo"]').fill('Ward 4, Near Apollo Hospital');
  184 |     await page.locator('button', { hasText: 'SUBMIT COMPLAINT TO CITY ENGINE' }).click();
  185 | 
  186 |     // 2. Wait for submission receipt to render (increased timeout due to backend AI extraction retries)
  187 |     await expect(page.locator('h3', { hasText: 'SUBMISSION RECEIPT & INCIDENT LINK' })).toBeVisible({ timeout: 25000 });
  188 | 
  189 |     // 3. Log in as an officer to verify the incident is clustered and visible on dashboard
  190 |     await page.locator('button', { hasText: 'Log In' }).click();
  191 |     await page.locator('summary', { hasText: 'ADVANCED / DEVELOPER JWT ENTRY' }).click();
  192 |     await page.locator('textarea[placeholder*="Bearer eyJhbGciOi"]').fill(DEV_JWT);
  193 |     await page.locator('button', { hasText: 'Inject Custom Token' }).click();
  194 | 
  195 |     // Wait for login to complete and dashboard to become accessible
  196 |     await expect(page.locator('button', { hasText: 'Officer Dashboard' })).toBeVisible();
  197 |     // Refresh incident list to ensure newly created incident is fetched
  198 |     await page.locator('button', { hasText: 'Refresh Data' }).click();
  199 |     // Search for the unique ID using the correct placeholder text
  200 |     await page.locator('input[placeholder*="Search master incidents"]').fill(uniqueId.toString());
  201 |     await expect(page.locator('text=CLUSTER STATUS')).toBeVisible();
  202 |     await expect(page.locator('h3', { hasText: 'CLUSTERED COMPLAINTS' })).toBeVisible();
  203 |     await expect(page.locator(`text=${uniqueId}`).first()).toBeVisible({ timeout: 30000 });
  204 |   });
  205 | });
  206 | 
```