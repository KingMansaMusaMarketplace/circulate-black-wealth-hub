import { createClient } from "npm:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-csrf-token",
};
const PLACEHOLDER = "contact@mansamusamarketplace.com";
const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,24}/gi;
const BAD_DOMAINS = [
  "wix.com", "wixpress.com", "squarespace.com", "sentry.io", "sentry-next.wixpress.com",
  "example.com", "domain.com", "godaddy.com", "wordpress.com", "shopify.com",
  "mansamusamarketplace.com", "1325.ai", "email.com", "yourdomain.com", "sentry.wixpress.com",
];
const BAD_LOCAL = /^(no-?reply|donotreply|do-not-reply|user|name|email|your|example|test)$/i;
const BAD_EXT = /\.(png|jpe?g|gif|svg|webp|css|js|ico|avif)$/i;

function clean(e: string) {
  e = e.toLowerCase().replace(/^[^a-z0-9]+/, "").replace(/[.]+$/, "");
  const [local, dom] = e.split("@");
  if (!local || !dom) return null;
  if (BAD_EXT.test(e) || BAD_LOCAL.test(local)) return null;
  if (BAD_DOMAINS.some((d) => dom === d || dom.endsWith("." + d))) return null;
  if (/^[0-9a-f]{16,}$/.test(local)) return null;
  return e;
}

async function fetchText(url: string) {
  try {
    const r = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(7000),
      headers: { "User-Agent": "Mozilla/5.0 (compatible; 1325AI-DirectoryBot/1.0; +https://1325.ai)" },
    });
    if (!r.ok) return "";
    const t = (r.headers.get("content-type") || "");
    if (!t.includes("html") && !t.includes("text")) return "";
    return (await r.text()).slice(0, 600_000);
  } catch { return ""; }
}

function pick(html: string, siteHost: string) {
  const found = new Set<string>();
  for (const m of html.matchAll(/mailto:([^"'?>\s]+)/gi)) {
    const c = clean(decodeURIComponent(m[1])); if (c) found.add(c);
  }
  for (const m of html.matchAll(EMAIL_RE)) { const c = clean(m[0]); if (c) found.add(c); }
  const list = [...found];
  const host = siteHost.replace(/^www\./, "");
  return list.find((e) => e.endsWith("@" + host)) || list[0] || null;
}

async function check(website: string) {
  let url = website.trim();
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;
  let u: URL; try { u = new URL(url); } catch { return { email: null, result: "bad_url" }; }
  const home = await fetchText(u.origin);
  if (!home) return { email: null, result: "unreachable" };
  let email = pick(home, u.hostname);
  if (email) return { email, result: "found_home" };
  const link = home.match(/href=["']([^"']*contact[^"']*)["']/i)?.[1];
  const paths = link ? [new URL(link, u.origin).href] : [];
  paths.push(u.origin + "/contact", u.origin + "/contact-us");
  for (const p of [...new Set(paths)].slice(0, 2)) {
    const h = await fetchText(p);
    email = h ? pick(h, u.hostname) : null;
    if (email) return { email, result: "found_contact" };
  }
  return { email: null, result: "none" };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const json = (b: unknown, s = 200) =>
    new Response(JSON.stringify(b), { status: s, headers: { ...cors, "Content-Type": "application/json" } });
  const url = Deno.env.get("SUPABASE_URL")!;
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const admin = createClient(url, key);

  const token = (req.headers.get("Authorization") || "").replace("Bearer ", "");
  const jobTok = req.headers.get("x-job-token");
  let jobOk = false;
  if (jobTok) {
    const { data } = await admin.from("internal_job_tokens").select("token").eq("name", "find-business-emails").maybeSingle();
    jobOk = !!data && data.token === jobTok;
  }
  if (token !== key && !jobOk) {
    const { data: u } = await admin.auth.getUser(token);
    if (!u?.user) return json({ error: "unauthorized" }, 401);
    const { data: ok } = await admin.rpc("has_role", { _user_id: u.user.id, _role: "admin" });
    if (!ok) return json({ error: "forbidden" }, 403);
  }

  const body = await req.json().catch(() => ({}));
  if (body.stats) {
    const [{ count: checked }, { count: found }, { count: left }] = await Promise.all([
      admin.from("businesses_private").select("business_id", { count: "exact", head: true }).not("email_checked_at", "is", null),
      admin.from("businesses_private").select("business_id", { count: "exact", head: true }).eq("email_source", "found on website"),
      admin.from("businesses_private").select("business_id", { count: "exact", head: true }).eq("email", PLACEHOLDER).is("email_checked_at", null),
    ]);
    return json({ checked, found, left });
  }
  const limit = Math.min(Math.max(Number(body.limit) || 40, 1), 60);

  const { data: rows, error } = await admin
    .from("businesses_private")
    .select("business_id, businesses!inner(website, claim_status)")
    .eq("email", PLACEHOLDER)
    .is("email_checked_at", null)
    .not("businesses.website", "is", null)
    .neq("businesses.website", "")
    .limit(limit);
  if (error) return json({ error: error.message }, 500);

  let found = 0;
  const results = await Promise.all((rows || []).map(async (r: any) => {
    const { email, result } = await check(r.businesses.website);
    const upd: Record<string, unknown> = { email_checked_at: new Date().toISOString(), email_check_result: result };
    if (email) { upd.email = email; upd.email_source = "found on website"; found++; }
    await admin.from("businesses_private").update(upd).eq("business_id", r.business_id).eq("email", PLACEHOLDER);
    return result;
  }));
  const tally: Record<string, number> = {};
  results.forEach((x) => (tally[x] = (tally[x] || 0) + 1));
  return json({ checked: results.length, found, tally });
});
