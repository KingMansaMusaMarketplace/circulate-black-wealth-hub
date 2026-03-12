import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

type BusinessRow = {
  id: string;
  name: string;
  website: string | null;
  logo_url: string | null;
  banner_url: string | null;
};

const GENERIC_ASSET_PATTERNS = [
  "wixstatic.com",
  "squarespace-cdn.com",
  "godaddy",
  "wordpress.com",
  "gravatar.com",
  "clearbit.com",
  "favicon",
  "icon-",
  "apple-touch-icon",
  "android-chrome",
  "mstile",
  "site.webmanifest",
];

const INVALID_IMAGE_PATTERNS = ["${", "{{", "/images/businesses/", "placeholder", "default-banner", "default-logo"];

const WEBSITE_TIMEOUT_MS = 12000;

const normalizeWebsite = (website: string) => {
  const trimmed = website.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  return `https://${trimmed}`;
};

const toAbsoluteUrl = (rawUrl: string, baseUrl: string): string => {
  try {
    return new URL(rawUrl, baseUrl).toString();
  } catch {
    return "";
  }
};

const isValidImageUrl = (url: string) => {
  if (!url) return false;
  const lc = url.toLowerCase();
  if (!lc.startsWith("http://") && !lc.startsWith("https://")) return false;
  if (INVALID_IMAGE_PATTERNS.some((p) => lc.includes(p))) return false;
  return true;
};

const isGenericAsset = (url: string) => {
  const lc = url.toLowerCase();
  return GENERIC_ASSET_PATTERNS.some((pattern) => lc.includes(pattern));
};

const needsField = (value: string | null) => {
  const normalized = (value ?? "").trim().toLowerCase();
  if (!normalized) return true;
  return INVALID_IMAGE_PATTERNS.some((p) => normalized.includes(p));
};

const findMetaImage = (html: string, keys: string[], baseUrl: string) => {
  for (const key of keys) {
    const pattern = new RegExp(
      `<meta[^>]+(?:property|name)=["']${key}["'][^>]+content=["']([^"']+)["'][^>]*>|<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${key}["'][^>]*>`,
      "i",
    );
    const match = html.match(pattern);
    const candidate = (match?.[1] || match?.[2] || "").trim();
    if (!candidate) continue;
    const absolute = toAbsoluteUrl(candidate, baseUrl);
    if (isValidImageUrl(absolute) && !isGenericAsset(absolute)) return absolute;
  }
  return "";
};

const findLogoImage = (html: string, baseUrl: string) => {
  const logoImgRegex = /<img[^>]*?(?:class|alt|id)=["'][^"']*(logo|brand)[^"']*["'][^>]*?src=["']([^"']+)["'][^>]*>|<img[^>]*?src=["']([^"']+)["'][^>]*?(?:class|alt|id)=["'][^"']*(logo|brand)[^"']*["'][^>]*>/gi;
  let imgMatch: RegExpExecArray | null = null;

  while ((imgMatch = logoImgRegex.exec(html)) !== null) {
    const src = (imgMatch[2] || imgMatch[3] || "").trim();
    const absolute = toAbsoluteUrl(src, baseUrl);
    if (isValidImageUrl(absolute) && !isGenericAsset(absolute)) return absolute;
  }

  const linkLogoRegex = /<link[^>]*?rel=["'][^"']*(?:icon|apple-touch-icon)[^"']*["'][^>]*?href=["']([^"']+)["'][^>]*>|<link[^>]*?href=["']([^"']+)["'][^>]*?rel=["'][^"']*(?:icon|apple-touch-icon)[^"']*["'][^>]*>/gi;
  let linkMatch: RegExpExecArray | null = null;

  while ((linkMatch = linkLogoRegex.exec(html)) !== null) {
    const href = (linkMatch[1] || linkMatch[2] || "").trim();
    const absolute = toAbsoluteUrl(href, baseUrl);
    if (isValidImageUrl(absolute) && !isGenericAsset(absolute)) return absolute;
  }

  return "";
};

const fetchWebsiteHtml = async (url: string) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), WEBSITE_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; BusinessBrandingBot/1.0; +https://1325.ai)",
        "Accept": "text/html,application/xhtml+xml",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch website [${response.status}]`);
    }

    const html = await response.text();
    return { html, finalUrl: response.url || url };
  } finally {
    clearTimeout(timeout);
  }
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ success: false, error: "Authentication required" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const token = authHeader.replace("Bearer ", "");
    // Allow service role key OR anon key (internal tooling) to bypass user auth
    const isServiceRole = token === serviceRoleKey || token === anonKey;

    if (!isServiceRole) {
      const supabaseAuth = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_ANON_KEY") ?? "",
        { global: { headers: { Authorization: authHeader } } },
      );

      const {
        data: { user },
        error: userError,
      } = await supabaseAuth.auth.getUser();

      if (userError || !user) {
        return new Response(JSON.stringify({ success: false, error: "Invalid authentication" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const supabaseAdmin = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        serviceRoleKey,
      );

      let isAdmin = false;
      const { data: hasRoleResult } = await supabaseAdmin.rpc("has_role", {
        _user_id: user.id,
        _role: "admin",
      });
      if (hasRoleResult === true) {
        isAdmin = true;
      } else {
        const { data: roleRows } = await supabaseAdmin
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "admin")
          .limit(1);
        isAdmin = !!roleRows?.length;
      }

      if (!isAdmin) {
        return new Response(JSON.stringify({ success: false, error: "Admin access required" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const supabaseAdminClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      serviceRoleKey,
    );

    const body = await req.json().catch(() => ({}));
    const batchSize = Math.min(Math.max(Number(body.batchSize) || 12, 1), 50);
    const offset = Math.max(Number(body.offset) || 0, 0);
    const ids: string[] | null = Array.isArray(body.ids) && body.ids.length ? body.ids : null;

    let query = supabaseAdminClient
      .from("businesses")
      .select("id, name, website, logo_url, banner_url")
      .not("website", "is", null)
      .neq("website", "")
      .or("logo_url.is.null,banner_url.is.null,logo_url.eq.,banner_url.eq.,logo_url.ilike.%placeholder%,banner_url.ilike.%placeholder%,logo_url.ilike.%default%,banner_url.ilike.%default%,logo_url.ilike.%unsplash%,banner_url.ilike.%unsplash%")
      .order("updated_at", { ascending: true, nullsFirst: true });

    if (ids) {
      query = query.in("id", ids);
    } else {
      query = query.range(offset, offset + batchSize - 1);
    }

    const { data: businesses, error: fetchError } = await query;

    if (fetchError) {
      return new Response(JSON.stringify({ success: false, error: `Failed to fetch businesses: ${fetchError.message}` }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!businesses?.length) {
      return new Response(JSON.stringify({ success: true, summary: { total: 0, updated: 0, failed: 0, skipped: 0, nextOffset: offset + batchSize }, results: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const results: Array<{ id: string; name: string; status: string; logoUrl?: string; bannerUrl?: string; error?: string }> = [];

    for (const biz of businesses as BusinessRow[]) {
      try {
        const website = normalizeWebsite(biz.website || "");
        if (!website) {
          results.push({ id: biz.id, name: biz.name, status: "skipped_no_website" });
          continue;
        }

        const needsLogo = needsField(biz.logo_url);
        const needsBanner = needsField(biz.banner_url);

        if (!needsLogo && !needsBanner) {
          results.push({ id: biz.id, name: biz.name, status: "skipped_complete" });
          continue;
        }

        const { html, finalUrl } = await fetchWebsiteHtml(website);

        const logoCandidate = needsLogo
          ? findLogoImage(html, finalUrl) || findMetaImage(html, ["og:logo", "twitter:image"], finalUrl)
          : "";

        const bannerCandidate = needsBanner
          ? findMetaImage(html, ["og:image", "twitter:image", "msapplication-TileImage"], finalUrl)
          : "";

        const updates: Record<string, string> = {
          updated_at: new Date().toISOString(),
        };

        if (needsLogo && logoCandidate) {
          updates.logo_url = logoCandidate;
        }

        if (needsBanner && bannerCandidate) {
          updates.banner_url = bannerCandidate;
        }

        if (Object.keys(updates).length === 1) {
          results.push({ id: biz.id, name: biz.name, status: "no_images_found" });
          continue;
        }

        const { error: updateError } = await supabaseAdminClient
          .from("businesses")
          .update(updates)
          .eq("id", biz.id);

        if (updateError) {
          results.push({ id: biz.id, name: biz.name, status: "update_failed", error: updateError.message });
          continue;
        }

        results.push({
          id: biz.id,
          name: biz.name,
          status: "updated",
          logoUrl: updates.logo_url,
          bannerUrl: updates.banner_url,
        });

        await new Promise((resolve) => setTimeout(resolve, 250));
      } catch (error) {
        results.push({
          id: biz.id,
          name: biz.name,
          status: "error",
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    const updated = results.filter((r) => r.status === "updated").length;
    const failed = results.filter((r) => ["error", "update_failed"].includes(r.status)).length;
    const skipped = results.length - updated - failed;

    return new Response(
      JSON.stringify({
        success: true,
        summary: {
          total: businesses.length,
          updated,
          failed,
          skipped,
          nextOffset: offset + batchSize,
        },
        results,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("bulk-refresh-business-branding error", error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
