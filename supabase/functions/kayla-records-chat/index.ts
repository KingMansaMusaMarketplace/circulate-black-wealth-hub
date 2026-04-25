import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing authorization header");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!);
    const { data: { user }, error: authError } = await anonClient.auth.getUser(authHeader.replace("Bearer ", ""));
    if (authError || !user) throw new Error("Unauthorized");

    const { question, businessId, conversationHistory } = await req.json();
    if (!question || !businessId) throw new Error("Missing question or businessId");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    // Fetch all documents for context (for small collections, direct context is fine)
    const { data: documents } = await supabase
      .from("document_records")
      .select("id, file_name, document_type, extracted_fields, ocr_text, expiration_date, processing_status, created_at")
      .eq("business_id", businessId)
      .eq("processing_status", "completed")
      .order("created_at", { ascending: false })
      .limit(50);

    // Build document context
    const docContext = (documents || []).map((doc) => {
      const fields = doc.extracted_fields ? JSON.stringify(doc.extracted_fields) : "none";
      const expiry = doc.expiration_date ? `Expires: ${doc.expiration_date}` : "No expiration";
      return `[${doc.document_type || "unknown"}] ${doc.file_name}\n${expiry}\nExtracted fields: ${fields}\nContent preview: ${(doc.ocr_text || "").substring(0, 500)}`;
    }).join("\n---\n");

    const systemPrompt = `You are Kayla, an AI records management assistant for 1325.AI / Mansa Musa Marketplace. You help business owners understand, find, and manage their business documents.

You have access to the following documents for this business:
${docContext || "No documents uploaded yet."}

Guidelines:
- Answer questions about document contents, expiration dates, compliance status
- Alert about upcoming expirations
- Help find specific information across documents
- Suggest what documents may be missing based on business type
- Never disclose proprietary technology details
- Be concise and actionable
- If no documents are available, guide the user to upload their first document`;

    const messages = [
      { role: "system" as const, content: systemPrompt },
      ...(conversationHistory || []),
      { role: "user" as const, content: question },
    ];

    // Stream response
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credits exhausted. Add funds in Settings > Workspace > Usage." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      throw new Error(`AI gateway error ${response.status}: ${t}`);
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("kayla-records-chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? (error as Error).message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
