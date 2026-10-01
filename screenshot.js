const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  // set viewport
  await page.setViewportSize({ width: 1280, height: 1024 });

  const artifactDir = 'C:\\Users\\dell\\.gemini\\antigravity-ide\\brain\\7a97d7e9-9f4c-452d-a4af-d51e92a853f3';
  
  const pages = [
    { name: 'Overview_Light', url: 'http://localhost:3000/' },
    { name: 'Overview_Dark', url: 'http://localhost:3000/', dark: true },
    { name: 'Scale', url: 'http://localhost:3000/scale' },
    { name: 'Network', url: 'http://localhost:3000/network' },
    { name: 'Profitability', url: 'http://localhost:3000/profitability' },
    { name: 'Fees', url: 'http://localhost:3000/fees' },
    { name: 'Verdict', url: 'http://localhost:3000/verdict' },
    { name: 'Sources', url: 'http://localhost:3000/sources' },
  ];

  for (const p of pages) {
    console.log(`Navigating to ${p.name}...`);
    await page.goto(p.url, { waitUntil: 'networkidle' });
    if (p.dark) {
      await page.evaluate(() => {
        document.documentElement.classList.add('dark');
      });
      await page.waitForTimeout(500); // give time for styles to apply
    } else {
      await page.evaluate(() => {
        document.documentElement.classList.remove('dark');
      });
    }
    const filename = path.join(artifactDir, `${p.name}.png`);
    await page.screenshot({ path: filename, fullPage: true });
    console.log(`Saved ${filename}`);
  }

  await browser.close();
})();
