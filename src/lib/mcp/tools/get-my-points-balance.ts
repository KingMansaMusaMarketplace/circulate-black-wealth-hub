import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { createClient } from "@supabase/supabase-js";

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
  name: "get_my_points_balance",
  title: "Get my loyalty points",
  description:
    "Return the signed-in 1325.AI user's total loyalty points and per-business balances. Requires the caller to be signed in.",
  inputSchema: {},
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  handler: async (_input, ctx) => {
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
      .from("loyalty_points")
      .select("business_id, points, businesses(business_name)")
      .eq("customer_id", ctx.getUserId());

    if (error) {
      return {
        content: [
          {
            type: "text",
            text: `Could not read your points: ${error.message}`,
          },
        ],
        isError: true,
      };
    }

    const rows = data ?? [];
    const total = rows.reduce((sum, r: any) => sum + (r.points ?? 0), 0);
    const perBusiness = rows.map((r: any) => ({
      business_id: r.business_id,
      business_name: r.businesses?.business_name ?? null,
      points: r.points,
    }));

    return {
      content: [
        {
          type: "text",
          text:
            `You have ${total} total loyalty points across ${rows.length} business(es).` +
            (perBusiness.length
              ? `\n\n${perBusiness
                  .map(
                    (b) =>
                      `• ${b.business_name ?? b.business_id}: ${b.points} pts`,
                  )
                  .join("\n")}`
              : ""),
        },
      ],
      structuredContent: { total_points: total, per_business: perBusiness },
    };
  },
});
