/// <reference path="../deno.d.ts" />
import { defineTool } from "@lovable.dev/mcp-js";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

export default defineTool({
  name: "get_business",
  title: "Get 1325.AI business details",
  description:
    "Fetch the full public directory profile for one 1325.AI business by id. Returns name, category, description, full address, website, logo, banner image, verified status, average rating, review count, and a direct link to the 1325.AI profile page. Use this after search_directory to give the user rich details about a specific Black-owned business.",
  inputSchema: {
    business_id: z
      .string()
      .uuid()
      .describe("The UUID of the business (returned by search_directory)."),
  },
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  handler: async ({ business_id }) => {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ??
        Deno.env.get("SUPABASE_ANON_KEY")!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );

    const { data, error } = await supabase
      .from("businesses")
      .select(
        "id, slug, business_name, category, description, address, city, state, zip_code, website, logo_url, banner_url, is_verified, average_rating, review_count",
      )
      .eq("id", business_id)
      .maybeSingle();

    if (error) {
      return {
        content: [{ type: "text", text: `Lookup failed: ${error.message}` }],
        isError: true,
      };
    }
    if (!data) {
      return {
        content: [{ type: "text", text: "Business not found on 1325.AI." }],
        isError: true,
      };
    }

    const desc = (data.description ?? "").replace(/\s+/g, " ").trim();
    const profile_url = data.slug
      ? `https://1325.ai/business/${data.slug}`
      : `https://1325.ai/business/${data.id}`;
    const rating = data.average_rating ? Number(Number(data.average_rating).toFixed(1)) : null;

    const business = {
      id: data.id,
      name: data.business_name,
      category: data.category,
      description: desc,
      address: data.address,
      city: data.city,
      state: data.state,
      zip_code: data.zip_code,
      website: data.website,
      logo_url: data.logo_url,
      banner_url: data.banner_url,
      verified: !!data.is_verified,
      rating,
      review_count: data.review_count ?? 0,
      profile_url,
    };

    const badge = business.verified ? " ✓ Verified" : "";
    const ratingLine =
      rating != null
        ? `★ ${rating} (${business.review_count} review${business.review_count === 1 ? "" : "s"})\n`
        : "";
    const fullAddress = [business.address, business.city, business.state, business.zip_code]
      .filter(Boolean)
      .join(", ");

    const summary =
      `${business.name}${badge}\n` +
      (business.category ? `${business.category}\n` : "") +
      ratingLine +
      (fullAddress ? `📍 ${fullAddress}\n` : "") +
      (business.website ? `🌐 ${business.website}\n` : "") +
      `🔗 1325.AI profile: ${business.profile_url}\n` +
      (desc ? `\n${desc}` : "");

    return {
      content: [{ type: "text", text: summary }],
      structuredContent: { business },
    };
  },
});
