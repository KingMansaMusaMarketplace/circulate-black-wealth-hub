/// <reference path="../deno.d.ts" />
import { defineTool } from "@lovable.dev/mcp-js";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

export default defineTool({
  name: "list_rewards",
  title: "List loyalty rewards",
  description:
    "Browse active loyalty rewards available on 1325.AI. Returns rewards sorted by lowest point cost. Optionally filter to one business.",
  inputSchema: {
    business_id: z
      .string()
      .uuid()
      .optional()
      .describe("Optional business id to filter to that business's rewards."),
    limit: z
      .number()
      .int()
      .min(1)
      .max(50)
      .optional()
      .describe("Max rewards to return (1-50). Defaults to 20."),
  },
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  handler: async ({ business_id, limit }) => {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ??
        Deno.env.get("SUPABASE_ANON_KEY")!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );

    let q = supabase
      .from("rewards")
      .select(
        "id, title, description, points_cost, business_id, is_global, image_url",
      )
      .eq("is_active", true)
      .order("points_cost", { ascending: true })
      .limit(limit ?? 20);

    if (business_id) q = q.eq("business_id", business_id);

    const { data, error } = await q;
    if (error) {
      return {
        content: [
          { type: "text", text: `Could not list rewards: ${error.message}` },
        ],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: "text",
          text:
            data && data.length
              ? `${data.length} reward(s) available:\n\n${data
                  .map(
                    (r) =>
                      `• ${r.title} — ${r.points_cost} pts${r.is_global ? " (global)" : ""}${r.description ? `\n  ${r.description.slice(0, 160)}` : ""}`,
                  )
                  .join("\n\n")}`
              : "No active rewards found.",
        },
      ],
      structuredContent: { rewards: data ?? [] },
    };
  },
});
