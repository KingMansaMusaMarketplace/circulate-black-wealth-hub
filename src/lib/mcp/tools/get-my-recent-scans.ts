import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

function supabaseForUser(ctx: ToolContext) {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ??
      Deno.env.get("SUPABASE_ANON_KEY")!,
    {
      global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
}

export default defineTool({
  name: "get_my_recent_scans",
  title: "Get my recent QR scans",
  description:
    "Return the signed-in user's most recent 1325.AI QR code scans (business visits that earned points).",
  inputSchema: {
    limit: z
      .number()
      .int()
      .min(1)
      .max(50)
      .optional()
      .describe("Max scans to return (1-50). Defaults to 20."),
  },
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  handler: async ({ limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return {
        content: [
          {
            type: "text",
            text: "Not signed in. Reconnect this assistant to your 1325.AI account.",
          },
        ],
        isError: true,
      };
    }

    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("qr_scans")
      .select(
        "id, business_id, points_awarded, scanned_at, businesses(business_name)",
      )
      .eq("customer_id", ctx.getUserId())
      .order("scanned_at", { ascending: false })
      .limit(limit ?? 20);

    if (error) {
      return {
        content: [
          {
            type: "text",
            text: `Could not read your scans: ${error.message}`,
          },
        ],
        isError: true,
      };
    }

    const rows = data ?? [];
    return {
      content: [
        {
          type: "text",
          text: rows.length
            ? `Last ${rows.length} scan(s):\n\n${rows
                .map(
                  (r: any) =>
                    `• ${r.businesses?.business_name ?? r.business_id} — ${r.points_awarded ?? 0} pts (${new Date(r.scanned_at).toLocaleString()})`,
                )
                .join("\n")}`
            : "No QR scans yet.",
        },
      ],
      structuredContent: { scans: rows },
    };
  },
});
