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

const TOOL = {
  type: "function",
  function: {
    name: "save_review",
    description: "Save the structured record review.",
    parameters: {
      type: "object",
      properties: {
        summary: { type: "string", description: "3-5 sentence plain-English overview for the examining doctor." },
        incident_date: { type: "string", description: "Date of the injury/incident if stated, else empty." },
        timeline: {
          type: "array",
          items: {
            type: "object",
            properties: {
              date: { type: "string" }, provider: { type: "string" }, complaint: { type: "string" },
              findings: { type: "string" }, treatment: { type: "string" }, page: { type: "string" },
            },
            required: ["date", "provider", "complaint", "findings", "treatment", "page"],
          },
        },
        pre_existing: {
          type: "array", description: "Complaints/conditions documented BEFORE the incident date.",
          items: { type: "object", properties: { date: { type: "string" }, provider: { type: "string" }, quote: { type: "string" }, page: { type: "string" } }, required: ["date", "quote", "page"] },
        },
        discrepancies: {
          type: "array", description: "Patient-reported symptoms that conflict with objective findings or imaging.",
          items: { type: "object", properties: { subjective: { type: "string" }, objective: { type: "string" }, severity: { type: "string", enum: ["low", "medium", "high"] }, pages: { type: "string" } }, required: ["subjective", "objective", "severity", "pages"] },
        },
        gaps_in_care: { type: "array", items: { type: "string" } },
        questions_for_exam: { type: "array", items: { type: "string" }, description: "Things the doctor may want to ask or test during the exam." },
        report_outline: { type: "array", items: { type: "string" } },
      },
      required: ["summary", "timeline", "pre_existing", "discrepancies", "gaps_in_care", "questions_for_exam", "report_outline"],
    },
  },
};

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
    const model = "google/gemini-2.5-pro";
    const ai = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content:
              "You are Kayla Clinical, a medical-legal record organizer for 1325 Clinical. The records are fictional SAMPLE data. " +
              "Organize facts only; never diagnose, never decide fault — the examining doctor decides. " +
              "Pages are marked like [Page 12]. Cite page numbers for every item. Quote exactly when quoting. " +
              "Never invent anything not in the text; if a field is unknown, write 'Not stated'.",
          },
          { role: "user", content: `Review these records:\n\n${text.slice(0, MAX_CHARS)}` },
        ],
        tools: [TOOL],
        tool_choice: { type: "function", function: { name: "save_review" } },
      }),
    });
    if (!ai.ok) {
      await userClient.from("hc_documents").update({ status: "failed" }).eq("id", documentId);
      if (ai.status === 429) return json({ error: "Kayla is busy — try again in a minute." }, 429);
      if (ai.status === 402) return json({ error: "AI credits used up — add credits to continue." }, 402);
      return json({ error: "Kayla could not finish the review" }, 502);
    }
    const out = await ai.json();
    const args = out?.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    let result: unknown;
    try { result = JSON.parse(args); } catch { result = null; }
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
