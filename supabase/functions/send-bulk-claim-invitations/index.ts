import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { Resend } from "npm:resend@2.0.0";

const resendApiKey = Deno.env.get("RESEND_API_KEY");
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BulkInvitationRequest {
  campaign_id: string;
  batch_size?: number;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const resend = new Resend(resendApiKey);
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { campaign_id, batch_size = 50 }: BulkInvitationRequest = await req.json();

    console.log(`[send-bulk-claim-invitations] Starting for campaign: ${campaign_id}`);

    // Get campaign details
    const { data: campaign, error: campaignError } = await supabase
      .from('bulk_invitation_campaigns')
      .select('*, invitation_templates(*)')
      .eq('id', campaign_id)
      .single();

    if (campaignError || !campaign) {
      throw new Error(`Campaign not found: ${campaignError?.message}`);
    }

    // Get leads that haven't been invited yet for this campaign
    let query = supabase
      .from('b2b_external_leads')
      .select('*')
      .or('email_status.is.null,email_status.eq.not_sent')
      .not('owner_email', 'is', null)
      .limit(batch_size);

    // Apply campaign filters
    if (campaign.target_categories?.length > 0) {
      query = query.in('category', campaign.target_categories);
    }
    if (campaign.target_cities?.length > 0) {
      query = query.in('city', campaign.target_cities);
    }
    if (campaign.target_states?.length > 0) {
      query = query.in('state', campaign.target_states);
    }
    if (campaign.exclude_previously_invited) {
      query = query.eq('invitation_count', 0);
    }

    const { data: leads, error: leadsError } = await query;

    if (leadsError) {
      throw new Error(`Failed to fetch leads: ${leadsError.message}`);
    }

    console.log(`[send-bulk-claim-invitations] Found ${leads?.length || 0} leads to invite`);

    if (!leads || leads.length === 0) {
      // Mark campaign as completed
      await supabase
        .from('bulk_invitation_campaigns')
        .update({ 
          status: 'completed', 
          completed_at: new Date().toISOString() 
        })
        .eq('id', campaign_id);

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No more leads to invite. Campaign completed.',
          sent: 0 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const template = campaign.invitation_templates;
    let sentCount = 0;
    let failedCount = 0;

    for (const lead of leads) {
      try {
        // Generate a claim token
        const claimToken = crypto.randomUUID();
        const claimUrl = `${Deno.env.get("FRONTEND_URL") || "https://mansamusa.app"}/claim-business?token=${claimToken}&lead=${lead.id}`;

        // Personalize the email
        const personalizedSubject = (template?.subject || "Claim Your Business on Mansa Musa Marketplace!")
          .replace('{{business_name}}', lead.business_name)
          .replace('{{owner_name}}', lead.owner_name || 'Business Owner');

        const personalizedBody = (template?.body || getDefaultEmailBody())
          .replace(/{{business_name}}/g, lead.business_name)
          .replace(/{{owner_name}}/g, lead.owner_name || 'Business Owner')
          .replace(/{{claim_url}}/g, claimUrl)
          .replace(/{{city}}/g, lead.city || '')
          .replace(/{{category}}/g, lead.category || '');

        // Send the email
        const { error: emailError } = await resend.emails.send({
          from: "Mansa Musa Marketplace <hello@mansamusamarketplace.com>",
          to: [lead.owner_email],
          subject: personalizedSubject,
          html: personalizedBody,
        });

        if (emailError) {
          console.error(`Failed to send to ${lead.owner_email}:`, emailError);
          failedCount++;
          continue;
        }

        // Update lead status
        await supabase
          .from('b2b_external_leads')
          .update({
            email_status: 'sent',
            invitation_count: (lead.invitation_count || 0) + 1,
            last_invited_at: new Date().toISOString(),
            last_campaign_id: campaign_id,
            claim_token: claimToken,
            claim_token_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
            invited_at: lead.invited_at || new Date().toISOString(),
            is_invited: true,
          })
          .eq('id', lead.id);

        sentCount++;
        console.log(`[send-bulk-claim-invitations] Sent to ${lead.owner_email}`);

        // Rate limiting - small delay between sends
        await new Promise(resolve => setTimeout(resolve, 50));

      } catch (error) {
        console.error(`Error processing lead ${lead.id}:`, error);
        failedCount++;
      }
    }

    // Update campaign stats
    await supabase
      .from('bulk_invitation_campaigns')
      .update({
        sent_count: (campaign.sent_count || 0) + sentCount,
        status: sentCount < batch_size ? 'completed' : 'sending',
        ...(sentCount < batch_size ? { completed_at: new Date().toISOString() } : {}),
      })
      .eq('id', campaign_id);

    console.log(`[send-bulk-claim-invitations] Completed batch: ${sentCount} sent, ${failedCount} failed`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        sent: sentCount, 
        failed: failedCount,
        remaining: leads.length === batch_size ? 'more' : 'done'
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("[send-bulk-claim-invitations] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

function getDefaultEmailBody(): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
  <div style="background: linear-gradient(135deg, #1B365D 0%, #0f2447 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
    <img src="https://mansamusamarketplace.com/images/mansa-musa-logo.png" alt="Mansa Musa Marketplace" style="width: 80px; height: 80px; border-radius: 50%; margin-bottom: 15px; border: 3px solid #FFD700; object-fit: cover;">
    <h1 style="color: #FFD700; margin: 0; font-size: 28px;">You're Invited!</h1>
    <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 14px;">Join the Premier Directory for Black-Owned Businesses</p>
  </div>
  
  <div style="background: #ffffff; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <p style="font-size: 16px;">Hi {{owner_name}},</p>
    
    <p>We discovered <strong>{{business_name}}</strong> and we'd love for you to be part of our growing community! <a href="https://mansamusamarketplace.com" style="color: #1B365D; font-weight: bold;">Mansa Musa Marketplace</a> is the premier platform connecting customers with Black-owned businesses across the nation.</p>
    
    <p><strong>The best part?</strong> Claiming your listing is completely <span style="color: #FFD700; background: #1B365D; padding: 2px 8px; border-radius: 4px; font-weight: bold;">FREE</span>!</p>
    
    <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #FFD700;">
      <h3 style="margin: 0 0 15px 0; color: #1B365D;">✨ What's Included (All FREE):</h3>
      <ul style="margin: 0; padding-left: 20px; color: #333;">
        <li style="margin-bottom: 8px;"><strong>Verified business profile</strong> with photos & reviews</li>
        <li style="margin-bottom: 8px;"><strong>Customer loyalty program</strong> to reward repeat customers</li>
        <li style="margin-bottom: 8px;"><strong>Business analytics dashboard</strong> to track your growth</li>
        <li style="margin-bottom: 8px;"><strong>B2B networking</strong> with other Black-owned businesses</li>
        <li style="margin-bottom: 8px;"><strong>Marketing materials</strong> & promotional support</li>
      </ul>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{claim_url}}" style="display: inline-block; background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); color: #1B365D; padding: 18px 45px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 18px; box-shadow: 0 4px 15px rgba(255,215,0,0.4);">
        Claim Your FREE Listing →
      </a>
      <p style="font-size: 13px; color: #666; margin-top: 10px;">Takes less than 2 minutes!</p>
    </div>
    
    <p style="font-size: 14px; color: #666; background: #fff8e1; padding: 12px; border-radius: 6px; text-align: center;">
      ⏰ This invitation link expires in 7 days
    </p>
    
    <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;">
    
    <p style="font-size: 14px; color: #555;">Have questions? Simply reply to this email - we're here to help!</p>
    
    <p style="font-size: 14px; color: #333; margin-bottom: 5px;">Warm regards,</p>
    <p style="font-size: 16px; color: #1B365D; font-weight: bold; margin-top: 0;">The Mansa Musa Marketplace Team 👑</p>
    
    <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;">
    
    <div style="text-align: center;">
      <a href="https://mansamusamarketplace.com" style="color: #1B365D; font-weight: bold; text-decoration: none; font-size: 14px;">Visit Mansa Musa Marketplace</a>
      <p style="font-size: 12px; color: #666; margin-top: 15px;">
        1000 E. 111th Street, Suite 1100<br>
        Chicago, Illinois 60628
      </p>
      <p style="font-size: 12px; color: #999; margin-top: 10px;">
        © 2025 Mansa Musa Marketplace. Empowering Black-owned businesses everywhere.
      </p>
      <p style="font-size: 11px; color: #bbb; margin-top: 10px;">
        You received this email because your business was discovered in our search for Black-owned businesses. 
        If you'd prefer not to receive these emails, simply ignore this message.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

serve(handler);
