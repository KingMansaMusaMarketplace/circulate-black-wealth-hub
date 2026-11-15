
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, supabaseServiceKey) as any;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-csrf-token",
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

/** Email addresses on record for the business or sponsor an admin notification is about. */
async function allowedRecipients(type: string, businessId?: string, userId?: string): Promise<Set<string>> {
  const out = new Set<string>();
  const add = (e?: string | null) => { if (e && typeof e === 'string') out.add(e.trim().toLowerCase()); };
  const authEmail = async (id?: string | null) => {
    if (!id) return;
    const { data } = await supabase.auth.admin.getUserById(id);
    add(data?.user?.email);
  };
  if (type === 'verification_approved') {
    if (!businessId) return out;
    const { data: biz } = await supabase.from('businesses').select('owner_id, email').eq('id', businessId).maybeSingle();
    if (!biz) return out;
    add(biz.email);
    const { data: priv } = await supabase.from('businesses_private').select('email').eq('business_id', businessId).maybeSingle();
    add(priv?.email);
    await authEmail(biz.owner_id);
  } else if (type === 'sponsor_welcome' || type === 'sponsor_rejected') {
    if (!userId) return out;
    const { data: sub } = await supabase.from('corporate_subscriptions').select('user_id').eq('user_id', userId).limit(1).maybeSingle();
    if (sub?.user_id) await authEmail(sub.user_id);
  }
  return out;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate the caller
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabaseAuth = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } }
    });
    const token = authHeader.replace('Bearer ', '');
    const { data: claims, error: authError } = await supabaseAuth.auth.getUser(token);
    if (authError || !claims?.user) {
      return new Response(
        JSON.stringify({ error: 'Authentication failed' }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { type, businessId, userId, recipientEmail, businessName, customerName, companyName, tier, rejectionReason }: NotificationRequest = await req.json();

    // Privileged notification types are admin-only; the rest may only be sent
    // by the signed-in user to their own address.
    const adminOnlyTypes = ['verification_approved', 'sponsor_welcome', 'sponsor_rejected'];
    const { data: isAdmin } = await supabaseAuth.rpc('is_admin_secure');

    if (adminOnlyTypes.includes(type)) {
      if (!isAdmin) {
        return new Response(
          JSON.stringify({ error: 'Forbidden' }),
          { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      // Even admins may only send these to the business or sponsor on record:
      // the server looks up the allowed addresses instead of trusting the request.
      const allowed = await allowedRecipients(type, businessId, userId);
      if (!allowed.has((recipientEmail || '').trim().toLowerCase())) {
        return new Response(
          JSON.stringify({ error: 'Recipient does not match the business or sponsor on record' }),
          { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
    } else if (!isAdmin) {
      const callerEmail = (claims.user.email || '').toLowerCase();
      if (userId !== claims.user.id || (recipientEmail || '').toLowerCase() !== callerEmail) {
        return new Response(
          JSON.stringify({ error: 'Forbidden' }),
          { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
    }

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

    console.log(`Sending ${type} email`);
    
    const emailResponse = await resend.emails.send({
      from: "Thomas at 1325.AI <Partner@1325.AI>",
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
      JSON.stringify({ error: (error as Error).message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
