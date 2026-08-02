import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-csrf-token",
};

const PARTNER_INBOX = "Partner@1325.AI";
const FROM = "1325.AI Partnerships <noreply@1325.ai>";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return new Response(JSON.stringify({ error: "Invalid request body" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const name = String(body.name ?? "").trim().slice(0, 120);
    const email = String(body.email ?? "").trim().slice(0, 200);
    const organization = String(body.organization ?? "").trim().slice(0, 200);
    const phone = String(body.phone ?? "").trim().slice(0, 40);
    const memberCount = String(body.memberCount ?? "").trim().slice(0, 60);
    const topic = String(body.topic ?? "Enterprise Partnership Inquiry")
      .trim().slice(0, 120);
    const message = String(body.message ?? "").trim().slice(0, 4000);

    const errors: string[] = [];
    if (name.length < 2) errors.push("Please enter your name.");
    if (!isEmail(email)) errors.push("Please enter a valid email address.");
    if (organization.length < 2) errors.push("Please enter your organization.");
    if (message.length < 10) errors.push("Please tell us a bit more (10+ characters).");
    if (errors.length) {
      return new Response(JSON.stringify({ error: errors.join(" ") }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const rows: Array<[string, string]> = [
      ["Name", name],
      ["Organization", organization],
      ["Email", email],
      ["Phone", phone || "—"],
      ["Members / Size", memberCount || "—"],
      ["Topic", topic],
    ];

    const internalHtml = `
      <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto">
        <div style="background:#003366;padding:24px;color:#fff">
          <h2 style="margin:0;font-size:20px">New Partnership Inquiry</h2>
          <p style="margin:6px 0 0;color:#FFB300;font-size:13px">${esc(topic)}</p>
        </div>
        <table style="width:100%;border-collapse:collapse;margin-top:16px">
          ${rows.map(([k, v]) => `
            <tr>
              <td style="padding:8px 12px;background:#f5f5f5;font-weight:bold;width:180px">${esc(k)}</td>
              <td style="padding:8px 12px">${esc(v)}</td>
            </tr>`).join("")}
        </table>
        <div style="padding:16px 12px">
          <h3 style="margin:0 0 8px;font-size:15px">Message</h3>
          <p style="white-space:pre-wrap;line-height:1.6">${esc(message)}</p>
        </div>
      </div>`;

    const internal = await resend.emails.send({
      from: FROM,
      to: [PARTNER_INBOX],
      reply_to: email,
      subject: `Partnership Inquiry — ${organization}`,
      html: internalHtml,
    });

    if ((internal as { error?: unknown }).error) {
      console.error("Resend internal send failed:", (internal as { error?: unknown }).error);
      return new Response(
        JSON.stringify({ error: "We could not send your message. Please email Partner@1325.AI directly." }),
        { status: 502, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    // Confirmation to the sender (best effort)
    try {
      await resend.emails.send({
        from: FROM,
        to: [email],
        reply_to: PARTNER_INBOX,
        subject: "We received your partnership inquiry — 1325.AI",
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
            <div style="background:#003366;padding:32px 24px;color:#fff;text-align:center">
              <h1 style="margin:0;font-size:22px">Thank you, ${esc(name)}</h1>
              <p style="margin:8px 0 0;color:#FFB300">1325.AI Enterprise Partnerships</p>
            </div>
            <div style="padding:24px;line-height:1.6;color:#222">
              <p>We received your inquiry for <strong>${esc(organization)}</strong> and a member of our partnership team will respond within two business days.</p>
              <p>If you need us sooner, reply directly to this email or write to <a href="mailto:${PARTNER_INBOX}">${PARTNER_INBOX}</a>.</p>
              <p style="margin-top:24px;color:#666;font-size:12px">1325.AI — a Mansa Musa Marketplace company</p>
            </div>
          </div>`,
      });
    } catch (e) {
      console.error("Confirmation email failed (non-fatal):", e);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (e) {
    console.error("send-partnership-inquiry error:", e);
    return new Response(
      JSON.stringify({ error: "Unexpected server error. Please email Partner@1325.AI directly." }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  }
});
