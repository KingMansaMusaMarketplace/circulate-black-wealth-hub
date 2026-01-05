import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InvitationRequest {
  invitationId: string;
  email: string;
  businessName?: string;
  message?: string;
  inviterName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { invitationId, email, businessName, message, inviterName }: InvitationRequest = await req.json();

    console.log("Sending business invitation to:", email);

    // Create Supabase client to get invitation details
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the invitation token
    const { data: invitation, error: invError } = await supabase
      .from("business_invitations")
      .select("invitation_token")
      .eq("id", invitationId)
      .single();

    if (invError) {
      console.error("Error fetching invitation:", invError);
      throw new Error("Failed to fetch invitation details");
    }

    const signupUrl = `${Deno.env.get("SITE_URL") || "https://mansa-musa-marketplace.lovable.app"}/business-signup?invite=${invitation.invitation_token}`;

    const personalMessage = message 
      ? `<p style="background-color: #f8f9fa; padding: 16px; border-radius: 8px; border-left: 4px solid #d4a017; margin: 20px 0;">
          <strong>Personal message from ${inviterName || "a community member"}:</strong><br/>
          ${message}
        </p>`
      : "";

    const emailResponse = await resend.emails.send({
      from: "Mansa Musa Marketplace <noreply@resend.dev>",
      to: [email],
      subject: `You're Invited to Join Mansa Musa Marketplace${businessName ? ` - ${businessName}` : ""}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1a365d; margin-bottom: 10px;">🏛️ Mansa Musa Marketplace</h1>
            <p style="color: #666; font-size: 14px;">The Premier Directory for Black-Owned Businesses</p>
          </div>

          <div style="background: linear-gradient(135deg, #1a365d 0%, #2d4a6f 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
            <h2 style="margin: 0 0 10px 0; font-size: 24px;">You're Invited! 🎉</h2>
            ${businessName ? `<p style="margin: 0; opacity: 0.9;">for ${businessName}</p>` : ""}
          </div>

          <p>Hello${businessName ? ` from ${businessName}` : ""},</p>

          <p>${inviterName || "A community member"} thinks your business would be a great addition to <strong>Mansa Musa Marketplace</strong> - the growing platform connecting customers with Black-owned businesses across the country.</p>

          ${personalMessage}

          <h3 style="color: #1a365d;">Why Join Our Platform?</h3>
          <ul style="padding-left: 20px;">
            <li>📈 <strong>Increase Visibility</strong> - Get discovered by customers actively seeking Black-owned businesses</li>
            <li>🤝 <strong>B2B Connections</strong> - Network with other businesses for partnerships and suppliers</li>
            <li>⭐ <strong>Build Trust</strong> - Verified business badges and customer reviews</li>
            <li>💰 <strong>Loyalty Programs</strong> - Tools to retain customers and grow revenue</li>
            <li>🌍 <strong>Join a Community</strong> - Be part of a supportive network of entrepreneurs</li>
          </ul>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${signupUrl}" style="display: inline-block; background: linear-gradient(135deg, #d4a017 0%, #f5c842 100%); color: #1a365d; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
              Claim Your Free Listing →
            </a>
          </div>

          <p style="text-align: center; color: #666; font-size: 14px;">
            It only takes 5 minutes to set up your business profile.
          </p>

          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

          <p style="color: #888; font-size: 12px; text-align: center;">
            This invitation was sent by ${inviterName || "a member"} of Mansa Musa Marketplace.<br/>
            If you believe this was sent in error, you can safely ignore this email.
          </p>

        </body>
        </html>
      `,
    });

    console.log("Invitation email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-business-invitation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
