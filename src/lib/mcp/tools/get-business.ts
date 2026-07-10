/// <reference path="../deno.d.ts" />
import { defineTool } from "@lovable.dev/mcp-js";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

export default defineTool({
  name: "get_business",
  title: "Get business details",
  description:
    "Fetch public directory details for one 1325.AI business by id. Returns the business name, category, description, location, website, logo, banner image, and hours.",
  inputSchema: {
    business_id: z
      .string()
      .uuid()
      .describe("The UUID of the business."),
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
        "id, business_name, category, description, address, city, state, zip_code, website, logo_url, banner_url, hours_of_operation",
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
        content: [{ type: "text", text: "Business not found." }],
        isError: true,
      };
    }

    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { business: data },
    };
  },
});
