import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-csrf-token',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!),
  );
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization') ?? '';
    if (!authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

    // Verify caller is admin
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const admin = createClient(supabaseUrl, serviceKey);
    const { data: isAdmin } = await admin.rpc('is_admin_secure', { _user_id: userData.user.id });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { request_id } = await req.json();
    if (!request_id || typeof request_id !== 'string') {
      return new Response(JSON.stringify({ error: 'request_id is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: reqRow, error: fetchErr } = await admin
      .from('investor_access_requests')
      .select('id, name, email, firm, status, approval_email_sent_at')
      .eq('id', request_id)
      .single();

    if (fetchErr || !reqRow) {
      return new Response(JSON.stringify({ error: 'Request not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (reqRow.status !== 'approved') {
      return new Response(JSON.stringify({ error: 'Request is not approved' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const passcode = Deno.env.get('INVESTOR_PORTAL_PASSCODE') ?? '';
    const resendKey = Deno.env.get('RESEND_API_KEY');
    if (!passcode) {
      return new Response(JSON.stringify({ error: 'INVESTOR_PORTAL_PASSCODE not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (!resendKey) {
      return new Response(JSON.stringify({ error: 'RESEND_API_KEY not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const portalUrl = 'https://1325.ai/investor-portal';
    const name = reqRow.name;
    const firm = reqRow.firm;

    const html = `
      <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:600px;margin:0 auto;color:#0b0b0b;">
        <div style="background:#000;padding:24px;text-align:center;">
          <h1 style="color:#FFB300;margin:0;font-size:22px;letter-spacing:0.5px;">1325.AI — Investor Data Room</h1>
        </div>
        <div style="padding:28px 24px;background:#fff;">
          <p>Hello ${escapeHtml(name)},</p>
          <p>Your request for access to the 1325.AI investor data room on behalf of <b>${escapeHtml(firm)}</b> has been <b>approved</b>.</p>

          <p>Before entering, you'll be asked to acknowledge our standard NDA. By using the passcode below, you agree to keep all materials strictly confidential and not to copy, forward, or distribute them.</p>

          <div style="background:#f5f5f5;border-left:4px solid #FFB300;padding:16px 20px;margin:24px 0;">
            <div style="font-size:12px;color:#666;text-transform:uppercase;letter-spacing:1px;">Your Access Passcode</div>
            <div style="font-family:'SF Mono',Menlo,monospace;font-size:20px;font-weight:600;color:#000;margin-top:6px;letter-spacing:2px;">${escapeHtml(passcode)}</div>
          </div>

          <div style="text-align:center;margin:28px 0;">
            <a href="${portalUrl}" style="display:inline-block;background:#003366;color:#fff;text-decoration:none;padding:14px 32px;border-radius:6px;font-weight:600;">
              Enter the Investor Portal →
            </a>
          </div>

          <p style="font-size:13px;color:#555;">Direct link: <a href="${portalUrl}" style="color:#003366;">${portalUrl}</a></p>

          <hr style="border:none;border-top:1px solid #e5e5e5;margin:28px 0;" />

          <p style="font-size:11px;color:#c00;text-align:center;font-weight:600;letter-spacing:0.5px;">
            PRIVATE &amp; CONFIDENTIAL — DO NOT COPY, FORWARD, OR DISTRIBUTE
          </p>
          <p style="font-size:11px;color:#888;text-align:center;">
            All materials reference U.S. Provisional Patent Application No. 63/969,202 — 27 claims pending.<br/>
            Questions? Reply to this email or contact Thomas@1325.AI.
          </p>
        </div>
      </div>
    `;

    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: '1325.AI Investor Relations <noreply@1325.ai>',
        to: [reqRow.email],
        bcc: ['Thomas@1325.AI'],
        reply_to: 'Thomas@1325.AI',
        subject: '1325.AI — Investor Data Room Access Approved',
        html,
      }),
    });

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null;
    const ua = req.headers.get('user-agent') ?? null;
    const alreadySent = !!(reqRow as any).approval_email_sent_at;

    if (!emailRes.ok) {
      const body = await emailRes.text();
      console.error('Resend error', emailRes.status, body);
      await admin.from('investor_access_log').insert({
        investor_name: reqRow.name,
        investor_email: reqRow.email,
        investor_firm: reqRow.firm ?? null,
        action_type: 'approval_email_failed',
        ip_address: ip,
        user_agent: ua,
        metadata: {
          request_id,
          approved_by: userData.user.id,
          resend_status: emailRes.status,
          error: body.slice(0, 500),
        },
      });
      return new Response(
        JSON.stringify({ error: 'Email send failed', status: emailRes.status, details: body }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    await admin
      .from('investor_access_requests')
      .update({ approval_email_sent_at: new Date().toISOString() })
      .eq('id', request_id);

    await admin.from('investor_access_log').insert({
      investor_name: reqRow.name,
      investor_email: reqRow.email,
      investor_firm: reqRow.firm ?? null,
      action_type: alreadySent ? 'approval_email_resent' : 'approval_email_sent',
      ip_address: ip,
      user_agent: ua,
      metadata: {
        request_id,
        approved_by: userData.user.id,
        portal_url: portalUrl,
      },
    });

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('send-investor-approval error', e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
