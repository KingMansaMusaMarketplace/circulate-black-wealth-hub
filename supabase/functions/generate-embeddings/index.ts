import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Generate embedding via OpenAI API
async function generateEmbedding(text: string, openaiApiKey: string): Promise<number[]> {
  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openaiApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input: text.substring(0, 8000),
      model: "text-embedding-3-small",
      dimensions: 768,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Embedding API error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  return data.data?.[0]?.embedding;
}

// Build text representation for each content type
function buildBusinessText(b: any): string {
  const parts = [
    b.business_name || b.name,
    b.description,
    b.category,
    b.city && b.state ? `Located in ${b.city}, ${b.state}` : null,
    b.address,
  ].filter(Boolean);
  return parts.join('. ');
}

function buildReviewText(r: any, businessName?: string): string {
  const parts = [
    businessName ? `Review for ${businessName}` : null,
    `Rating: ${r.rating}/5`,
    r.review_text,
  ].filter(Boolean);
  return parts.join('. ');
}

function buildEventText(e: any): string {
  const parts = [
    e.title,
    e.description,
    e.location ? `At ${e.location}` : null,
    e.event_date ? `Date: ${e.event_date}` : null,
  ].filter(Boolean);
  return parts.join('. ');
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authorization (service role or admin)
    const authHeader = req.headers.get("authorization");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

    if (!OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: "OPENAI_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request
    const body = await req.json().catch(() => ({}));
    const contentType = body.content_type || 'all'; // 'business', 'review', 'event', 'all'
    const batchSize = Math.min(body.batch_size || 50, 100);
    
    let processed = 0;
    let errors = 0;

    // Process businesses
    if (contentType === 'all' || contentType === 'business') {
      const { data: businesses } = await supabase
        .from('businesses')
        .select('id, business_name, name, description, category, city, state, address, is_verified')
        .or('is_verified.eq.true,listing_status.eq.live')
        .limit(batchSize);

      if (businesses) {
        for (const biz of businesses) {
          try {
            // Check if embedding already exists and is fresh
            const { data: existing } = await supabase
              .from('rag_embeddings')
              .select('id, updated_at')
              .eq('content_type', 'business')
              .eq('content_id', biz.id)
              .maybeSingle();

            const text = buildBusinessText(biz);
            const embedding = await generateEmbedding(text, OPENAI_API_KEY);

            const record = {
              content_type: 'business',
              content_id: biz.id,
              content_text: text,
              embedding: `[${embedding.join(',')}]`,
              metadata: { business_name: biz.business_name || biz.name, category: biz.category, city: biz.city, state: biz.state, is_verified: biz.is_verified },
            };

            if (existing) {
              await supabase.from('rag_embeddings').update(record).eq('id', existing.id);
            } else {
              await supabase.from('rag_embeddings').insert(record);
            }
            processed++;
          } catch (e) {
            console.error(`Error embedding business ${biz.id}:`, e);
            errors++;
          }
        }
      }
    }

    // Process reviews
    if (contentType === 'all' || contentType === 'review') {
      const { data: reviews } = await supabase
        .from('reviews')
        .select('id, business_id, rating, review_text, is_verified')
        .not('review_text', 'is', null)
        .eq('is_flagged', false)
        .limit(batchSize);

      if (reviews) {
        // Get business names for context
        const bizIds = [...new Set(reviews.map(r => r.business_id))];
        const { data: bizNames } = await supabase
          .from('businesses')
          .select('id, business_name')
          .in('id', bizIds);
        const nameMap = new Map((bizNames || []).map(b => [b.id, b.business_name]));

        for (const review of reviews) {
          try {
            const { data: existing } = await supabase
              .from('rag_embeddings')
              .select('id')
              .eq('content_type', 'review')
              .eq('content_id', review.id)
              .maybeSingle();

            const text = buildReviewText(review, nameMap.get(review.business_id));
            const embedding = await generateEmbedding(text, OPENAI_API_KEY);

            const record = {
              content_type: 'review',
              content_id: review.id,
              content_text: text,
              embedding: `[${embedding.join(',')}]`,
              metadata: { business_id: review.business_id, rating: review.rating, business_name: nameMap.get(review.business_id) },
            };

            if (existing) {
              await supabase.from('rag_embeddings').update(record).eq('id', existing.id);
            } else {
              await supabase.from('rag_embeddings').insert(record);
            }
            processed++;
          } catch (e) {
            console.error(`Error embedding review ${review.id}:`, e);
            errors++;
          }
        }
      }
    }

    // Process community events
    if (contentType === 'all' || contentType === 'event') {
      const { data: events } = await supabase
        .from('community_events')
        .select('id, title, description, location, event_date, is_featured')
        .limit(batchSize);

      if (events) {
        for (const event of events) {
          try {
            const { data: existing } = await supabase
              .from('rag_embeddings')
              .select('id')
              .eq('content_type', 'event')
              .eq('content_id', event.id)
              .maybeSingle();

            const text = buildEventText(event);
            const embedding = await generateEmbedding(text, OPENAI_API_KEY);

            const record = {
              content_type: 'event',
              content_id: event.id,
              content_text: text,
              embedding: `[${embedding.join(',')}]`,
              metadata: { title: event.title, location: event.location, event_date: event.event_date, is_featured: event.is_featured },
            };

            if (existing) {
              await supabase.from('rag_embeddings').update(record).eq('id', existing.id);
            } else {
              await supabase.from('rag_embeddings').insert(record);
            }
            processed++;
          } catch (e) {
            console.error(`Error embedding event ${event.id}:`, e);
            errors++;
          }
        }
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      processed, 
      errors,
      message: `Processed ${processed} embeddings with ${errors} errors` 
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Generate embeddings error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? (error as Error).message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
