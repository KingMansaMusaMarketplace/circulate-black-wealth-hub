/// <reference path="../deno.d.ts" />
import { defineTool } from "@lovable.dev/mcp-js";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

export default defineTool({
  name: "get_business",
  title: "Get business details",
  description:
    "Fetch full details for one business in the 1325.AI directory by id. Returns name, category, description, address, contact info, and website.",
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
        "id, business_name, category, description, address, city, state, zip_code, phone, email, website, logo_url, hours_of_operation",
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
