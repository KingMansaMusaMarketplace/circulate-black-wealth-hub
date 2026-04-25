import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ALLOWED_DOCS: Record<string, string> = {
  manual: "1325AI_Complete_Platform_Manual_v12.pdf",
  nda: "1325AI_Investor_NDA_v3.pdf",
};

interface Body {
  session?: string;
  document?: string; // "manual" | "nda"
  ndaAcknowledged?: boolean;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = (await req.json()) as Body;
    const sessionToken = (body.session ?? "").trim();
    const document = (body.document ?? "").trim();
    const ndaAcknowledged = !!body.ndaAcknowledged;

    if (!sessionToken || !document || !(document in ALLOWED_DOCS)) {
      return new Response(JSON.stringify({ error: "Invalid request." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const secret = Deno.env.get("INVESTOR_PORTAL_PASSCODE") ?? "";
    if (!secret) {
      return new Response(JSON.stringify({ error: "Portal not configured." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify session
    const [payload, sig] = sessionToken.split(".");
    if (!payload || !sig) {
      return new Response(JSON.stringify({ error: "Invalid session." }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const expectedSig = await hmac(secret, payload);
    if (expectedSig !== sig) {
      return new Response(JSON.stringify({ error: "Invalid session." }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    let session: { n: string; e: string; f: string; iat: number; exp: number };
    try {
      session = JSON.parse(atob(payload));
    } catch {
      return new Response(JSON.stringify({ error: "Invalid session." }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (Date.now() > session.exp) {
      return new Response(JSON.stringify({ error: "Session expired." }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // NDA-first gate: must acknowledge NDA before manual
    if (document === "manual" && !ndaAcknowledged) {
      return new Response(
        JSON.stringify({ error: "NDA acknowledgment required before accessing the manual." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") as any!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const filename = ALLOWED_DOCS[document];
    const { data: signed, error } = await supabase.storage
      .from("investor-materials")
      .createSignedUrl(filename, 600); // 10 min

    if (error || !signed) {
      console.error("Signed URL error", error);
      return new Response(
        JSON.stringify({ error: "Document not available. Please contact the team." }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("cf-connecting-ip") ??
      null;
    const ua = req.headers.get("user-agent") ?? null;

    await supabase.from("investor_access_log").insert({
      investor_name: session.n,
      investor_email: session.e,
      investor_firm: session.f || null,
      action_type: document === "manual" ? "manual_download" : "nda_download",
      document_requested: filename,
      ip_address: ip,
      user_agent: ua,
      metadata: { ndaAcknowledged },
    });

    return new Response(JSON.stringify({ url: signed.signedUrl }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("get-investor-document-url error", e);
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
