import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  sponsorId: string;
  subject: string;
  content: string;
  template?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { sponsorId, subject, content, template }: EmailRequest = await req.json();

    console.log(`Sending email to sponsor: ${sponsorId}, template: ${template}`);

    // Get sponsor details
    const { data: sponsor, error: sponsorError } = await supabase
      .from("corporate_subscriptions")
      .select("*")
      .eq("id", sponsorId)
      .single();

    if (sponsorError || !sponsor) {
      console.error("Error fetching sponsor:", sponsorError);
      throw new Error("Sponsor not found");
    }

    // Get user email if contact_email is not set
    let recipientEmail = sponsor.contact_email;
    
    if (!recipientEmail && sponsor.user_id) {
      const { data: userData } = await supabase.auth.admin.getUserById(sponsor.user_id);
      recipientEmail = userData?.user?.email;
    }

    if (!recipientEmail) {
      throw new Error("No email address found for sponsor");
    }

    console.log(`Sending to: ${recipientEmail}`);

    // Build HTML email
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1B365D 0%, #2d4a7c 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: #D4AF37; margin: 0; font-size: 24px;">Mansa Musa Marketplace</h1>
            <p style="color: #ffffff; margin: 10px 0 0; font-size: 14px;">Supporting Black-Owned Businesses</p>
          </div>
          
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e5e5; border-top: none;">
            <div style="white-space: pre-wrap; font-size: 16px; color: #333;">
              ${content.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <div style="background: #f5f5f5; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border: 1px solid #e5e5e5; border-top: none;">
            <p style="margin: 0; font-size: 12px; color: #666;">
              Mansa Musa Marketplace<br>
              <a href="https://mansamusamarketplace.com" style="color: #1B365D;">mansamusamarketplace.com</a>
            </p>
          </div>
        </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "Mansa Musa Marketplace <sponsors@resend.dev>",
      to: [recipientEmail],
      subject: subject,
      html: htmlContent,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-sponsor-email function:", error);
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
