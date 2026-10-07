import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Globe, Phone, MapPin, Handshake, Sparkles, Award, Mail, Copy, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { isNativeApp } from '@/utils/platform-utils';

type Ally = {
  id: string; name: string; category: string | null; city: string | null; state: string | null;
  website: string | null; phone: string | null; logo_url: string | null; description: string | null;
};

const link = (u: string) => (/^https?:\/\//i.test(u) ? u : `https://${u}`);
const SITE = 'https://1325.ai';

/** Copy-paste HTML for an ally's own website. Never says "Verified" or "Black-owned". */
const badgeCode = (a: Ally) =>
  `<a href="${SITE}/allies?ally=${a.id}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:8px;padding:8px 14px;border-radius:999px;background:#000;border:2px solid #FFB300;color:#FFB300;font:600 14px/1 system-ui,sans-serif;text-decoration:none">&#129309; Proud Ally of 1325.AI</a>`;

const SPONSOR_MAIL =
  'mailto:Partner@1325.AI?subject=' + encodeURIComponent('Ally Sponsorship Inquiry') +
  '&body=' + encodeURIComponent('Hi 1325.AI team,\n\nOur business would like to learn about Ally sponsor packages.\n\nBusiness name:\nCity:\nPhone:\n');

/** Ally Businesses: approved non-Black-owned supporters, kept apart from the main directory. */
const AlliesPage: React.FC = () => {
  const [params] = useSearchParams();
  const focusId = params.get('ally');
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<Ally[]>([]);
  const [loading, setLoading] = useState(true);
  const [openBadge, setOpenBadge] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const native = isNativeApp();

  useEffect(() => {
    const t = setTimeout(async () => {
      setLoading(true);
      const { data, error } = await (supabase.rpc as any)('get_ally_businesses', { p_search: search.trim() || null, p_limit: 60, p_offset: 0 });
      if (error) console.error('Allies load failed:', error);
      setItems((data as Ally[]) || []);
      setLoading(false);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  // When someone arrives from an ally's badge, scroll to that ally's card.
  useEffect(() => {
    if (!focusId || loading) return;
    document.getElementById(`ally-${focusId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [focusId, loading]);

  const copy = async (a: Ally) => {
    try { await navigator.clipboard.writeText(badgeCode(a)); setCopied(a.id); setTimeout(() => setCopied(null), 2000); } catch {}
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#000000] via-[#050a18] to-[#030712]">
      <Helmet>
        <title>Ally Businesses | 1325.AI</title>
        <meta name="description" content="Businesses that stand with Black-owned businesses. Ally listings are not Black-owned and are shown separately from the 1325.AI directory." />
        <link rel="canonical" href="https://1325.ai/allies" />
      </Helmet>
      <main className="container mx-auto px-4 py-10 max-w-5xl">
        <div className="text-center mb-8">
          <Handshake className="w-10 h-10 text-mansagold mx-auto mb-3" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">Ally Businesses</h1>
          <p className="text-slate-300 mt-3 max-w-2xl mx-auto">
            Businesses that stand with Black-owned businesses. Allies are <strong className="text-white">not Black-owned</strong>,
            so they are listed here, separately from the main 1325.AI directory.
          </p>
        </div>

        {/* What allies get */}
        <section className="grid md:grid-cols-3 gap-4 mb-10">
          {!native && (
            <div className="rounded-2xl border border-mansagold/30 bg-mansagold/5 p-5">
              <Sparkles className="w-6 h-6 text-mansagold mb-2" />
              <h2 className="text-white font-bold text-lg">Kayla works for Allies too</h2>
              <p className="text-slate-300 text-sm mt-1">Approved allies can subscribe to Kayla and the 42 Agentic AI Employees on the same plans as every business.</p>
              <Link to="/pricing" className="inline-block mt-3 text-mansagold font-semibold underline">See plans →</Link>
            </div>
          )}
          <div className="rounded-2xl border border-mansagold/30 bg-mansagold/5 p-5">
            <Award className="w-6 h-6 text-mansagold mb-2" />
            <h2 className="text-white font-bold text-lg">“Proud Ally” badge</h2>
            <p className="text-slate-300 text-sm mt-1">Once approved, find your card below and tap “Get my badge” to copy a badge for your own website. It links back to your card here.</p>
          </div>
          <div className="rounded-2xl border border-mansagold/30 bg-mansagold/5 p-5">
            <Mail className="w-6 h-6 text-mansagold mb-2" />
            <h2 className="text-white font-bold text-lg">Become a Sponsor</h2>
            <p className="text-slate-300 text-sm mt-1">Want to do more? Ask us about Ally sponsor packages.</p>
            <a href={SPONSOR_MAIL} className="inline-block mt-3 text-mansagold font-semibold underline">Contact Us →</a>
          </div>
        </section>

        <div className="relative max-w-xl mx-auto mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, city or category" className="pl-9 h-12" aria-label="Search allies" />
        </div>
        {loading ? (
          <p className="text-center text-slate-300">Loading…</p>
        ) : items.length === 0 ? (
          <p className="text-center text-slate-300">
            {search ? 'No allies match your search.' : 'No ally businesses yet. Check back soon.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((a) => (
              <article id={`ally-${a.id}`} key={a.id} className={`rounded-2xl border bg-slate-900/70 p-5 ${focusId === a.id ? 'border-mansagold' : 'border-white/10'}`}>
                <div className="flex items-start gap-3">
                  {a.logo_url && <img src={a.logo_url} alt="" className="w-12 h-12 rounded-lg object-cover" loading="lazy" />}
                  <div className="min-w-0">
                    <h2 className="font-bold text-lg text-white">{a.name}</h2>
                    {a.category && <p className="text-xs text-mansagold">{a.category}</p>}
                  </div>
                </div>
                {a.description && <p className="text-sm text-slate-300 mt-2 line-clamp-3">{a.description}</p>}
                <div className="mt-3 space-y-1 text-sm">
                  {(a.city || a.state) && <p className="flex items-center gap-2 text-slate-300"><MapPin className="w-4 h-4" />{[a.city, a.state].filter(Boolean).join(', ')}</p>}
                  {a.phone && <a href={`tel:${a.phone}`} className="flex items-center gap-2 text-white"><Phone className="w-4 h-4" />{a.phone}</a>}
                  {a.website && <a href={link(a.website)} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-mansagold underline"><Globe className="w-4 h-4" />Website</a>}
                </div>
                <button type="button" onClick={() => setOpenBadge(openBadge === a.id ? null : a.id)} className="mt-3 text-xs text-slate-300 underline">
                  {openBadge === a.id ? 'Hide badge' : 'Own this business? Get my badge'}
                </button>
                {openBadge === a.id && (
                  <div className="mt-2 rounded-lg bg-black/60 border border-white/10 p-3 space-y-2">
                    <div dangerouslySetInnerHTML={{ __html: badgeCode(a) }} />
                    <p className="text-xs text-slate-300">Copy this and paste it into your website:</p>
                    <textarea readOnly value={badgeCode(a)} className="w-full h-20 text-[11px] bg-black text-slate-200 rounded p-2 font-mono" />
                    <button type="button" onClick={() => copy(a)} className="inline-flex items-center gap-1 text-xs font-semibold text-black bg-mansagold rounded px-3 py-1.5">
                      {copied === a.id ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy badge code</>}
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AlliesPage;
