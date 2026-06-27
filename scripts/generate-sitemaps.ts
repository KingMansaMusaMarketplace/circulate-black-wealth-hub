// Fetches the 3 dynamic sitemaps from Supabase edge functions and writes them
// as static XML files into public/ so they live on the same domain as 1325.ai.
// Google requires sub-sitemaps in a sitemap index to be on the same verified domain.
// Runs via `prebuild` and `predev` npm scripts.

import { readdirSync, unlinkSync, writeFileSync } from "fs";
import { resolve } from "path";

const SUPABASE_BASE = "https://agoclnqfyinwjxdmjnns.supabase.co/functions/v1";
const SITE_URL = "https://1325.ai";
const IMAGE_SITEMAP_CHUNK_SIZE = 10000;

const SITEMAPS = [
  { fn: "priority-businesses-sitemap", file: "priority-businesses-sitemap.xml" },
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

function writeImageSitemapIndex(xml: string) {
  const publicDir = resolve("public");
  const staleImageParts = readdirSync(publicDir).filter((file) => /^images-sitemap-\d+\.xml$/.test(file));
  staleImageParts.forEach((file) => unlinkSync(resolve(publicDir, file)));

  const urls = xml.match(/<url>[\s\S]*?<\/url>/g) || [];
  const partFiles: string[] = [];

  for (let i = 0; i < urls.length; i += IMAGE_SITEMAP_CHUNK_SIZE) {
    const partNumber = partFiles.length + 1;
    const file = `images-sitemap-${partNumber}.xml`;
    const body = urls.slice(i, i + IMAGE_SITEMAP_CHUNK_SIZE).join("\n");
    const partXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${body}\n</urlset>`;
    writeFileSync(resolve(publicDir, file), partXml);
    partFiles.push(file);
  }

  const today = new Date().toISOString().slice(0, 10);
  const indexXml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${partFiles
    .map((file) => `  <sitemap>\n    <loc>${SITE_URL}/${file}</loc>\n    <lastmod>${today}</lastmod>\n  </sitemap>`)
    .join("\n")}\n</sitemapindex>`;

  writeFileSync(resolve(publicDir, "images-sitemap.xml"), indexXml);
  console.log(`✓ images-sitemap.xml — index with ${partFiles.length} smaller parts, ${urls.length} URLs`);
}

async function main() {
  const results = await Promise.allSettled(
    SITEMAPS.map(async ({ fn, file }) => {
      const xml = await fetchOne(fn);
      if (file === "images-sitemap.xml") {
        writeImageSitemapIndex(xml);
        return file;
      }

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
