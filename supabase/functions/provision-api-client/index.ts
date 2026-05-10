/**
 * Admin-only: provision a new institutional API client.
 * Returns the plaintext API key ONCE. We store only the SHA-256 hash.
 */
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-csrf-token",
};

async function sha256Hex(input: string) {
  const buf = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, "0")).join("");
}

const TIER_QUOTAS: Record<string, number> = {
  starter: 1000,
  pro: 10000,
  enterprise: 100000,
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );
    const auth = req.headers.get("Authorization");
    if (!auth) throw new Error("Missing authorization");
    const { data: { user } } = await supabase.auth.getUser(auth.replace("Bearer ", ""));
    if (!user) throw new Error("Unauthorized");

    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: user.id, _role: "admin",
    });
    if (!isAdmin) throw new Error("Admin only");

    const { orgName, contactEmail, tier = "starter", companyWebsite, notes } = await req.json();
    if (!orgName || !contactEmail) throw new Error("orgName and contactEmail required");
    const quota = TIER_QUOTAS[tier] ?? 1000;

    // Find or create user for this contact email so developer_accounts.user_id is satisfied.
    // For institutional clients we just create a placeholder developer_account with current admin user_id.
    const { data: dev, error: devErr } = await supabase
      .from("developer_accounts")
      .insert({
        user_id: user.id,
        company_name: orgName,
        company_website: companyWebsite || null,
        company_description: notes || null,
        tier,
        status: "active",
        monthly_cmal_limit: quota,
      })
      .select()
      .single();
    if (devErr) throw devErr;

    // Generate plaintext key: mma_<env>_<random>
    const rand = crypto.getRandomValues(new Uint8Array(24));
    const randStr = Array.from(rand).map(b => b.toString(16).padStart(2, "0")).join("");
    const apiKey = `mma_live_${randStr}`;
    const keyHash = await sha256Hex(apiKey);
    const keyPrefix = apiKey.slice(0, 16);

    const { error: keyErr } = await supabase.from("api_keys").insert({
      developer_id: dev.id,
      key_hash: keyHash,
      key_prefix: keyPrefix,
      name: `${orgName} primary key`,
      environment: "live",
      rate_limit_per_minute: 60,
      scopes: ["circulation", "business-density", "demographics"],
    });
    if (keyErr) throw keyErr;

    return new Response(JSON.stringify({
      success: true,
      developer_id: dev.id,
      api_key: apiKey, // SHOWN ONCE
      key_prefix: keyPrefix,
      tier,
      monthly_quota: quota,
      message: "Save this api_key — it will not be shown again.",
    }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err instanceof Error ? err.message : String(err) }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
