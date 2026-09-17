// =============================================================================
// KAYLA MEMORY — shared long-term memory for every Kayla surface.
//
// Three layers:
//   1. Platform knowledge (RAG)  — semantic search over businesses/reviews/events
//   2. Personal memory           — prior conversations + business context
//   3. Verified learnings        — only lessons that have been confirmed
//
// Previously this lived only inside ai-chat-orchestrator, which is why the
// main chat widget had no memory at all. Both now import from here.
// =============================================================================

// ---------------------------------------------------------------------------
// 1. PLATFORM KNOWLEDGE (RAG)
// ---------------------------------------------------------------------------

/** Embed a query. Uses the Lovable AI Gateway so it works with no extra keys. */
async function getQueryEmbedding(text: string, lovableApiKey: string): Promise<number[] | null> {
  try {
    const res = await fetch("https://ai.gateway.lovable.dev/v1/embeddings", {
      method: "POST",
      headers: { Authorization: `Bearer ${lovableApiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        input: text.substring(0, 2000),
        model: "text-embedding-3-small",
        dimensions: 768,
      }),
    });
    if (!res.ok) {
      console.warn("[kayla-memory] embedding failed:", res.status);
      return null;
    }
    const data = await res.json();
    return data.data?.[0]?.embedding ?? null;
  } catch (e) {
    console.error("[kayla-memory] embedding error:", e);
    return null;
  }
}

/** Semantic search over the platform's indexed businesses, reviews and events. */
export async function retrieveRAGContext(
  userMessage: string,
  lovableApiKey: string,
  supabase: any,
): Promise<string> {
  try {
    const embedding = await getQueryEmbedding(userMessage, lovableApiKey);
    if (!embedding) return "";

    const { data, error } = await supabase.rpc("match_embeddings", {
      query_embedding: `[${embedding.join(",")}]`,
      match_threshold: 0.4,
      match_count: 8,
    });

    if (error || !data?.length) return "";

    const parts = data.map((item: any) => {
      const meta = item.metadata || {};
      const sim = (item.similarity * 100).toFixed(0);
      if (item.content_type === "business") {
        return `[Business: ${meta.business_name || "Unknown"} | ${meta.category || ""} | ${meta.city || ""}, ${meta.state || ""} | Relevance: ${sim}%]\n${item.content_text}`;
      }
      if (item.content_type === "review") {
        return `[Review for ${meta.business_name || "Unknown"} | Rating: ${meta.rating}/5 | Relevance: ${sim}%]\n${item.content_text}`;
      }
      if (item.content_type === "event") {
        return `[Event: ${meta.title || "Unknown"} | ${meta.location || ""} | Relevance: ${sim}%]\n${item.content_text}`;
      }
      return item.content_text;
    });

    console.log(`[kayla-memory] RAG matched ${data.length} records`);
    return "\n\n[PLATFORM KNOWLEDGE — real records from 1325.AI. Use these to answer accurately about specific businesses, reviews and events. Do not invent anything beyond them.]:\n" + parts.join("\n\n");
  } catch (e) {
    console.error("[kayla-memory] RAG error:", e);
    return "";
  }
}

// ---------------------------------------------------------------------------
// 2 + 3. PERSONAL MEMORY AND VERIFIED LEARNINGS
// ---------------------------------------------------------------------------

/**
 * What Kayla remembers about this specific person: their last few
 * conversations, their business context, and lessons that have been VERIFIED.
 *
 * Unverified learnings are deliberately excluded — an unconfirmed guess should
 * never be repeated back to the user as if it were established fact.
 */
export async function retrievePersonalMemory(
  userId: string,
  supabase: any,
  currentSessionId: string | null,
): Promise<string> {
  try {
    let sessionQuery = supabase
      .from("ai_chat_sessions")
      .select("title, messages, updated_at")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(3);
    if (currentSessionId) sessionQuery = sessionQuery.neq("id", currentSessionId);
    const { data: priorSessions } = await sessionQuery;

    const { data: business } = await supabase
      .from("businesses")
      .select("id, business_name")
      .eq("owner_id", userId)
      .maybeSingle();

    let learnings: any[] = [];
    let bizContext: any = null;

    if (business?.id) {
      const [{ data: l }, { data: ctx }] = await Promise.all([
        supabase
          .from("kayla_learnings")
          .select("learning, agent_name, confidence, verified, created_at")
          .eq("business_id", business.id)
          .eq("verified", true)
          .gte("confidence", 0.7)
          .order("created_at", { ascending: false })
          .limit(8),
        supabase
          .from("kayla_business_context")
          .select("summary, goals, preferences, key_metrics")
          .eq("business_id", business.id)
          .maybeSingle(),
      ]);
      learnings = l || [];
      bizContext = ctx || null;
    }

    if (!priorSessions?.length && !learnings.length && !bizContext) return "";

    const parts: string[] = [
      "\n\n[KAYLA PERSONAL MEMORY — what you remember about this user. Reference it naturally; never recite it back as a list.]",
    ];

    if (bizContext) {
      parts.push(`\nBusiness context for ${business?.business_name || "this user"}:`);
      if (bizContext.summary) parts.push(`- Summary: ${bizContext.summary}`);
      if (bizContext.goals) parts.push(`- Goals: ${JSON.stringify(bizContext.goals).slice(0, 300)}`);
      if (bizContext.preferences) parts.push(`- Preferences: ${JSON.stringify(bizContext.preferences).slice(0, 300)}`);
      if (bizContext.key_metrics) parts.push(`- Key metrics: ${JSON.stringify(bizContext.key_metrics).slice(0, 300)}`);
    }

    if (learnings.length) {
      parts.push(`\nVerified lessons about ${business?.business_name || "them"}:`);
      learnings.forEach((l) => parts.push(`- (${l.agent_name}) ${l.learning}`));
    }

    if (priorSessions?.length) {
      parts.push(`\nPrior conversations (most recent first):`);
      priorSessions.forEach((s: any) => {
        const lastUser = Array.isArray(s.messages)
          ? s.messages.filter((m: any) => m.role === "user").slice(-1)[0]
          : null;
        const snippet = lastUser
          ? (typeof lastUser.content === "string" ? lastUser.content : JSON.stringify(lastUser.content)).slice(0, 140)
          : s.title;
        parts.push(`- ${new Date(s.updated_at).toLocaleDateString()}: "${snippet}"`);
      });
    }

    console.log(`[kayla-memory] ${learnings.length} verified learnings, ${priorSessions?.length || 0} prior sessions`);
    return parts.join("\n");
  } catch (e) {
    console.error("[kayla-memory] personal memory failed (non-fatal):", e);
    return "";
  }
}

/**
 * Save/refresh the conversation so memory survives page reloads and new
 * devices. Non-fatal on failure — memory is an enhancement, never a blocker.
 */
export async function persistSession(
  supabase: any,
  sessionId: string,
  userId: string,
  messages: any[],
): Promise<void> {
  try {
    const firstUser = messages.find((m: any) => m.role === "user");
    const title = firstUser
      ? String(typeof firstUser.content === "string" ? firstUser.content : JSON.stringify(firstUser.content)).slice(0, 80)
      : "Kayla session";

    await supabase.from("ai_chat_sessions").upsert(
      {
        id: sessionId,
        user_id: userId,
        title,
        messages,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );
  } catch (e) {
    console.error("[kayla-memory] session upsert failed (non-fatal):", e);
  }
}

/** Normalize a session id from the client, or mint a fresh one. */
export function resolveSessionId(incoming: unknown): string {
  return typeof incoming === "string" && /^[0-9a-f-]{36}$/i.test(incoming)
    ? incoming
    : crypto.randomUUID();
}
