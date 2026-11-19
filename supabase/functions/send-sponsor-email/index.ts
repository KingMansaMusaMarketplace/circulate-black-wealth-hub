import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { requireAdmin } from "../_shared/auth-guard.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-csrf-token",
};

interface EmailRequest {
  sponsorId: string;
  subject: string;
  content: string;
  template?: string;
}

const escHtml = (value: unknown): string =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const RATE_LIMIT_PER_HOUR = 30;
const rateLimitCache = new Map<string, { count: number; resetAt: number }>();
function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = rateLimitCache.get(key);
  if (!entry || entry.resetAt < now) {
    rateLimitCache.set(key, { count: 1, resetAt: now + 60 * 60 * 1000 });
    return true;
  }
  if (entry.count >= RATE_LIMIT_PER_HOUR) return false;
  entry.count += 1;
  return true;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authResult = await requireAdmin(req, corsHeaders);
    if (!authResult.authenticated) {
      return new Response(JSON.stringify({ error: authResult.error }), {
        status: authResult.status,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") as any ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { sponsorId, subject, content, template }: EmailRequest = await req.json();

    // Validate the request: a real sponsor record, a short single-line subject
    // and a bounded plain-text message. Admin-typed text is escaped below so it
    // can never inject markup, hidden links or scripts into a 1325.AI email.
    const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const cleanSubject = String(subject ?? "").replace(/[\r\n\t]+/g, " ").trim();
    const cleanContent = String(content ?? "").replace(/\r\n/g, "\n").trim();
    if (
      typeof sponsorId !== "string" || !UUID_RE.test(sponsorId) ||
      !cleanSubject || cleanSubject.length > 200 ||
      !cleanContent || cleanContent.length > 10000
    ) {
      return new Response(
        JSON.stringify({ error: "Please provide a sponsor, a subject (up to 200 characters) and a message (up to 10,000 characters)." }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    // Per-admin hourly limit so a single session cannot mass-mail sponsors.
    const adminId = authResult.userId ?? "unknown";
    if (!checkRateLimit(adminId)) {
      return new Response(
        JSON.stringify({ error: "Too many sponsor emails sent. Please try again later." }),
        { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    console.log(`Sending email to sponsor: ${sponsorId}, template: ${template}`);

    // Get sponsor details
    const { data: sponsor, error: sponsorError } = await supabase
      .from("corporate_subscriptions")
      .select("*")
      .eq("id", sponsorId)
      .single();

    if (sponsorError || !sponsor) {
      console.error("Error fetching sponsor:", sponsorError);
      throw new Error("Sponsor not found");
    }

    // Get user email if contact_email is not set
    let recipientEmail = sponsor.contact_email;
    
    if (!recipientEmail && sponsor.user_id) {
      const { data: userData } = await supabase.auth.admin.getUserById(sponsor.user_id);
      recipientEmail = userData?.user?.email;
    }

    if (!recipientEmail) {
      throw new Error("No email address found for sponsor");
    }

    console.log(`Admin ${adminId} sending sponsor email to sponsor ${sponsorId}`);

    // Build HTML email
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${escHtml(cleanSubject)}</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1B365D 0%, #2d4a7c 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: #D4AF37; margin: 0; font-size: 24px;">Mansa Musa Marketplace</h1>
            <p style="color: #ffffff; margin: 10px 0 0; font-size: 14px;">Supporting Black-Owned Businesses</p>
          </div>
          
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e5e5; border-top: none;">
            <div style="white-space: pre-wrap; font-size: 16px; color: #333;">
              ${escHtml(cleanContent).replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <div style="background: #f5f5f5; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border: 1px solid #e5e5e5; border-top: none;">
            <p style="margin: 0; font-size: 12px; color: #666;">
              1325.AI<br>
              <a href="https://1325.ai" style="color: #1B365D;">1325.ai</a>
            </p>
          </div>
        </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "Thomas at 1325.AI <Partner@1325.AI>",
      to: [recipientEmail],
      subject: cleanSubject,
      html: htmlContent,
      text: cleanContent,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-sponsor-email function:", error);
    return new Response(
      JSON.stringify({ error: "An internal error occurred while sending the email." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
