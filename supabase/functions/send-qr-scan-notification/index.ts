import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  salesAgentId: string;
  scanId: string;
  notificationType: 'scan' | 'conversion';
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { salesAgentId, scanId, notificationType }: NotificationRequest = await req.json();

    console.log('Processing QR notification:', { salesAgentId, scanId, notificationType });

    // Get agent details
    const { data: agent, error: agentError } = await supabase
      .from('sales_agents')
      .select('*, profiles!inner(email, full_name)')
      .eq('id', salesAgentId)
      .single();

    if (agentError || !agent) {
      console.error('Error fetching agent:', agentError);
      return new Response(
        JSON.stringify({ error: 'Agent not found' }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Check notification preferences
    const { data: preferences } = await supabase
      .from('notification_preferences')
      .select('qr_scan_notifications, qr_conversion_notifications')
      .eq('user_id', agent.user_id)
      .single();

    const shouldNotify = notificationType === 'scan' 
      ? preferences?.qr_scan_notifications !== false 
      : preferences?.qr_conversion_notifications !== false;

    if (!shouldNotify) {
      console.log('Notifications disabled for this agent');
      return new Response(
        JSON.stringify({ message: 'Notifications disabled' }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Get scan details
    const { data: scan, error: scanError } = await supabase
      .from('qr_code_scans')
      .select('*')
      .eq('id', scanId)
      .single();

    if (scanError || !scan) {
      console.error('Error fetching scan:', scanError);
      return new Response(
        JSON.stringify({ error: 'Scan not found' }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const agentEmail = agent.profiles?.email;
    const agentName = agent.profiles?.full_name || 'Sales Agent';

    if (!agentEmail) {
      console.error('No email found for agent');
      return new Response(
        JSON.stringify({ error: 'Agent email not found' }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Send email based on notification type
    let subject: string;
    let htmlContent: string;

    if (notificationType === 'scan') {
      subject = '🎯 Your QR Code Was Just Scanned!';
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1E40AF;">QR Code Scanned! 📱</h1>
          <p>Hi ${agentName},</p>
          <p>Great news! Your referral QR code was just scanned.</p>
          
          <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Scan Details:</h3>
            <p><strong>Date & Time:</strong> ${new Date(scan.scanned_at).toLocaleString()}</p>
            <p><strong>Referral Code:</strong> ${scan.referral_code}</p>
            ${scan.ip_address ? `<p><strong>Location:</strong> ${scan.ip_address}</p>` : ''}
          </div>
          
          <p>The person who scanned your QR code is now viewing your referral signup page. Fingers crossed for a conversion! 🤞</p>
          
          <p style="margin-top: 30px;">
            <a href="${supabaseUrl.replace('.supabase.co', '.lovable.app')}/sales-agent-dashboard" 
               style="background: #1E40AF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Dashboard
            </a>
          </p>
          
          <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">
            Keep sharing your QR code to maximize your referrals!<br>
            <a href="${supabaseUrl.replace('.supabase.co', '.lovable.app')}/settings" style="color: #1E40AF;">Manage notification preferences</a>
          </p>
        </div>
      `;
    } else {
      subject = '🎉 QR Code Scan Converted to Signup!';
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #10B981;">Conversion Success! 🎉</h1>
          <p>Hi ${agentName},</p>
          <p><strong>Congratulations!</strong> A QR code scan has converted into a new signup!</p>
          
          <div style="background: #D1FAE5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10B981;">
            <h3 style="margin-top: 0; color: #065F46;">Conversion Details:</h3>
            <p><strong>Scanned:</strong> ${new Date(scan.scanned_at).toLocaleString()}</p>
            <p><strong>Converted:</strong> ${scan.converted_at ? new Date(scan.converted_at).toLocaleString() : 'Just now'}</p>
            <p><strong>Referral Code:</strong> ${scan.referral_code}</p>
          </div>
          
          <p>This new signup will count towards your referral commissions. Keep up the great work!</p>
          
          <p style="margin-top: 30px;">
            <a href="${supabaseUrl.replace('.supabase.co', '.lovable.app')}/sales-agent-dashboard" 
               style="background: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Your Earnings
            </a>
          </p>
          
          <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">
            Share your QR code more to increase your conversions!<br>
            <a href="${supabaseUrl.replace('.supabase.co', '.lovable.app')}/settings" style="color: #10B981;">Manage notification preferences</a>
          </p>
        </div>
      `;
    }

    const emailResponse = await resend.emails.send({
      from: "Mansa Musa Marketplace <notifications@mansamusamarketplace.com>",
      to: [agentEmail],
      subject: subject,
      html: htmlContent,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      emailResponse 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-qr-scan-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
