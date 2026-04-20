import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Admin-only function to fetch a PDF from a public URL and store it
// in the private investor-materials bucket. Used to seed the bucket.
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace("Bearer ", "").trim();
    if (!token) {
      return json({ error: "Unauthorized" }, 401);
    }

    const supabaseUser = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: `Bearer ${token}` } } },
    );

    const { data: userData, error: userErr } = await supabaseUser.auth.getUser();
    if (userErr || !userData.user) return json({ error: "Unauthorized" }, 401);

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Verify admin role server-side
    const { data: roleData } = await admin.rpc("has_role", {
      _user_id: userData.user.id,
      _role: "admin",
    });
    if (!roleData) return json({ error: "Admin access required" }, 403);

    const { sourceUrl, filename } = (await req.json()) as {
      sourceUrl?: string;
      filename?: string;
    };

    if (!sourceUrl || !filename) {
      return json({ error: "sourceUrl and filename required" }, 400);
    }

    // Allow only known filenames
    const allowed = new Set([
      "1325AI_Complete_Platform_Manual_v12.pdf",
      "1325AI_Investor_NDA_v3.pdf",
    ]);
    if (!allowed.has(filename)) {
      return json({ error: "Filename not allowed" }, 400);
    }

    const res = await fetch(sourceUrl);
    if (!res.ok) return json({ error: `Source fetch failed: ${res.status}` }, 502);
    const bytes = new Uint8Array(await res.arrayBuffer());

    const { error: upErr } = await admin.storage
      .from("investor-materials")
      .upload(filename, bytes, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (upErr) {
      console.error("upload error", upErr);
      return json({ error: upErr.message }, 500);
    }

    return json({ ok: true, filename, size: bytes.length });
  } catch (e) {
    console.error("admin-upload-investor-doc error", e);
    return json({ error: "Server error" }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
