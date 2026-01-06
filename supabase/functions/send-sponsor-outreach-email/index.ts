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

interface OutreachEmailRequest {
  prospect_id: string;
  template_id?: string;
  subject?: string;
  body?: string;
  performed_by: string;
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

    const { prospect_id, template_id, subject, body, performed_by }: OutreachEmailRequest = await req.json();

    console.log(`[send-sponsor-outreach-email] Sending to prospect: ${prospect_id}`);

    // Get prospect details
    const { data: prospect, error: prospectError } = await supabase
      .from('sponsor_prospects')
      .select('*')
      .eq('id', prospect_id)
      .single();

    if (prospectError || !prospect) {
      throw new Error(`Prospect not found: ${prospectError?.message}`);
    }

    if (!prospect.primary_contact_email) {
      throw new Error('Prospect has no email address');
    }

    let emailSubject = subject;
    let emailBody = body;

    // If template_id provided, use that template
    if (template_id) {
      const { data: template, error: templateError } = await supabase
        .from('sponsor_email_templates')
        .select('*')
        .eq('id', template_id)
        .single();

      if (templateError || !template) {
        throw new Error(`Template not found: ${templateError?.message}`);
      }

      emailSubject = template.subject;
      emailBody = template.body;
    }

    // Personalize the email
    const personalizedSubject = (emailSubject || 'Partnership Opportunity with Mansa Musa Marketplace')
      .replace(/{{company_name}}/g, prospect.company_name)
      .replace(/{{contact_name}}/g, prospect.primary_contact_name || 'there')
      .replace(/{{contact_title}}/g, prospect.primary_contact_title || '')
      .replace(/{{industry}}/g, prospect.industry || '');

    const personalizedBody = (emailBody || getDefaultOutreachBody())
      .replace(/{{company_name}}/g, prospect.company_name)
      .replace(/{{contact_name}}/g, prospect.primary_contact_name || 'there')
      .replace(/{{contact_title}}/g, prospect.primary_contact_title || '')
      .replace(/{{industry}}/g, prospect.industry || '')
      .replace(/{{expected_tier}}/g, prospect.expected_tier || 'Partner');

    // Generate tracking pixel ID
    const trackingId = crypto.randomUUID();

    // Add tracking pixel to email
    const trackingPixel = `<img src="${supabaseUrl}/functions/v1/track-sponsor-email-open?id=${trackingId}" width="1" height="1" style="display:none" />`;
    const bodyWithTracking = personalizedBody + trackingPixel;

    // Send the email
    const { data: emailResult, error: emailError } = await resend.emails.send({
      from: "Mansa Musa Marketplace <partnerships@mansamusa.app>",
      to: [prospect.primary_contact_email],
      subject: personalizedSubject,
      html: bodyWithTracking,
    });

    if (emailError) {
      throw new Error(`Failed to send email: ${emailError.message}`);
    }

    console.log(`[send-sponsor-outreach-email] Email sent: ${emailResult?.id}`);

    // Log the activity
    const { error: activityError } = await supabase
      .from('sponsor_outreach_activities')
      .insert({
        prospect_id,
        activity_type: 'email',
        subject: personalizedSubject,
        body: personalizedBody,
        performed_by,
        performed_at: new Date().toISOString(),
        outcome: 'sent',
      });

    if (activityError) {
      console.error('Failed to log activity:', activityError);
    }

    // Update prospect last contact
    await supabase
      .from('sponsor_prospects')
      .update({
        last_contact_at: new Date().toISOString(),
        pipeline_stage: prospect.pipeline_stage === 'research' ? 'contacted' : prospect.pipeline_stage,
      })
      .eq('id', prospect_id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        emailId: emailResult?.id,
        trackingId 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("[send-sponsor-outreach-email] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

function getDefaultOutreachBody(): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <p>Hi {{contact_name}},</p>
  
  <p>I hope this email finds you well. I'm reaching out from <strong>Mansa Musa Marketplace</strong>, the fastest-growing platform connecting brands with Black-owned businesses and conscious consumers.</p>
  
  <p>Given {{company_name}}'s commitment to diversity and inclusion, I thought you'd be interested in exploring a sponsorship partnership that could:</p>
  
  <ul>
    <li>🎯 Reach our engaged community of 50,000+ users</li>
    <li>💼 Support 500+ verified Black-owned businesses</li>
    <li>📊 Generate measurable impact reports for your DEI initiatives</li>
    <li>🏆 Showcase your brand's commitment to economic equity</li>
  </ul>
  
  <p>Our {{expected_tier}} sponsorship tier might be a great fit for {{company_name}}. I'd love to schedule a brief call to discuss how we can create a mutually beneficial partnership.</p>
  
  <p>Would you have 15 minutes this week or next for a quick chat?</p>
  
  <p>Best regards,<br>
  <strong>The Mansa Musa Team</strong><br>
  <a href="https://mansamusa.app" style="color: #1B365D;">mansamusa.app</a></p>
  
  <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
  
  <p style="font-size: 12px; color: #999;">
    © 2026 Mansa Musa Marketplace. Empowering economic equity through community.
  </p>
</body>
</html>
  `;
}

serve(handler);
