import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL") || "admin@1325.ai";
const APP_URL = Deno.env.get("APP_URL") || "https://1325.ai";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  type: 'application' | 'approval' | 'rejection';
  partnerId: string;
  partnerEmail: string;
  partnerName: string;
  tier?: string;
  reason?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, partnerId, partnerEmail, partnerName, tier, reason }: NotificationRequest = await req.json();

    console.log(`Processing ${type} notification for partner: ${partnerName}`);

    let emailResponse;

    switch (type) {
      case 'application':
        // Send confirmation to partner
        emailResponse = await resend.emails.send({
          from: "1325.ai Partners <partners@1325.ai>",
          to: [partnerEmail],
          subject: "We've Received Your Partner Application!",
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
                .header h1 { color: #fbbf24; margin: 0; font-size: 24px; }
                .content { background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px; }
                .highlight { background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #fbbf24; margin: 20px 0; }
                .footer { text-align: center; padding: 20px; color: #64748b; font-size: 14px; }
                .steps { margin: 20px 0; }
                .step { display: flex; align-items: flex-start; margin-bottom: 15px; }
                .step-number { background: #fbbf24; color: #1e293b; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 12px; flex-shrink: 0; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🎉 Application Received!</h1>
                </div>
                <div class="content">
                  <p>Hello <strong>${partnerName}</strong>,</p>
                  
                  <p>Thank you for applying to become a <strong>1325.ai Directory Partner</strong>! We're excited about the possibility of working together to support Black-owned businesses.</p>
                  
                  <div class="highlight">
                    <strong>What happens next?</strong>
                  </div>
                  
                  <div class="steps">
                    <div class="step">
                      <div class="step-number">1</div>
                      <div>
                        <strong>Application Review</strong><br>
                        <span style="color: #64748b;">Our team will review your application within 1-2 business days.</span>
                      </div>
                    </div>
                    <div class="step">
                      <div class="step-number">2</div>
                      <div>
                        <strong>Approval Notification</strong><br>
                        <span style="color: #64748b;">You'll receive an email once your application is approved.</span>
                      </div>
                    </div>
                    <div class="step">
                      <div class="step-number">3</div>
                      <div>
                        <strong>Access Your Dashboard</strong><br>
                        <span style="color: #64748b;">Start referring businesses and earning commissions!</span>
                      </div>
                    </div>
                  </div>
                  
                  <p>If you have any questions, feel free to reply to this email.</p>
                  
                  <p>Best regards,<br><strong>The 1325.ai Partnership Team</strong></p>
                </div>
                <div class="footer">
                  <p>1325.ai - Empowering Black-Owned Businesses</p>
                </div>
              </div>
            </body>
            </html>
          `,
        });

        // Send notification to admin
        await resend.emails.send({
          from: "1325.ai System <noreply@1325.ai>",
          to: [ADMIN_EMAIL],
          subject: `🆕 New Partner Application: ${partnerName}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
                .header h1 { color: #fbbf24; margin: 0; font-size: 24px; }
                .content { background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px; }
                .info-row { display: flex; border-bottom: 1px solid #e2e8f0; padding: 12px 0; }
                .info-label { font-weight: 600; width: 120px; color: #64748b; }
                .info-value { flex: 1; }
                .cta-button { display: inline-block; background: #fbbf24; color: #1e293b; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 20px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>New Partner Application</h1>
                </div>
                <div class="content">
                  <p>A new directory partner application has been submitted and requires review.</p>
                  
                  <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <div class="info-row">
                      <div class="info-label">Directory</div>
                      <div class="info-value">${partnerName}</div>
                    </div>
                    <div class="info-row">
                      <div class="info-label">Email</div>
                      <div class="info-value">${partnerEmail}</div>
                    </div>
                    <div class="info-row">
                      <div class="info-label">Partner ID</div>
                      <div class="info-value" style="font-family: monospace; font-size: 12px;">${partnerId}</div>
                    </div>
                  </div>
                  
                  <a href="${APP_URL}/admin" class="cta-button">Review in Admin Dashboard</a>
                </div>
              </div>
            </body>
            </html>
          `,
        });
        break;

      case 'approval':
        const tierInfo = {
          founding: { name: 'Founding Partner', revenueShare: '15%', flatFee: '$25' },
          premium: { name: 'Premium Partner', revenueShare: '12%', flatFee: '$20' },
          standard: { name: 'Standard Partner', revenueShare: '10%', flatFee: '$15' },
        }[tier || 'standard'];

        emailResponse = await resend.emails.send({
          from: "1325.ai Partners <partners@1325.ai>",
          to: [partnerEmail],
          subject: "🎉 Congratulations! Your Partner Application is Approved!",
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
                .header h1 { color: white; margin: 0; font-size: 24px; }
                .content { background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px; }
                .tier-badge { display: inline-block; background: #fef3c7; color: #92400e; padding: 8px 16px; border-radius: 20px; font-weight: 600; margin: 10px 0; }
                .benefits { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
                .benefit-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e2e8f0; }
                .benefit-row:last-child { border-bottom: none; }
                .cta-button { display: inline-block; background: #059669; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 20px; }
                .footer { text-align: center; padding: 20px; color: #64748b; font-size: 14px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🎉 Welcome to the Partner Program!</h1>
                </div>
                <div class="content">
                  <p>Hello <strong>${partnerName}</strong>,</p>
                  
                  <p>Great news! Your application to become a 1325.ai Directory Partner has been <strong>approved</strong>!</p>
                  
                  <p style="text-align: center;">
                    <span class="tier-badge">✨ ${tierInfo.name}</span>
                  </p>
                  
                  <div class="benefits">
                    <h3 style="margin-top: 0;">Your Partner Benefits</h3>
                    <div class="benefit-row">
                      <span>Revenue Share</span>
                      <strong>${tierInfo.revenueShare}</strong>
                    </div>
                    <div class="benefit-row">
                      <span>Flat Fee per Signup</span>
                      <strong>${tierInfo.flatFee}</strong>
                    </div>
                    <div class="benefit-row">
                      <span>Dedicated Dashboard</span>
                      <strong>✓ Included</strong>
                    </div>
                    <div class="benefit-row">
                      <span>Embed Widget</span>
                      <strong>✓ Included</strong>
                    </div>
                  </div>
                  
                  <p>You can now access your Partner Dashboard to:</p>
                  <ul>
                    <li>Get your unique referral link</li>
                    <li>Track referrals and conversions</li>
                    <li>Monitor your earnings</li>
                    <li>Request payouts</li>
                  </ul>
                  
                  <p style="text-align: center;">
                    <a href="${APP_URL}/partner-portal" class="cta-button">Access Your Dashboard</a>
                  </p>
                  
                  <p>Welcome to the family! We're excited to partner with you.</p>
                  
                  <p>Best regards,<br><strong>The 1325.ai Partnership Team</strong></p>
                </div>
                <div class="footer">
                  <p>1325.ai - Empowering Black-Owned Businesses</p>
                </div>
              </div>
            </body>
            </html>
          `,
        });
        break;

      case 'rejection':
        emailResponse = await resend.emails.send({
          from: "1325.ai Partners <partners@1325.ai>",
          to: [partnerEmail],
          subject: "Update on Your Partner Application",
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
                .header h1 { color: #fbbf24; margin: 0; font-size: 24px; }
                .content { background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px; }
                .footer { text-align: center; padding: 20px; color: #64748b; font-size: 14px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Application Update</h1>
                </div>
                <div class="content">
                  <p>Hello <strong>${partnerName}</strong>,</p>
                  
                  <p>Thank you for your interest in becoming a 1325.ai Directory Partner.</p>
                  
                  <p>After careful review, we've decided not to move forward with your application at this time.</p>
                  
                  ${reason ? `
                  <div style="background: #fef2f2; padding: 15px; border-radius: 8px; border-left: 4px solid #ef4444; margin: 20px 0;">
                    <strong>Feedback:</strong><br>
                    ${reason}
                  </div>
                  ` : ''}
                  
                  <p>This decision doesn't reflect on the quality of your directory. We encourage you to:</p>
                  <ul>
                    <li>Continue building your directory</li>
                    <li>Consider reapplying in the future</li>
                    <li>Reach out if you have questions</li>
                  </ul>
                  
                  <p>We appreciate your interest in supporting Black-owned businesses.</p>
                  
                  <p>Best regards,<br><strong>The 1325.ai Partnership Team</strong></p>
                </div>
                <div class="footer">
                  <p>1325.ai - Empowering Black-Owned Businesses</p>
                </div>
              </div>
            </body>
            </html>
          `,
        });
        break;

      default:
        throw new Error(`Unknown notification type: ${type}`);
    }

    console.log(`${type} notification sent successfully:`, emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-partner-notification:", error);
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
