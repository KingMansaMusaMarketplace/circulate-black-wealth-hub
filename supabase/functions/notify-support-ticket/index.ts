import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
) as any;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-csrf-token",
};

const esc = (s: unknown) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Validate the caller is a signed-in user
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace("Bearer ", "");
    const { data: userData } = await supabase.auth.getUser(token);
    const user = userData?.user;
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const ticketId = typeof body.ticketId === "string" ? body.ticketId : "";
    if (!ticketId) {
      return new Response(JSON.stringify({ error: "ticketId is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: ticket, error } = await supabase
      .from("support_tickets")
      .select(
        "id, ticket_number, subject, description, category, priority, status, created_at, user_id",
      )
      .eq("id", ticketId)
      .maybeSingle();

    if (error || !ticket) {
      return new Response(JSON.stringify({ error: "Ticket not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Only the ticket owner can trigger its notification
    if (ticket.user_id !== user.id) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, email")
      .eq("id", ticket.user_id)
      .maybeSingle();

    // All new support tickets go to the partner inbox
    const recipients: string[] = ["Partner@1325.AI"];


    const priority = String(ticket.priority ?? "normal");
    const subject = `[${priority.toUpperCase()}] New support ticket ${ticket.ticket_number}: ${ticket.subject}`;

    const html = `
      <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:640px;margin:0 auto;">
        <h2 style="color:#003366;margin-bottom:4px;">New Support Ticket</h2>
        <p style="color:#555;margin-top:0;">Ticket <strong>${esc(ticket.ticket_number)}</strong></p>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr><td style="padding:6px 0;color:#666;">From</td><td>${esc(profile?.full_name || "Member")} (${esc(profile?.email || "no email on file")})</td></tr>
          <tr><td style="padding:6px 0;color:#666;">Category</td><td>${esc(ticket.category)}</td></tr>
          <tr><td style="padding:6px 0;color:#666;">Priority</td><td>${esc(priority)}</td></tr>
          <tr><td style="padding:6px 0;color:#666;">Subject</td><td>${esc(ticket.subject)}</td></tr>
        </table>
        <div style="background:#f6f8fb;border-left:4px solid #FFB300;padding:12px 16px;margin:16px 0;white-space:pre-wrap;">${esc(ticket.description)}</div>
        <p><a href="https://1325.ai/admin-dashboard" style="background:#003366;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none;">Open in Admin Dashboard</a></p>
      </div>`;

    const result = await resend.emails.send({
      from: "1325.AI Support <admin@1325.ai>",
      to: recipients,
      subject,
      html,
    });

    console.log("Support ticket notification sent", ticket.ticket_number, result);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("notify-support-ticket error", e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
