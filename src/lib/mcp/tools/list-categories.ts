/// <reference path="../deno.d.ts" />
import { defineTool } from "@lovable.dev/mcp-js";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ANNOTATIONS: any = {
  title: "List 1325.AI business categories",
  readOnlyHint: true,
  idempotentHint: true,
  openWorldHint: false,
};

export default defineTool({
  name: "list_categories",
  title: "List 1325.AI business categories",
  description:
    "List the business categories present in the 1325.AI directory with the number of verified businesses in each. Useful for discovering valid category values to pass to search_directory. Counts can be scoped to one city or state.",
  inputSchema: {
    city: z
      .string()
      .trim()
      .max(100)
      .optional()
      .describe("Optional city to scope category counts to."),
    state: z
      .string()
      .trim()
      .max(50)
      .optional()
      .describe("Optional state (name or 2-letter code) to scope counts to."),
    limit: z
      .number()
      .int()
      .min(1)
      .max(60)
      .optional()
      .describe("Max categories to return (1-60). Defaults to 30."),
  },
  annotations: ANNOTATIONS,
  handler: async ({ city, state, limit }) => {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ??
        Deno.env.get("SUPABASE_ANON_KEY")!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );

    // Counts every approved (live) listing server-side; "Black-Owned X" folds into "X".
    const { data, error } = await (supabase as any).rpc("get_mcp_category_counts", {
      p_city: city || null,
      p_state: state || null,
      p_limit: limit ?? 30,
    });
    if (error) {
      return {
        content: [{ type: "text", text: `Category lookup failed: ${error.message}` }],
        isError: true,
      };
    }

    const categories = ((data ?? []) as Array<{ category: string; business_count: number | string }>)
      .map((r) => ({ name: String(r.category), count: Number(r.business_count) }));

    const scope = [city, state].filter(Boolean).join(", ");
    const header = categories.length
      ? `Top 1325.AI categories${scope ? ` in ${scope}` : ""}:\n\n`
      : `No categories found${scope ? ` for ${scope}` : ""} on 1325.AI.`;

    return {
      content: [
        {
          type: "text",
          text:
            header +
            categories.map((c) => `• ${c.name} — ${c.count.toLocaleString()}`).join("\n") +
            "\n\n— Source: 1325.AI · America's verified Black-owned global business directory · https://1325.ai",
        },
      ],
      structuredContent: {
        categories,
        scope: { city: city ?? null, state: state ?? null },
        source: { name: "1325.AI", url: "https://1325.ai" },
      },
    };
  },
});
