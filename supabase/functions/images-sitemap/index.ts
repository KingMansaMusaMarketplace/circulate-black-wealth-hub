// Google Image Sitemap — exposes business logos & banners for Google Images indexing.
// Returns XML at: /functions/v1/images-sitemap (proxied via /images-sitemap.xml)
// Spec: https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const BASE_URL = "https://1325.ai";
const PAGE_SIZE = 1000;
// Google allows max 1,000 images per <url> and recommends sitemaps under 50MB / 50k URLs.
const MAX_URLS = 45000;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-csrf-token",
};

function escapeXml(s: string) {
  return s.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c]!));
}

function isHttpUrl(u: string | null | undefined): u is string {
  return !!u && /^https?:\/\//i.test(u);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    let from = 0;
    const urls: string[] = [];
    outer: while (true) {
      const { data, error } = await supabase
        .from("businesses")
        .select("id, slug, name, business_name, city, state, category, logo_url, banner_url, updated_at")
        .eq("listing_status", "live")
        .or("logo_url.not.is.null,banner_url.not.is.null")
        .order("id", { ascending: true })
        .range(from, from + PAGE_SIZE - 1);
      if (error) throw error;
      if (!data || data.length === 0) break;

      for (const row of data) {
        const images: string[] = [];
        const name = (row.name || row.business_name || "Black-owned business").toString();
        const locationBits = [row.city, row.state].filter(Boolean).join(", ");
        const captionBase = locationBits
          ? `${name} — Black-owned ${row.category || "business"} in ${locationBits}`
          : `${name} — Black-owned ${row.category || "business"}`;

        if (isHttpUrl(row.banner_url)) {
          images.push(
            `    <image:image><image:loc>${escapeXml(row.banner_url)}</image:loc><image:title>${escapeXml(name)}</image:title><image:caption>${escapeXml(captionBase)}</image:caption></image:image>`,
          );
        }
        if (isHttpUrl(row.logo_url)) {
          images.push(
            `    <image:image><image:loc>${escapeXml(row.logo_url)}</image:loc><image:title>${escapeXml(`${name} logo`)}</image:title><image:caption>${escapeXml(`${name} logo — Black-owned ${row.category || "business"}`)}</image:caption></image:image>`,
          );
        }
        if (images.length === 0) continue;

        const path = row.slug || row.id;
        const lastmod = row.updated_at ? new Date(row.updated_at).toISOString().slice(0, 10) : "";
        urls.push(
          `  <url>\n    <loc>${BASE_URL}/business/${escapeXml(path)}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""}\n${images.join("\n")}\n  </url>`,
        );

        if (urls.length >= MAX_URLS) break outer;
      }
      if (data.length < PAGE_SIZE) break;
      from += PAGE_SIZE;
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls.join("\n")}\n</urlset>`;

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
