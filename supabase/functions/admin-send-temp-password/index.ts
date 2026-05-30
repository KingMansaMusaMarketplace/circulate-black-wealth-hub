import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-csrf-token, x-admin-secret",
};

function generateTempPassword(): string {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghijkmnpqrstuvwxyz";
  const digits = "23456789";
  const symbols = "!@#$%^&*";
  const all = upper + lower + digits + symbols;
  const pick = (s: string) => s[Math.floor(Math.random() * s.length)];
  let pw = pick(upper) + pick(lower) + pick(digits) + pick(symbols);
  for (let i = 0; i < 10; i++) pw += pick(all);
  return pw.split("").sort(() => Math.random() - 0.5).join("");
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const adminSecret = req.headers.get("x-admin-secret");
    if (!adminSecret || adminSecret !== Deno.env.get("CRON_SECRET")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return new Response(JSON.stringify({ error: "email required" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Find user
    const { data: list, error: listErr } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 200,
    });
    if (listErr) throw listErr;
    const user = list.users.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase(),
    );
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const tempPassword = generateTempPassword();

    const { error: updErr } = await supabase.auth.admin.updateUserById(user.id, {
      password: tempPassword,
    });
    if (updErr) throw updErr;

    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    const loginUrl = (Deno.env.get("APP_URL") || "https://1325.ai") + "/login";

    const emailResp = await resend.emails.send({
      from: "1325.AI <noreply@1325.ai>",
      to: [email],
      subject: "Your Temporary Password - 1325.AI",
      html: `
        <div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;">
          <div style="background:linear-gradient(135deg,#003366,#1e3a8a);padding:32px 20px;text-align:center;">
            <h1 style="color:#fff;margin:0;font-size:24px;">Your Temporary Password</h1>
          </div>
          <div style="padding:32px 24px;background:#fff;color:#111;">
            <p style="font-size:16px;line-height:1.6;">Hi,</p>
            <p style="font-size:16px;line-height:1.6;">
              An administrator has set a temporary password for your 1325.AI account.
              Please sign in with the password below, then change it from your account settings right away.
            </p>
            <div style="margin:24px 0;padding:16px;background:#f3f4f6;border-radius:8px;text-align:center;">
              <div style="font-size:13px;color:#6b7280;margin-bottom:6px;">Temporary password</div>
              <div style="font-family:'Courier New',monospace;font-size:22px;font-weight:bold;letter-spacing:2px;color:#003366;">${tempPassword}</div>
            </div>
            <div style="text-align:center;margin:24px 0;">
              <a href="${loginUrl}" style="background:#FFB300;color:#003366;padding:14px 28px;text-decoration:none;border-radius:8px;font-weight:bold;display:inline-block;">Sign In Now</a>
            </div>
            <p style="font-size:13px;color:#6b7280;line-height:1.6;">
              For your security, change this password immediately after signing in.
              If you didn't request this, contact support@mansamusamarketplace.com right away.
            </p>
          </div>
        </div>
      `,
    });

    console.log("Temp password email sent:", emailResp);

    return new Response(
      JSON.stringify({ success: true, userId: user.id, email }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  } catch (e: any) {
    console.error("admin-send-temp-password error:", e);
    return new Response(JSON.stringify({ error: e.message || String(e) }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
