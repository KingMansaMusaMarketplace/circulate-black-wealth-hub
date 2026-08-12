import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { z } from 'https://esm.sh/zod@3.23.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-csrf-token',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const BodySchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255),
  firm: z.string().trim().min(2).max(160),
  title: z.string().trim().max(120).optional().or(z.literal('')),
  aum: z.string().trim().max(80).optional().or(z.literal('')),
  linkedin_url: z.string().trim().url().max(255).optional().or(z.literal('')),
  reason: z.string().trim().max(1000).optional().or(z.literal('')),
});

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const body = await req.json();
    const parsed = BodySchema.safeParse(body);
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.flatten().fieldErrors }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const d = parsed.data;
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null;
    const ua = req.headers.get('user-agent') ?? null;

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: inserted, error } = await supabase
      .from('investor_access_requests')
      .insert({
        name: d.name,
        email: d.email,
        firm: d.firm,
        title: d.title || null,
        aum: d.aum || null,
        linkedin_url: d.linkedin_url || null,
        reason: d.reason || null,
        ip_address: ip,
        user_agent: ua,
      })
      .select('id')
      .single();

    if (error) {
      console.error('insert error', error);
      return new Response(JSON.stringify({ error: 'Failed to save request' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fire-and-forget notification (best effort)
    const resend = Deno.env.get('RESEND_API_KEY');
    if (resend) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: `Bearer ${resend}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: '1325.AI <noreply@1325.ai>',
            to: ['Partner@1325.AI'],
            reply_to: d.email,
            subject: `Investor access request — ${d.firm}`,
            html: `
              <h2>New investor access request</h2>
              <p><b>Name:</b> ${escapeHtml(d.name)}</p>
              <p><b>Email:</b> ${escapeHtml(d.email)}</p>
              <p><b>Firm:</b> ${escapeHtml(d.firm)}</p>
              <p><b>Title:</b> ${escapeHtml(d.title || '—')}</p>
              <p><b>AUM:</b> ${escapeHtml(d.aum || '—')}</p>
              <p><b>LinkedIn:</b> ${escapeHtml(d.linkedin_url || '—')}</p>
              <p><b>Reason:</b><br/>${escapeHtml(d.reason || '—').replace(/\n/g, '<br/>')}</p>
              <hr/>
              <p>Review at <a href="https://1325.ai/admin/investor-requests">/admin/investor-requests</a></p>
            `,
          }),
        });
      } catch (e) {
        console.error('email notify failed', e);
      }
    }

    return new Response(JSON.stringify({ ok: true, id: inserted.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Bad request' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
}
