import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RejectionEmailRequest {
  email: string;
  companyName: string;
  reason?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, companyName, reason }: RejectionEmailRequest = await req.json();

    console.log('Sending sponsor rejection email to:', email);

    const emailResponse = await resend.emails.send({
      from: "Mansa Musa Marketplace <noreply@mansamusamarketplace.com>",
      to: [email],
      subject: "Update on Your Corporate Sponsorship Application",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              border-radius: 8px 8px 0 0;
              text-align: center;
            }
            .content {
              background: #ffffff;
              padding: 30px;
              border: 1px solid #e5e7eb;
              border-top: none;
            }
            .footer {
              background: #f9fafb;
              padding: 20px;
              text-align: center;
              border-radius: 0 0 8px 8px;
              font-size: 14px;
              color: #6b7280;
            }
            .button {
              display: inline-block;
              background: #667eea;
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 6px;
              margin: 20px 0;
            }
            .info-box {
              background: #fef3c7;
              border-left: 4px solid #f59e0b;
              padding: 15px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Sponsorship Application Update</h1>
          </div>
          
          <div class="content">
            <p>Dear ${companyName} Team,</p>
            
            <p>Thank you for your interest in becoming a corporate sponsor of Mansa Musa Marketplace.</p>
            
            <p>After careful review, we regret to inform you that we are unable to approve your sponsorship application at this time.</p>
            
            ${reason ? `
              <div class="info-box">
                <strong>Reason:</strong>
                <p>${reason}</p>
              </div>
            ` : ''}
            
            <p>We appreciate your interest in supporting Black economic empowerment and would welcome the opportunity to reconsider your application in the future.</p>
            
            <h3>Next Steps</h3>
            <p>If you have questions about this decision or would like to discuss alternative partnership opportunities, please don't hesitate to reach out to our partnerships team:</p>
            
            <ul>
              <li>📧 Email: partnerships@mansamusa.com</li>
              <li>📞 Phone: (555) 123-4567</li>
            </ul>
            
            <p>Thank you again for considering Mansa Musa Marketplace.</p>
            
            <p>Best regards,<br>
            <strong>The Mansa Musa Marketplace Team</strong></p>
          </div>
          
          <div class="footer">
            <p>© 2025 Mansa Musa Marketplace. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Rejection email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error sending rejection email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
