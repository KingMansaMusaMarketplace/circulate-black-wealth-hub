import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  companyName: string;
  tier: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, companyName, tier }: WelcomeEmailRequest = await req.json();

    console.log('Sending corporate welcome email to:', email);

    const tierBenefits = tier === 'gold' ? `
      <ul>
        <li>✓ Featured logo placement on homepage</li>
        <li>✓ Logo in marketplace footer</li>
        <li>✓ Monthly impact reports</li>
        <li>✓ Quarterly executive briefings</li>
        <li>✓ Co-branded marketing materials</li>
        <li>✓ Priority event sponsorship</li>
        <li>✓ Advanced analytics dashboard</li>
        <li>✓ Direct business introductions</li>
      </ul>
    ` : `
      <ul>
        <li>✓ Logo placement in marketplace footer</li>
        <li>✓ Monthly impact reports</li>
        <li>✓ Social media recognition</li>
        <li>✓ Access to community events</li>
        <li>✓ Basic analytics dashboard</li>
      </ul>
    `;

    const emailResponse = await resend.emails.send({
      from: "Mansa Musa Marketplace <onboarding@resend.dev>",
      to: [email],
      subject: `Welcome to Mansa Musa Corporate Partnership - ${tier.toUpperCase()} Tier`,
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
            .tier-badge {
              background: ${tier === 'gold' ? '#fbbf24' : '#c2410c'};
              color: white;
              padding: 8px 16px;
              border-radius: 20px;
              display: inline-block;
              font-weight: bold;
              text-transform: uppercase;
              margin: 10px 0;
            }
            ul {
              list-style: none;
              padding: 0;
            }
            li {
              padding: 8px 0;
              border-bottom: 1px solid #e5e7eb;
            }
            .highlight-box {
              background: #f0f9ff;
              border-left: 4px solid #667eea;
              padding: 15px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Welcome to the Partnership, ${companyName}!</h1>
            <p>Thank you for supporting Black economic empowerment</p>
          </div>
          
          <div class="content">
            <div style="text-align: center;">
              <span class="tier-badge">${tier.toUpperCase()} TIER</span>
            </div>
            
            <h2>🎉 Your Partnership is Now Active</h2>
            
            <p>Dear ${companyName} Team,</p>
            
            <p>Thank you for joining Mansa Musa Marketplace as a corporate sponsor! Your commitment to economic equity and community empowerment is making a real difference.</p>
            
            <div class="highlight-box">
              <strong>🚀 Quick Start:</strong>
              <p>Access your corporate dashboard to track your impact, view analytics, and manage your sponsorship benefits.</p>
              <a href="${Deno.env.get("SUPABASE_URL")?.replace('https://', 'https://app.')}/corporate-dashboard" class="button">Go to Dashboard</a>
            </div>
            
            <h3>Your ${tier.toUpperCase()} Tier Benefits:</h3>
            ${tierBenefits}
            
            <h3>What Happens Next?</h3>
            <ol>
              <li><strong>Dashboard Access:</strong> Log in to view real-time impact metrics</li>
              <li><strong>Logo Submission:</strong> Upload your company logo for marketplace placement</li>
              <li><strong>Impact Tracking:</strong> Watch as your sponsorship supports Black-owned businesses</li>
              <li><strong>Monthly Reports:</strong> Receive detailed analytics on your community impact</li>
            </ol>
            
            <div class="highlight-box">
              <strong>💡 Did You Know?</strong>
              <p>Every $1 circulated in Black communities generates $2.30 in economic value through the multiplier effect. Your sponsorship amplifies this impact!</p>
            </div>
            
            <h3>Need Help?</h3>
            <p>Our partnership team is here to support you:</p>
            <ul>
              <li>📧 Email: partnerships@mansamusa.com</li>
              <li>📞 Phone: (555) 123-4567</li>
              <li>💬 Live Chat: Available in your dashboard</li>
            </ul>
            
            <p>Thank you for being a champion of economic equity and community empowerment!</p>
            
            <p>With gratitude,<br>
            <strong>The Mansa Musa Marketplace Team</strong></p>
          </div>
          
          <div class="footer">
            <p>© 2025 Mansa Musa Marketplace. All rights reserved.</p>
            <p>Building wealth, creating opportunities, strengthening communities.</p>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Welcome email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error sending welcome email:", error);
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
