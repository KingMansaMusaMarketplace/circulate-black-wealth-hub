import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/**
 * Track Invitation Opens and Clicks
 * Records when invitation emails are opened or clicked
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// 1x1 transparent GIF for tracking pixel
const TRACKING_PIXEL = new Uint8Array([
  0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 
  0x80, 0x00, 0x00, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x21, 
  0xf9, 0x04, 0x01, 0x00, 0x00, 0x00, 0x00, 0x2c, 0x00, 0x00, 
  0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x02, 0x02, 0x44, 
  0x01, 0x00, 0x3b
]);

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");
    const action = url.searchParams.get("action"); // 'open' or 'click'
    const redirect = url.searchParams.get("redirect");

    if (!token) {
      console.log("No token provided");
      // Still return valid response to not break email
      if (action === "open") {
        return new Response(TRACKING_PIXEL, {
          headers: { ...corsHeaders, "Content-Type": "image/gif" },
        });
      }
      return new Response("Missing token", { status: 400, headers: corsHeaders });
    }

    console.log(`Tracking invitation ${action} for token: ${token}`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Update the lead with click tracking
    if (action === "click") {
      const { error } = await supabase
        .from("b2b_external_leads")
        .update({ 
          invitation_clicked_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq("invitation_token", token);

      if (error) {
        console.error("Error updating lead:", error);
      } else {
        console.log("Successfully tracked click for token:", token);
      }

      // Redirect to the signup page
      if (redirect) {
        return new Response(null, {
          status: 302,
          headers: { ...corsHeaders, "Location": redirect },
        });
      }
    }

    // For open tracking, return a 1x1 transparent pixel
    if (action === "open") {
      // We could track opens here too, but clicks are more reliable
      return new Response(TRACKING_PIXEL, {
        headers: { 
          ...corsHeaders, 
          "Content-Type": "image/gif",
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      });
    }

    return new Response("OK", { status: 200, headers: corsHeaders });
  } catch (error: any) {
    console.error("Error in track-invitation function:", error);
    // Return valid response even on error to not break email
    return new Response(TRACKING_PIXEL, {
      headers: { ...corsHeaders, "Content-Type": "image/gif" },
    });
  }
};

serve(handler);
