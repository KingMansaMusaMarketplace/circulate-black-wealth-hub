// Fetches the 3 dynamic sitemaps from Supabase edge functions and writes them
// as static XML files into public/ so they live on the same domain as 1325.ai.
// Google requires sub-sitemaps in a sitemap index to be on the same verified domain.
// Runs via `prebuild` and `predev` npm scripts.

import { writeFileSync } from "fs";
import { resolve } from "path";

const SUPABASE_BASE = "https://agoclnqfyinwjxdmjnns.supabase.co/functions/v1";

const SITEMAPS = [
  { fn: "businesses-sitemap", file: "businesses-sitemap.xml" },
  { fn: "landing-sitemap", file: "landing-sitemap.xml" },
  { fn: "images-sitemap", file: "images-sitemap.xml" },
];

async function fetchOne(fn: string): Promise<string> {
  const res = await fetch(`${SUPABASE_BASE}/${fn}`, {
    headers: { Accept: "application/xml" },
  });
  if (!res.ok) throw new Error(`${fn} returned ${res.status}`);
  return await res.text();
}

async function main() {
  const results = await Promise.allSettled(
    SITEMAPS.map(async ({ fn, file }) => {
      const xml = await fetchOne(fn);
      const out = resolve("public", file);
      writeFileSync(out, xml);
      const sizeKb = Math.round(xml.length / 1024);
      const urlCount = (xml.match(/<url>/g) || []).length;
      console.log(`✓ ${file} — ${urlCount} URLs, ${sizeKb}KB`);
      return file;
    }),
  );

  const failed = results.filter((r) => r.status === "rejected");
  if (failed.length > 0) {
    console.warn(`⚠ ${failed.length} sitemap(s) failed to generate (build continues):`);
    failed.forEach((r) => console.warn(`  - ${(r as PromiseRejectedResult).reason}`));
  }
}

main().catch((e) => {
  console.error("Sitemap generation crashed:", e);
  // Do not fail the build — site can still ship without fresh sitemaps.
  process.exit(0);
});
