// Batch geocoder: fills latitude/longitude for live businesses missing coords.
// Uses Mapbox Geocoding API. Admin-only (verified via JWT + has_role check).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders as supabaseCorsHeaders } from "npm:@supabase/supabase-js@2/cors";

const corsHeaders = {
  ...supabaseCorsHeaders,
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-csrf-token",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const MAX_BATCH_SIZE = 10;
const GEOCODE_CONCURRENCY = 4;
const MAPBOX_TIMEOUT_MS = 2_500;

const MAPBOX_TOKEN = Deno.env.get("MAPBOX_PUBLIC_TOKEN");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

interface BizRow {
  id: string;
  business_name: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
}

function buildQuery(b: BizRow): string | null {
  const parts = [b.address, b.city, b.state, b.zip_code]
    .map((p) => (p ?? "").trim())
    .filter(Boolean);
  if (parts.length === 0) return null;
  return parts.join(", ");
}

async function geocodeOne(query: string): Promise<{ lat: number; lng: number } | null> {
  if (!MAPBOX_TOKEN) return null;
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    query
  )}.json?access_token=${MAPBOX_TOKEN}&limit=1`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), MAPBOX_TIMEOUT_MS);
  try {
    const r = await fetch(url, { signal: controller.signal });
    if (!r.ok) return null;
    const j = await r.json();
    const feat = j?.features?.[0];
    if (!feat?.center || feat.center.length !== 2) return null;
    const [lng, lat] = feat.center;
    if (typeof lat !== "number" || typeof lng !== "number") return null;
    return { lat, lng };
  } catch {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  worker: (item: T) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let index = 0;
  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, async () => {
      while (index < items.length) {
        const currentIndex = index++;
        results[currentIndex] = await worker(items[currentIndex]);
      }
    }),
  );
  return results;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Auth: must be an admin user
    const authHeader = req.headers.get("Authorization") ?? "";
    const userClient = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);
    const { data: isAdmin } = await admin.rpc("has_role", {
      _user_id: userData.user.id,
      _role: "admin",
    });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden — admin only" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const limit = Math.min(Number(body?.limit ?? 100), 500);

    const { data: rows, error } = await admin
      .from("businesses")
      .select("id, business_name, address, city, state, zip_code")
      .eq("listing_status", "live")
      .or("latitude.is.null,longitude.is.null")
      .limit(limit);

    if (error) throw error;

    let updated = 0;
    let skipped = 0;
    let failed = 0;

    for (const b of (rows ?? []) as BizRow[]) {
      const q = buildQuery(b);
      if (!q) {
        skipped++;
        continue;
      }
      try {
        const coords = await geocodeOne(q);
        if (!coords) {
          failed++;
          continue;
        }
        const { error: upErr } = await admin
          .from("businesses")
          .update({ latitude: coords.lat, longitude: coords.lng })
          .eq("id", b.id);
        if (upErr) failed++;
        else updated++;
        // mild rate-limit cushion
        await new Promise((r) => setTimeout(r, 50));
      } catch {
        failed++;
      }
    }

    return new Response(
      JSON.stringify({
        scanned: rows?.length ?? 0,
        updated,
        skipped_no_address: skipped,
        failed,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e?.message ?? e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
