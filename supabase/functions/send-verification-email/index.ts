import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface VerificationEmailRequest {
  email: string;
  confirmationUrl: string;
  userType: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, confirmationUrl, userType }: VerificationEmailRequest = await req.json();

    console.log("Sending verification email to:", email);

    const emailResponse = await resend.emails.send({
      from: "Mansa Musa Marketplace <onboarding@resend.dev>",
      to: [email],
      subject: "Verify Your Email - Welcome to Mansa Musa Marketplace!",
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #1e3a8a, #3730a3); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to the Movement!</h1>
            <p style="color: #e0e7ff; margin-top: 10px; font-size: 16px;">
              Thank you for joining Mansa Musa Marketplace
            </p>
          </div>
          
          <div style="padding: 40px 20px; background: #ffffff;">
            <h2 style="color: #1e3a8a; margin-bottom: 20px;">Verify Your Email Address</h2>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Welcome to Mansa Musa Marketplace! You're now part of a community dedicated to 
              circulating wealth within the Black community and supporting Black-owned businesses.
            </p>

            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
              To complete your ${userType === 'business' ? 'business' : 'customer'} account setup, 
              please verify your email address by clicking the button below:
            </p>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${confirmationUrl}" 
                 style="background: #dc2626; color: white; padding: 16px 32px; text-decoration: none; 
                        border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
                Verify Email Address
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
              If the button doesn't work, copy and paste this link into your browser:
            </p>
            <p style="color: #3730a3; font-size: 14px; word-break: break-all; background: #f3f4f6; 
                      padding: 10px; border-radius: 4px;">
              ${confirmationUrl}
            </p>

            ${userType === 'business' ? `
            <div style="margin-top: 30px; padding: 20px; background: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
              <h3 style="color: #92400e; margin: 0 0 10px 0;">Next Steps for Your Business:</h3>
              <ul style="color: #92400e; margin: 10px 0; padding-left: 20px;">
                <li>Complete your business profile</li>
                <li>Upload your business verification documents</li>
                <li>Create your first QR codes</li>
                <li>Start connecting with customers!</li>
              </ul>
            </div>
            ` : `
            <div style="margin-top: 30px; padding: 20px; background: #dbeafe; border-radius: 8px; border-left: 4px solid #3b82f6;">
              <h3 style="color: #1e40af; margin: 0 0 10px 0;">What's Next:</h3>
              <ul style="color: #1e40af; margin: 10px 0; padding-left: 20px;">
                <li>Explore the business directory</li>
                <li>Download our mobile app</li>
                <li>Start earning loyalty points</li>
                <li>Connect with Black-owned businesses!</li>
              </ul>
            </div>
            `}
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px; margin: 0;">
                <strong>Security Notice:</strong> This verification link will expire in 24 hours. 
                If you didn't create this account, please ignore this email.
              </p>
            </div>
          </div>
          
          <div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 12px; margin: 0 0 10px 0;">
              © 2024 Mansa Musa Marketplace. Supporting Black-owned businesses nationwide.
            </p>
            <p style="color: #6b7280; font-size: 12px; margin: 0;">
              "Circulating wealth, strengthening community, one transaction at a time."
            </p>
          </div>
        </div>
      `,
    });

    console.log("Verification email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending verification email:", error);
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