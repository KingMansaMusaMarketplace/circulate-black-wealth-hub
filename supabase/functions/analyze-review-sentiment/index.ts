import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ReviewData {
  id: string;
  rating: number;
  comment: string;
  business_id: string;
  customer_id: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { reviewId, reviewIds } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    
    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch review(s) to analyze
    const reviewIdsToAnalyze = reviewIds || [reviewId];
    const { data: reviews, error: fetchError } = await supabase
      .from('reviews')
      .select('id, rating, comment, business_id, customer_id')
      .in('id', reviewIdsToAnalyze);

    if (fetchError || !reviews || reviews.length === 0) {
      throw new Error('Reviews not found');
    }

    const analyzedReviews = [];

    for (const review of reviews as ReviewData[]) {
      console.log(`Analyzing review ${review.id}`);

      // Build AI prompt for sentiment analysis
      const systemPrompt = `You are an expert sentiment analysis AI for customer reviews. Analyze the review and extract:
1. Overall sentiment (positive, negative, neutral, or mixed)
2. Sentiment score (-1 to 1, where -1 is very negative and 1 is very positive)
3. Confidence score (0 to 1)
4. Key themes mentioned (e.g., food quality, service, atmosphere, cleanliness, pricing, wait time)
5. Extracted topics with sentiment for each
6. Urgency level (low, medium, high, critical) - based on severity of complaints or praise
7. Brief AI summary (1-2 sentences)
8. Emotions detected (e.g., happy, frustrated, disappointed, satisfied)

Consider both the rating and the comment text. Be nuanced - a 3-star review might be mixed sentiment.`;

      const userPrompt = `Review Rating: ${review.rating}/5
Review Comment: ${review.comment || 'No comment provided'}

Analyze this review comprehensively.`;

      // Call Lovable AI for analysis
      const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${lovableApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          tools: [
            {
              type: 'function',
              function: {
                name: 'analyze_sentiment',
                description: 'Extract sentiment analysis from a customer review',
                parameters: {
                  type: 'object',
                  properties: {
                    sentiment: {
                      type: 'string',
                      enum: ['positive', 'negative', 'neutral', 'mixed'],
                      description: 'Overall sentiment classification'
                    },
                    sentiment_score: {
                      type: 'number',
                      description: 'Sentiment score from -1 (very negative) to 1 (very positive)',
                      minimum: -1,
                      maximum: 1
                    },
                    confidence_score: {
                      type: 'number',
                      description: 'Confidence in the analysis from 0 to 1',
                      minimum: 0,
                      maximum: 1
                    },
                    key_themes: {
                      type: 'array',
                      items: { type: 'string' },
                      description: 'Main themes mentioned (e.g., food_quality, service, atmosphere)'
                    },
                    extracted_topics: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          topic: { type: 'string' },
                          sentiment: { type: 'string', enum: ['positive', 'negative', 'neutral'] },
                          mention: { type: 'string' }
                        }
                      },
                      description: 'Specific topics with their sentiment'
                    },
                    urgency_level: {
                      type: 'string',
                      enum: ['low', 'medium', 'high', 'critical'],
                      description: 'How urgent is this review for business attention'
                    },
                    ai_summary: {
                      type: 'string',
                      description: 'Brief 1-2 sentence summary of the review'
                    },
                    emotions: {
                      type: 'object',
                      additionalProperties: { type: 'number' },
                      description: 'Detected emotions with intensity scores'
                    }
                  },
                  required: ['sentiment', 'sentiment_score', 'confidence_score', 'key_themes', 'urgency_level', 'ai_summary']
                }
              }
            }
          ],
          tool_choice: { type: 'function', function: { name: 'analyze_sentiment' } }
        }),
      });

      if (!aiResponse.ok) {
        const errorText = await aiResponse.text();
        console.error('AI API error:', aiResponse.status, errorText);
        
        if (aiResponse.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        }
        if (aiResponse.status === 402) {
          throw new Error('Payment required. Please add credits to your Lovable AI workspace.');
        }
        
        throw new Error(`AI analysis failed: ${errorText}`);
      }

      const aiData = await aiResponse.json();
      const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
      
      if (!toolCall) {
        throw new Error('No analysis data returned from AI');
      }

      const analysis = JSON.parse(toolCall.function.arguments);
      
      // Insert sentiment analysis into database
      const { error: insertError } = await supabase
        .from('review_sentiment_analysis')
        .insert({
          review_id: review.id,
          business_id: review.business_id,
          sentiment: analysis.sentiment,
          sentiment_score: analysis.sentiment_score,
          confidence_score: analysis.confidence_score,
          key_themes: analysis.key_themes || [],
          extracted_topics: analysis.extracted_topics || [],
          urgency_level: analysis.urgency_level,
          ai_summary: analysis.ai_summary,
          emotions: analysis.emotions || {}
        });

      if (insertError) {
        console.error('Error inserting sentiment analysis:', insertError);
        throw insertError;
      }

      analyzedReviews.push({
        reviewId: review.id,
        sentiment: analysis.sentiment,
        urgency: analysis.urgency_level
      });

      // If urgent, create a notification for the business owner
      if (analysis.urgency_level === 'high' || analysis.urgency_level === 'critical') {
        const { data: business } = await supabase
          .from('businesses')
          .select('owner_id, business_name')
          .eq('id', review.business_id)
          .single();

        if (business) {
          await supabase
            .from('notifications')
            .insert({
              user_id: business.owner_id,
              type: 'urgent_review',
              title: `${analysis.urgency_level === 'critical' ? '🚨 Critical' : '⚠️ Urgent'} Review Alert`,
              message: `${analysis.ai_summary}`,
              metadata: {
                review_id: review.id,
                sentiment: analysis.sentiment,
                urgency_level: analysis.urgency_level,
                rating: review.rating
              }
            });
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        analyzedCount: analyzedReviews.length,
        reviews: analyzedReviews
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-review-sentiment:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
