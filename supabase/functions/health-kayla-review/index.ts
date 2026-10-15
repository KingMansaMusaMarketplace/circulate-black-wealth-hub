// 1325 Clinical — Kayla record review (SAMPLE DATA ONLY).
// Reads text extracted from a sample record file and returns a structured
// CME (Compulsory Medical Examination) review. Doctors make every decision.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-csrf-token",
};
const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

const MAX_CHARS = 700_000;

const str = { type: "string" };
const obj = (props: Record<string, unknown>) => ({ type: "object", additionalProperties: false, properties: props, required: Object.keys(props) });
const arr = (items: unknown) => ({ type: "array", items });
const SCHEMA = obj({
  summary: str,
  incident_date: str,
  timeline: arr(obj({ date: str, provider: str, complaint: str, findings: str, treatment: str, page: str })),
  pre_existing: arr(obj({ date: str, provider: str, quote: str, page: str })),
  discrepancies: arr(obj({ subjective: str, objective: str, severity: { type: "string", enum: ["low", "medium", "high"] }, pages: str })),
  gaps_in_care: arr(str),
  questions_for_exam: arr(str),
  report_outline: arr(str),
});

async function readStream(res: Response): Promise<string> {
  const reader = res.body!.getReader(); const dec = new TextDecoder();
  let buf = "", out = "";
  for (;;) {
    const { done, value } = await reader.read(); if (done) break;
    buf += dec.decode(value, { stream: true });
    const lines = buf.split("\n"); buf = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.startsWith("data:")) continue;
      const d = line.slice(5).trim(); if (!d || d === "[DONE]") continue;
      try { const ev = JSON.parse(d); if (ev.type === "response.output_text.delta") out += ev.delta ?? ""; } catch { /* skip */ }
    }
  }
  return out;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const auth = req.headers.get("Authorization");
    if (!auth) return json({ error: "Sign in required" }, 401);
    const url = Deno.env.get("SUPABASE_URL")!;
    const userClient = createClient(url, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: auth } } });
    const { data: u } = await userClient.auth.getUser();
    if (!u?.user) return json({ error: "Sign in required" }, 401);

    const body = await req.json().catch(() => null);
    const documentId = typeof body?.document_id === "string" ? body.document_id : "";
    const text = typeof body?.text === "string" ? body.text : "";
    if (!/^[0-9a-f-]{36}$/i.test(documentId)) return json({ error: "Invalid document" }, 400);
    if (text.trim().length < 50) return json({ error: "Not enough readable text in this file" }, 400);

    // RLS: user can only read documents in their own clinic
    const { data: doc } = await userClient.from("hc_documents").select("id, clinic_id").eq("id", documentId).maybeSingle();
    if (!doc) return json({ error: "Document not found" }, 404);

    await userClient.from("hc_documents").update({ status: "reviewing" }).eq("id", documentId);

    const key = Deno.env.get("LOVABLE_API_KEY");
    if (!key) return json({ error: "AI not configured" }, 500);
    const model = "openai/gpt-6-astra";
    const ai = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
      method: "POST",
      headers: { "Lovable-API-Key": key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", "X-Lovable-AIG-SDK": "fetch" },
      body: JSON.stringify({
        model, stream: true, store: false,
        reasoning: { effort: "medium" },
        instructions:
          "You are Kayla Clinical, a medical-legal record organizer for 1325 Clinical. The records are fictional SAMPLE data. " +
          "Organize facts only; never diagnose, never decide fault — the examining doctor decides. " +
          "Pages are marked like [Page 12]. Cite page numbers for every item. Quote exactly when quoting. " +
          "Never invent anything not in the text; if a field is unknown, write 'Not stated'. pre_existing = complaints dated before the incident; discrepancies = patient-reported symptoms that conflict with objective findings or imaging.",
        input: [{ role: "user", content: `Review these records:\n\n${text.slice(0, MAX_CHARS)}` }],
        text: { format: { type: "json_schema", name: "record_review", strict: true, schema: SCHEMA } },
      }),
    });
    if (!ai.ok) {
      await userClient.from("hc_documents").update({ status: "failed" }).eq("id", documentId);
      if (ai.status === 429) return json({ error: "Kayla is busy — try again in a minute." }, 429);
      if (ai.status === 402) return json({ error: "AI credits used up — add credits to continue." }, 402);
      console.error("gateway", ai.status, await ai.text());
      return json({ error: "Kayla could not finish the review" }, 502);
    }
    let result: unknown;
    try { result = JSON.parse(await readStream(ai)); } catch { result = null; }
    if (!result) {
      await userClient.from("hc_documents").update({ status: "failed" }).eq("id", documentId);
      return json({ error: "Kayla returned an unreadable review" }, 502);
    }

    const { data: review, error } = await userClient
      .from("hc_reviews").insert({ clinic_id: doc.clinic_id, document_id: documentId, result, model }).select().single();
    if (error) throw error;
    await userClient.from("hc_documents").update({ status: "reviewed" }).eq("id", documentId);
    return json({ review });
  } catch (e) {
    console.error("health-kayla-review", e);
    return json({ error: "Something went wrong" }, 500);
  }
});
