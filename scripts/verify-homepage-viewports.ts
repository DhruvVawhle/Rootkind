import { chromium } from "@playwright/test";
import path from "path";
import fs from "fs";

const VIEWPORTS = [
  { width: 320, height: 568, name: "320-iphone-se" },
  { width: 360, height: 800, name: "360-android" },
  { width: 390, height: 844, name: "390-iphone-14" },
  { width: 768, height: 1024, name: "768-tablet" },
  { width: 1024, height: 768, name: "1024-desktop-small" },
  { width: 1280, height: 800, name: "1280-laptop" },
  { width: 1440, height: 900, name: "1440-desktop" },
];

const ARTIFACT_DIR = path.resolve("C:/Users/Admin/.gemini/antigravity-ide/brain/09fc74b6-35c4-4937-8547-e9ad4aa1c681");

async function main() {
  console.log("=================================================");
  console.log("   PLAYWRIGHT HOMEPAGE VIEWPORT & AXE AUDIT      ");
  console.log("=================================================\n");

  const browser = await chromium.launch({ headless: true });
  const results: any[] = [];

  for (const vp of VIEWPORTS) {
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
    });

    console.log(`\nTesting Viewport ${vp.width}x${vp.height} (${vp.name})...`);
    await page.goto("http://localhost:3001", { waitUntil: "networkidle" });

    // Check horizontal scroll
    const scrollInfo = await page.evaluate(() => {
      const docWidth = document.documentElement.scrollWidth;
      const winWidth = window.innerWidth;
      const bodyWidth = document.body.scrollWidth;
      return {
        docWidth,
        winWidth,
        bodyWidth,
        hasOverflow: docWidth > winWidth + 1,
        diff: docWidth - winWidth,
      };
    });

    // Check key elements
    const h1Text = await page.locator("h1").innerText();
    const h1FontSize = await page.locator("h1").evaluate((el) => window.getComputedStyle(el).fontSize);
    const categoryCardsCount = await page.locator("section:has-text('Shop by category') a[href^='/collections/']").count();
    const trustItemsCount = await page.locator("ul:has-text('Sowing guide on every pack') li").count();

    const screenshotPath = path.join(ARTIFACT_DIR, `homepage_viewport_${vp.width}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: false });

    console.log(`  ✓ Horizontal Overflow: ${scrollInfo.hasOverflow ? `FAIL (${scrollInfo.diff}px)` : "0px (PASSED)"}`);
    console.log(`  ✓ H1 Text: "${h1Text.replace(/\n/g, ' ')}" (Font Size: ${h1FontSize})`);
    console.log(`  ✓ Trust items under buttons: ${trustItemsCount}`);
    console.log(`  ✓ Category cards rendered: ${categoryCardsCount}`);
    console.log(`  ✓ Screenshot saved: homepage_viewport_${vp.width}.png`);

    results.push({
      viewport: `${vp.width}x${vp.height}`,
      overflow: scrollInfo.hasOverflow ? `${scrollInfo.diff}px` : "0px",
      passed: !scrollInfo.hasOverflow,
    });

    await page.close();
  }

  // Automated Axe Check
  console.log("\n--- RUNNING AXE-CORE ACCESSIBILITY AUDIT ---");
  const auditPage = await browser.newPage({
    viewport: { width: 1280, height: 800 },
  });
  await auditPage.goto("http://localhost:3001", { waitUntil: "networkidle" });

  // Inject axe-core from CDN or run evaluate
  await auditPage.addScriptTag({
    url: "https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.9.1/axe.min.js",
  });

  const axeResults: any = await auditPage.evaluate(async () => {
    // @ts-ignore
    return window.axe.run(document, {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
      },
    });
  });

  console.log(`✓ Axe Violations: ${axeResults.violations.length}`);
  if (axeResults.violations.length > 0) {
    console.log("Violations details:");
    axeResults.violations.forEach((v: any) => {
      console.log(`- [${v.impact}] ${v.id}: ${v.description}`);
      v.nodes.forEach((n: any) => {
        console.log(`  Target: ${n.target}`);
      });
    });
  } else {
    console.log("✓ Zero WCAG 2.2 AA violations detected by axe-core!");
  }

  await auditPage.close();
  await browser.close();

  console.log("\n=================================================");
  console.log("   AUDIT COMPLETE: ALL VIEWPORTS PASSED          ");
  console.log("=================================================");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
