import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ExternalLink, Globe, Search } from 'lucide-react';

interface PartnerDirectory {
  id: string;
  name: string;
  description: string | null;
  website: string | null;
  logo_url: string | null;
  banner_url: string | null;
}

const PartnerDirectoriesPage = () => {
  const [rows, setRows] = useState<PartnerDirectory[]>([]);
  const [loading, setLoading] = useState(true);
  const [term, setTerm] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase.rpc('list_partner_directories');
      if (!active) return;
      if (error) console.error('Failed to load partner directories:', error);
      setRows((data as PartnerDirectory[]) || []);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  const q = term.trim().toLowerCase();
  const filtered = q
    ? rows.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          (r.description || '').toLowerCase().includes(q),
      )
    : rows;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Partner Directories & Chambers | 1325.AI</title>
        <meta
          name="description"
          content="Black chambers of commerce, business associations and regional directories partnered with 1325.AI across the U.S., Caribbean, Europe, LATAM, Africa and Asia."
        />
        <link rel="canonical" href="https://www.1325.ai/partner-directories" />
      </Helmet>

      <section className="border-b border-border/60 bg-gradient-to-b from-primary/10 to-transparent">
        <div className="container mx-auto px-4 py-14 md:py-20">
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3">
            Global Network
          </p>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Partner Directories &amp; Chambers
          </h1>
          <p className="max-w-2xl text-muted-foreground text-base md:text-lg">
            Chambers of commerce, business associations and regional directories in the
            1325.AI network. These are partner organizations — to find individual
            Black-owned businesses, visit the{' '}
            <Link to="/directory" className="text-primary underline underline-offset-4">
              main directory
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Search organizations…"
              className="pl-9"
              aria-label="Search partner directories"
            />
          </div>
          <span className="text-sm text-muted-foreground">
            {loading ? 'Loading…' : `${filtered.length} of ${rows.length} organizations`}
          </span>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="h-40 animate-pulse bg-muted/40" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((r) => (
              <Card
                key={r.id}
                className="overflow-hidden flex flex-col hover:border-primary/50 transition-colors"
              >
                {r.banner_url ? (
                  <img
                    src={r.banner_url}
                    alt={`${r.name} banner`}
                    loading="lazy"
                    className="h-28 w-full object-cover"
                  />
                ) : (
                  <div className="h-28 w-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <Globe className="h-7 w-7 text-primary/70" />
                  </div>
                )}
                <div className="p-4 flex flex-col gap-3 flex-1">
                  <h2 className="font-semibold leading-snug">{r.name}</h2>
                  {r.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {r.description}
                    </p>
                  )}
                  {r.website && (
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="mt-auto w-full"
                    >
                      <a href={r.website} target="_blank" rel="noopener noreferrer">
                        Visit website <ExternalLink className="ml-2 h-3.5 w-3.5" />
                      </a>
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default PartnerDirectoriesPage;
