import { chromium } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

const axeCorePath = require.resolve("axe-core");
const axeSource = fs.readFileSync(axeCorePath, "utf8");

const widths = [360, 390, 768, 1024, 1280, 1440];
const screenshotsDir = path.join(process.cwd(), "test-results", "screenshots");

if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

async function runAudits() {
  console.log("Starting comprehensive verification...");
  console.log("Target URL: http://localhost:3000/");

  const browser = await chromium.launch({ headless: true });

  // 1. Viewport Screenshots and Horizontal Overflow Checks
  console.log("\n=== 1. PLAYWRIGHT SCREENSHOTS & OVERFLOW CHECKS ===");
  for (const width of widths) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
    });
    const page = await context.newPage();
    await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
    await page.waitForSelector("#starter-kits", { timeout: 10000 });

    const overflow = await page.evaluate(() => {
      const docWidth = document.documentElement.scrollWidth;
      const bodyWidth = document.body.scrollWidth;
      const winWidth = window.innerWidth;
      const maxScroll = Math.max(docWidth, bodyWidth);
      return {
        hasOverflow: maxScroll > winWidth + 1,
        maxScroll,
        winWidth,
      };
    });

    console.log(
      `Width ${width}px: scrollWidth=${overflow.maxScroll}px, winWidth=${overflow.winWidth}px -> ${
        overflow.hasOverflow ? "OVERFLOW FAIL" : "PASS (No overflow)"
      }`
    );

    const screenshotPath = path.join(screenshotsDir, `viewport-${width}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log(`Saved screenshot: ${screenshotPath}`);

    await context.close();
  }

  // 2. axe-core scan on Section A (Starter Kits) and Section B (Trust Row + Footer)
  console.log("\n=== 2. AXE ACCESSIBILITY SCAN ===");
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
  });
  const page = await context.newPage();
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await page.waitForSelector("#starter-kits", { timeout: 10000 });
  await page.waitForSelector("footer", { timeout: 10000 });

  // Inject axe-core
  await page.evaluate((source) => {
    window.eval(source);
  }, axeSource);

  // Scan Section A: Starter Kits
  const axeSectionA = await page.evaluate(async () => {
    const el = document.getElementById("starter-kits");
    if (!el) throw new Error("Could not find #starter-kits element");
    // @ts-ignore
    const results = await axe.run(el, {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
      },
    });
    return {
      violations: results.violations.map((v: any) => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        help: v.help,
        nodes: v.nodes.map((n: any) => ({ html: n.html, target: n.target })),
      })),
    };
  });

  const seriousOrCriticalA = axeSectionA.violations.filter(
    (v: any) => v.impact === "serious" || v.impact === "critical"
  );
  console.log(`Section A (Starter Kits) total violations: ${axeSectionA.violations.length}`);
  console.log(`Section A serious/critical violations: ${seriousOrCriticalA.length}`);
  if (axeSectionA.violations.length > 0) {
    console.log("Section A violations:", JSON.stringify(axeSectionA.violations, null, 2));
  }

  // Scan Section B: Footer (Trust row + Footer)
  const axeSectionB = await page.evaluate(async () => {
    const el = document.querySelector("footer");
    if (!el) throw new Error("Could not find footer element");
    // @ts-ignore
    const results = await axe.run(el, {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
      },
    });
    return {
      violations: results.violations.map((v: any) => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        help: v.help,
        nodes: v.nodes.map((n: any) => ({ html: n.html, target: n.target })),
      })),
    };
  });

  const seriousOrCriticalB = axeSectionB.violations.filter(
    (v: any) => v.impact === "serious" || v.impact === "critical"
  );
  console.log(`Section B (Trust Row + Footer) total violations: ${axeSectionB.violations.length}`);
  console.log(`Section B serious/critical violations: ${seriousOrCriticalB.length}`);
  if (axeSectionB.violations.length > 0) {
    console.log("Section B violations:", JSON.stringify(axeSectionB.violations, null, 2));
  }

  // 3. Keyboard walk-through of Add to cart on both cards
  console.log("\n=== 3. KEYBOARD WALK-THROUGH OF ADD TO CART ===");
  const buttons = page.locator("#starter-kits button");
  const count = await buttons.count();
  console.log(`Found ${count} buttons inside #starter-kits`);

  for (let i = 0; i < count; i++) {
    const btn = buttons.nth(i);
    const initialText = await btn.innerText();
    const ariaPressedInitial = await btn.getAttribute("aria-pressed");
    console.log(`Card ${i + 1} button initial: text="${initialText}", aria-pressed=${ariaPressedInitial}`);

    await btn.focus();
    const isFocused = await btn.evaluate((el) => document.activeElement === el);
    console.log(`Card ${i + 1} button focused via keyboard: ${isFocused}`);

    // Press Enter to add
    await page.keyboard.press("Enter");
    await page.waitForTimeout(1000);

    const afterFirstPressText = await btn.innerText();
    const ariaPressedAfter = await btn.getAttribute("aria-pressed");
    console.log(`Card ${i + 1} button after Enter press: text="${afterFirstPressText}", aria-pressed=${ariaPressedAfter}`);

    // Re-focus and press Enter to remove
    await btn.focus();
    await page.keyboard.press("Enter");
    await page.waitForTimeout(1000);

    const afterSecondPressText = await btn.innerText();
    const ariaPressedSecond = await btn.getAttribute("aria-pressed");
    console.log(`Card ${i + 1} button after 2nd Enter press: text="${afterSecondPressText}", aria-pressed=${ariaPressedSecond}`);
  }

  // 4. Zoom 200% test
  console.log("\n=== 4. 200% ZOOM TEST ===");
  await page.evaluate(() => {
    // @ts-ignore
    document.body.style.zoom = "200%";
  });
  await page.waitForTimeout(500);
  const zoomOverflow = await page.evaluate(() => {
    return {
      docWidth: document.documentElement.scrollWidth,
      winWidth: window.innerWidth,
      hasOverflow: document.documentElement.scrollWidth > window.innerWidth + 2,
    };
  });
  console.log(`200% zoom check: docWidth=${zoomOverflow.docWidth}px, winWidth=${zoomOverflow.winWidth}px, overflow=${zoomOverflow.hasOverflow}`);

  await context.close();
  await browser.close();

  console.log("\nAutomated audits completed successfully!");
}

runAudits().catch((err) => {
  console.error("Audit error:", err);
  process.exit(1);
});
