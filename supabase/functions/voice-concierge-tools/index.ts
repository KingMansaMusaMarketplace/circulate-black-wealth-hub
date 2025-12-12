import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from 'https://esm.sh/zod@3.23.8';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Rate limiting store (in-memory, resets on function cold start)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string, maxRequests = 20, windowMs = 60000): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);
  
  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (entry.count >= maxRequests) return false;
  entry.count++;
  return true;
}

// UUID validation regex
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// Zod schema for input validation
const VoiceConciergeRequestSchema = z.object({
  tool_name: z.enum([
    'search_businesses',
    'get_business_details',
    'check_availability',
    'get_recommendations',
    'check_coalition_points',
    'start_booking'
  ]),
  arguments: z.record(z.unknown()).optional().default({}),
  user_id: z.string().regex(uuidRegex).optional().nullable(),
});

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Apply rate limiting
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    
    if (!checkRateLimit(clientIP, 20, 60000)) { // 20 requests per minute
      console.log(`Rate limit exceeded for IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please wait a moment before trying again.' }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse and validate input
    const rawBody = await req.json();
    const parseResult = VoiceConciergeRequestSchema.safeParse(rawBody);
    
    if (!parseResult.success) {
      const errors = parseResult.error.issues.map(i => i.message).join(', ');
      console.log('Validation error:', errors);
      return new Response(
        JSON.stringify({ error: `Validation error: ${errors}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { tool_name, arguments: args, user_id } = parseResult.data;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log(`Voice concierge tool called: ${tool_name}`, args);

    let result: any = null;

    switch (tool_name) {
      case "search_businesses": {
        let query = supabase
          .from("businesses")
          .select("id, business_name, category, description, city, state, average_rating, review_count, logo_url")
          .eq("is_verified", true);

        if (args.category) {
          query = query.ilike("category", `%${args.category}%`);
        }
        if (args.city) {
          query = query.ilike("city", `%${args.city}%`);
        }
        if (args.min_rating) {
          query = query.gte("average_rating", args.min_rating);
        }
        if (args.query) {
          query = query.or(`business_name.ilike.%${args.query}%,description.ilike.%${args.query}%,category.ilike.%${args.query}%`);
        }

        const { data, error } = await query.limit(10);
        if (error) throw error;

        result = {
          businesses: data,
          count: data?.length || 0,
          message: data?.length 
            ? `Found ${data.length} businesses matching your criteria.`
            : "No businesses found matching your criteria.",
        };
        break;
      }

      case "get_business_details": {
        const { data, error } = await supabase
          .from("businesses")
          .select(`
            id, business_name, category, description, 
            address, city, state, zip_code, phone, website,
            average_rating, review_count, logo_url, banner_url
          `)
          .eq("id", args.business_id)
          .single();

        if (error) throw error;

        // Get services if available
        const { data: services } = await supabase
          .from("business_services")
          .select("id, name, description, price, duration_minutes")
          .eq("business_id", args.business_id)
          .eq("is_active", true)
          .limit(5);

        result = {
          business: data,
          services: services || [],
          message: data 
            ? `Here are the details for ${data.business_name}.`
            : "Business not found.",
        };
        break;
      }

      case "check_availability": {
        const { data: availability } = await supabase
          .from("business_availability")
          .select("day_of_week, start_time, end_time, is_available")
          .eq("business_id", args.business_id);

        const requestedDate = new Date(args.date);
        const dayOfWeek = requestedDate.getDay();
        const dayAvailability = availability?.find(a => a.day_of_week === dayOfWeek);

        result = {
          available: dayAvailability?.is_available || false,
          hours: dayAvailability 
            ? `${dayAvailability.start_time} - ${dayAvailability.end_time}`
            : null,
          message: dayAvailability?.is_available
            ? `The business is available on that day from ${dayAvailability.start_time} to ${dayAvailability.end_time}.`
            : "The business is not available on that day.",
        };
        break;
      }

      case "get_recommendations": {
        // Get user's past interactions for personalization
        let recommendations: any[] = [];
        
        if (user_id) {
          const { data: interactions } = await supabase
            .from("business_interactions")
            .select("business_id")
            .eq("user_id", user_id)
            .order("created_at", { ascending: false })
            .limit(5);

          const visitedIds = interactions?.map(i => i.business_id) || [];

          // Get similar businesses or top-rated
          const { data } = await supabase
            .from("businesses")
            .select("id, business_name, category, description, city, average_rating, logo_url")
            .eq("is_verified", true)
            .order("average_rating", { ascending: false })
            .limit(5);

          recommendations = data || [];
        } else {
          // For non-authenticated users, just return top-rated
          const { data } = await supabase
            .from("businesses")
            .select("id, business_name, category, description, city, average_rating, logo_url")
            .eq("is_verified", true)
            .order("average_rating", { ascending: false })
            .limit(5);

          recommendations = data || [];
        }

        result = {
          recommendations,
          count: recommendations.length,
          message: recommendations.length 
            ? `Here are ${recommendations.length} recommended businesses for you.`
            : "I couldn't find specific recommendations right now.",
        };
        break;
      }

      case "check_coalition_points": {
        if (!user_id) {
          result = {
            points: 0,
            tier: null,
            message: "Please log in to check your coalition points.",
          };
          break;
        }

        const { data } = await supabase
          .from("coalition_points")
          .select("points, lifetime_earned, tier")
          .eq("customer_id", user_id)
          .single();

        result = {
          points: data?.points || 0,
          lifetime_earned: data?.lifetime_earned || 0,
          tier: data?.tier || "bronze",
          message: data
            ? `You have ${data.points} coalition points and you're a ${data.tier} member with ${data.lifetime_earned} lifetime points earned.`
            : "You don't have any coalition points yet. Start earning by visiting coalition businesses!",
        };
        break;
      }

      case "start_booking": {
        // For now, return booking information - actual booking would need more implementation
        result = {
          success: false,
          message: "To complete your booking, please visit the business page directly. I can provide you the link if you'd like.",
          booking_url: `/business/${args.business_id}`,
        };
        break;
      }

      default:
        result = {
          error: "Unknown tool",
          message: "I'm not sure how to help with that. Can you try asking in a different way?",
        };
    }

    console.log(`Voice concierge tool result:`, result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Voice concierge tool error:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        message: "I encountered an error. Please try again.",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
