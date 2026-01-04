import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch active sponsors
    const { data: sponsors, error: fetchError } = await supabase
      .from('corporate_subscriptions')
      .select('id, user_id, company_name, tier, contact_email')
      .eq('status', 'active');

    if (fetchError) throw fetchError;

    const results = [];
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const monthName = lastMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

    for (const sponsor of sponsors || []) {
      // Get metrics for this sponsor
      const { data: metrics } = await supabase
        .from('sponsor_impact_metrics')
        .select('*')
        .eq('subscription_id', sponsor.id)
        .order('metric_date', { ascending: false })
        .limit(30);

      // Calculate totals
      const totalImpressions = metrics?.reduce((sum, m) => sum + (m.impressions || 0), 0) || 0;
      const totalClicks = metrics?.reduce((sum, m) => sum + (m.clicks || 0), 0) || 0;
      const latestMetric = metrics?.[0] || {};

      // Get contact email
      let email = sponsor.contact_email;
      if (!email && sponsor.user_id) {
        const { data: userData } = await supabase.auth.admin.getUserById(sponsor.user_id);
        email = userData?.user?.email;
      }

      if (!email) {
        console.log(`No email for sponsor ${sponsor.company_name}`);
        continue;
      }

      // Send email with impact report
      if (RESEND_API_KEY) {
        try {
          const emailHtml = generateImpactReportEmail(
            sponsor.company_name,
            sponsor.tier,
            monthName,
            {
              impressions: totalImpressions,
              clicks: totalClicks,
              businessesSupported: latestMetric.businesses_supported || 0,
              totalTransactions: latestMetric.total_transactions || 0,
              communityReach: latestMetric.community_reach || 0,
              economicImpact: latestMetric.economic_impact || 0,
            }
          );

          const emailResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${RESEND_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'Mansa Musa Marketplace <noreply@mansamusamarketplace.com>',
              to: [email],
              subject: `📊 Your ${monthName} Sponsorship Impact Report`,
              html: emailHtml,
            }),
          });

          if (emailResponse.ok) {
            results.push({ company: sponsor.company_name, status: 'sent' });
          } else {
            const errorText = await emailResponse.text();
            console.error(`Failed to send to ${email}:`, errorText);
            results.push({ company: sponsor.company_name, status: 'failed', error: errorText });
          }
        } catch (emailError) {
          console.error(`Email error for ${sponsor.company_name}:`, emailError);
          results.push({ company: sponsor.company_name, status: 'error', error: String(emailError) });
        }
      } else {
        results.push({ company: sponsor.company_name, status: 'skipped_no_api_key' });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        reports_sent: results.filter(r => r.status === 'sent').length,
        results,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in send-monthly-impact-report:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toLocaleString();
}

function formatCurrency(num: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

interface ImpactMetrics {
  impressions: number;
  clicks: number;
  businessesSupported: number;
  totalTransactions: number;
  communityReach: number;
  economicImpact: number;
}

function generateImpactReportEmail(
  companyName: string,
  tier: string,
  monthName: string,
  metrics: ImpactMetrics
): string {
  const ctr = metrics.impressions > 0 
    ? ((metrics.clicks / metrics.impressions) * 100).toFixed(2) 
    : '0.00';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
      <div style="background: linear-gradient(135deg, #1b365d 0%, #0f172a 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: #d4af37; margin: 0; font-size: 24px;">📊 Monthly Impact Report</h1>
        <p style="color: #94a3b8; margin: 10px 0 0 0;">${monthName}</p>
      </div>
      
      <div style="background: #ffffff; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <p style="font-size: 16px;">Dear ${companyName} Team,</p>
        
        <p>Thank you for your continued support as a <strong style="color: #d4af37; text-transform: uppercase;">${tier} Sponsor</strong>. Here's a summary of your impact this month:</p>
        
        <div style="background: linear-gradient(135deg, #fef3c7, #fde68a); padding: 20px; border-radius: 12px; margin: 20px 0;">
          <h2 style="color: #92400e; margin: 0 0 15px 0; font-size: 18px;">🎯 Visibility Metrics</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #78350f;">Logo Impressions</td>
              <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #92400e;">${formatNumber(metrics.impressions)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #78350f;">Clicks to Your Site</td>
              <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #92400e;">${formatNumber(metrics.clicks)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #78350f;">Click-Through Rate</td>
              <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #92400e;">${ctr}%</td>
            </tr>
          </table>
        </div>
        
        <div style="background: linear-gradient(135deg, #dbeafe, #bfdbfe); padding: 20px; border-radius: 12px; margin: 20px 0;">
          <h2 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px;">💪 Community Impact</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #1e3a8a;">Businesses Supported</td>
              <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #1e40af;">${formatNumber(metrics.businessesSupported)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #1e3a8a;">Total Transactions</td>
              <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #1e40af;">${formatNumber(metrics.totalTransactions)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #1e3a8a;">Community Reach</td>
              <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #1e40af;">${formatNumber(metrics.communityReach)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #1e3a8a;">Economic Impact</td>
              <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #1e40af;">${formatCurrency(metrics.economicImpact)}</td>
            </tr>
          </table>
        </div>
        
        <div style="background: #f0fdf4; border: 1px solid #86efac; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #166534;">
            <strong>🌟 Your Impact Story:</strong><br>
            This month, your sponsorship helped support <strong>${formatNumber(metrics.businessesSupported)}</strong> Black-owned businesses, 
            generating <strong>${formatCurrency(metrics.economicImpact)}</strong> in economic activity within our community.
          </p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://mansamusamarketplace.com/sponsor-dashboard" 
             style="display: inline-block; background: linear-gradient(135deg, #d4af37, #b8960f); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-right: 10px;">
            View Full Dashboard
          </a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
        
        <p style="color: #666; font-size: 14px; text-align: center;">
          Questions about your sponsorship? <a href="mailto:sponsors@mansamusamarketplace.com" style="color: #d4af37;">Contact our team</a><br><br>
          Thank you for making a difference!<br>
          <strong>The Mansa Musa Marketplace Team</strong>
        </p>
      </div>
    </body>
    </html>
  `;
}
