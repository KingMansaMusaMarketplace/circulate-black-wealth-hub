import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { Resend } from "https://esm.sh/resend@2.0.0";
// Simple HTML template instead of React Email to avoid npm dependency issues

interface NotificationRequest {
  userId: string;
  email: string;
  type: 'points_milestone' | 'reward_expiry' | 'new_business' | 'special_offer' | 'weekly_digest';
  subject: string;
  data: {
    fullName?: string;
    points?: number;
    businessName?: string;
    offerDetails?: string;
    rewardName?: string;
    expiryDate?: string;
    weeklyStats?: {
      pointsEarned: number;
      businessesVisited: number;
      rewardsRedeemed: number;
    };
  };
}

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  console.log('Notification email function called');
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const notificationRequest: NotificationRequest = await req.json();
    console.log('Processing notification:', notificationRequest);

    // Check if user has this notification type enabled
    // (This would check user preferences in a real implementation)
    
    // Generate notification email HTML
    const html = generateNotificationEmailHTML({
      type: notificationRequest.type,
      fullName: notificationRequest.data.fullName || 'User',
      points: notificationRequest.data.points,
      businessName: notificationRequest.data.businessName,
      offerDetails: notificationRequest.data.offerDetails,
      rewardName: notificationRequest.data.rewardName,
      expiryDate: notificationRequest.data.expiryDate,
      weeklyStats: notificationRequest.data.weeklyStats,
      dashboardUrl: Deno.env.get('APP_URL') || 'https://mansamusamarketplace.com'
    });

    // Send notification email
    const emailResponse = await resend.emails.send({
      from: 'Mansa Musa Marketplace <notifications@mansamusamarketplace.com>',
      to: [notificationRequest.email],
      subject: notificationRequest.subject,
      html,
    });

    if (emailResponse.error) {
      console.error('Email sending error:', emailResponse.error);
      throw emailResponse.error;
    }

    console.log("Notification email sent successfully:", emailResponse);

    // Log the email notification
    await supabase
      .from('email_notifications')
      .insert({
        user_id: notificationRequest.userId,
        email_type: notificationRequest.type,
        recipient_email: notificationRequest.email,
        subject: notificationRequest.subject,
        content: html,
        status: 'sent'
      });

    return new Response(JSON.stringify({ 
      success: true, 
      emailId: emailResponse.data?.id,
      message: 'Notification email sent successfully' 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error in send-notification-email function:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

// Simple HTML email template generator
function generateNotificationEmailHTML(props: {
  type: 'points_milestone' | 'reward_expiry' | 'new_business' | 'special_offer' | 'weekly_digest';
  fullName: string;
  points?: number;
  businessName?: string;
  offerDetails?: string;
  rewardName?: string;
  expiryDate?: string;
  weeklyStats?: {
    pointsEarned: number;
    businessesVisited: number;
    rewardsRedeemed: number;
  };
  dashboardUrl: string;
}) {
  const getNotificationContent = () => {
    switch (props.type) {
      case 'points_milestone':
        return {
          emoji: '🏆',
          title: `Congratulations! You've reached ${props.points} points!`,
          message: `Amazing work, ${props.fullName}! You've just reached ${props.points} loyalty points by supporting Black-owned businesses in your community.`,
          cta: 'View Your Rewards',
          ctaUrl: `${props.dashboardUrl}/rewards`,
          additional: 'Keep supporting local businesses to earn even more points and unlock exclusive rewards!'
        };
      case 'reward_expiry':
        return {
          emoji: '⚠️',
          title: `Your ${props.rewardName} reward expires soon!`,
          message: `Hi ${props.fullName}, your "${props.rewardName}" reward is expiring on ${props.expiryDate}. Don't let this great deal slip away!`,
          cta: 'Redeem Now',
          ctaUrl: `${props.dashboardUrl}/rewards`,
          additional: 'After this date, the reward will no longer be available. Redeem it today!'
        };
      case 'new_business':
        return {
          emoji: '🏪',
          title: `New business alert: ${props.businessName} just joined!`,
          message: `Exciting news, ${props.fullName}! ${props.businessName} has just joined the Mansa Musa Marketplace. Be among the first to support this new Black-owned business!`,
          cta: 'Visit Business',
          ctaUrl: `${props.dashboardUrl}/businesses`,
          additional: 'Early supporters often get special deals and help new businesses thrive in the community.'
        };
      case 'special_offer':
        return {
          emoji: '🎁',
          title: `Special offer from ${props.businessName}!`,
          message: `Great news, ${props.fullName}! ${props.businessName} has a special offer just for loyal customers like you: ${props.offerDetails}`,
          cta: 'Get Offer',
          ctaUrl: `${props.dashboardUrl}/businesses`,
          additional: 'This exclusive offer is available for a limited time, so act fast!'
        };
      case 'weekly_digest':
        return {
          emoji: '📊',
          title: 'Your weekly community impact summary',
          message: `Hi ${props.fullName}, here's your weekly impact summary for supporting Black-owned businesses in your community.`,
          cta: 'View Full Dashboard',
          ctaUrl: props.dashboardUrl,
          additional: 'Every scan, every purchase, every review helps build stronger communities!'
        };
      default:
        return {
          emoji: '📢',
          title: 'You have a new notification',
          message: `Hi ${props.fullName}, you have a new notification from Mansa Musa Marketplace.`,
          cta: 'View Dashboard',
          ctaUrl: props.dashboardUrl,
          additional: 'Stay connected with your community.'
        };
    }
  };

  const content = getNotificationContent();

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${content.title}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f6f9fc; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background-color: #1a1a1a; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .emoji { font-size: 48px; margin-bottom: 10px; }
        .logo { color: #d4af37; font-size: 20px; font-weight: bold; }
        .content { padding: 30px; }
        .title { color: #1a1a1a; font-size: 24px; font-weight: bold; text-align: center; margin-bottom: 20px; }
        .text { color: #484848; font-size: 16px; line-height: 1.6; margin-bottom: 20px; text-align: center; }
        .stats { background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
        .stat-item { display: inline-block; margin: 0 15px; }
        .stat-number { color: #d4af37; font-size: 32px; font-weight: bold; display: block; }
        .stat-label { color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
        .button { display: inline-block; background-color: #d4af37; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
        .additional { color: #6b7280; font-size: 14px; text-align: center; font-style: italic; margin: 20px 0; }
        .footer { background-color: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; }
        .footer-text { color: #9ca3af; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="emoji">${content.emoji}</div>
          <div class="logo">Mansa Musa Marketplace</div>
        </div>
        <div class="content">
          <h1 class="title">${content.title}</h1>
          <p class="text">${content.message}</p>
          
          ${props.type === 'weekly_digest' && props.weeklyStats ? `
            <div class="stats">
              <h2 style="color: #1a1a1a; margin-bottom: 20px;">This Week's Impact:</h2>
              <div class="stat-item">
                <span class="stat-number">${props.weeklyStats.pointsEarned}</span>
                <span class="stat-label">Points Earned</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">${props.weeklyStats.businessesVisited}</span>
                <span class="stat-label">Businesses Visited</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">${props.weeklyStats.rewardsRedeemed}</span>
                <span class="stat-label">Rewards Redeemed</span>
              </div>
            </div>
          ` : ''}
          
          <div style="text-align: center;">
            <a href="${content.ctaUrl}" class="button">${content.cta}</a>
          </div>
          
          <p class="additional">${content.additional}</p>
          
          <div style="background-color: #fef3cd; padding: 20px; border-radius: 6px; text-align: center; margin: 20px 0;">
            <p style="color: #92400e; margin: 0; font-weight: 500;">
              Thank you for being part of the Mansa Musa community. Together, we're building economic empowerment and community wealth! 💪
            </p>
          </div>
        </div>
        <div class="footer">
          <p class="footer-text">
            <a href="${props.dashboardUrl}/profile" style="color: #6b7280; text-decoration: underline;">Manage Notifications</a> | 
            <a href="${props.dashboardUrl}/help" style="color: #6b7280; text-decoration: underline;">Help Center</a>
          </p>
          <p class="footer-text">© 2024 Mansa Musa Marketplace. Building community wealth.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

serve(handler);