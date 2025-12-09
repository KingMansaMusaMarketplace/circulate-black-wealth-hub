import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const adminEmail = Deno.env.get("ADMIN_EMAIL") || "contact@mansamusamarketplace.com";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface MediaKitRequest {
  fullName: string;
  email: string;
  company?: string;
  role?: string;
  reason: string;
  documentType: 'partnership_guide' | 'investor_analysis';
}

const documentLabels: Record<string, string> = {
  'partnership_guide': 'Partnership Guide',
  'investor_analysis': 'Investor Analysis',
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fullName, email, company, role, reason, documentType }: MediaKitRequest = await req.json();

    console.log(`Processing media kit access request from ${fullName} (${email}) for ${documentType}`);

    // Validate required fields
    if (!fullName || !email || !reason || !documentType) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Missing required fields' 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Generate a unique download token for future use
    const downloadToken = crypto.randomUUID();

    // Store the request in database
    const { data: requestData, error: dbError } = await supabase
      .from('media_kit_requests')
      .insert({
        full_name: fullName,
        email: email,
        company: company || null,
        role: role || null,
        reason: reason,
        document_type: documentType,
        download_token: downloadToken,
        status: 'pending'
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to store request');
    }

    console.log('Request stored successfully:', requestData.id);

    const documentLabel = documentLabels[documentType] || documentType;
    const baseUrl = supabaseUrl.replace('.supabase.co', '.lovableproject.com');

    // Send notification email to admin
    const adminEmailContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #b8860b 0%, #daa520 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
            .info-box { background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #b8860b; }
            .info-row { margin: 12px 0; }
            .label { font-weight: bold; color: #92400e; display: inline-block; width: 120px; }
            .value { color: #1f2937; }
            .reason-box { background: #f3f4f6; padding: 15px; border-radius: 6px; margin: 15px 0; }
            .button { display: inline-block; background: #b8860b; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; margin: 10px 5px; font-weight: bold; }
            .button-approve { background: #059669; }
            .button-deny { background: #dc2626; }
            .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📋 New Media Kit Access Request</h1>
              <p style="margin: 0; opacity: 0.9;">${documentLabel}</p>
            </div>
            <div class="content">
              <p>A new request has been submitted for access to confidential media kit documents.</p>
              
              <div class="info-box">
                <h3 style="margin-top: 0; color: #92400e;">Requester Information</h3>
                <div class="info-row">
                  <span class="label">Name:</span>
                  <span class="value">${fullName}</span>
                </div>
                <div class="info-row">
                  <span class="label">Email:</span>
                  <span class="value"><a href="mailto:${email}">${email}</a></span>
                </div>
                ${company ? `
                <div class="info-row">
                  <span class="label">Company:</span>
                  <span class="value">${company}</span>
                </div>
                ` : ''}
                ${role ? `
                <div class="info-row">
                  <span class="label">Role:</span>
                  <span class="value">${role}</span>
                </div>
                ` : ''}
                <div class="info-row">
                  <span class="label">Document:</span>
                  <span class="value"><strong>${documentLabel}</strong></span>
                </div>
              </div>

              <div class="reason-box">
                <h4 style="margin-top: 0; color: #4b5563;">Reason for Request:</h4>
                <p style="margin-bottom: 0;">${reason}</p>
              </div>

              <p><strong>Action Required:</strong> Please review this request and approve or deny access.</p>

              <center style="margin: 30px 0;">
                <a href="${baseUrl}/admin-dashboard" class="button">
                  Review in Admin Dashboard →
                </a>
              </center>

              <p style="font-size: 13px; color: #6b7280;">
                Request ID: ${requestData.id}<br>
                Submitted: ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })} CT
              </p>
            </div>
            <div class="footer">
              <p>Mansa Musa Marketplace - Media Kit Access System</p>
              <p>Building economic empowerment in the Black community</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const adminEmailResponse = await resend.emails.send({
      from: "Mansa Musa Media Kit <media@mansamusamarketplace.com>",
      to: [adminEmail],
      subject: `📋 Media Kit Access Request: ${fullName} - ${documentLabel}`,
      html: adminEmailContent,
    });

    console.log('Admin notification sent:', adminEmailResponse);

    // Send confirmation email to requester
    const requesterEmailContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1a365d 0%, #2563eb 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
            .highlight-box { background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb; }
            .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Request Received</h1>
              <p style="margin: 0; opacity: 0.9;">Mansa Musa Marketplace Media Kit</p>
            </div>
            <div class="content">
              <p>Hi ${fullName},</p>
              
              <p>Thank you for your interest in the Mansa Musa Marketplace <strong>${documentLabel}</strong>.</p>
              
              <div class="highlight-box">
                <h3 style="margin-top: 0; color: #1e40af;">What happens next?</h3>
                <p style="margin-bottom: 0;">Our team will review your request and get back to you within 1-2 business days. If approved, you'll receive an email with access to the requested document.</p>
              </div>

              <p>In the meantime, feel free to explore our public media resources at <a href="https://mansamusamarketplace.com/media-kit">our Media Kit page</a>.</p>

              <p>If you have any questions, please contact us at <a href="mailto:contact@mansamusamarketplace.com">contact@mansamusamarketplace.com</a>.</p>

              <p>Best regards,<br>
              <strong>The Mansa Musa Marketplace Team</strong></p>
            </div>
            <div class="footer">
              <p>Mansa Musa Marketplace</p>
              <p>Building economic empowerment in the Black community</p>
              <p style="margin-top: 15px; font-size: 11px;">1000 E. 111th St. Suite 1100, Chicago, IL 60628</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const requesterEmailResponse = await resend.emails.send({
      from: "Mansa Musa Marketplace <noreply@mansamusamarketplace.com>",
      to: [email],
      subject: `Your Media Kit Access Request - ${documentLabel}`,
      html: requesterEmailContent,
    });

    console.log('Requester confirmation sent:', requesterEmailResponse);

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Request submitted successfully',
      requestId: requestData.id
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("Error in send-media-kit-request function:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
