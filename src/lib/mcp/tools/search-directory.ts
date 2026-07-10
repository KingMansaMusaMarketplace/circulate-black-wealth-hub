/// <reference path="../deno.d.ts" />
import { defineTool } from "@lovable.dev/mcp-js";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

export default defineTool({
  name: "search_directory",
  title: "Search 1325.AI directory",
  description:
    "Search the 1325.AI community business directory. Filter by keyword, category, or city. Returns up to 20 matching businesses with name, category, city, and short description.",
  inputSchema: {
    query: z
      .string()
      .trim()
      .max(200)
      .optional()
      .describe("Keyword to match in business name or description."),
    category: z
      .string()
      .trim()
      .max(100)
      .optional()
      .describe("Business category, e.g. 'restaurant', 'salon', 'retail'."),
    city: z
      .string()
      .trim()
      .max(100)
      .optional()
      .describe("City name to filter by."),
    limit: z
      .number()
      .int()
      .min(1)
      .max(20)
      .optional()
      .describe("Max results to return (1-20). Defaults to 10."),
  },
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  handler: async ({ query, category, city, limit }) => {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ??
        Deno.env.get("SUPABASE_ANON_KEY")!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );

    let q = supabase
      .from("businesses")
      .select(
        "id, business_name, category, city, state, description, logo_url, banner_url, website",
      )
      .limit(limit ?? 10);

    if (query) {
      q = q.or(
        `business_name.ilike.%${query}%,description.ilike.%${query}%`,
      );
    }
    if (category) q = q.ilike("category", `%${category}%`);
    if (city) q = q.ilike("city", `%${city}%`);

    const { data, error } = await q;
    if (error) {
      return {
        content: [{ type: "text", text: `Search failed: ${error.message}` }],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: "text",
          text:
            data && data.length
              ? `Found ${data.length} business(es):\n\n${data
                  .map(
                    (b) =>
                      `• ${b.business_name}${b.category ? ` — ${b.category}` : ""}${b.city ? ` (${b.city}${b.state ? ", " + b.state : ""})` : ""}${b.description ? `\n  ${b.description.slice(0, 160)}` : ""}`,
                  )
                  .join("\n\n")}`
              : "No businesses matched your search.",
        },
      ],
      structuredContent: { businesses: data ?? [] },
    };
  },
});
