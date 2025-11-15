import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CommissionReportRequest {
  businessId?: string; // Optional - if not provided, sends to all businesses
  month?: string; // Format: YYYY-MM, defaults to previous month
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { businessId, month }: CommissionReportRequest = await req.json();

    // Calculate date range for the report (default to previous month)
    const reportDate = month ? new Date(month + "-01") : new Date();
    if (!month) {
      reportDate.setMonth(reportDate.getMonth() - 1);
    }
    
    const startDate = new Date(reportDate.getFullYear(), reportDate.getMonth(), 1);
    const endDate = new Date(reportDate.getFullYear(), reportDate.getMonth() + 1, 0);
    const monthName = startDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    console.log(`Generating commission reports for ${monthName}`);

    // Get businesses to send reports to
    let businessQuery = supabase
      .from('businesses')
      .select('id, business_name, email, user_id')
      .eq('verification_status', 'approved');

    if (businessId) {
      businessQuery = businessQuery.eq('id', businessId);
    }

    const { data: businesses, error: businessError } = await businessQuery;

    if (businessError) {
      throw new Error(`Failed to fetch businesses: ${businessError.message}`);
    }

    if (!businesses || businesses.length === 0) {
      return new Response(
        JSON.stringify({ message: "No businesses found" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const results = [];

    // Process each business
    for (const business of businesses) {
      try {
        // Get commission data for the month
        const { data: commissions, error: commissionError } = await supabase
          .from('platform_commissions')
          .select('*')
          .eq('business_id', business.id)
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString());

        if (commissionError) {
          console.error(`Error fetching commissions for ${business.business_name}:`, commissionError);
          continue;
        }

        // Calculate metrics
        const totalCommission = commissions?.reduce((sum, c) => sum + (c.commission_amount || 0), 0) || 0;
        const totalTransactions = commissions?.length || 0;
        const totalVolume = commissions?.reduce((sum, c) => sum + (c.transaction_amount || 0), 0) || 0;

        // Get previous month data for comparison
        const prevMonthStart = new Date(startDate);
        prevMonthStart.setMonth(prevMonthStart.getMonth() - 1);
        const prevMonthEnd = new Date(startDate);
        prevMonthEnd.setDate(0);

        const { data: prevCommissions } = await supabase
          .from('platform_commissions')
          .select('commission_amount, transaction_amount')
          .eq('business_id', business.id)
          .gte('created_at', prevMonthStart.toISOString())
          .lte('created_at', prevMonthEnd.toISOString());

        const prevTotalCommission = prevCommissions?.reduce((sum, c) => sum + (c.commission_amount || 0), 0) || 0;
        const prevTotalVolume = prevCommissions?.reduce((sum, c) => sum + (c.transaction_amount || 0), 0) || 0;

        // Calculate trends
        const commissionTrend = prevTotalCommission > 0 
          ? ((totalCommission - prevTotalCommission) / prevTotalCommission * 100).toFixed(1)
          : totalCommission > 0 ? "100" : "0";
        
        const volumeTrend = prevTotalVolume > 0
          ? ((totalVolume - prevTotalVolume) / prevTotalVolume * 100).toFixed(1)
          : totalVolume > 0 ? "100" : "0";

        // Generate insights
        const insights = [];
        if (parseFloat(commissionTrend) > 10) {
          insights.push(`📈 Your commission fees increased by ${commissionTrend}% compared to last month`);
        } else if (parseFloat(commissionTrend) < -10) {
          insights.push(`📉 Your commission fees decreased by ${Math.abs(parseFloat(commissionTrend))}% compared to last month`);
        }

        if (totalTransactions > (prevCommissions?.length || 0)) {
          insights.push(`🎉 You had ${totalTransactions - (prevCommissions?.length || 0)} more transactions this month`);
        }

        if (insights.length === 0) {
          insights.push("💼 Your business performance is steady this month");
        }

        // Create email HTML
        const emailHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
                .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
                .metric-card { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #667eea; }
                .metric-value { font-size: 32px; font-weight: bold; color: #667eea; margin: 10px 0; }
                .metric-label { color: #6b7280; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; }
                .trend { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; margin-top: 8px; }
                .trend-up { background: #d1fae5; color: #065f46; }
                .trend-down { background: #fee2e2; color: #991b1b; }
                .insights { background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6; }
                .insight-item { margin: 10px 0; font-size: 14px; }
                .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
                .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>💼 Monthly Commission Report</h1>
                  <p>${monthName}</p>
                </div>
                <div class="content">
                  <p>Hi ${business.business_name},</p>
                  <p>Here's your commission summary for ${monthName}:</p>
                  
                  <div class="metric-card">
                    <div class="metric-label">Total Commission Fees</div>
                    <div class="metric-value">$${totalCommission.toFixed(2)}</div>
                    <span class="trend ${parseFloat(commissionTrend) >= 0 ? 'trend-up' : 'trend-down'}">
                      ${parseFloat(commissionTrend) >= 0 ? '↑' : '↓'} ${Math.abs(parseFloat(commissionTrend))}% vs last month
                    </span>
                  </div>

                  <div class="metric-card">
                    <div class="metric-label">Transaction Volume</div>
                    <div class="metric-value">$${totalVolume.toFixed(2)}</div>
                    <span class="trend ${parseFloat(volumeTrend) >= 0 ? 'trend-up' : 'trend-down'}">
                      ${parseFloat(volumeTrend) >= 0 ? '↑' : '↓'} ${Math.abs(parseFloat(volumeTrend))}% vs last month
                    </span>
                  </div>

                  <div class="metric-card">
                    <div class="metric-label">Total Transactions</div>
                    <div class="metric-value">${totalTransactions}</div>
                    <span class="trend ${totalTransactions >= (prevCommissions?.length || 0) ? 'trend-up' : 'trend-down'}">
                      ${totalTransactions >= (prevCommissions?.length || 0) ? '↑' : '↓'} ${Math.abs(totalTransactions - (prevCommissions?.length || 0))} vs last month
                    </span>
                  </div>

                  <div class="insights">
                    <h3>📊 Key Insights</h3>
                    ${insights.map(insight => `<div class="insight-item">${insight}</div>`).join('')}
                  </div>

                  <center>
                    <a href="${supabaseUrl.replace('.supabase.co', '.lovable.app')}/business/${business.id}/commissions" class="button">
                      View Detailed Report
                    </a>
                  </center>

                  <div class="footer">
                    <p>This is an automated monthly report. For questions, please contact support.</p>
                    <p>© ${new Date().getFullYear()} Mansa Musa Marketplace</p>
                  </div>
                </div>
              </div>
            </body>
          </html>
        `;

        // Send email
        const emailResponse = await resend.emails.send({
          from: "Mansa Musa Marketplace <reports@mansamusamarketplace.com>",
          to: [business.email],
          subject: `📊 Your Commission Report for ${monthName}`,
          html: emailHtml,
        });

        console.log(`Email sent to ${business.business_name}:`, emailResponse);

        // Record email in database
        await supabase.from('email_notifications').insert({
          user_id: business.user_id,
          type: 'commission_report',
          recipient_email: business.email,
          subject: `Your Commission Report for ${monthName}`,
          content: emailHtml,
          status: 'sent'
        });

        results.push({
          businessId: business.id,
          businessName: business.business_name,
          email: business.email,
          success: true,
          metrics: {
            totalCommission,
            totalVolume,
            totalTransactions,
            commissionTrend,
            volumeTrend
          }
        });

      } catch (error: any) {
        console.error(`Error processing ${business.business_name}:`, error);
        results.push({
          businessId: business.id,
          businessName: business.business_name,
          success: false,
          error: error.message
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Processed ${results.length} businesses`,
        results
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );

  } catch (error: any) {
    console.error("Error in send-commission-report:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
};

serve(handler);
