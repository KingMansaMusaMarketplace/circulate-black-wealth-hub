import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { Resend } from "https://esm.sh/resend@2.0.0";
// Simple HTML template instead of React Email to avoid npm dependency issues

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  userId: string;
  email: string;
  fullName: string;
  userType: 'customer' | 'business' | 'sponsor';
}

const handler = async (req: Request): Promise<Response> => {
  console.log('Welcome email function called');
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { userId, email, fullName, userType }: WelcomeEmailRequest = await req.json();
    
    console.log('Processing welcome email for:', { userId, email, fullName, userType });

    // Get user profile data for personalization
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    console.log('User profile data:', profile);

    // Generate welcome email HTML
    const html = generateWelcomeEmailHTML({
      fullName: fullName || 'New User',
      email: email,
      userType: userType,
      subscriptionTier: profile?.subscription_tier || 'free',
      dashboardUrl: `${Deno.env.get('SUPABASE_URL')?.replace('supabase.co', 'vercel.app') || 'https://localhost:5173'}/dashboard`
    });

    console.log('Email template rendered successfully');

    // Send welcome email
    const emailResponse = await resend.emails.send({
      from: 'Mansa Musa Marketplace <welcome@mansamusamarketplace.com>',
      to: [email],
      subject: `Welcome to Mansa Musa Marketplace, ${fullName}! 🎉`,
      html,
    });

    if (emailResponse.error) {
      console.error('Email sending error:', emailResponse.error);
      throw emailResponse.error;
    }

    console.log("Welcome email sent successfully:", emailResponse);

    // Log the email notification
    await supabase
      .from('email_notifications')
      .insert({
        user_id: userId,
        email_type: 'welcome',
        recipient_email: email,
        subject: `Welcome to Mansa Musa Marketplace, ${fullName}! 🎉`,
        content: html,
        status: 'sent'
      });

    console.log('Email notification logged');

    return new Response(JSON.stringify({ 
      success: true, 
      emailId: emailResponse.data?.id,
      message: 'Welcome email sent successfully' 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error in send-welcome-email function:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        details: error.toString()
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
function generateWelcomeEmailHTML(props: {
  fullName: string;
  email: string;
  userType: 'customer' | 'business' | 'sponsor';
  subscriptionTier: string;
  dashboardUrl: string;
}) {
  const getPersonalizedContent = () => {
    switch (props.userType) {
      case 'business':
        return {
          title: 'Welcome to the Mansa Musa Business Network! 🏢',
          intro: 'Thank you for joining our community of Black-owned businesses. You\'re now part of a powerful network that\'s building economic empowerment together.',
          features: [
            '📊 Business Dashboard & Analytics',
            '📱 QR Code Generation for Customer Loyalty',
            '🎯 Customer Engagement Tools',
            '📈 Revenue Tracking & Insights',
            '🤝 Business Networking Opportunities'
          ]
        };
      case 'sponsor':
        return {
          title: 'Welcome to Corporate Partnership! 🤝',
          intro: 'Thank you for supporting Black-owned businesses and community economic development. Your partnership makes a real difference.',
          features: [
            '🎯 Targeted Community Impact',
            '📊 Partnership Analytics & Reporting',
            '🌟 Brand Visibility in the Community',
            '📈 ROI Tracking for Sponsorships',
            '🤝 Direct Business Connections'
          ]
        };
      default:
        return {
          title: 'Welcome to Mansa Musa Marketplace! 🎉',
          intro: 'Thank you for joining our community! You\'re now part of a movement that supports Black-owned businesses and builds community wealth.',
          features: [
            '🏪 Discover Local Black-Owned Businesses',
            '📱 Scan QR Codes to Earn Loyalty Points',
            '🎁 Redeem Exclusive Rewards & Discounts',
            '🌟 Leave Reviews & Build Community',
            '📊 Track Your Community Impact'
          ]
        };
    }
  };

  const content = getPersonalizedContent();

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
        .logo { color: #d4af37; font-size: 24px; font-weight: bold; }
        .content { padding: 30px; }
        .title { color: #1a1a1a; font-size: 28px; font-weight: bold; text-align: center; margin-bottom: 20px; }
        .text { color: #484848; font-size: 16px; line-height: 1.6; margin-bottom: 20px; }
        .features { background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .feature-item { color: #374151; margin: 8px 0; }
        .button { display: inline-block; background-color: #d4af37; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
        .footer { background-color: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; }
        .footer-text { color: #9ca3af; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">Mansa Musa Marketplace</div>
        </div>
        <div class="content">
          <h1 class="title">${content.title}</h1>
          <p class="text">Hello ${props.fullName},</p>
          <p class="text">${content.intro}</p>
          
          <div class="features">
            <h2 style="color: #1a1a1a; margin-bottom: 15px;">What you can do now:</h2>
            ${content.features.map(feature => `<div class="feature-item">${feature}</div>`).join('')}
          </div>
          
          <div style="text-align: center;">
            <a href="${props.dashboardUrl}" class="button">Get Started with Your Dashboard</a>
          </div>
          
          <p class="text">
            <strong>Your Account Details:</strong><br>
            Email: ${props.email}<br>
            Account Type: ${props.userType.charAt(0).toUpperCase() + props.userType.slice(1)}<br>
            Plan: ${props.subscriptionTier.charAt(0).toUpperCase() + props.subscriptionTier.slice(1)}
          </p>
          
          <p class="text">
            Need help getting started? Our community support team is here to help!<br>
            📧 Email us at <a href="mailto:support@mansamusa.com">support@mansamusa.com</a>
          </p>
        </div>
        <div class="footer">
          <p class="footer-text">Building wealth. Building community. Building the future.</p>
          <p class="footer-text">© 2024 Mansa Musa Marketplace. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

serve(handler);