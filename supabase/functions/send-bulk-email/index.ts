import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BulkEmailRequest {
  recipients: string[];
  subject: string;
  content: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { recipients, subject, content }: BulkEmailRequest = await req.json();

    if (!recipients || recipients.length === 0) {
      throw new Error("No recipients provided");
    }

    if (!subject || !content) {
      throw new Error("Subject and content are required");
    }

    console.log(`Sending bulk email to ${recipients.length} recipients`);

    // Send emails in batches to avoid rate limits
    const batchSize = 100;
    const results = [];

    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);
      
      try {
        const emailResponse = await resend.emails.send({
          from: "Mansa Musa Marketplace <onboarding@resend.dev>",
          to: batch,
          subject: subject,
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
                  background: linear-gradient(135deg, #1B365D 0%, #2D5A8C 100%);
                  color: white;
                  padding: 30px;
                  border-radius: 10px 10px 0 0;
                  text-align: center;
                }
                .content {
                  background: white;
                  padding: 30px;
                  border: 1px solid #e5e5e5;
                  border-top: none;
                  border-radius: 0 0 10px 10px;
                }
                .footer {
                  margin-top: 30px;
                  padding-top: 20px;
                  border-top: 1px solid #e5e5e5;
                  text-align: center;
                  font-size: 12px;
                  color: #666;
                }
                .button {
                  display: inline-block;
                  padding: 12px 24px;
                  background: #D4AF37;
                  color: white;
                  text-decoration: none;
                  border-radius: 6px;
                  margin: 20px 0;
                  font-weight: 600;
                }
              </style>
            </head>
            <body>
              <div class="header">
                <h1 style="margin: 0; font-size: 24px;">Mansa Musa Marketplace</h1>
              </div>
              <div class="content">
                ${content.split('\n').map(line => `<p>${line}</p>`).join('')}
                
                <div style="text-align: center; margin-top: 30px;">
                  <a href="https://mansamusamarketplace.com" class="button">Visit Marketplace</a>
                </div>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} Mansa Musa Marketplace. All rights reserved.</p>
                <p>You're receiving this email because you signed up for our platform.</p>
              </div>
            </body>
            </html>
          `,
        });

        results.push({
          batch: Math.floor(i / batchSize) + 1,
          count: batch.length,
          success: true,
          response: emailResponse
        });

        console.log(`Batch ${Math.floor(i / batchSize) + 1} sent successfully`);
      } catch (error) {
        console.error(`Error sending batch ${Math.floor(i / batchSize) + 1}:`, error);
        results.push({
          batch: Math.floor(i / batchSize) + 1,
          count: batch.length,
          success: false,
          error: error.message
        });
      }

      // Small delay between batches to respect rate limits
      if (i + batchSize < recipients.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    const successCount = results.filter(r => r.success).length;
    const totalBatches = results.length;

    return new Response(
      JSON.stringify({
        success: true,
        totalRecipients: recipients.length,
        batches: totalBatches,
        successfulBatches: successCount,
        results
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-bulk-email function:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
