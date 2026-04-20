import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface Body {
  name?: string;
  email?: string;
  firm?: string;
  passcode?: string;
}

function isValidEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) && s.length <= 255;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = (await req.json()) as Body;
    const name = (body.name ?? "").trim();
    const email = (body.email ?? "").trim().toLowerCase();
    const firm = (body.firm ?? "").trim();
    const passcode = (body.passcode ?? "").trim();

    if (!name || name.length < 2 || name.length > 120) {
      return new Response(JSON.stringify({ error: "Name is required (2-120 chars)." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!isValidEmail(email)) {
      return new Response(JSON.stringify({ error: "Valid email is required." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (firm.length > 200) {
      return new Response(JSON.stringify({ error: "Firm name too long." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!passcode) {
      return new Response(JSON.stringify({ error: "Passcode is required." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const expected = Deno.env.get("INVESTOR_PORTAL_PASSCODE") ?? "";
    if (!expected) {
      console.error("INVESTOR_PORTAL_PASSCODE not configured");
      return new Response(JSON.stringify({ error: "Portal not configured." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("cf-connecting-ip") ??
      null;
    const ua = req.headers.get("user-agent") ?? null;

    const success = passcode === expected;

    // Always log the attempt
    await supabase.from("investor_access_log").insert({
      investor_name: name,
      investor_email: email,
      investor_firm: firm || null,
      action_type: success ? "portal_unlock_success" : "portal_unlock_failed",
      document_requested: null,
      ip_address: ip,
      user_agent: ua,
      metadata: {},
    });

    if (!success) {
      return new Response(JSON.stringify({ error: "Invalid passcode." }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Issue a short-lived session token (signed JSON, base64) so the client can
    // request documents without re-sending the passcode. Valid for 2 hours.
    const session = {
      n: name,
      e: email,
      f: firm,
      iat: Date.now(),
      exp: Date.now() + 2 * 60 * 60 * 1000,
    };
    const secret = Deno.env.get("INVESTOR_PORTAL_PASSCODE")!;
    const payload = btoa(JSON.stringify(session));
    const sig = await hmac(secret, payload);

    return new Response(
      JSON.stringify({
        ok: true,
        session: `${payload}.${sig}`,
        investor: { name, email, firm },
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("verify-investor-passcode error", e);
    return new Response(JSON.stringify({ error: "Server error." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function hmac(secret: string, data: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}
