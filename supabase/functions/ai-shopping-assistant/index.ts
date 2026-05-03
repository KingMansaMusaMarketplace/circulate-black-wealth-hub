import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version, x-csrf-token",
};

// US states + common abbreviations to detect location intent
const US_STATES: Record<string, string> = {
  alabama: "AL", alaska: "AK", arizona: "AZ", arkansas: "AR", california: "CA",
  colorado: "CO", connecticut: "CT", delaware: "DE", florida: "FL", georgia: "GA",
  hawaii: "HI", idaho: "ID", illinois: "IL", indiana: "IN", iowa: "IA",
  kansas: "KS", kentucky: "KY", louisiana: "LA", maine: "ME", maryland: "MD",
  massachusetts: "MA", michigan: "MI", minnesota: "MN", mississippi: "MS",
  missouri: "MO", montana: "MT", nebraska: "NE", nevada: "NV",
  "new hampshire": "NH", "new jersey": "NJ", "new mexico": "NM", "new york": "NY",
  "north carolina": "NC", "north dakota": "ND", ohio: "OH", oklahoma: "OK",
  oregon: "OR", pennsylvania: "PA", "rhode island": "RI", "south carolina": "SC",
  "south dakota": "SD", tennessee: "TN", texas: "TX", utah: "UT", vermont: "VT",
  virginia: "VA", washington: "WA", "west virginia": "WV", wisconsin: "WI",
  wyoming: "WY", "district of columbia": "DC",
};

// Common words to ignore when extracting search terms
const STOPWORDS = new Set([
  "find","show","me","a","an","the","best","top","good","great","near","in","on","at","for",
  "any","some","please","can","you","i","want","need","looking","look","get","tell","about",
  "what","where","is","are","there","do","does","help","with","and","or","of","to","my",
  "black","owned","business","businesses","shop","shops","store","stores","place","places",
  "kayla","hi","hello","hey","thanks","thank"
]);

function extractSearchSignals(text: string) {
  const lower = (text || "").toLowerCase();

  // City detection: "in <City>" or "<City>, <ST>" — stop at state names so
  // "in Chicago Illinois" parses to city="chicago", state="IL".
  let city: string | null = null;
  const stateNamesAlt = Object.keys(US_STATES).join("|");
  const inRegex = new RegExp(
    `\\bin\\s+([a-z][a-z\\s\\.'-]{2,30}?)(?:[,\\.\\?!]|\\s+(?:${stateNamesAlt}|[a-z]{2}\\b|area|zone|today|tonight|please|tomorrow)|$)`,
  );
  const inMatch = lower.match(inRegex);
  if (inMatch) city = inMatch[1].trim();
  const cityComma = lower.match(/\b([a-z][a-z\s'-]{2,25}),\s*([a-z]{2})\b/);
  if (cityComma) city = cityComma[1].trim();

  // State detection
  let state: string | null = null;
  for (const [name, abbr] of Object.entries(US_STATES)) {
    if (lower.includes(` ${name} `) || lower.endsWith(` ${name}`) || lower.includes(`, ${name}`)) {
      state = abbr;
      break;
    }
  }
  const stateAbbrMatch = lower.match(/\b([a-z]{2})\b\s*$/);
  if (!state && stateAbbrMatch) {
    const guess = stateAbbrMatch[1].toUpperCase();
    if (Object.values(US_STATES).includes(guess)) state = guess;
  }

  // Keyword extraction (drop stopwords + the city/state we already pulled)
  const tokens = lower
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(t => t && !STOPWORDS.has(t) && !US_STATES[t] && t.length > 2);
  if (city) {
    for (const w of city.split(/\s+/)) {
      const idx = tokens.indexOf(w);
      if (idx >= 0) tokens.splice(idx, 1);
    }
  }
  const keywords = tokens.slice(0, 5);

  return { city: city || null, state, keywords };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const startedAt = Date.now();
  let runStatus: "success" | "error" = "success";
  let runDetails: Record<string, unknown> = {};

  try {
    const { messages, sessionId } = await req.json();
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages array is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey) as any;

    // Try to identify the caller (only persists sessions if logged in)
    let userId: string | null = null;
    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace(/^Bearer\s+/i, "");
    if (token && token !== Deno.env.get("SUPABASE_ANON_KEY")) {
      try {
        const { data: { user } } = await supabase.auth.getUser(token);
        if (user) userId = user.id;
      } catch { /* anonymous */ }
    }

    // Pull the user's most recent message and extract intent
    const lastUser = [...messages].reverse().find((m: any) => m.role === "user")?.content || "";
    const { city, state, keywords } = extractSearchSignals(String(lastUser));

    // Build a relevance-aware business query
    let relevantBusinesses: any[] = [];
    if (city || state || keywords.length > 0) {
      let q = supabase
        .from("businesses")
        .select("name, category, city, state, description, average_rating, website")
        .in("listing_status", ["live", "active"])
        .limit(25);

      if (city) q = q.ilike("city", `%${city}%`);
      if (state) q = q.eq("state", state);
      if (keywords.length > 0) {
        // Match category OR name OR description against any keyword
        const ors = keywords.flatMap(k => [
          `category.ilike.%${k}%`,
          `name.ilike.%${k}%`,
          `description.ilike.%${k}%`,
        ]).join(",");
        q = q.or(ors);
      }
      q = q.order("average_rating", { ascending: false, nullsFirst: false });
      const { data } = await q;
      relevantBusinesses = data || [];
    }

    // Always include a fallback "popular" set so Kayla has something to talk about
    let popular: any[] = [];
    if (relevantBusinesses.length < 10) {
      const { data } = await supabase
        .from("businesses")
        .select("name, category, city, state, description, average_rating, website")
        .in("listing_status", ["live", "active"])
        .order("average_rating", { ascending: false, nullsFirst: false })
        .limit(30);
      popular = data || [];
    }

    const merged = [...relevantBusinesses];
    const seen = new Set(merged.map(b => b.name));
    for (const b of popular) {
      if (!seen.has(b.name)) { merged.push(b); seen.add(b.name); }
      if (merged.length >= 30) break;
    }

    const businessContext = merged.length
      ? merged.map((b: any) =>
          `• ${b.name} — ${b.category || "General"} — ${b.city || "?"}, ${b.state || "?"}` +
          (b.average_rating ? ` ★${Number(b.average_rating).toFixed(1)}` : "") +
          (b.website ? ` — ${b.website}` : "") +
          (b.description ? `\n   ${String(b.description).substring(0, 140)}` : "")
        ).join("\n")
      : "No matching businesses in the directory snapshot.";

    runDetails = {
      session_id: sessionId || null,
      user_id: userId,
      query: lastUser,
      parsed: { city, state, keywords },
      relevant_count: relevantBusinesses.length,
      total_context: merged.length,
    };

    const systemPrompt = `⚠️ ABSOLUTE BRAND RULE — READ FIRST: The product is named **1325.AI**. You MUST refer to it as "1325.AI" in every response. NEVER say "Mansa Musa Marketplace directory", "Mansa Musa Marketplace website", or "the Mansa Musa Marketplace" as the product name. "Mansa Musa Marketplace" is ONLY the parent brand and may appear ONLY as a parenthetical aside, e.g. "1325.AI (also known as Mansa Musa Marketplace)". Default to just "1325.AI". Violating this rule is a critical error.

You are Kayla, the AI shopping assistant for **1325.AI** — the premier directory of Black-owned businesses (also known as Mansa Musa Marketplace).

PARSED USER INTENT:
- City filter: ${city || "(none)"}
- State filter: ${state || "(none)"}
- Keywords: ${keywords.length ? keywords.join(", ") : "(none)"}

LIVE BUSINESS RESULTS FROM 1325.AI DIRECTORY${relevantBusinesses.length ? ` (${relevantBusinesses.length} matched the user's request)` : ""}:
${businessContext}

INSTRUCTIONS:
- ALWAYS use the LIVE BUSINESS RESULTS above to answer. Recommend 2–4 specific businesses by name when the user asks for a category or location.
- If the user asked for a city/state and we returned matches, name them. Do NOT say "I don't have listings" when results are present above.
- If we have NO matches for that exact city, say so honestly and suggest the closest alternatives from the list, then point them to the full directory at /directory.
- Never invent businesses, websites, or details that aren't in the list above.
- Keep replies tight: 2–4 sentences plus a short bullet list of recommendations when applicable.
- Use markdown for emphasis and lists. Always say "1325.AI" — never "Mansa Musa Marketplace" alone.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.slice(-20),
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      runStatus = "error";
      runDetails.http_status = response.status;
      if (response.status === 429) {
        await logRun(supabase, "kayla-shopping", runStatus, startedAt, runDetails);
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        await logRun(supabase, "kayla-shopping", runStatus, startedAt, runDetails);
        return new Response(JSON.stringify({ error: "AI service credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      runDetails.error = text.slice(0, 500);
      await logRun(supabase, "kayla-shopping", runStatus, startedAt, runDetails);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Tee the upstream stream: one branch goes back to the client, the other we
    // accumulate so we can persist the assistant reply after streaming completes.
    const [clientStream, persistStream] = response.body!.tee();

    // Fire-and-forget: persist session + log the run after the stream finishes.
    (async () => {
      try {
        const reader = persistStream.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let assistantText = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          let nl: number;
          while ((nl = buffer.indexOf("\n")) !== -1) {
            const raw = buffer.slice(0, nl);
            buffer = buffer.slice(nl + 1);
            const line = raw.endsWith("\r") ? raw.slice(0, -1) : raw;
            if (!line.startsWith("data: ")) continue;
            const json = line.slice(6).trim();
            if (json === "[DONE]") continue;
            try {
              const parsed = JSON.parse(json);
              const c = parsed.choices?.[0]?.delta?.content;
              if (c) assistantText += c;
            } catch { /* ignore */ }
          }
        }

        runDetails.assistant_chars = assistantText.length;

        // Persist session only when we know the user
        if (userId) {
          const fullMessages = [...messages, { role: "assistant", content: assistantText }];
          const title = (messages.find((m: any) => m.role === "user")?.content || "Chat").slice(0, 80);
          if (sessionId) {
            await supabase.from("ai_chat_sessions").update({
              messages: fullMessages,
              updated_at: new Date().toISOString(),
            }).eq("id", sessionId).eq("user_id", userId);
          } else {
            await supabase.from("ai_chat_sessions").insert({
              user_id: userId,
              title,
              messages: fullMessages,
            });
          }
        }

        await logRun(supabase, "kayla-shopping", "success", startedAt, runDetails);
      } catch (e) {
        console.error("Persist/log error:", e);
        await logRun(supabase, "kayla-shopping", "error", startedAt, {
          ...runDetails,
          persist_error: e instanceof Error ? e.message : String(e),
        });
      }
    })();

    return new Response(clientStream, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-shopping-assistant error:", e);
    try {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      ) as any;
      await logRun(supabase, "kayla-shopping", "error", startedAt, {
        ...runDetails,
        error: e instanceof Error ? e.message : String(e),
      });
    } catch { /* swallow */ }
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function logRun(
  supabase: any,
  agent: string,
  status: "success" | "error",
  startedAt: number,
  details: Record<string, unknown>,
) {
  try {
    const now = new Date();
    await supabase.from("kayla_run_log").insert({
      agent_name: agent,
      run_status: status,
      started_at: new Date(startedAt).toISOString(),
      completed_at: now.toISOString(),
      duration_ms: Date.now() - startedAt,
      details,
    });
  } catch (e) {
    console.error("kayla_run_log insert failed:", e);
  }
}
