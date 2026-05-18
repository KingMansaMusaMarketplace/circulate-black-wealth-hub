// Nightly job: scan lease_saved_searches, find new matches in vacation_properties,
// email each user via send-transactional-email. Updates last_notified_at to prevent dupes.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-csrf-token',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  const results: any[] = []

  try {
    const { data: searches, error: searchErr } = await supabase
      .from('lease_saved_searches')
      .select('*')
      .eq('notify_email', true)

    if (searchErr) throw searchErr

    for (const s of searches ?? []) {
      try {
        const since = s.last_notified_at ?? s.created_at
        let q = supabase
          .from('vacation_properties')
          .select('id,title,city,state,base_nightly_rate,monthly_rent,bedrooms,bathrooms,photos,listing_mode,property_type,created_at')
          .eq('listing_mode', 'yearly_lease')
          .eq('is_verified', true)
          .gt('created_at', since)
          .order('created_at', { ascending: false })
          .limit(10)

        if (s.city) q = q.ilike('city', `%${s.city}%`)
        if (s.bedrooms != null) q = q.gte('bedrooms', s.bedrooms)
        if (s.property_type) q = q.eq('property_type', s.property_type)
        if (s.min_rent != null) q = q.gte('monthly_rent', s.min_rent)
        if (s.max_rent != null) q = q.lte('monthly_rent', s.max_rent)

        const { data: props, error: propErr } = await q
        if (propErr) throw propErr
        if (!props || props.length === 0) {
          results.push({ search_id: s.id, matches: 0 })
          continue
        }

        // Get user email
        const { data: userRes } = await supabase.auth.admin.getUserById(s.user_id)
        const email = userRes?.user?.email
        if (!email) {
          results.push({ search_id: s.id, matches: props.length, skipped: 'no_email' })
          continue
        }

        const matches = props.map((p: any) => ({
          id: p.id,
          title: p.title,
          city: p.city,
          state: p.state,
          rent: p.monthly_rent ?? p.base_nightly_rate,
          bedrooms: p.bedrooms,
          bathrooms: p.bathrooms,
          image: Array.isArray(p.photos) && p.photos[0] ? p.photos[0] : undefined,
        }))

        const { error: sendErr } = await supabase.functions.invoke('send-transactional-email', {
          body: {
            templateName: 'lease-saved-search-matches',
            recipientEmail: email,
            idempotencyKey: `lease-search-${s.id}-${new Date().toISOString().slice(0, 10)}`,
            templateData: {
              searchLabel: s.label || s.city || 'your saved search',
              matches,
              manageUrl: 'https://1325.ai/stays/lease',
            },
          },
        })
        if (sendErr) throw sendErr

        await supabase
          .from('lease_saved_searches')
          .update({ last_notified_at: new Date().toISOString() })
          .eq('id', s.id)

        results.push({ search_id: s.id, matches: matches.length, sent: true })
      } catch (e) {
        results.push({ search_id: s.id, error: String(e) })
      }
    }

    return new Response(JSON.stringify({ ok: true, processed: results.length, results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
