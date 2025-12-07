import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotifyRequest {
  businessId: string;
  senderName: string;
  subject: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { businessId, senderName, subject }: NotifyRequest = await req.json();

    if (!businessId || !senderName || !subject) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get business owner info
    const { data: business, error: businessError } = await supabaseClient
      .from("businesses")
      .select("business_name, owner_id, email")
      .eq("id", businessId)
      .single();

    if (businessError || !business) {
      console.error("Business not found:", businessError);
      return new Response(
        JSON.stringify({ error: "Business not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get owner's email from profiles if business email not set
    let recipientEmail = business.email;
    if (!recipientEmail) {
      const { data: profile } = await supabaseClient
        .from("profiles")
        .select("email")
        .eq("id", business.owner_id)
        .single();
      
      recipientEmail = profile?.email;
    }

    if (!recipientEmail) {
      console.log("No recipient email found for business:", businessId);
      return new Response(
        JSON.stringify({ success: true, message: "No email to notify" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Send email notification via Resend
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.log("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ success: true, message: "Email notifications not configured" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "Mansa Musa Marketplace <notifications@mansamusamarketplace.com>",
        to: [recipientEmail],
        subject: `New Contact Request: ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #1e40af, #1e3a8a); padding: 20px; text-align: center;">
              <h1 style="color: #fbbf24; margin: 0;">New Contact Request</h1>
            </div>
            <div style="padding: 20px; background: #f8fafc;">
              <p>Hello,</p>
              <p>You have received a new contact request for <strong>${business.business_name}</strong> on Mansa Musa Marketplace.</p>
              <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #fbbf24;">
                <p style="margin: 0 0 10px 0;"><strong>From:</strong> ${senderName}</p>
                <p style="margin: 0;"><strong>Subject:</strong> ${subject}</p>
              </div>
              <p>Log in to your dashboard to view the full message and respond.</p>
              <a href="https://mansamusamarketplace.com/business/dashboard" 
                 style="display: inline-block; background: #fbbf24; color: #1e293b; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                View Message
              </a>
            </div>
            <div style="padding: 15px; text-align: center; color: #64748b; font-size: 12px;">
              <p>Mansa Musa Marketplace - Empowering Black-Owned Businesses</p>
            </div>
          </div>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error("Failed to send email:", errorText);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in notify-business-contact:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
