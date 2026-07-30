#!/usr/bin/env node
// Investor-route crawl. Fails (exit 1) on any non-2xx status, page error,
// console error, or 4xx/5xx sub-resource that isn't in the third-party ignore list.
// Usage: node scripts/investor-crawl.mjs [baseUrl]
import { chromium } from "playwright";

const BASE = process.argv[2] || process.env.CRAWL_BASE_URL || "http://localhost:4173";

const ROUTES = [
  "/", "/directory", "/about-1325", "/pricing", "/how-it-works", "/connect",
  "/mcp", "/noir", "/partners", "/terms", "/privacy", "/founding-100",
  "/noir-ride", "/enterprise", "/partnerships", "/legal/terms", "/legal/privacy",
  "/karma", "/rewards", "/business-signup", "/auth", "/community",
  "/vacation-rentals", "/investor-portal", "/all-pages",
];

// Third-party origins we don't own — network failures here shouldn't fail the build.
const IGNORE_SUBSTR = [
  "mapbox", "posthog", "sentry", "gpteng", "apple-touch", "favicon",
  "gtag", "google-analytics", "hotjar", "clarity", "stripe.com/v3",
  "youtube", "gstatic", "doubleclick", "googletagmanager",
];

// Console-error substrings that are noisy or come from third-party scripts.
const IGNORE_CONSOLE = [
  "React Router Future Flag",
  "Download the React DevTools",
  "PostHog",
  "Sentry Logger",
];

const shouldIgnoreUrl = (url) => IGNORE_SUBSTR.some((k) => url.includes(k));
const shouldIgnoreConsole = (t) => IGNORE_CONSOLE.some((k) => t.includes(k));

const results = [];

const browser = await chromium.launch({ headless: true, executablePath: process.env.CRAWL_CHROME || undefined });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 1800 } });

for (const route of ROUTES) {
  const page = await ctx.newPage();
  const errors = [];
  const bad = [];
  page.on("console", (m) => {
    if (m.type() === "error" && !shouldIgnoreConsole(m.text())) errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("response", (r) => {
    if (r.status() >= 400 && !shouldIgnoreUrl(r.url())) bad.push([r.status(), r.url()]);
  });

  let status = 0;
  let final = "";
  try {
    const resp = await page.goto(BASE + route, { waitUntil: "load", timeout: 30000 });
    status = resp ? resp.status() : 0;
    final = page.url();
  } catch (e) {
    final = `nav-error: ${e.message}`;
  }
  await page.waitForTimeout(600);
  await page.close();

  const ok = status >= 200 && status < 400 && errors.length === 0 && bad.length === 0;
  results.push({ route, status, final, errors, bad, ok });
}

await browser.close();

let failed = 0;
for (const r of results) {
  const flag = r.ok ? "OK  " : "FAIL";
  console.log(`${flag} ${r.route.padEnd(28)} status=${r.status} final=${r.final.slice(-60)} errs=${r.errors.length} bad=${r.bad.length}`);
  for (const e of r.errors) console.log("   err:", e.slice(0, 240));
  for (const [s, u] of r.bad) console.log("   bad:", s, u.slice(0, 200));
  if (!r.ok) failed++;
}

console.log(`\n${results.length - failed}/${results.length} routes passed`);
if (failed > 0) {
  console.error(`\n❌ Investor crawl failed: ${failed} route(s) had errors.`);
  process.exit(1);
}
console.log("✅ Investor crawl passed.");
