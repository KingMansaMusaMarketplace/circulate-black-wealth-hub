// Checks whether discovered-business website addresses exist (DNS lookup).
// Tags b2b_external_leads.website_status = 'ok' | 'not_found'.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-csrf-token",
};

const hostOf = (url: string) => {
  try {
    const u = new URL(/^https?:\/\//i.test(url) ? url : `https://${url}`);
    return u.hostname.toLowerCase();
  } catch { return null; }
};

async function resolves(host: string): Promise<boolean | null> {
  const tryType = async (h: string, t: "A" | "AAAA" | "CNAME") => {
    try { const r = await Deno.resolveDns(h, t); return r.length > 0; }
    catch (e) {
      const m = String((e as Error)?.name || e);
      if (m.includes("NotFound")) return false;
      return null; // timeout / unknown
    }
  };
  const bare = host.replace(/^www\./, "");
  let unknown = false;
  for (const h of [host, bare, `www.${bare}`]) {
    for (const t of ["A", "CNAME", "AAAA"] as const) {
      const r = await tryType(h, t);
      if (r === true) return true;
      if (r === null) unknown = true;
    }
  }
  return unknown ? null : false;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  const token = (req.headers.get("Authorization") || "").replace("Bearer ", "");
  if (token !== Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")) {
    const { data: u } = await admin.auth.getUser(token);
    if (!u?.user) return new Response("Unauthorized", { status: 401, headers: cors });
    const { data: isAdmin } = await admin.rpc("has_role", { _user_id: u.user.id, _role: "admin" });
    if (!isAdmin) return new Response("Forbidden", { status: 403, headers: cors });
  }

  const body = await req.json().catch(() => ({}));
  const limit = Math.min(Number(body.limit) || 300, 600);

  const { data: leads, error } = await admin
    .from("b2b_external_leads")
    .select("id, website_url")
    .is("website_checked_at", null)
    .not("website_url", "is", null)
    .limit(limit);
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: cors });

  const cache = new Map<string, boolean | null>();
  const results: { id: string; status: string }[] = [];
  const queue = [...(leads || [])];
  const worker = async () => {
    while (queue.length) {
      const l = queue.shift()!;
      const h = hostOf(l.website_url);
      let ok: boolean | null = false;
      if (h) {
        if (!cache.has(h)) cache.set(h, await resolves(h));
        ok = cache.get(h)!;
      }
      results.push({ id: l.id, status: ok === true ? "ok" : ok === false ? "not_found" : "unknown" });
    }
  };
  await Promise.all(Array.from({ length: 25 }, worker));

  const now = new Date().toISOString();
  const byStatus: Record<string, string[]> = {};
  for (const r of results) (byStatus[r.status] ||= []).push(r.id);
  for (const [status, ids] of Object.entries(byStatus)) {
    for (let i = 0; i < ids.length; i += 200) {
      await admin.from("b2b_external_leads")
        .update({ website_status: status === "unknown" ? null : status, website_checked_at: now })
        .in("id", ids.slice(i, i + 200));
    }
  }
  const { count } = await admin.from("b2b_external_leads").select("id", { count: "exact", head: true })
    .is("website_checked_at", null).not("website_url", "is", null);

  return new Response(JSON.stringify({
    checked: results.length,
    ok: byStatus.ok?.length || 0,
    not_found: byStatus.not_found?.length || 0,
    unknown: byStatus.unknown?.length || 0,
    remaining: count,
  }), { headers: { ...cors, "Content-Type": "application/json" } });
});
