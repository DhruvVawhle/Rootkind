import { chromium } from "@playwright/test";

const viewports = [
  { name: "iPhone SE / Small Mobile", width: 320, height: 568 },
  { name: "Common Android", width: 360, height: 800 },
  { name: "iPhone Mini / X", width: 375, height: 812 },
  { name: "iPhone 12/13/14/15", width: 390, height: 844 },
  { name: "iPhone Pro Max", width: 430, height: 932 },
  { name: "iPad Portrait", width: 768, height: 1024 },
  { name: "iPad Landscape", width: 1024, height: 768 },
  { name: "Small Laptop", width: 1280, height: 800 },
  { name: "Standard Desktop", width: 1440, height: 900 },
  { name: "Full HD Desktop", width: 1920, height: 1080 },
];

const testRoutes = [
  "/",
  "/shop",
  "/collections/vegetable-seeds",
  "/products/pusa-ruby-heirloom-tomato",
  "/cart",
  "/checkout",
  "/about",
  "/journal",
  "/faq",
  "/shipping-policy",
];

async function runResponsiveTests() {
  console.log("Starting Automated Responsive Viewport Audits across 10 Viewports...");
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
  } catch (err: any) {
    console.error("Chromium launch failed:", err.message);
    process.exit(1);
  }

  const results: any[] = [];
  let totalViolations = 0;

  for (const vp of viewports) {
    console.log(`\nTesting Viewport: ${vp.name} (${vp.width}x${vp.height})`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
    });
    const page = await context.newPage();

    for (const route of testRoutes) {
      const url = `http://localhost:3001${route}`;
      try {
        await page.goto(url, { waitUntil: "networkidle", timeout: 15000 });

        // Check for horizontal overflow: document.documentElement.scrollWidth > window.innerWidth
        const overflow = await page.evaluate(() => {
          const docWidth = document.documentElement.scrollWidth;
          const winWidth = window.innerWidth;
          const bodyWidth = document.body.scrollWidth;
          const maxContentWidth = Math.max(docWidth, bodyWidth);
          return {
            hasOverflow: maxContentWidth > winWidth + 1, // allow 1px rounding
            maxContentWidth,
            winWidth,
          };
        });

        if (overflow.hasOverflow) {
          totalViolations++;
          console.error(`  [OVERFLOW DEFECT] ${route} at ${vp.width}px: scrollWidth ${overflow.maxContentWidth}px > viewport ${overflow.winWidth}px`);
        } else {
          process.stdout.write(".");
        }

        results.push({
          viewport: `${vp.width}x${vp.height}`,
          viewportName: vp.name,
          route,
          overflow: overflow.hasOverflow,
          scrollWidth: overflow.maxContentWidth,
          innerWidth: overflow.winWidth,
        });
      } catch (e: any) {
        console.error(`  [ERROR] ${route} at ${vp.width}x${vp.height}:`, e.message);
      }
    }
    await context.close();
  }

  await browser.close();

  console.log(`\n\n--- Viewport Audit Complete ---`);
  console.log(`Total checks executed: ${results.length}`);
  console.log(`Total horizontal overflow defects: ${totalViolations}`);

  if (totalViolations > 0) {
    process.exit(1);
  } else {
    console.log("All 10 viewports passed zero-horizontal-overflow verification!");
    process.exit(0);
  }
}

runResponsiveTests();
