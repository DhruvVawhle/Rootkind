const { execSync } = require("child_process");
const fs = require("fs");

const pages = [
  { name: "Home (/)", url: "http://localhost:3005/", file: "./lh-home-final.json" },
  { name: "Catalogue (/shop)", url: "http://localhost:3005/shop", file: "./lh-shop-final.json" },
  { name: "Our Story (/about)", url: "http://localhost:3005/about", file: "./lh-about-final.json" },
];

console.log("=== RUNNING LIGHTHOUSE MOBILE AUDITS ===");

const scores = {};

for (const p of pages) {
  console.log(`\nAuditing ${p.name}...`);
  try {
    execSync(
      `npx -y lighthouse ${p.url} --chrome-flags="--headless" --output=json --output-path=${p.file} --only-categories=performance,accessibility,best-practices --quiet`,
      { stdio: "inherit", timeout: 120000 }
    );
    const data = JSON.parse(fs.readFileSync(p.file, "utf8"));
    scores[p.name] = {
      performance: Math.round((data.categories.performance?.score || 0) * 100),
      accessibility: Math.round((data.categories.accessibility?.score || 0) * 100),
      bestPractices: Math.round((data.categories["best-practices"]?.score || 0) * 100),
    };
    console.log(`  Performance: ${scores[p.name].performance}`);
    console.log(`  Accessibility: ${scores[p.name].accessibility}`);
    console.log(`  Best Practices: ${scores[p.name].bestPractices}`);
  } catch (err) {
    console.error(`  Error auditing ${p.name}:`, err.message);
  }
}

console.log("\n=== FINAL LIGHTHOUSE SCORES SUMMARY ===");
console.table(scores);
