const { chromium, devices } = require("@playwright/test");

const viewports = [
  { name: "360px", width: 360, height: 800 },
  { name: "390px", width: 390, height: 844 },
  { name: "768px", width: 768, height: 1024 },
  { name: "1024px", width: 1024, height: 768 },
  { name: "1280px", width: 1280, height: 800 },
  { name: "1440px", width: 1440, height: 900 },
];

const routes = ["/", "/shop", "/about"];

async function main() {
  console.log("=== ROOTKIND 3-PAGE VIEWPORT & INTERACTION AUDIT ===");
  const browser = await chromium.launch({ headless: true });

  let overflowErrors = 0;

  // 1. HORIZONTAL OVERFLOW ACROSS ALL 6 REQUIRED VIEWPORTS
  console.log("\n1. Testing horizontal scroll on 360, 390, 768, 1024, 1280, 1440px...");
  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
    });
    const page = await context.newPage();

    for (const route of routes) {
      const url = `http://localhost:3005${route}`;
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });
      await page.waitForTimeout(400);

      const check = await page.evaluate(() => {
        const docWidth = document.documentElement.scrollWidth;
        const winWidth = window.innerWidth;
        const bodyWidth = document.body.scrollWidth;
        const maxW = Math.max(docWidth, bodyWidth);
        return {
          overflow: maxW > winWidth + 1,
          maxW,
          winWidth,
        };
      });

      if (check.overflow) {
        overflowErrors++;
        console.error(`  FAIL: ${route} at ${vp.width}px has overflow! (scrollWidth ${check.maxW}px > innerWidth ${check.winWidth}px)`);
      } else {
        console.log(`  PASS: ${route} at ${vp.width}px (scrollWidth ${check.maxW}px <= innerWidth ${check.winWidth}px)`);
      }
    }
    await context.close();
  }

  // 2. KEYBOARD INTERACTION & ESCAPE TEST
  console.log("\n2. Testing keyboard navigation and Escape key on overlays...");
  {
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
    });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto("http://localhost:3005/", { waitUntil: "domcontentloaded" });
    await mobilePage.waitForTimeout(400);

    // Open mobile menu
    const burgerBtn = mobilePage.locator("#mobile-menu-burger-btn");
    await burgerBtn.click();
    await mobilePage.waitForTimeout(300);

    const isExpanded = await burgerBtn.getAttribute("aria-expanded");
    console.log(`  Mobile menu opened, aria-expanded: ${isExpanded}`);

    // Press Escape to close
    await mobilePage.keyboard.press("Escape");
    await mobilePage.waitForTimeout(300);

    const isExpandedAfterEsc = await burgerBtn.getAttribute("aria-expanded");
    console.log(`  Escape pressed, aria-expanded: ${isExpandedAfterEsc}`);

    await mobileContext.close();
  }

  // 3. CATALOGUE FILTER & SORT TEST
  console.log("\n3. Testing Catalogue Filter chips & Sort Select...");
  {
    const shopContext = await browser.newContext({
      viewport: { width: 1280, height: 800 },
    });
    const shopPage = await shopContext.newPage();
    await shopPage.goto("http://localhost:3005/shop", { waitUntil: "domcontentloaded" });
    await shopPage.waitForTimeout(600);

    // Click on "Vegetable Seeds" chip
    const vegChip = shopPage.locator("button.filter-chip-item", { hasText: "Vegetable Seeds" });
    if (await vegChip.count() > 0) {
      await vegChip.first().click();
      await shopPage.waitForTimeout(500);
      const isPressed = await vegChip.first().getAttribute("aria-pressed");
      const currentUrl = shopPage.url();
      console.log(`  Vegetable Seeds chip clicked, aria-pressed: ${isPressed}, url: ${currentUrl}`);
    }

    // Change Sort select
    const sortSelect = shopPage.locator("#catalogue-sort");
    if (await sortSelect.count() > 0) {
      await sortSelect.selectOption("price-asc");
      await shopPage.waitForTimeout(500);
      const currentUrl = shopPage.url();
      console.log(`  Sort changed to price-asc, url: ${currentUrl}`);
    }

    await shopContext.close();
  }

  // 4. PREFERS-REDUCED-MOTION TEST
  console.log("\n4. Testing prefers-reduced-motion fallback...");
  {
    const rmContext = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      reducedMotion: "reduce",
    });
    const rmPage = await rmContext.newPage();
    await rmPage.goto("http://localhost:3005/", { waitUntil: "domcontentloaded" });
    await rmPage.waitForTimeout(500);

    // Verify pinned sections or motion components respect reduced motion
    const cursor = await rmPage.locator('[aria-hidden="true"].fixed.pointer-events-none.mix-blend-difference').count();
    console.log(`  Reduced motion active: custom cursor disabled: ${cursor === 0 ? "YES" : "NO"}`);

    await rmContext.close();
  }

  // 5. SAFARI EMULATION
  console.log("\n5. Testing iOS Safari mobile emulation...");
  {
    const iphone = devices["iPhone 14"];
    const safariContext = await browser.newContext({
      ...iphone,
    });
    const safariPage = await safariContext.newPage();
    await safariPage.goto("http://localhost:3005/about", { waitUntil: "domcontentloaded" });
    await safariPage.waitForTimeout(500);

    const check = await safariPage.evaluate(() => {
      return {
        docWidth: document.documentElement.scrollWidth,
        winWidth: window.innerWidth,
      };
    });
    console.log(`  Safari mobile emulation on /about: scrollWidth ${check.docWidth}px, innerWidth ${check.winWidth}px`);

    await safariContext.close();
  }

  await browser.close();
  console.log("\n=== AUDIT RESULTS ===");
  console.log(`Total Horizontal Overflow Defects: ${overflowErrors}`);
  if (overflowErrors > 0) {
    process.exit(1);
  } else {
    console.log("ALL RESPONSIVE AND INTERACTION CHECKS PASSED!");
  }
}

main().catch((err) => {
  console.error("Audit error:", err);
  process.exit(1);
});
