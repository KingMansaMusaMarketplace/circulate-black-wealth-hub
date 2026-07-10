
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version, x-csrf-token, x-twilio-signature",
};

const GATEWAY_URL = "https://connector-gateway.lovable.dev/twilio";

// Verify Twilio webhook signature (HMAC-SHA1 of full URL + sorted form params)
async function verifyTwilioSignature(
  authToken: string,
  signatureHeader: string,
  url: string,
  params: Record<string, string>
): Promise<boolean> {
  const sortedKeys = Object.keys(params).sort();
  let data = url;
  for (const key of sortedKeys) data += key + params[key];

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(authToken),
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  const expected = btoa(String.fromCharCode(...new Uint8Array(sig)));
  return expected === signatureHeader;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) as any;

    // Parse the incoming request — support both Twilio webhook (form) and JSON test
    let from = "";
    let body = "";
    let to = "";
    let isTest = false;

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/x-www-form-urlencoded")) {
      // Twilio webhook: require valid signature
      const TWILIO_AUTH_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN");
      const signature = req.headers.get("x-twilio-signature");
      if (!TWILIO_AUTH_TOKEN || !signature) {
        console.error("Missing Twilio auth token or signature");
        return new Response("Unauthorized", { status: 401, headers: corsHeaders });
      }

      const rawBody = await req.text();
      const formParams: Record<string, string> = {};
      for (const [k, v] of new URLSearchParams(rawBody)) formParams[k] = v;

      // Use the exact URL Twilio signed (public function URL)
      const publicUrl = `${SUPABASE_URL.replace(".supabase.co", ".functions.supabase.co")}/kayla-answering-service`;
      const candidateUrls = [publicUrl, req.url];
      let verified = false;
      for (const u of candidateUrls) {
        if (await verifyTwilioSignature(TWILIO_AUTH_TOKEN, signature, u, formParams)) {
          verified = true;
          break;
        }
      }
      if (!verified) {
        console.error("Invalid Twilio signature");
        return new Response("Invalid signature", { status: 401, headers: corsHeaders });
      }

      from = formParams["From"] || "";
      body = formParams["Body"] || "";
      to = formParams["To"] || "";
    } else {
      // JSON test path: require authenticated admin caller
      const authHeader = req.headers.get("Authorization");
      if (!authHeader?.startsWith("Bearer ")) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
      const userClient = createClient(SUPABASE_URL, anonKey, {
        global: { headers: { Authorization: authHeader } },
      });
      const token = authHeader.replace("Bearer ", "");
      const { data: claimsData, error: claimsError } = await userClient.auth.getClaims(token);
      if (claimsError || !claimsData?.claims?.sub) {
        return new Response(JSON.stringify({ error: "Invalid token" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { data: isAdmin } = await userClient.rpc("is_admin_secure");
      if (!isAdmin) {
        return new Response(JSON.stringify({ error: "Forbidden: admin only" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const json = await req.json();
      from = json.from || "";
      body = json.body || json.message || "";
      to = json.to || "";
      isTest = json.test === true;
    }


    if (!body.trim()) {
      return new Response(
        '<?xml version="1.0" encoding="UTF-8"?><Response><Message>Please send a message.</Message></Response>',
        { headers: { ...corsHeaders, "Content-Type": "text/xml" }, status: 200 }
      );
    }

    // Look up business config by twilio phone number
    const { data: config, error: configError } = await supabase
      .from("business_answering_config")
      .select("*, businesses:business_id(business_name, category, address, city, state)")
      .eq("twilio_phone_number", to)
      .eq("is_active", true)
      .maybeSingle();

    if (configError) {
      console.error("Config lookup error:", configError);
      throw new Error("Failed to look up business config");
    }

    if (!config) {
      const fallback = "Sorry, this number is not currently active. Please try again later.";
      if (isTest) {
        return new Response(JSON.stringify({ reply: fallback }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(
        `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${fallback}</Message></Response>`,
        { headers: { ...corsHeaders, "Content-Type": "text/xml" } }
      );
    }

    const biz = (config as any).businesses || {};
    const faqEntries = Array.isArray(config.faq_entries) ? config.faq_entries : [];
    const faqText = faqEntries
      .map((f: any, i: number) => `Q${i + 1}: ${f.question}\nA${i + 1}: ${f.answer}`)
      .join("\n\n");

    const hoursText = config.business_hours
      ? Object.entries(config.business_hours as Record<string, any>)
          .map(([day, h]) => `${day}: ${h ? `${h.open}-${h.close}` : "Closed"}`)
          .join(", ")
      : "Not specified";

    const systemPrompt = `You are Kayla, a friendly AI assistant answering messages for "${biz.business_name || 'this business'}".
Category: ${biz.category || 'General'}
Location: ${[biz.address, biz.city, biz.state].filter(Boolean).join(', ') || 'Not specified'}
Business Hours: ${hoursText}
Greeting: ${config.greeting_message}

FAQ Knowledge Base:
${faqText || 'No FAQs configured yet.'}

RULES:
- Be warm, professional, and concise (under 160 characters when possible for SMS).
- If the customer's question matches an FAQ, answer using that information.
- If you don't know the answer, politely take a message and say the owner will follow up.
- Never make up information not in the FAQ or business details.
- If asked about hours, refer to the business hours above.`;

    // Call Lovable AI Gateway
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: body },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI Gateway error:", aiResponse.status, errText);
      throw new Error(`AI Gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const reply = aiData.choices?.[0]?.message?.content || "I'm sorry, I couldn't process that. Please try again.";

    // Determine action taken
    let actionTaken: "answered_faq" | "took_message" | "forwarded" = "answered_faq";
    const replyLower = reply.toLowerCase();
    if (replyLower.includes("follow up") || replyLower.includes("get back to you") || replyLower.includes("take a message")) {
      actionTaken = "took_message";
    }

    // Simple sentiment
    let sentiment = "neutral";
    const bodyLower = body.toLowerCase();
    if (bodyLower.includes("thank") || bodyLower.includes("great") || bodyLower.includes("love") || bodyLower.includes("awesome")) {
      sentiment = "positive";
    } else if (bodyLower.includes("complaint") || bodyLower.includes("terrible") || bodyLower.includes("worst") || bodyLower.includes("angry")) {
      sentiment = "negative";
    }

    // Log interaction
    await supabase.from("answering_call_logs").insert({
      business_id: config.business_id,
      caller_number: from || "test",
      channel: "sms",
      transcript: `Customer: ${body}\nKayla: ${reply}`,
      summary: body.substring(0, 200),
      action_taken: actionTaken,
      sentiment,
    });

    // For test requests, return JSON
    if (isTest) {
      return new Response(JSON.stringify({ reply, action: actionTaken, sentiment }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // For Twilio webhook, return TwiML
    const escapedReply = reply.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${escapedReply}</Message></Response>`,
      { headers: { ...corsHeaders, "Content-Type": "text/xml" } }
    );
  } catch (error) {
    console.error("Answering service error:", error);
    const msg = error instanceof Error ? (error as Error).message : "Unknown error";
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?><Response><Message>We're experiencing technical difficulties. Please try again later.</Message></Response>`,
      { headers: { ...corsHeaders, "Content-Type": "text/xml" }, status: 200 }
    );
  }
});
