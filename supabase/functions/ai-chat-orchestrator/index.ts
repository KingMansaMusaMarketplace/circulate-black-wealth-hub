import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { buildKaylaSystemPrompt, classifyQuery, fetchAIWithRetry } from "../_shared/kayla-brain.ts";
import { retrieveRAGContext, retrievePersonalMemory } from "../_shared/kayla-memory.ts";
import { gatherLiveGrounding, resolveOwnedBusinessId } from "../_shared/kayla-grounding.ts";

// Memory + platform knowledge now live in _shared/kayla-memory.ts so every
// Kayla surface remembers the same things.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-csrf-token",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();


function checkRateLimit(identifier: string, maxRequests = 20, windowMs = 60000): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);
  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }
  if (entry.count >= maxRequests) return false;
  entry.count++;
  return true;
}

function sanitizeForPrompt(input: string): string {
  if (typeof input !== 'string') return '';
  return input.replace(/[\x00-\x1F\x7F]/g, '').substring(0, 10000).replace(/\{\{|\}\}/g, '').trim();
}

function sanitizeMessages(messages: any[]): any[] {
  if (!Array.isArray(messages)) return [];
  return messages
    .filter(msg => msg && typeof msg === 'object' && msg.role && msg.content)
    .slice(0, 50)
    .map(msg => {
      const role = String(msg.role).substring(0, 20);
      
      // Handle multimodal content (array of text + image_url)
      if (Array.isArray(msg.content)) {
        const sanitizedContent = msg.content
          .filter((part: any) => part && (part.type === 'text' || part.type === 'image_url'))
          .map((part: any) => {
            if (part.type === 'text') {
              return { type: 'text', text: sanitizeForPrompt(String(part.text || '')) };
            }
            if (part.type === 'image_url' && part.image_url?.url) {
              // Validate it's a data URL (base64)
              const url = String(part.image_url.url);
              if (url.startsWith('data:image/')) {
                return { type: 'image_url', image_url: { url } };
              }
            }
            return null;
          })
          .filter(Boolean);
        
        return { role, content: sanitizedContent };
      }
      
      return { role, content: sanitizeForPrompt(String(msg.content)) };
    });
}

// Extract text from a message (handles both string and multimodal content)
function getMessageText(content: any): string {
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content.filter((p: any) => p.type === 'text').map((p: any) => p.text || '').join(' ');
  }
  return '';
}

// Check if a message contains an image
function hasImage(content: any): boolean {
  if (Array.isArray(content)) {
    return content.some((p: any) => p.type === 'image_url');
  }
  return false;
}

type QueryCategory = 'simple' | 'complex' | 'search' | 'critical';

// Classify query intent using Gemini Flash Lite (fast & cheap)
// Query routing now lives in _shared/kayla-brain.ts (classifyQuery), which
// escalates UP to deeper thinking whenever it is unsure.

async function callGemini(
  messages: any[],
  systemPrompt: string,
  lovableApiKey: string,
  deep = false,
): Promise<Response> {
  // A single hiccup no longer kills the answer — fetchAIWithRetry backs off
  // and tries again on temporary failures only.
  return await fetchAIWithRetry(
    "https://ai.gateway.lovable.dev/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: deep ? "google/gemini-3.1-pro-preview" : "google/gemini-3.7-flash",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        stream: true,
      }),
    },
    { label: deep ? "gemini-deep" : "gemini-fast" },
  );
}

// Call Claude via Anthropic API (streaming, convert to OpenAI SSE format)
async function callClaude(messages: any[], systemPrompt: string, anthropicApiKey: string): Promise<Response> {
  // Convert messages to Anthropic format, handling multimodal content
  const anthropicMessages = messages
    .map(m => {
      const role = m.role === 'system' ? 'user' : m.role;
      if (role !== 'user' && role !== 'assistant') return null;

      // Handle multimodal content (array format)
      if (Array.isArray(m.content)) {
        const anthropicContent = m.content.map((part: any) => {
          if (part.type === 'text') {
            return { type: 'text', text: part.text };
          }
          if (part.type === 'image_url' && part.image_url?.url) {
            // Convert data URL to Anthropic's base64 format
            const dataUrl = part.image_url.url;
            const match = dataUrl.match(/^data:(image\/\w+);base64,(.+)$/);
            if (match) {
              return {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: match[1],
                  data: match[2],
                },
              };
            }
          }
          return null;
        }).filter(Boolean);

        return { role, content: anthropicContent };
      }

      return { role, content: m.content };
    })
    .filter(Boolean);

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": anthropicApiKey,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      system: systemPrompt,
      messages: anthropicMessages,
      stream: true,
    }),
  });

  if (!response.ok || !response.body) {
    throw new Error(`Claude API error: ${response.status}`);
  }

  // Transform Anthropic SSE stream to OpenAI-compatible SSE stream
  const reader = response.body.getReader();
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      let buffer = '';
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          let newlineIdx: number;
          while ((newlineIdx = buffer.indexOf('\n')) !== -1) {
            const line = buffer.slice(0, newlineIdx).trim();
            buffer = buffer.slice(newlineIdx + 1);

            if (!line.startsWith('data: ')) continue;
            const jsonStr = line.slice(6);
            if (jsonStr === '[DONE]') continue;

            try {
              const event = JSON.parse(jsonStr);
              if (event.type === 'content_block_delta' && event.delta?.text) {
                // Convert to OpenAI format
                const openAIChunk = {
                  choices: [{ delta: { content: event.delta.text }, index: 0 }],
                };
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(openAIChunk)}\n\n`));
              } else if (event.type === 'message_stop') {
                controller.enqueue(encoder.encode('data: [DONE]\n\n'));
              }
            } catch { /* skip unparseable lines */ }
          }
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      } catch (e) {
        controller.error(e);
      }
    }
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream" },
  });
}

// Call Perplexity (non-streaming, returns content + citations)
async function callPerplexity(userMessage: string, systemPrompt: string, perplexityApiKey: string): Promise<{ content: string; citations: string[] }> {
  const response = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${perplexityApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "sonar",
      messages: [
        { role: "system", content: systemPrompt + "\n\nProvide well-sourced answers with citations." },
        { role: "user", content: userMessage },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Perplexity API error: ${response.status}`);
  }

  const data = await response.json();
  return {
    content: data.choices?.[0]?.message?.content || '',
    citations: data.citations || [],
  };
}

// Convert a string response to OpenAI-compatible SSE stream
function stringToSSEStream(text: string, model: string): ReadableStream {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      // Send content in chunks for a streaming feel
      const chunkSize = 20;
      for (let i = 0; i < text.length; i += chunkSize) {
        const chunk = text.slice(i, i + chunkSize);
        const data = { choices: [{ delta: { content: chunk }, index: 0 }], model };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      }
      controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      controller.close();
    }
  });
}

// Build the Kayla system prompt (reused from ai-chat)
// Kayla's instructions now live in ONE place: _shared/kayla-brain.ts.
// This wrapper exists only so the rest of this file reads unchanged.
function buildSystemPrompt(isAdmin: boolean): string {
  return buildKaylaSystemPrompt({ isAdmin });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // ========== AUTHENTICATION ==========
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Authorization header required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey) as any;

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (!checkRateLimit(user.id, 20, 60000)) {
      return new Response(JSON.stringify({ error: "Too many requests. Please wait a moment." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    console.log(`Authenticated user: ${user.id}`);

    // ========== PARSE & VALIDATE ==========
    const requestBody = await req.json();
    const messages = sanitizeMessages(requestBody.messages);
    if (messages.length === 0) {
      return new Response(JSON.stringify({ error: "No valid messages provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // ========== KAYLA SESSION MEMORY ==========
    // Optional client-provided session id; if absent we generate one and return it
    // so the client can pin all subsequent turns to the same row in ai_chat_sessions.
    const incomingSessionId = typeof requestBody.session_id === 'string' ? requestBody.session_id : null;
    const sessionId = incomingSessionId && /^[0-9a-f-]{36}$/i.test(incomingSessionId)
      ? incomingSessionId
      : crypto.randomUUID();

    // Persist (or refresh) the conversation row with the messages we know about so far.
    // This guarantees Kayla's memory survives reloads. The next request will include
    // the assistant's reply (the client always sends the full message list), so the
    // assistant turn lands in the row on the *next* upsert. This is intentional —
    // it keeps the streaming response path uncomplicated.
    try {
      const firstUserText = (() => {
        const firstUser = messages.find((m: any) => m.role === 'user');
        return firstUser ? getMessageText(firstUser.content).slice(0, 80) : 'Kayla session';
      })();
      await supabase
        .from('ai_chat_sessions')
        .upsert({
          id: sessionId,
          user_id: user.id,
          title: firstUserText,
          messages,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' });
    } catch (e) {
      console.error('[Kayla memory] Session upsert failed (non-fatal):', e);
    }

    // ========== CHECK API KEYS ==========
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    const PERPLEXITY_API_KEY = Deno.env.get("PERPLEXITY_API_KEY");
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      return new Response(JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Check admin status
    let isAdmin = false;
    try {
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").single();
      if (!roleError && roleData) isAdmin = true;
    } catch { /* not admin */ }

    let systemPrompt = buildSystemPrompt(isAdmin);
    const lastMessage = messages[messages.length - 1];
    const lastUserMessage = getMessageText(lastMessage?.content || '');
    const messageHasImage = hasImage(lastMessage?.content);

    // ========== CLASSIFY QUERY ==========
    // If message has an image, route to Claude (vision) by default
    let category: QueryCategory;
    if (messageHasImage) {
      category = 'complex'; // Claude handles vision
      console.log(`Image detected, routing to Claude vision`);
    } else {
      const routed = await classifyQuery(lastUserMessage, LOVABLE_API_KEY);
      category = routed.category;
      console.log(`Router: ${routed.category} (${routed.reason})`);
    }
    console.log(`Routing to: ${category} | Message: "${lastUserMessage.substring(0, 80)}..." | Image: ${messageHasImage}`);

    // ========== GROUNDING: platform knowledge + personal memory + LIVE LOOKUPS ==========
    // All three run for EVERY question. Live lookups let Kayla check the real
    // directory, the person's own numbers and the live web before answering,
    // instead of answering from memory.
    const ownedBusinessId = await resolveOwnedBusinessId(supabase, user.id);
    const [ragContext, personalMemory, grounding] = await Promise.all([
      retrieveRAGContext(lastUserMessage, LOVABLE_API_KEY, supabase),
      retrievePersonalMemory(user.id, supabase, sessionId),
      gatherLiveGrounding({
        supabase,
        question: lastUserMessage,
        lovableApiKey: LOVABLE_API_KEY,
        userId: user.id,
        businessId: ownedBusinessId,
      }),
    ]);
    if (ragContext) systemPrompt += ragContext;
    if (personalMemory) systemPrompt += personalMemory;
    if (grounding.block) systemPrompt += grounding.block;
    if (grounding.calls.length) {
      console.log(`[orchestrator] grounding: ${grounding.calls.map((c) => c.tool).join(", ")}`);
    }


    // ========== ROUTE TO PROVIDER(S) ==========
    let responseStream: Response;
    let modelUsed = 'gemini';

    try {
      switch (category) {
        case 'simple': {
          // Gemini — fast & cheap
          responseStream = await callGemini(messages, systemPrompt, LOVABLE_API_KEY);
          modelUsed = 'gemini';
          if (!responseStream.ok) throw new Error(`Gemini error: ${responseStream.status}`);
          break;
        }

        case 'complex': {
          // Claude — deep reasoning (fallback to Gemini)
          if (ANTHROPIC_API_KEY) {
            try {
              responseStream = await callClaude(messages, systemPrompt, ANTHROPIC_API_KEY);
              modelUsed = 'claude';
            } catch (e) {
              console.error("Claude failed, falling back to Gemini:", e);
              responseStream = await callGemini(messages, systemPrompt, LOVABLE_API_KEY, true);
              modelUsed = 'gemini-pro';
              if (!responseStream.ok) throw new Error(`Gemini fallback error: ${responseStream.status}`);
            }
          } else {
            console.log("No ANTHROPIC_API_KEY, using Gemini for complex query");
            responseStream = await callGemini(messages, systemPrompt, LOVABLE_API_KEY, true);
            modelUsed = 'gemini';
            if (!responseStream.ok) throw new Error(`Gemini error: ${responseStream.status}`);
          }
          break;
        }

        case 'search': {
          // Perplexity — real-time web search (fallback to Gemini)
          if (PERPLEXITY_API_KEY) {
            try {
              const result = await callPerplexity(lastUserMessage, systemPrompt, PERPLEXITY_API_KEY);
              let fullContent = result.content;
              if (result.citations.length > 0) {
                fullContent += '\n\n📎 **Sources:**\n' + result.citations.map((c, i) => `${i + 1}. ${c}`).join('\n');
              }
              const stream = stringToSSEStream(fullContent, 'perplexity');
              responseStream = new Response(stream, { headers: { "Content-Type": "text/event-stream" } });
              modelUsed = 'perplexity';
            } catch (e) {
              console.error("Perplexity failed, falling back to Gemini:", e);
              responseStream = await callGemini(messages, systemPrompt, LOVABLE_API_KEY, true);
              modelUsed = 'gemini-pro';
              if (!responseStream.ok) throw new Error(`Gemini fallback error: ${responseStream.status}`);
            }
          } else {
            console.log("No PERPLEXITY_API_KEY, using Gemini for search query");
            responseStream = await callGemini(messages, systemPrompt, LOVABLE_API_KEY, true);
            modelUsed = 'gemini';
            if (!responseStream.ok) throw new Error(`Gemini error: ${responseStream.status}`);
          }
          break;
        }

        case 'critical': {
          // Claude + Perplexity in parallel (fallback gracefully)
          const hasClaudeKey = !!ANTHROPIC_API_KEY;
          const hasPerplexityKey = !!PERPLEXITY_API_KEY;

          if (hasClaudeKey && hasPerplexityKey) {
            try {
              // Run both in parallel
              const [perplexityResult] = await Promise.all([
                callPerplexity(lastUserMessage, systemPrompt, PERPLEXITY_API_KEY),
              ]);

              // Feed Perplexity context into Claude
              const enrichedMessages = [
                ...messages.slice(0, -1),
                {
                  role: 'user',
                  content: `${lastUserMessage}\n\n[Real-time research data for context]:\n${perplexityResult.content}${
                    perplexityResult.citations.length > 0
                      ? '\n\nSources: ' + perplexityResult.citations.join(', ')
                      : ''
                  }`
                }
              ];

              responseStream = await callClaude(enrichedMessages, systemPrompt + '\n\nYou have been provided real-time research data. Synthesize it with your analysis. Cite sources when using external data.', ANTHROPIC_API_KEY);
              modelUsed = 'claude+perplexity';
            } catch (e) {
              console.error("Critical dual-model failed, falling back:", e);
              // Try Claude alone, then Gemini
              if (hasClaudeKey) {
                try {
                  responseStream = await callClaude(messages, systemPrompt, ANTHROPIC_API_KEY);
                  modelUsed = 'claude';
                } catch {
                  responseStream = await callGemini(messages, systemPrompt, LOVABLE_API_KEY, true);
                  modelUsed = 'gemini';
                  if (!responseStream.ok) throw new Error(`Gemini fallback error: ${responseStream.status}`);
                }
              } else {
                responseStream = await callGemini(messages, systemPrompt, LOVABLE_API_KEY, true);
                modelUsed = 'gemini';
                if (!responseStream.ok) throw new Error(`Gemini fallback error: ${responseStream.status}`);
              }
            }
          } else if (hasClaudeKey) {
            responseStream = await callClaude(messages, systemPrompt, ANTHROPIC_API_KEY);
            modelUsed = 'claude';
          } else {
            responseStream = await callGemini(messages, systemPrompt, LOVABLE_API_KEY, true);
            modelUsed = 'gemini';
            if (!responseStream.ok) throw new Error(`Gemini error: ${responseStream.status}`);
          }
          break;
        }

        default: {
          responseStream = await callGemini(messages, systemPrompt, LOVABLE_API_KEY, true);
          modelUsed = 'gemini';
          if (!responseStream.ok) throw new Error(`Gemini error: ${responseStream.status}`);
        }
      }
    } catch (error) {
      console.error("All providers failed:", error);
      // Ultimate fallback — try Gemini one more time
      try {
        responseStream = await callGemini(messages, systemPrompt, LOVABLE_API_KEY, true);
        modelUsed = 'gemini';
        if (!responseStream.ok) throw new Error("Final Gemini fallback failed");
      } catch {
        return new Response(JSON.stringify({ error: "AI service temporarily unavailable" }),
          { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }

    console.log(`Response served by: ${modelUsed}`);

    // Inject model info + session id as the first SSE event, then pipe the rest
    const encoder = new TextEncoder();
    const modelInfoChunk = encoder.encode(`data: ${JSON.stringify({ model_used: modelUsed, session_id: sessionId })}\n\n`);

    const originalBody = responseStream.body;
    if (!originalBody) {
      return new Response(JSON.stringify({ error: "Empty response from AI" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const combinedStream = new ReadableStream({
      async start(controller) {
        // Send model info first
        controller.enqueue(modelInfoChunk);
        
        const reader = originalBody.getReader();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            controller.enqueue(value);
          }
          controller.close();
        } catch (e) {
          controller.error(e);
        }
      }
    });

    return new Response(combinedStream, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });

  } catch (error) {
    console.error("Orchestrator error:", error);
    return new Response(JSON.stringify({ error: "An error occurred processing your request" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
