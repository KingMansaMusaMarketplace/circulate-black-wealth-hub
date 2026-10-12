// Copies the CRON_SECRET backend secret into the database vault so scheduled jobs
// read it at run time (the secret is never written into job definitions).
// Only an admin or a server-side (service role) caller may run this.
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { requireAdmin, authErrorResponse } from "../_shared/auth-guard.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-csrf-token",
};

function isServiceRole(req: Request): boolean {
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const bearer = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  return !!key && (bearer === key || req.headers.get("apikey") === key);
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (!isServiceRole(req)) {
    const auth = await requireAdmin(req, corsHeaders);
    if (!auth.authenticated) return authErrorResponse(auth, corsHeaders);
  }
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
