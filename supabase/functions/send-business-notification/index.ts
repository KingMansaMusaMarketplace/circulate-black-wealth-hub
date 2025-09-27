
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
  type: 'new_business' | 'verification_approved' | 'new_customer';
  businessId?: string;
  userId: string;
  recipientEmail: string;
  businessName?: string;
  customerName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, businessId, userId, recipientEmail, businessName, customerName }: NotificationRequest = await req.json();

    let subject = "";
    let htmlContent = "";

    switch (type) {
      case 'new_business':
        subject = `Welcome to Mansa Musa Marketplace, ${businessName}!`;
        htmlContent = `
          <h1>Welcome to Mansa Musa Marketplace! 🎉</h1>
          <p>Dear ${businessName} team,</p>
          <p>Congratulations! Your business has been successfully registered on Mansa Musa Marketplace.</p>
          <h2>What's Next?</h2>
          <ul>
            <li>Complete your business profile</li>
            <li>Upload your logo and banner images</li>
            <li>Generate QR codes for customer rewards</li>
            <li>Start connecting with customers in your community</li>
          </ul>
          <p>Together, we're building economic empowerment and keeping dollars circulating in our community.</p>
          <p>Best regards,<br>The Mansa Musa Marketplace Team</p>
          <p>For questions, contact us at: contact@mansamusamarketplace.com</p>
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
          <p>For questions, contact us at: contact@mansamusamarketplace.com</p>
        `;
        break;

      case 'new_customer':
        subject = `Welcome to Mansa Musa Marketplace, ${customerName}!`;
        htmlContent = `
          <h1>Welcome to the Movement! 🚀</h1>
          <p>Dear ${customerName},</p>
          <p>Welcome to Mansa Musa Marketplace - where every purchase builds community wealth!</p>
          <h2>Get Started:</h2>
          <ul>
            <li>Discover amazing Black-owned businesses near you</li>
            <li>Scan QR codes to earn loyalty points</li>
            <li>Get exclusive discounts and rewards</li>
            <li>Support economic empowerment with every purchase</li>
          </ul>
          <p>Together, we're extending the circulation of the Black dollar beyond the national average of 6 hours.</p>
          <p>Welcome to the movement!</p>
          <p>For questions, contact us at: contact@mansamusamarketplace.com</p>
        `;
        break;
    }

    const emailResponse = await resend.emails.send({
      from: "Mansa Musa Marketplace <onboarding@resend.dev>",
      to: [recipientEmail],
      subject: subject,
      html: htmlContent,
    });

    // Record notification in database
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
