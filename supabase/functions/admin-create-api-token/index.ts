// admin-create-api-token — generates a random token, returns it once, stores only the SHA-256 hash.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-csrf-token",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const sha256Hex = async (s: string) => {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

    const auth = req.headers.get("Authorization") ?? "";
    if (!auth.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Missing auth" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: auth } },
    });
    const { data: u } = await userClient.auth.getUser();
    if (!u.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const { data: roleRow } = await admin
      .from("user_roles").select("role")
      .eq("user_id", u.user.id).eq("role", "admin").maybeSingle();
    if (!roleRow) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const name = (body.name || "").toString().trim().slice(0, 100);
    const description = (body.description || "").toString().slice(0, 500) || null;
    const scopes: string[] = Array.isArray(body.scopes)
      ? body.scopes.filter((s: unknown) => typeof s === "string").slice(0, 20)
      : [];
    const expires_in_days = Number.isFinite(body.expires_in_days) ? Math.min(Math.max(body.expires_in_days, 0), 3650) : 0;

    if (!name) {
      return new Response(JSON.stringify({ error: "name required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate token: mma_<32 random hex bytes>
    const rand = new Uint8Array(32);
    crypto.getRandomValues(rand);
    const raw = "mma_" + Array.from(rand).map((b) => b.toString(16).padStart(2, "0")).join("");
    const token_hash = await sha256Hex(raw);
    const token_prefix = raw.slice(0, 12); // mma_xxxxxxxx
    const expires_at = expires_in_days > 0
      ? new Date(Date.now() + expires_in_days * 86400000).toISOString()
      : null;

    const { data, error } = await admin.from("admin_api_tokens").insert({
      name, description, scopes, token_hash, token_prefix,
      expires_at, created_by: u.user.id,
    }).select("id, name, token_prefix, scopes, expires_at, created_at").single();
    if (error) throw error;

    return new Response(JSON.stringify({ token: raw, record: data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("admin-create-api-token error", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
