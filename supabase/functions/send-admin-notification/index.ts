import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AdminNotificationRequest {
  type: 'business_verification_submitted' | 'agent_milestone_reached';
  data: {
    businessId?: string;
    businessName?: string;
    ownerEmail?: string;
    verificationId?: string;
    agentId?: string;
    agentName?: string;
    agentEmail?: string;
    milestoneType?: string;
    milestoneValue?: number;
    previousValue?: number;
  };
}

const getNotificationPreferences = async () => {
  try {
    const { data, error } = await supabase
      .from('admin_notification_preferences')
      .select('*')
      .limit(1)
      .single();

    if (error || !data) {
      console.log('No preferences found, using defaults');
      return null;
    }
    return data;
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return null;
  }
};

const shouldSendNotification = (
  preferences: any,
  type: string,
  milestoneData?: { type: string; value: number }
): boolean => {
  if (!preferences) return true;
  if (!preferences.send_immediate) return false;
  if (type === 'business_verification_submitted') {
    return preferences.business_verification_enabled;
  }
  if (type === 'agent_milestone_reached' && milestoneData) {
    if (!preferences.agent_milestone_enabled) return false;
    const { type: milestoneType, value } = milestoneData;
    if (milestoneType.startsWith('referrals_')) {
      if (!preferences.milestone_referrals_enabled) return false;
      if (value < preferences.min_referral_milestone) return false;
    }
    if (milestoneType.startsWith('earnings_')) {
      if (!preferences.milestone_earnings_enabled) return false;
      if (value < preferences.min_earnings_milestone) return false;
    }
    if (milestoneType.startsWith('conversion_')) {
      if (!preferences.milestone_conversion_enabled) return false;
      if (value < preferences.min_conversion_milestone) return false;
    }
  }
  return true;
};

const getRecipients = (preferences: any): string[] => {
  const adminEmail = Deno.env.get("ADMIN_EMAIL");
  if (!preferences) {
    return adminEmail ? [adminEmail] : [];
  }
  const recipients: string[] = [preferences.notification_email];
  if (preferences.send_to_multiple_emails && preferences.send_to_multiple_emails.length > 0) {
    recipients.push(...preferences.send_to_multiple_emails);
  }
  return recipients.filter(email => email && email.trim() !== '');
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate the caller
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabaseAuth = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } }
    });
    const token = authHeader.replace('Bearer ', '');
    const { data: claims, error: authError } = await supabaseAuth.auth.getUser(token);
    if (authError || !claims?.user) {
      return new Response(
        JSON.stringify({ error: 'Authentication failed' }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { type, data }: AdminNotificationRequest = await req.json();
    console.log(`Processing admin notification: ${type}`);

    const preferences = await getNotificationPreferences();
    const milestoneData = type === 'agent_milestone_reached' && data.milestoneType && data.milestoneValue
      ? { type: data.milestoneType, value: data.milestoneValue }
      : undefined;

    if (!shouldSendNotification(preferences, type, milestoneData)) {
      console.log('Notification blocked by preferences');
      return new Response(JSON.stringify({ success: true, message: 'Notification blocked by preferences' }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const recipients = getRecipients(preferences);
    if (recipients.length === 0) {
      console.error('No recipients configured');
      return new Response(JSON.stringify({ success: false, error: 'No recipients configured' }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    let subject = "";
    let htmlContent = "";
    const adminEmail = Deno.env.get("ADMIN_EMAIL");

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
                    This notification was sent because a new business verification was submitted to 1325.AI.
                  </p>
                </div>
                <div class="footer">
                  <p>1325.AI Admin System</p>
                  <p>Building economic empowerment in the community</p>
                </div>
              </div>
            </body>
          </html>
        `;
        break;

      case 'agent_milestone_reached':
        const milestoneEmojis: { [key: string]: string } = {
          'first_referral': '🎉', 'referrals_10': '🎯', 'referrals_25': '🌟',
          'referrals_50': '💎', 'referrals_100': '👑', 'earnings_100': '💰',
          'earnings_500': '💵', 'earnings_1000': '🏆', 'earnings_5000': '🚀',
          'conversion_50': '📈', 'conversion_75': '⭐',
        };
        const milestoneDescriptions: { [key: string]: string } = {
          'first_referral': 'First Referral', 'referrals_10': '10 Referrals',
          'referrals_25': '25 Referrals', 'referrals_50': '50 Referrals',
          'referrals_100': '100 Referrals', 'earnings_100': '$100 Earned',
          'earnings_500': '$500 Earned', 'earnings_1000': '$1,000 Earned',
          'earnings_5000': '$5,000 Earned', 'conversion_50': '50% Conversion Rate',
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
                    <div class="info-row"><span class="label">Agent Name:</span><span class="value">${data.agentName}</span></div>
                    <div class="info-row"><span class="label">Email:</span><span class="value">${data.agentEmail}</span></div>
                    <div class="info-row"><span class="label">Milestone Type:</span><span class="value">${milestoneDesc}</span></div>
                    <div class="info-row"><span class="label">Current Value:</span><span class="value">${data.milestoneValue}</span></div>
                  </div>
                  <p><strong>Consider:</strong></p>
                  <ul>
                    <li>Sending a congratulatory message to the agent</li>
                    <li>Featuring them in agent spotlight communications</li>
                    <li>Reviewing if they qualify for bonus rewards</li>
                  </ul>
                  <center>
                    <a href="${supabaseUrl.replace('.supabase.co', '.lovableproject.com')}/admin-dashboard" class="button">View Agent Dashboard →</a>
                  </center>
                  <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">This notification was sent because an agent reached a performance milestone.</p>
                </div>
                <div class="footer">
                  <p>1325.AI Admin System</p>
                  <p>Building economic empowerment in the community</p>
                </div>
              </div>
            </body>
          </html>
        `;
        break;

      default:
        throw new Error(`Unknown notification type: ${type}`);
    }

    console.log(`Sending admin notification to ${recipients.join(', ')}`);
    
    const emailResponse = await resend.emails.send({
      from: "1325.AI Admin <admin@1325.ai>",
      to: recipients,
      subject: subject,
      html: htmlContent,
    });
    
    console.log("Admin notification sent successfully:", emailResponse);

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
    }

    return new Response(JSON.stringify({ success: true, emailId: emailResponse.id }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-admin-notification function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
