import { chromium } from "@playwright/test";

async function findOverflowingElements() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 320, height: 568 },
  });

  const urls = ["http://localhost:3001/", "http://localhost:3001/products/pusa-ruby-heirloom-tomato"];

  for (const url of urls) {
    console.log(`\n--- Inspecting Overflows on: ${url} at 320px ---`);
    const page = await context.newPage();
    await page.goto(url, { waitUntil: "networkidle" });

    const overflowing = await page.evaluate(() => {
      const results: any[] = [];
      const all = document.querySelectorAll("*");
      for (const el of all) {
        const rect = el.getBoundingClientRect();
        if (rect.right > 321 || el.scrollWidth > 321) {
          results.push({
            tag: el.tagName,
            id: el.id,
            className: el.className?.toString().substring(0, 100),
            scrollWidth: el.scrollWidth,
            clientWidth: el.clientWidth,
            rectRight: Math.round(rect.right),
            text: el.textContent?.trim().substring(0, 40),
          });
        }
      }
      return results.slice(0, 15);
    });

    console.log("Found overflowing elements:", JSON.stringify(overflowing, null, 2));
    await page.close();
  }

  await browser.close();
}

findOverflowingElements();
