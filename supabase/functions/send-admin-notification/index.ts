import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const adminEmail = Deno.env.get("ADMIN_EMAIL")!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AdminNotificationRequest {
  type: 'business_verification_submitted' | 'agent_milestone_reached';
  data: {
    // For business verification
    businessId?: string;
    businessName?: string;
    ownerEmail?: string;
    verificationId?: string;
    
    // For agent milestone
    agentId?: string;
    agentName?: string;
    agentEmail?: string;
    milestoneType?: string;
    milestoneValue?: number;
    previousValue?: number;
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, data }: AdminNotificationRequest = await req.json();

    console.log(`Processing admin notification: ${type}`);

    let subject = "";
    let htmlContent = "";

    switch (type) {
      case 'business_verification_submitted':
        subject = `🔔 New Business Verification: ${data.businessName}`;
        htmlContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #1a365d 0%, #2563eb 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
                .info-box { background: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0; }
                .info-row { display: flex; justify-content: space-between; margin: 10px 0; }
                .label { font-weight: bold; color: #4b5563; }
                .value { color: #1f2937; }
                .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
                .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🔔 New Business Verification Submitted</h1>
                </div>
                <div class="content">
                  <p>A new business has submitted their verification documents and is awaiting review.</p>
                  
                  <div class="info-box">
                    <h3>Business Details</h3>
                    <div class="info-row">
                      <span class="label">Business Name:</span>
                      <span class="value">${data.businessName}</span>
                    </div>
                    <div class="info-row">
                      <span class="label">Owner Email:</span>
                      <span class="value">${data.ownerEmail || 'Not provided'}</span>
                    </div>
                    <div class="info-row">
                      <span class="label">Business ID:</span>
                      <span class="value">${data.businessId}</span>
                    </div>
                    <div class="info-row">
                      <span class="label">Verification ID:</span>
                      <span class="value">${data.verificationId}</span>
                    </div>
                  </div>

                  <p><strong>Action Required:</strong> Please review the verification documents and approve or reject the submission.</p>

                  <center>
                    <a href="${supabaseUrl.replace('.supabase.co', '.lovableproject.com')}/admin-dashboard" class="button">
                      Review Verification →
                    </a>
                  </center>

                  <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
                    This notification was sent because a new business verification was submitted to Mansa Musa Marketplace.
                  </p>
                </div>
                <div class="footer">
                  <p>Mansa Musa Marketplace Admin System</p>
                  <p>Building economic empowerment in the Black community</p>
                </div>
              </div>
            </body>
          </html>
        `;
        break;

      case 'agent_milestone_reached':
        const milestoneEmojis: { [key: string]: string } = {
          'first_referral': '🎉',
          'referrals_10': '🎯',
          'referrals_25': '🌟',
          'referrals_50': '💎',
          'referrals_100': '👑',
          'earnings_100': '💰',
          'earnings_500': '💵',
          'earnings_1000': '🏆',
          'earnings_5000': '🚀',
          'conversion_50': '📈',
          'conversion_75': '⭐',
        };

        const milestoneDescriptions: { [key: string]: string } = {
          'first_referral': 'First Referral',
          'referrals_10': '10 Referrals',
          'referrals_25': '25 Referrals',
          'referrals_50': '50 Referrals',
          'referrals_100': '100 Referrals',
          'earnings_100': '$100 Earned',
          'earnings_500': '$500 Earned',
          'earnings_1000': '$1,000 Earned',
          'earnings_5000': '$5,000 Earned',
          'conversion_50': '50% Conversion Rate',
          'conversion_75': '75% Conversion Rate',
        };

        const emoji = milestoneEmojis[data.milestoneType || ''] || '🎊';
        const milestoneDesc = milestoneDescriptions[data.milestoneType || ''] || data.milestoneType;

        subject = `${emoji} Agent Milestone: ${data.agentName} - ${milestoneDesc}`;
        htmlContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
                .milestone-box { background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #10b981; text-align: center; }
                .milestone-title { font-size: 24px; font-weight: bold; color: #059669; margin: 10px 0; }
                .info-box { background: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0; }
                .info-row { display: flex; justify-content: space-between; margin: 10px 0; }
                .label { font-weight: bold; color: #4b5563; }
                .value { color: #1f2937; }
                .button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
                .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>${emoji} Sales Agent Milestone Reached!</h1>
                </div>
                <div class="content">
                  <div class="milestone-box">
                    <div style="font-size: 48px;">${emoji}</div>
                    <div class="milestone-title">${milestoneDesc}</div>
                    <p style="color: #059669; font-weight: 600;">Congratulations!</p>
                  </div>

                  <p>Great news! One of your sales agents has reached an important milestone.</p>
                  
                  <div class="info-box">
                    <h3>Agent Details</h3>
                    <div class="info-row">
                      <span class="label">Agent Name:</span>
                      <span class="value">${data.agentName}</span>
                    </div>
                    <div class="info-row">
                      <span class="label">Email:</span>
                      <span class="value">${data.agentEmail}</span>
                    </div>
                    <div class="info-row">
                      <span class="label">Milestone Type:</span>
                      <span class="value">${milestoneDesc}</span>
                    </div>
                    <div class="info-row">
                      <span class="label">Current Value:</span>
                      <span class="value">${data.milestoneValue}</span>
                    </div>
                  </div>

                  <p><strong>Consider:</strong></p>
                  <ul>
                    <li>Sending a congratulatory message to the agent</li>
                    <li>Featuring them in agent spotlight communications</li>
                    <li>Reviewing if they qualify for bonus rewards</li>
                  </ul>

                  <center>
                    <a href="${supabaseUrl.replace('.supabase.co', '.lovableproject.com')}/admin-dashboard" class="button">
                      View Agent Dashboard →
                    </a>
                  </center>

                  <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
                    This notification was sent because an agent reached a performance milestone.
                  </p>
                </div>
                <div class="footer">
                  <p>Mansa Musa Marketplace Admin System</p>
                  <p>Building economic empowerment in the Black community</p>
                </div>
              </div>
            </body>
          </html>
        `;
        break;

      default:
        throw new Error(`Unknown notification type: ${type}`);
    }

    console.log(`Sending admin notification to ${adminEmail}`);
    
    const emailResponse = await resend.emails.send({
      from: "Mansa Musa Admin <onboarding@resend.dev>",
      to: [adminEmail],
      subject: subject,
      html: htmlContent,
    });
    
    console.log("Admin notification sent successfully:", emailResponse);

    // Log the notification in database
    const { error: dbError } = await supabase
      .from('email_notifications')
      .insert({
        user_id: data.agentId || data.businessId || '00000000-0000-0000-0000-000000000000',
        email_type: `admin_${type}`,
        recipient_email: adminEmail,
        subject: subject,
        content: htmlContent,
        status: 'sent'
      });

    if (dbError) {
      console.error('Database logging error:', dbError);
      // Don't fail the request if logging fails
    }

    return new Response(JSON.stringify({ 
      success: true,
      emailId: emailResponse.id 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-admin-notification function:", error);
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
