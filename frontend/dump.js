import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5174/');
  await page.waitForTimeout(2000); // give it time to render React
  const content = await page.content();
  console.log(content);
  await browser.close();
})();
