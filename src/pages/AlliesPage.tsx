import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search, Globe, Phone, MapPin, Handshake } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';

type Ally = {
  id: string; name: string; category: string | null; city: string | null; state: string | null;
  website: string | null; phone: string | null; logo_url: string | null; description: string | null;
};

const link = (u: string) => (/^https?:\/\//i.test(u) ? u : `https://${u}`);

/** Ally Businesses: approved non-Black-owned supporters, kept apart from the main directory. */
const AlliesPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<Ally[]>([]);
  const [loading, setLoading] = useState(true);

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
              <article key={a.id} className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
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
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AlliesPage;
