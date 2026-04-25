/**
 * Track-only visit logger.
 * Records a customer-reported bill (no money moves) and optionally
 * marks it confirmed when the cashier enters the business PIN.
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const Body = z.object({
  businessId: z.string().uuid(),
  qrCodeId: z.string().uuid().optional(),
  qrScanId: z.string().uuid().optional(),
  reportedAmount: z.number().min(0).max(99999.99),
  discountPercentage: z.number().min(0).max(100).optional().default(0),
  cashierPin: z.string().regex(/^\d{4,6}$/).optional(),
  notes: z.string().max(500).optional(),
});

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") as any ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const auth = req.headers.get("Authorization");
    if (!auth) throw new Error("No authorization header");
    const { data: { user }, error: authErr } = await supabase.auth.getUser(auth.replace("Bearer ", ""));
    if (authErr || !user) throw new Error("Unauthorized");

    const parsed = Body.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid request", details: parsed.error.errors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const { businessId, qrCodeId, qrScanId, reportedAmount, discountPercentage, cashierPin, notes } = parsed.data;

    let confirmed = false;
    if (cashierPin) {
      const { data: ok, error: pinErr } = await supabase.rpc("verify_cashier_pin", {
        p_business_id: businessId,
        p_pin: cashierPin,
      });
      if (pinErr) console.error("PIN verify error:", pinErr);
      confirmed = ok === true;
      if (!confirmed) {
        return new Response(
          JSON.stringify({ success: false, error: "invalid_pin" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    const { data: visit, error: insertErr } = await supabase
      .from("tracked_visits")
      .insert({
        business_id: businessId,
        customer_id: user.id,
        qr_code_id: qrCodeId,
        qr_scan_id: qrScanId,
        reported_amount: reportedAmount,
        discount_percentage: discountPercentage ?? 0,
        status: confirmed ? "confirmed" : "pending",
        confirmed_at: confirmed ? new Date().toISOString() : null,
        confirmed_by_method: confirmed ? "cashier_pin" : null,
        notes: notes ?? null,
      })
      .select()
      .single();

    if (insertErr) {
      console.error("Insert visit error:", insertErr);
      throw new Error(insertErr.message);
    }

    return new Response(
      JSON.stringify({ success: true, visit, confirmed }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (e) {
    console.error("log-visit error:", e);
    return new Response(
      JSON.stringify({ success: false, error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
