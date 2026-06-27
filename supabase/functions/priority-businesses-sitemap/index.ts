// Priority sitemap of the top 500 highest-quality live businesses for SEO.
// Signals to Google these are the most important business pages to crawl first.
// Returns XML at: /functions/v1/priority-businesses-sitemap
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const BASE_URL = "https://1325.ai";
const TOP_N = 500;

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

    // Rank: verified first, then by review_count, then average_rating.
    const { data, error } = await supabase
      .from("businesses")
      .select("id, slug, updated_at, is_verified, review_count, average_rating")
      .eq("listing_status", "live")
      .order("is_verified", { ascending: false })
      .order("review_count", { ascending: false, nullsFirst: false })
      .order("average_rating", { ascending: false, nullsFirst: false })
      .limit(TOP_N);

    if (error) throw error;

    const urls = (data || []).map((row) => {
      const lastmod = row.updated_at ? new Date(row.updated_at).toISOString().slice(0, 10) : "";
      const path = row.slug || row.id;
      return `  <url><loc>${BASE_URL}/business/${escapeXml(path)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}<changefreq>weekly</changefreq><priority>1.0</priority></url>`;
    });

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
