import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

/**
 * Send B2B Invitation Edge Function
 * Invites discovered businesses to join the Mansa Musa Marketplace
 */

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InvitationRequest {
  businessName: string;
  businessEmail: string;
  inviterName: string;
  inviterBusinessName?: string;
  category: string;
  personalMessage?: string;
  leadId?: string;
  invitationToken?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      businessName, 
      businessEmail, 
      inviterName, 
      inviterBusinessName,
      category,
      personalMessage,
      leadId,
      invitationToken
    }: InvitationRequest = await req.json();

    // Validate required fields
    if (!businessName || !businessEmail) {
      return new Response(
        JSON.stringify({ error: "Business name and email are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(businessEmail)) {
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Sending B2B invitation to: ${businessName} (${businessEmail})`);

    // Build signup URL with UTM params for tracking
    const utmParams = new URLSearchParams({
      utm_source: 'b2b_invitation',
      utm_medium: 'email',
      utm_campaign: 'lead_discovery',
      utm_content: category || 'general',
      ...(leadId && { lead_id: leadId }),
      ...(invitationToken && { token: invitationToken })
    });
    
    const signupUrl = `https://mansamusa.app/business/signup?${utmParams.toString()}`;
    
    // Build tracking pixel URL for open tracking
    const trackingPixelUrl = invitationToken 
      ? `https://agoclnqfyinwjxdmjnns.supabase.co/functions/v1/track-invitation?token=${invitationToken}&action=open`
      : null;

    const clickTrackingUrl = invitationToken
      ? `https://agoclnqfyinwjxdmjnns.supabase.co/functions/v1/track-invitation?token=${invitationToken}&action=click&redirect=${encodeURIComponent(signupUrl)}`
      : signupUrl;
    
    const emailResponse = await resend.emails.send({
      from: "Mansa Musa Marketplace <noreply@mansamusa.app>",
      to: [businessEmail],
      subject: `${inviterName} invites you to join the Mansa Musa B2B Marketplace`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Join Mansa Musa Marketplace</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          ${trackingPixelUrl ? `<img src="${trackingPixelUrl}" width="1" height="1" style="display:none;" alt="" />` : ''}
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="max-width: 600px;">
                  <!-- Header -->
                  <tr>
                    <td style="text-align: center; padding-bottom: 30px;">
                      <h1 style="color: #f59e0b; font-size: 28px; margin: 0;">Mansa Musa</h1>
                      <p style="color: #94a3b8; font-size: 14px; margin: 5px 0 0 0;">B2B Marketplace</p>
                    </td>
                  </tr>
                  
                  <!-- Main Content -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-radius: 16px; padding: 40px; border: 1px solid rgba(255,255,255,0.1);">
                      <h2 style="color: #ffffff; font-size: 24px; margin: 0 0 20px 0;">
                        Hello ${businessName}! 👋
                      </h2>
                      
                      <p style="color: #cbd5e1; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                        <strong style="color: #f59e0b;">${inviterName}</strong>${inviterBusinessName ? ` from <strong style="color: #f59e0b;">${inviterBusinessName}</strong>` : ''} 
                        discovered your business while searching for <strong style="color: #3b82f6;">${category}</strong> suppliers 
                        and thinks you'd be a great fit for our community!
                      </p>
                      
                      ${personalMessage ? `
                      <div style="background-color: rgba(59, 130, 246, 0.1); border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0;">
                        <p style="color: #93c5fd; font-size: 14px; margin: 0; font-style: italic;">
                          "${personalMessage}"
                        </p>
                        <p style="color: #64748b; font-size: 12px; margin: 10px 0 0 0;">— ${inviterName}</p>
                      </div>
                      ` : ''}
                      
                      <div style="background-color: rgba(245, 158, 11, 0.1); border-radius: 12px; padding: 20px; margin: 25px 0;">
                        <h3 style="color: #f59e0b; font-size: 18px; margin: 0 0 15px 0;">Why Join Mansa Musa?</h3>
                        <ul style="color: #cbd5e1; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
                          <li><strong>Connect with Black-owned businesses</strong> actively seeking suppliers like you</li>
                          <li><strong>Keep money circulating</strong> in our community 6x longer</li>
                          <li><strong>Access B2B opportunities</strong> from verified member businesses</li>
                          <li><strong>Build lasting partnerships</strong> with businesses that share your values</li>
                        </ul>
                      </div>
                      
                      <div style="text-align: center; margin: 30px 0;">
                        <a href="${clickTrackingUrl}" style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #0f172a; text-decoration: none; padding: 16px 40px; font-size: 16px; font-weight: 600; border-radius: 8px;">
                          Join the Marketplace →
                        </a>
                      </div>
                      
                      <p style="color: #64748b; font-size: 13px; text-align: center; margin: 25px 0 0 0;">
                        It's free to create a business profile and list your capabilities.
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="text-align: center; padding-top: 30px;">
                      <p style="color: #475569; font-size: 12px; margin: 0;">
                        © ${new Date().getFullYear()} Mansa Musa Marketplace. All rights reserved.
                      </p>
                      <p style="color: #475569; font-size: 11px; margin: 10px 0 0 0;">
                        You received this email because a member discovered your business through our platform.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    console.log("B2B invitation email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, messageId: emailResponse.data?.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in send-b2b-invitation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
