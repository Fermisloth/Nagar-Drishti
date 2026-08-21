# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: smoke.spec.ts >> NagarDrishti Smoke and Security Tests >> E2E Flow: Citizen submits complaint, Gemini clusters it, and Officer inspects it on dashboard
- Location: tests\smoke.spec.ts:173:3

# Error details

```
Test timeout of 120000ms exceeded.
```

```
Error: locator.click: Test timeout of 120000ms exceeded.
Call log:
  - waiting for locator('button').filter({ hasText: 'Refresh Data' })

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - navigation [ref=e4]:
    - generic [ref=e5]:
      - link "NagarDrishti" [ref=e6] [cursor=pointer]:
        - /url: "#"
      - generic [ref=e11]:
        - button "Report Civic Problem" [ref=e12] [cursor=pointer]
        - button "Officer Dashboard" [ref=e16] [cursor=pointer]
        - button "System Analytics" [ref=e20] [cursor=pointer]
        - button "System Health" [ref=e25] [cursor=pointer]
      - generic [ref=e29]:
        - generic [ref=e30]: "ROLE: EVALUATOR"
        - button "Log Out" [ref=e35] [cursor=pointer]
  - main [ref=e37]:
    - generic [ref=e39]:
      - generic [ref=e40]:
        - generic [ref=e41]: CIVIC COGNITIVE INTELLIGENCE
        - generic [ref=e42]: REAL-TIME INCIDENT DETECTION & DEDUPLICATION
      - generic [ref=e43]:
        - generic [ref=e44]:
          - heading "CITIZEN COMPLAINT INTAKE" [level=2] [ref=e45]
          - paragraph [ref=e49]: Submit issues in any language (English, Hindi, Tamil, etc.). Our 10-stage AI pipeline automatically translates, extracts metadata, and groups duplicates into master incident files.
        - generic [ref=e50]:
          - generic [ref=e51]:
            - generic [ref=e52]: RAW COMPLAINT DESCRIPTION *
            - textbox "Describe the municipal issue (e.g., 'There is a huge water pipeline leakage near Sector 15 market overflow onto the road')..." [ref=e53]
          - generic [ref=e54]:
            - generic [ref=e55]:
              - generic [ref=e56]: LOCATION / LANDMARK
              - textbox "e.g., Ward 4, Near Apollo Hospital" [ref=e58]
            - generic [ref=e62]:
              - generic [ref=e63]: IMAGE / EVIDENCE URL
              - textbox "https://example.com/pothole.jpg" [ref=e65]
          - generic [ref=e70]:
            - generic [ref=e71]: AI Analysis Available After Submission
            - button "Voice Input (Stub)" [ref=e76] [cursor=pointer]
          - button "SUBMIT COMPLAINT TO CITY ENGINE" [ref=e81] [cursor=pointer]
      - generic [ref=e85]:
        - generic [ref=e86]:
          - heading "SUBMISSION RECEIPT & INCIDENT LINK" [level=3] [ref=e90]
          - generic [ref=e91]: RECORDED IN POSTGRES
        - generic [ref=e95]:
          - generic [ref=e96]:
            - generic [ref=e97]: TICKET ID
            - generic [ref=e98]: 5ab947a2...
          - generic [ref=e99]:
            - generic [ref=e100]: MASTER INCIDENT ID
            - generic [ref=e101]: INC-c539d7
          - generic [ref=e102]:
            - generic [ref=e103]: CLUSTER STATUS
            - generic [ref=e104]: MERGED INTO MASTER CLUSTER
          - generic [ref=e110]:
            - generic [ref=e111]: SUBMISSION TIMESTAMP
            - generic [ref=e112]: 8/21/2026, 10:07:35 PM
        - generic [ref=e113]: "Deduplication Active: Your report is linked to Master Incident cluster. Multiple duplicate entries are automatically aggregated to reduce city clutter."
      - generic [ref=e118]:
        - generic [ref=e119]:
          - heading "GEMINI 1.5 FLASH EXTRACTION RESULT" [level=3] [ref=e124]
          - generic [ref=e125]: PARSED & VALIDATED
        - generic [ref=e129]:
          - generic [ref=e130]:
            - generic [ref=e131]: DEPARTMENT
            - generic [ref=e135]: Water Supply & Sewage
          - generic [ref=e136]:
            - generic [ref=e137]: ISSUE TYPE
            - generic [ref=e141]: Water Leakage
          - generic [ref=e142]:
            - generic [ref=e143]: PRIORITY LEVEL
            - generic [ref=e146]: Medium
          - generic [ref=e147]:
            - generic [ref=e148]: EXTRACTED LOCATION
            - text: Apollo Hospital At
        - generic [ref=e152]:
          - generic [ref=e153]: AI GENERATED EXECUTIVE SUMMARY
          - paragraph [ref=e157]: "\"E2E TEST COMPLAINT: Huge pipeline burst and water flooding o...\""
        - generic [ref=e158]: "Raw Citizen Text: \"E2E TEST COMPLAINT: Huge pipeline burst and water flooding onto the main road near Apollo Hospital at Ward 4. Reference ID: 34349.\""
```

# Test source

```ts
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
  113 |     await page.waitForResponse(response => response.url().includes('/api/v1/incidents') && response.status() === 401);
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
> 198 |     await page.locator('button', { hasText: 'Refresh Data' }).click();
      |                                                               ^ Error: locator.click: Test timeout of 120000ms exceeded.
  199 |     // Search for the unique ID using the correct placeholder text
  200 |     await page.locator('input[placeholder*="Search master incidents"]').fill(uniqueId.toString());
  201 |     await expect(page.locator('text=CLUSTER STATUS')).toBeVisible();
  202 |     await expect(page.locator('h3', { hasText: 'CLUSTERED COMPLAINTS' })).toBeVisible();
  203 |     await expect(page.locator(`text=${uniqueId}`).first()).toBeVisible({ timeout: 30000 });
  204 |   });
  205 | });
  206 | 
```