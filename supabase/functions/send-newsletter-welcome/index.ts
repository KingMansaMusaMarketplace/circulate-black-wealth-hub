import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NewsletterWelcomeRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: NewsletterWelcomeRequest = await req.json();

    console.log('Sending newsletter welcome email to:', email);

    const emailResponse = await resend.emails.send({
      from: "Mansa Musa Marketplace <newsletter@mansamusamarketplace.com>",
      to: [email],
      subject: "Welcome to Mansa Musa Marketplace Newsletter! 🎉",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Mansa Musa Marketplace</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                      <td style="background: linear-gradient(135deg, #D4AF37 0%, #FFD700 100%); padding: 40px 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
                        <h1 style="margin: 0; color: #1a1a1a; font-size: 32px; font-weight: bold;">
                          Welcome to Mansa Musa! 🎉
                        </h1>
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px;">
                        <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                          Thank you for subscribing to our newsletter! We're thrilled to have you join our community of conscious consumers supporting Black-owned businesses.
                        </p>
                        
                        <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                          Here's what you can expect from us:
                        </p>
                        
                        <ul style="margin: 0 0 30px; padding-left: 20px; font-size: 16px; line-height: 1.8; color: #333333;">
                          <li>Featured Black-owned businesses in your area</li>
                          <li>Exclusive deals and special offers</li>
                          <li>Community impact stories</li>
                          <li>Updates on new marketplace features</li>
                        </ul>
                        
                        <div style="text-align: center; margin: 30px 0;">
                          <a href="https://agoclnqfyinwjxdmjnns.supabase.co" 
                             style="display: inline-block; background: linear-gradient(135deg, #D4AF37 0%, #FFD700 100%); color: #1a1a1a; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: bold; font-size: 16px;">
                            Explore the Marketplace
                          </a>
                        </div>
                        
                        <p style="margin: 30px 0 0; font-size: 16px; line-height: 1.6; color: #333333;">
                          Together, we're building economic empowerment and community wealth.
                        </p>
                        
                        <p style="margin: 10px 0 0; font-size: 16px; line-height: 1.6; color: #333333;">
                          With gratitude,<br>
                          <strong>The Mansa Musa Team</strong>
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="background-color: #f9f9f9; padding: 30px 40px; border-radius: 0 0 8px 8px; text-align: center;">
                        <p style="margin: 0 0 10px; font-size: 14px; color: #666666;">
                          You're receiving this email because you subscribed to our newsletter.
                        </p>
                        <p style="margin: 0; font-size: 14px; color: #999999;">
                          © ${new Date().getFullYear()} Mansa Musa Marketplace. All rights reserved.
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

    console.log('Newsletter welcome email sent successfully:', emailResponse);

    return new Response(
      JSON.stringify({ success: true, data: emailResponse }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error sending newsletter welcome email:", error);
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
