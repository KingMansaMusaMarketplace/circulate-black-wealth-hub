import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface DigestData {
  businessVerifications: Array<{
    business_name: string;
    submitted_at: string;
  }>;
  agentMilestones: Array<{
    agent_name: string;
    agent_email: string;
    milestone_type: string;
    value: number;
    achieved_at: string;
  }>;
  summary: {
    totalVerifications: number;
    totalMilestones: number;
    topAgents: Array<{ name: string; milestones: number }>;
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { digestType } = await req.json(); // 'daily' or 'weekly'
    
    console.log(`Processing ${digestType} notification digest...`);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Calculate time range
    const now = new Date();
    const startDate = new Date(now);
    if (digestType === 'daily') {
      startDate.setDate(startDate.getDate() - 1);
    } else {
      startDate.setDate(startDate.getDate() - 7);
    }

    // Get admin preferences for this digest type
    const { data: preferences, error: prefError } = await supabase
      .from('admin_notification_preferences')
      .select('*')
      .eq(digestType === 'daily' ? 'send_daily_digest' : 'send_weekly_digest', true);

    if (prefError) {
      console.error('Error fetching preferences:', prefError);
      throw prefError;
    }

    if (!preferences || preferences.length === 0) {
      console.log(`No admins configured for ${digestType} digest`);
      return new Response(
        JSON.stringify({ message: 'No recipients configured' }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Aggregate business verifications
    const { data: verifications, error: verError } = await supabase
      .from('businesses')
      .select('business_name, created_at, verification_status')
      .eq('verification_status', 'pending')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    if (verError) console.error('Error fetching verifications:', verError);

    // Aggregate notifications (for milestone tracking)
    const { data: notifications, error: notifError } = await supabase
      .from('notifications')
      .select('*, user:profiles!notifications_user_id_fkey(full_name, email)')
      .eq('type', 'agent_milestone')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    if (notifError) console.error('Error fetching notifications:', notifError);

    // Build digest data
    const digestData: DigestData = {
      businessVerifications: (verifications || []).map(v => ({
        business_name: v.business_name,
        submitted_at: v.created_at,
      })),
      agentMilestones: (notifications || []).map(n => ({
        agent_name: n.user?.full_name || 'Unknown',
        agent_email: n.user?.email || '',
        milestone_type: n.metadata?.milestone_type || '',
        value: n.metadata?.value || 0,
        achieved_at: n.created_at,
      })),
      summary: {
        totalVerifications: verifications?.length || 0,
        totalMilestones: notifications?.length || 0,
        topAgents: [],
      },
    };

    // Calculate top agents
    const agentStats = new Map<string, { name: string; count: number }>();
    (notifications || []).forEach(n => {
      const name = n.user?.full_name || 'Unknown';
      const current = agentStats.get(name) || { name, count: 0 };
      current.count++;
      agentStats.set(name, current);
    });
    digestData.summary.topAgents = Array.from(agentStats.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map(a => ({ name: a.name, milestones: a.count }));

    // Send digest to each admin
    const emailPromises = preferences.map(async (pref) => {
      const recipients = [pref.notification_email];
      if (pref.send_to_multiple_emails) {
        recipients.push(...pref.send_to_multiple_emails);
      }

      const emailHtml = generateDigestHtml(digestType, digestData, startDate, now);

      for (const recipient of recipients) {
        try {
          await resend.emails.send({
            from: "Mansa Musa Admin <admin@mansamusamarketplace.com>",
            to: [recipient],
            subject: `${digestType === 'daily' ? 'Daily' : 'Weekly'} Notification Digest - ${now.toLocaleDateString()}`,
            html: emailHtml,
          });
          console.log(`Digest sent to ${recipient}`);
        } catch (error) {
          console.error(`Failed to send digest to ${recipient}:`, error);
        }
      }
    });

    await Promise.all(emailPromises);

    return new Response(
      JSON.stringify({ 
        success: true,
        digestType,
        recipientCount: preferences.length,
        verifications: digestData.summary.totalVerifications,
        milestones: digestData.summary.totalMilestones,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in send-notification-digest:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

function generateDigestHtml(
  digestType: string,
  data: DigestData,
  startDate: Date,
  endDate: Date
): string {
  const { businessVerifications, agentMilestones, summary } = data;
  const period = digestType === 'daily' ? 'Past 24 Hours' : 'Past Week';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .section { background: white; margin: 20px 0; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .summary-stats { display: flex; justify-content: space-around; margin: 20px 0; }
        .stat { text-align: center; }
        .stat-number { font-size: 32px; font-weight: bold; color: #667eea; }
        .stat-label { color: #666; font-size: 14px; }
        .item { padding: 12px; border-left: 3px solid #667eea; margin: 10px 0; background: #f8f9fa; }
        .item-title { font-weight: bold; color: #333; }
        .item-meta { color: #666; font-size: 14px; margin-top: 4px; }
        .no-data { text-align: center; color: #999; padding: 20px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${digestType === 'daily' ? '📊 Daily' : '📈 Weekly'} Notification Digest</h1>
        <p>${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}</p>
      </div>
      
      <div class="content">
        <div class="section">
          <h2>📋 Summary</h2>
          <div class="summary-stats">
            <div class="stat">
              <div class="stat-number">${summary.totalVerifications}</div>
              <div class="stat-label">New Verifications</div>
            </div>
            <div class="stat">
              <div class="stat-number">${summary.totalMilestones}</div>
              <div class="stat-label">Agent Milestones</div>
            </div>
          </div>
        </div>

        ${businessVerifications.length > 0 ? `
          <div class="section">
            <h2>🏢 Business Verifications (${businessVerifications.length})</h2>
            ${businessVerifications.map(v => `
              <div class="item">
                <div class="item-title">${v.business_name}</div>
                <div class="item-meta">Submitted: ${new Date(v.submitted_at).toLocaleString()}</div>
              </div>
            `).join('')}
          </div>
        ` : '<div class="section"><div class="no-data">No new business verifications</div></div>'}

        ${agentMilestones.length > 0 ? `
          <div class="section">
            <h2>🎯 Agent Milestones (${agentMilestones.length})</h2>
            ${agentMilestones.map(m => `
              <div class="item">
                <div class="item-title">${m.agent_name} - ${m.milestone_type}</div>
                <div class="item-meta">
                  Value: ${m.value} | ${new Date(m.achieved_at).toLocaleString()}
                </div>
              </div>
            `).join('')}
          </div>
        ` : '<div class="section"><div class="no-data">No new agent milestones</div></div>'}

        ${summary.topAgents.length > 0 ? `
          <div class="section">
            <h2>🏆 Top Performing Agents</h2>
            ${summary.topAgents.map((agent, idx) => `
              <div class="item">
                <div class="item-title">#${idx + 1} ${agent.name}</div>
                <div class="item-meta">${agent.milestones} milestone${agent.milestones !== 1 ? 's' : ''} achieved</div>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>

      <div class="footer">
        <p>This is an automated ${digestType} digest from your admin notification system.</p>
        <p>To change your notification preferences, visit your admin dashboard.</p>
      </div>
    </body>
    </html>
  `;
}

serve(handler);
