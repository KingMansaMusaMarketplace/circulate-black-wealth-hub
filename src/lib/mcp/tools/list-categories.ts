/// <reference path="../deno.d.ts" />
import { defineTool } from "@lovable.dev/mcp-js";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

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
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  handler: async ({ city, state, limit }) => {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ??
        Deno.env.get("SUPABASE_ANON_KEY")!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );

    let q: any = supabase.from("businesses").select("category").limit(5000);
    if (city) q = q.ilike("city", `%${city}%`);
    if (state) q = q.ilike("state", `%${state}%`);

    const { data, error } = await q;
    if (error) {
      return {
        content: [{ type: "text", text: `Category lookup failed: ${error.message}` }],
        isError: true,
      };
    }

    const counts = new Map<string, number>();
    for (const row of data ?? []) {
      const c = (row.category ?? "").trim();
      if (!c) continue;
      counts.set(c, (counts.get(c) ?? 0) + 1);
    }

    const categories = [...counts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit ?? 30);

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
