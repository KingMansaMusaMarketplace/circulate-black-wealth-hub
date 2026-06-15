// Pre-renders the top ~5,000 business detail pages as static HTML at build time.
//
// Why: Lovable hosting serves the SPA for every route, which means Googlebot
// gets an empty <body> until it runs JS — a slow and deprioritized path.
// For the 44K business pages, this is the #1 reason ~46K are "Discovered
// – currently not indexed" in Google Search Console.
//
// What this does: at `prebuild` time we fetch the highest-quality businesses
// (verified, with description/image/location) and write a fully-formed HTML
// file at `public/business/<slug>/index.html` for each. Vite copies the
// `public/` tree into `dist/` during `vite build`, and Lovable's static
// hosting serves whichever file exists before falling back to the SPA.
//
// Result: Googlebot fetches `/business/<slug>` and gets real content +
// LocalBusiness JSON-LD in the first byte — no JS render needed. Humans
// see the static HTML for a moment, then React boots and takes over.
//
// Safety: the script never fails the build. If Supabase is unreachable
// or returns nothing, we log a warning and exit 0. Existing static files
// are wiped at the start of each build so stale data can't linger.

import { writeFileSync, mkdirSync, readFileSync, existsSync, rmSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://1325.ai";
const SUPABASE_URL = "https://agoclnqfyinwjxdmjnns.supabase.co";
// Publishable anon key — same key the frontend ships with. RLS allows
// anon to read businesses where listing_status='live', so this is safe.
const SUPABASE_ANON_KEY =
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnb2NsbnFmeWlud2p4ZG1qbm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1OTUyMjUsImV4cCI6MjA2MjE3MTIyNX0.9upJQa6LxK7_0waLixPY5403mpvckXVIvd8GGcDs-bQ";

// How many pages to pre-render. ~5,000 keeps the build output ~50–75 MB
// and adds ~60–90 s to build time — well within Lovable's tolerance.
// The remaining ~39,000 stay JS-rendered and benefit indirectly from
// hub pages and improved Helmet metadata.
const TARGET_COUNT = 5000;
// Fetch a wider pool so quality-scoring in JS can pick the best 5K.
const FETCH_POOL = 8000;
const FETCH_PAGE_SIZE = 1000;

interface Business {
  id: string;
  slug: string | null;
  business_name: string;
  description: string | null;
  category: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  phone: string | null;
  website: string | null;
  logo_url: string | null;
  banner_url: string | null;
  is_verified: boolean | null;
  average_rating: number | null;
  review_count: number | null;
  updated_at: string | null;
  latitude: number | null;
  longitude: number | null;
}

function esc(s: string | null | undefined): string {
  if (!s) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function qualityScore(b: Business): number {
  let score = 0;
  if (b.is_verified) score += 50;
  if (b.banner_url) score += 15;
  if (b.logo_url) score += 10;
  if (b.description && b.description.trim().length > 80) score += 20;
  if (b.city) score += 8;
  if (b.state) score += 4;
  if (b.phone) score += 5;
  if (b.website) score += 5;
  if (b.average_rating && b.average_rating >= 4) score += 5;
  if (b.review_count && b.review_count > 0) score += Math.min(10, b.review_count);
  return score;
}

async function fetchBusinessPool(): Promise<Business[]> {
  const fields = [
    "id", "slug", "business_name", "description", "category",
    "address", "city", "state", "zip_code", "phone", "website",
    "logo_url", "banner_url", "is_verified", "average_rating",
    "review_count", "updated_at", "latitude", "longitude",
  ].join(",");
  const out: Business[] = [];
  let from = 0;
  // Sort only by `id` (primary key, always indexed). Ordering by un-indexed
  // columns over 44K rows triggers a statement_timeout (PostgREST 57014).
  // We score and re-sort the pool in JS below.
  while (out.length < FETCH_POOL) {
    const url = `${SUPABASE_URL}/rest/v1/businesses?select=${fields}&listing_status=eq.live&order=id.asc&limit=${FETCH_PAGE_SIZE}&offset=${from}`;
    const res = await fetch(url, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Accept: "application/json",
      },
    });
    if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`);
    const rows = (await res.json()) as Business[];
    if (!rows.length) break;
    out.push(...rows);
    if (rows.length < FETCH_PAGE_SIZE) break;
    from += FETCH_PAGE_SIZE;
  }
  return out;
}

function buildDescription(b: Business): string {
  const trimmed = (b.description || "").trim();
  if (trimmed.length > 40) return trimmed.slice(0, 300);
  const locationLabel = [b.city, b.state].filter(Boolean).join(", ");
  const cat = (b.category || "Black-owned business").toLowerCase();
  return `${b.business_name} is a Black-owned ${cat}${
    locationLabel ? ` located in ${locationLabel}` : ""
  }. Find contact info, hours, and reviews on 1325.AI's directory of 43,000+ Black-owned businesses.`;
}

function getSchemaType(category: string | null): string {
  if (!category) return "LocalBusiness";
  const c = category.toLowerCase();
  if (c.includes("restaurant") || c.includes("food") || c.includes("dining")) return "Restaurant";
  if (c.includes("salon") || c.includes("beauty") || c.includes("spa")) return "BeautySalon";
  if (c.includes("health") || c.includes("medical") || c.includes("clinic")) return "MedicalBusiness";
  if (c.includes("legal") || c.includes("law") || c.includes("attorney")) return "LegalService";
  if (c.includes("retail") || c.includes("shop") || c.includes("store")) return "Store";
  if (c.includes("auto") || c.includes("car") || c.includes("mechanic")) return "AutoRepair";
  if (c.includes("fitness") || c.includes("gym")) return "SportsActivityLocation";
  if (c.includes("education") || c.includes("school") || c.includes("tutoring")) return "EducationalOrganization";
  if (c.includes("financial") || c.includes("accounting") || c.includes("tax")) return "FinancialService";
  if (c.includes("real estate") || c.includes("property")) return "RealEstateAgent";
  if (c.includes("cleaning") || c.includes("home service")) return "HomeAndConstructionBusiness";
  if (c.includes("professional") || c.includes("consulting")) return "ProfessionalService";
  return "LocalBusiness";
}

function buildJsonLd(b: Business, canonical: string, description: string): string {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": getSchemaType(b.category),
    "@id": canonical,
    name: b.business_name,
    description,
    url: canonical,
  };
  if (b.logo_url || b.banner_url) schema.image = b.banner_url || b.logo_url;
  if (b.phone) schema.telephone = b.phone;
  if (b.address || b.city || b.state) {
    const addr: Record<string, unknown> = { "@type": "PostalAddress" };
    if (b.address) addr.streetAddress = b.address;
    if (b.city) addr.addressLocality = b.city;
    if (b.state) addr.addressRegion = b.state;
    if (b.zip_code) addr.postalCode = b.zip_code;
    addr.addressCountry = "US";
    schema.address = addr;
  }
  if (b.latitude && b.longitude) {
    schema.geo = { "@type": "GeoCoordinates", latitude: b.latitude, longitude: b.longitude };
  }
  if (b.average_rating && b.review_count && b.review_count > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: b.average_rating,
      reviewCount: b.review_count,
    };
  }
  return JSON.stringify(schema);
}

function renderArticle(b: Business, description: string): string {
  // Pre-rendered content inside #root. React will replace this on hydration,
  // but Googlebot reads it before any JS runs. Keep it semantic and crawlable.
  const locationLine = [b.address, b.city, b.state, b.zip_code].filter(Boolean).join(", ");
  const ratingLine =
    b.average_rating && b.review_count
      ? `<p><strong>Rating:</strong> ${b.average_rating.toFixed(1)} (${b.review_count} reviews)</p>`
      : "";
  return `
    <main style="max-width:900px;margin:0 auto;padding:24px;color:#fff;background:#000;font-family:system-ui,sans-serif;">
      <nav aria-label="Breadcrumb"><a href="/" style="color:#FFB300;">Home</a> &rsaquo; <a href="/directory" style="color:#FFB300;">Directory</a> &rsaquo; <span>${esc(b.business_name)}</span></nav>
      <h1>${esc(b.business_name)}</h1>
      ${b.category ? `<p><strong>Category:</strong> ${esc(b.category)}</p>` : ""}
      ${locationLine ? `<p><strong>Location:</strong> ${esc(locationLine)}</p>` : ""}
      ${b.phone ? `<p><strong>Phone:</strong> ${esc(b.phone)}</p>` : ""}
      ${b.website ? `<p><strong>Website:</strong> <a href="${esc(b.website)}" rel="nofollow">${esc(b.website)}</a></p>` : ""}
      ${ratingLine}
      <h2>About</h2>
      <p>${esc(description)}</p>
      <p style="margin-top:32px;opacity:0.6;font-size:14px;">Loading interactive page&hellip;</p>
    </main>
  `;
}

function buildHtml(template: string, b: Business): string {
  const slug = b.slug || b.id;
  const canonical = `${BASE_URL}/business/${slug}`;
  const description = buildDescription(b);
  const locationLabel = [b.city, b.state].filter(Boolean).join(", ");
  const categoryLabel = b.category || "Black-owned business";
  const pageTitle = locationLabel
    ? `${b.business_name} — ${categoryLabel} in ${locationLabel} | 1325.AI`
    : `${b.business_name} | 1325.AI`;
  const ogImage = b.banner_url || b.logo_url || `${BASE_URL}/mmm-logo.png`;
  const jsonLd = buildJsonLd(b, canonical, description);

  // Block of SEO tags injected right before </head>. These override the
  // homepage defaults inherited from index.html.
  const seoBlock = `
    <!-- Pre-rendered SEO tags for /business/${esc(slug)} -->
    <meta name="prerendered" content="business" />
    <link rel="canonical" href="${esc(canonical)}" />
    <meta property="og:title" content="${esc(pageTitle)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:url" content="${esc(canonical)}" />
    <meta property="og:type" content="profile" />
    <meta property="og:image" content="${esc(ogImage)}" />
    <meta name="twitter:title" content="${esc(pageTitle)}" />
    <meta name="twitter:description" content="${esc(description)}" />
    <meta name="twitter:image" content="${esc(ogImage)}" />
    <script type="application/ld+json">${jsonLd}</script>
  `;

  // Replace homepage title.
  let html = template.replace(
    /<title>[^<]*<\/title>/,
    `<title>${esc(pageTitle)}</title>`,
  );
  // Replace homepage meta description.
  html = html.replace(
    /<meta\s+name=["']description["']\s+content=["'][^"']*["']\s*\/?>/,
    `<meta name="description" content="${esc(description)}">`,
  );
  // Remove the homepage canonical so the per-page one above is the only one.
  html = html.replace(/<link\s+rel=["']canonical["'][^>]*>/i, "");
  // Strip the homepage <noscript> block — it carries a homepage-specific
  // <h1> that would compete with this page's H1 in Google's view.
  html = html.replace(/<noscript>[\s\S]*?<\/noscript>/i, "");
  // Inject SEO block before </head>.
  html = html.replace(/<\/head>/i, `${seoBlock}\n  </head>`);
  // Pre-render the article into #root.
  html = html.replace(
    /<div id="root">[\s\S]*?<\/div>/,
    `<div id="root">${renderArticle(b, description)}</div>`,
  );
  return html;
}


async function main() {
  const start = Date.now();
  const publicDir = resolve("public");
  const outDir = resolve(publicDir, "business");
  const templatePath = resolve("index.html");

  if (!existsSync(templatePath)) {
    console.warn("⚠ prerender-businesses: index.html missing, skipping.");
    return;
  }
  const template = readFileSync(templatePath, "utf8");

  let businesses: Business[];
  try {
    businesses = await fetchBusinessPool();
  } catch (e) {
    console.warn(`⚠ prerender-businesses: fetch failed (${(e as Error).message}). Skipping.`);
    return;
  }

  if (!businesses.length) {
    console.warn("⚠ prerender-businesses: no businesses returned. Skipping.");
    return;
  }

  // Quality-score, sort, take top N.
  const scored = businesses
    .map((b) => ({ b, score: qualityScore(b) }))
    .sort((a, z) => z.score - a.score)
    .slice(0, TARGET_COUNT)
    .map((s) => s.b);

  // Wipe stale prerendered pages so deleted/unlisted businesses don't linger.
  if (existsSync(outDir)) {
    rmSync(outDir, { recursive: true, force: true });
  }
  mkdirSync(outDir, { recursive: true });

  let written = 0;
  let skipped = 0;
  for (const b of scored) {
    const slug = (b.slug || b.id || "").trim();
    if (!slug || !b.business_name) {
      skipped++;
      continue;
    }
    // Conservative path safety — only allow URL-safe slug chars.
    if (!/^[A-Za-z0-9_\-]+$/.test(slug)) {
      skipped++;
      continue;
    }
    const dir = resolve(outDir, slug);
    mkdirSync(dir, { recursive: true });
    try {
      const html = buildHtml(template, b);
      writeFileSync(resolve(dir, "index.html"), html, "utf8");
      written++;
    } catch (e) {
      console.warn(`⚠ skip ${slug}: ${(e as Error).message}`);
      skipped++;
    }
  }

  const seconds = ((Date.now() - start) / 1000).toFixed(1);
  console.log(
    `✓ prerender-businesses — wrote ${written} pages (skipped ${skipped}) in ${seconds}s. Pool ${businesses.length}, target ${TARGET_COUNT}.`,
  );
}

main().catch((e) => {
  // Never fail the build — site can ship without fresh prerenders.
  console.warn("⚠ prerender-businesses crashed (build continues):", (e as Error).message);
});
