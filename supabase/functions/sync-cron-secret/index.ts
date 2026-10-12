// Copies the CRON_SECRET backend secret into the database vault so scheduled jobs
// read it at run time (the secret is never written into job definitions).
// Takes no input and returns nothing secret: it only copies the server's own value
// into the vault, so calling it can never change or reveal the password. Anyone
// calling it repeatedly just re-saves the same value.
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-csrf-token",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return new Response(null, { status: 405, headers: corsHeaders });
  const secret = Deno.env.get("CRON_SECRET") ?? "";
  if (secret.length < 24) {
    return new Response(JSON.stringify({ ok: false, error: "CRON_SECRET missing or too short" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { error } = await admin.rpc("sync_cron_secret", { p_secret: secret });
  if (error) {
    console.error("sync_cron_secret failed");
    return new Response(JSON.stringify({ ok: false }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  return new Response(JSON.stringify({ ok: true }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
