// Sitemap of all city, category, and city+category landing pages for SEO.
// Returns XML at: /functions/v1/landing-sitemap
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const BASE_URL = "https://1325.ai";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-csrf-token",
};

// SEO category groups — must mirror src/lib/seo/category-groups.ts
const CATEGORY_GROUPS: { slug: string; categories: string[] }[] = [
  { slug: "restaurants",       categories: ["Restaurant","Soul Food Restaurant","Caribbean Restaurant","Jamaican Restaurant","Barbecue Restaurant","African Restaurant","Soul Food Catering"] },
  { slug: "hair-salons",       categories: ["Hair Salon","Natural Hair Salon","African Hair Braiding Salon"] },
  { slug: "barbershops",       categories: ["Barbershop"] },
  { slug: "nail-salons",       categories: ["Nail Salon"] },
  { slug: "spas",              categories: ["Day Spa","Yoga Studio"] },
  { slug: "coffee-shops",      categories: ["Coffee Shop","Juice Bar"] },
  { slug: "contractors",       categories: ["General Contractor","Roofing Contractor","Electrical Contractor"] },
  { slug: "auto-services",     categories: ["Auto Repair Shop","Mobile Auto Detailing"] },
  { slug: "boutiques",         categories: ["Women's Clothing Boutique"] },
  { slug: "creative-studios",  categories: ["Recording Studio","Music Recording Studio","Dance Studio","Tattoo Studio"] },
  { slug: "real-estate",       categories: ["Real Estate Brokerage"] },
  { slug: "florists",          categories: ["Florist"] },
  { slug: "mental-health",     categories: ["Mental Health Counseling Practice"] },
];

function escapeXml(s: string) {
  return s.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c]!));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const [cities, cats] = await Promise.all([
      supabase.rpc("list_landing_cities", { p_min_count: 5 }),
      supabase.rpc("list_landing_categories", { p_min_count: 5 }),
    ]);

    const urls: string[] = [
      `  <url><loc>${BASE_URL}/black-owned</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`,
    ];

    const cityRows = (cities.data || []) as Array<{ slug: string }>;
    const catRows = (cats.data || []) as Array<{ slug: string }>;

    for (const c of cityRows) {
      urls.push(
        `  <url><loc>${BASE_URL}/black-owned/city/${escapeXml(c.slug)}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`,
      );
    }
    for (const c of catRows) {
      urls.push(
        `  <url><loc>${BASE_URL}/black-owned/category/${escapeXml(c.slug)}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`,
      );
    }

    // City × category combo pages — only emit URLs that have ≥1 matching business
    // to avoid wasting crawl budget on empty pages.
    for (const city of cityRows) {
      for (const group of CATEGORY_GROUPS) {
        const { data: check } = await supabase.rpc(
          "get_businesses_by_city_and_categories",
          {
            p_city_slug: city.slug,
            p_categories: group.categories,
            p_limit: 1,
            p_offset: 0,
          },
        );
        const total = (check && check[0]?.total_count) ? Number(check[0].total_count) : 0;
        if (total > 0) {
          urls.push(
            `  <url><loc>${BASE_URL}/black-owned/in/${escapeXml(city.slug)}/${group.slug}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`,
          );
        }
      }
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;

    return new Response(xml, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (e) {
    return new Response(`<!-- error: ${(e as Error).message} -->`, {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/xml" },
    });
  }
});
