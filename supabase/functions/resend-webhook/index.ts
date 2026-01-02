import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/**
 * Resend Webhook Handler
 * Receives email events from Resend and stores them in the database
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, svix-id, svix-timestamp, svix-signature",
};

interface ResendWebhookPayload {
  type: string;
  created_at: string;
  data: {
    email_id: string;
    from: string;
    to: string[];
    subject: string;
    created_at: string;
    headers?: Array<{ name: string; value: string }>;
    tags?: Record<string, string>;
    click?: { link: string };
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Only accept POST requests
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const payload: ResendWebhookPayload = await req.json();
    
    console.log("Received Resend webhook:", JSON.stringify(payload, null, 2));

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Map Resend event types to our event types
    const eventTypeMap: Record<string, string> = {
      "email.sent": "sent",
      "email.delivered": "delivered",
      "email.opened": "opened",
      "email.clicked": "clicked",
      "email.bounced": "bounced",
      "email.complained": "complained",
    };

    const eventType = eventTypeMap[payload.type];
    if (!eventType) {
      console.log("Unknown event type:", payload.type);
      return new Response("OK", { status: 200, headers: corsHeaders });
    }

    const recipientEmail = payload.data.to[0];
    const emailId = payload.data.email_id;
    const subject = payload.data.subject;

    // Try to find associated lead by email
    let leadId: string | null = null;
    const { data: lead } = await supabase
      .from("b2b_external_leads")
      .select("id")
      .eq("contact_info->email", recipientEmail)
      .maybeSingle();

    if (lead) {
      leadId = lead.id;
    }

    // Insert email event
    const { error: insertError } = await supabase
      .from("email_events")
      .insert({
        email_id: emailId,
        event_type: eventType,
        recipient_email: recipientEmail,
        subject: subject,
        lead_id: leadId,
        metadata: {
          from: payload.data.from,
          created_at: payload.data.created_at,
          click_link: payload.data.click?.link,
          tags: payload.data.tags,
        },
      });

    if (insertError) {
      console.error("Error inserting email event:", insertError);
      // Don't fail the webhook, just log the error
    } else {
      console.log(`Successfully recorded ${eventType} event for ${recipientEmail}`);
    }

    // Update lead if this is an open or click event
    if (leadId && (eventType === "opened" || eventType === "clicked")) {
      const updateField = eventType === "opened" ? "invitation_opened_at" : "invitation_clicked_at";
      
      // Only update if not already set (first open/click)
      const { error: updateError } = await supabase
        .from("b2b_external_leads")
        .update({
          [updateField]: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", leadId)
        .is(updateField, null);

      if (updateError) {
        console.error("Error updating lead:", updateError);
      } else {
        console.log(`Updated lead ${leadId} with ${updateField}`);
      }
    }

    return new Response("OK", { status: 200, headers: corsHeaders });
  } catch (error: any) {
    console.error("Error processing webhook:", error);
    // Return 200 to prevent Resend from retrying
    return new Response("OK", { status: 200, headers: corsHeaders });
  }
};

serve(handler);
