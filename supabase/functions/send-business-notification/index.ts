
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  type: 'new_business' | 'verification_approved' | 'new_customer' | 'sponsor_welcome' | 'sponsor_rejected';
  businessId?: string;
  userId: string;
  recipientEmail: string;
  businessName?: string;
  customerName?: string;
  companyName?: string;
  tier?: string;
  rejectionReason?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, businessId, userId, recipientEmail, businessName, customerName, companyName, tier, rejectionReason }: NotificationRequest = await req.json();

    let subject = "";
    let htmlContent = "";

    switch (type) {
      case 'new_business':
        subject = `Welcome to 1325.AI, ${businessName}!`;
        htmlContent = `
          <h1>Welcome to 1325.AI! 🎉</h1>
          <p>Dear ${businessName} team,</p>
          <p>Congratulations! Your business has been successfully registered on 1325.AI.</p>
          <h2>What's Next?</h2>
          <ul>
            <li>Complete your business profile</li>
            <li>Upload your logo and banner images</li>
            <li>Generate QR codes for customer rewards</li>
            <li>Start connecting with customers in your community</li>
          </ul>
          <p>Together, we're building economic empowerment and keeping dollars circulating in our community.</p>
          <p>Best regards,<br>The 1325.AI Team</p>
          <p>For questions, contact us at: contact@1325.ai</p>
        `;
        break;

      case 'verification_approved':
        subject = `${businessName} - Verification Approved! 🎉`;
        htmlContent = `
          <h1>Verification Approved! ✅</h1>
          <p>Congratulations ${businessName}!</p>
          <p>Your business verification has been approved. You now have full access to all marketplace features.</p>
          <p>Your verified badge will help customers trust and find your business more easily.</p>
          <p>Start maximizing your impact in the community today!</p>
          <p>For questions, contact us at: contact@1325.ai</p>
        `;
        break;

      case 'new_customer':
        subject = `Welcome to 1325.AI, ${customerName}!`;
        htmlContent = `
          <h1>Welcome to the Movement! 🚀</h1>
          <p>Dear ${customerName},</p>
          <p>Welcome to 1325.AI - where every purchase builds community wealth!</p>
          <h2>Get Started:</h2>
          <ul>
            <li>Discover amazing community businesses near you</li>
            <li>Scan QR codes to earn loyalty points</li>
            <li>Get exclusive discounts and rewards</li>
            <li>Support economic empowerment with every purchase</li>
          </ul>
          <p>Together, we're extending the circulation of the community dollar beyond the national average of 6 hours.</p>
          <p>Welcome to the movement!</p>
          <p>For questions, contact us at: contact@1325.ai</p>
        `;
        break;

      case 'sponsor_welcome':
        subject = `Welcome as a Corporate Sponsor - ${companyName}! 🎉`;
        htmlContent = `
          <h1>Welcome to Corporate Sponsorship! 🌟</h1>
          <p>Congratulations, ${companyName}!</p>
          <p>Your <strong>${tier?.toUpperCase()}</strong> tier corporate sponsorship has been approved.</p>
          <h2>Your Impact Begins Now:</h2>
          <ul>
            <li>Your logo will be featured across the 1325.AI platform</li>
            <li>Track your sponsorship impact through our analytics dashboard</li>
            <li>Connect with our community of businesses</li>
            <li>Receive monthly reports on the community impact of your sponsorship</li>
          </ul>
          <p>Thank you for investing in economic empowerment and helping extend the circulation of the community dollar.</p>
          <p>Together, we're building generational wealth and stronger communities.</p>
          <p><strong>Next Steps:</strong></p>
          <ul>
            <li>Access your sponsor dashboard to update company information</li>
            <li>View real-time impact metrics</li>
            <li>Download your sponsorship certificate</li>
          </ul>
          <p>For questions about your sponsorship, contact us at: sponsors@1325.ai</p>
        `;
        break;

      case 'sponsor_rejected':
        subject = `Corporate Sponsorship Application Update - ${companyName}`;
        htmlContent = `
          <h1>Sponsorship Application Status Update</h1>
          <p>Dear ${companyName} team,</p>
          <p>Thank you for your interest in becoming a corporate sponsor of 1325.AI.</p>
          <p>After careful review, we are unable to approve your <strong>${tier?.toUpperCase()}</strong> tier sponsorship application at this time.</p>
          ${rejectionReason ? `
          <h2>Reason:</h2>
          <p style="padding: 15px; background-color: #f5f5f5; border-left: 4px solid #e74c3c;">${rejectionReason}</p>
          ` : ''}
          <p>We appreciate your interest in supporting economic empowerment in the community. If you have any questions about this decision or would like to discuss alternative partnership opportunities, please don't hesitate to reach out.</p>
          <p>You may reapply in the future if your circumstances change or if you would like to address the concerns raised.</p>
          <p>Thank you for considering 1325.AI for your corporate social responsibility initiatives.</p>
          <p>For questions, contact us at: sponsors@1325.ai</p>
        `;
        break;
    }

    console.log(`Sending ${type} email to ${recipientEmail}`);
    
    const emailResponse = await resend.emails.send({
      from: "1325.AI <noreply@1325.ai>",
      to: [recipientEmail],
      subject: subject,
      html: htmlContent,
    });
    
    console.log("Resend API response:", emailResponse);

    const { error: dbError } = await supabase
      .from('email_notifications')
      .insert({
        user_id: userId,
        email_type: type,
        recipient_email: recipientEmail,
        subject: subject,
        content: htmlContent,
        status: 'sent'
      });

    if (dbError) {
      console.error('Database error:', dbError);
    }

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-business-notification function:", error);
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
