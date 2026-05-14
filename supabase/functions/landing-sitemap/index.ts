// Sitemap of all city + category landing pages for SEO.
// Returns XML at: /functions/v1/landing-sitemap
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const BASE_URL = "https://1325.ai";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-csrf-token",
};

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

    for (const c of (cities.data || []) as Array<{ slug: string }>) {
      urls.push(
        `  <url><loc>${BASE_URL}/black-owned/city/${escapeXml(c.slug)}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`,
      );
    }
    for (const c of (cats.data || []) as Array<{ slug: string }>) {
      urls.push(
        `  <url><loc>${BASE_URL}/black-owned/category/${escapeXml(c.slug)}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`,
      );
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
