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

    // Verify user
    const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!);
    const { data: { user }, error: authError } = await anonClient.auth.getUser(authHeader.replace("Bearer ", ""));
    if (authError || !user) throw new Error("Unauthorized");

    const { action, documentId, businessId } = await req.json();

    if (action === "process") {
      // Fetch document record
      const { data: doc, error: docErr } = await supabase
        .from("document_records")
        .select("*")
        .eq("id", documentId)
        .single();
      if (docErr || !doc) throw new Error("Document not found");

      // Update status to processing
      await supabase
        .from("document_records")
        .update({ processing_status: "processing" })
        .eq("id", documentId);

      try {
        // Download file from storage
        const { data: fileData, error: dlErr } = await supabase.storage
          .from("business_documents")
          .download(doc.file_path);
        if (dlErr || !fileData) throw new Error("Failed to download file");

        // Convert to base64 for Gemini vision
        const arrayBuffer = await fileData.arrayBuffer();
        const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

        const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
        if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

        // OCR + Field extraction via Gemini
        const mimeType = doc.mime_type || "application/pdf";
        const extractionPrompt = `You are analyzing a business document. Extract the following information:
1. Full OCR text content of the document
2. Document type (one of: license, permit, contract, insurance, tax, certificate, other)
3. Key fields as structured data (e.g., license number, issue date, expiration date, business name, issuing authority, amounts, parties involved)
4. Expiration date if present (in ISO 8601 format)

Respond with a JSON object:
{
  "ocr_text": "full text content",
  "document_type": "detected type",
  "expiration_date": "YYYY-MM-DD or null",
  "extracted_fields": {
    "field_name": "value",
    ...
  }
}`;

        const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
              { role: "system", content: "You are a document analysis AI. Always respond with valid JSON only." },
              {
                role: "user",
                content: [
                  { type: "text", text: extractionPrompt },
                  {
                    type: "image_url",
                    image_url: { url: `data:${mimeType};base64,${base64}` },
                  },
                ],
              },
            ],
          }),
        });

        if (!aiResponse.ok) {
          const errText = await aiResponse.text();
          throw new Error(`AI gateway error ${aiResponse.status}: ${errText}`);
        }

        const aiData = await aiResponse.json();
        let content = aiData.choices?.[0]?.message?.content || "";

        // Clean markdown fences if present
        content = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

        let parsed;
        try {
          parsed = JSON.parse(content);
        } catch {
          parsed = { ocr_text: content, document_type: "other", extracted_fields: {}, expiration_date: null };
        }

        // Update document record with extracted data
        const updateData: Record<string, unknown> = {
          ocr_text: parsed.ocr_text || "",
          document_type: parsed.document_type || doc.document_type || "other",
          extracted_fields: parsed.extracted_fields || {},
          processing_status: "completed",
        };

        if (parsed.expiration_date) {
          updateData.expiration_date = parsed.expiration_date;
        }

        await supabase
          .from("document_records")
          .update(updateData)
          .eq("id", documentId);

        // Generate embeddings for document chunks
        const ocrText = parsed.ocr_text || "";
        if (ocrText.length > 0) {
          const chunks = chunkText(ocrText, 500);
          
          for (let i = 0; i < chunks.length; i++) {
            const embeddingResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${LOVABLE_API_KEY}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model: "google/gemini-2.5-flash-lite",
                messages: [
                  {
                    role: "system",
                    content: "Generate a semantic embedding representation. Respond with ONLY a JSON array of 768 floating point numbers representing the semantic embedding of the input text. No other text.",
                  },
                  { role: "user", content: chunks[i] },
                ],
              }),
            });

            if (embeddingResponse.ok) {
              const embData = await embeddingResponse.json();
              let embContent = embData.choices?.[0]?.message?.content || "";
              embContent = embContent.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
              
              try {
                const embedding = JSON.parse(embContent);
                if (Array.isArray(embedding) && embedding.length === 768) {
                  await supabase.from("document_embeddings").insert({
                    document_id: documentId,
                    business_id: doc.business_id,
                    chunk_index: i,
                    chunk_text: chunks[i],
                    embedding: JSON.stringify(embedding),
                  });
                }
              } catch {
                console.error(`Failed to parse embedding for chunk ${i}`);
              }
            }
          }
        }

        // Log to activity_log
        await supabase.from("activity_log").insert({
          user_id: user.id,
          activity_type: "document_processed",
          business_id: doc.business_id,
          activity_data: {
            document_id: documentId,
            document_type: parsed.document_type,
            file_name: doc.file_name,
            has_expiration: !!parsed.expiration_date,
          },
        });

        return new Response(JSON.stringify({ success: true, data: updateData }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (processError) {
        await supabase
          .from("document_records")
          .update({
            processing_status: "failed",
            processing_error: processError instanceof Error ? processError.message : "Unknown error",
          })
          .eq("id", documentId);
        throw processError;
      }
    }

    if (action === "check_expirations") {
      // Find documents expiring within 30 days that haven't been alerted
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

      const { data: expiringDocs, error: expErr } = await supabase
        .from("document_records")
        .select("*, businesses!inner(name, owner_id)")
        .eq("alert_sent", false)
        .not("expiration_date", "is", null)
        .lte("expiration_date", thirtyDaysFromNow.toISOString())
        .eq("processing_status", "completed");

      if (expErr) throw expErr;

      const alerts = [];
      for (const doc of expiringDocs || []) {
        // Emit kayla event for expiration alert
        await supabase.from("kayla_event_queue").insert({
          event_type: "document_expiring",
          business_id: doc.business_id,
          payload: {
            document_id: doc.id,
            file_name: doc.file_name,
            document_type: doc.document_type,
            expiration_date: doc.expiration_date,
          },
          status: "pending",
        });

        await supabase
          .from("document_records")
          .update({ alert_sent: true, alert_sent_at: new Date().toISOString() })
          .eq("id", doc.id);

        alerts.push({ id: doc.id, file_name: doc.file_name, expiration_date: doc.expiration_date });
      }

      return new Response(JSON.stringify({ success: true, alerts_sent: alerts.length, alerts }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("kayla-records-processor error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function chunkText(text: string, chunkSize: number): string[] {
  const chunks: string[] = [];
  const sentences = text.split(/(?<=[.!?])\s+/);
  let current = "";

  for (const sentence of sentences) {
    if ((current + " " + sentence).length > chunkSize && current.length > 0) {
      chunks.push(current.trim());
      current = sentence;
    } else {
      current = current ? current + " " + sentence : sentence;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks.length > 0 ? chunks : [text];
}
