import React, { useMemo, useState } from 'react';
import { Copy, ExternalLink, Phone, Mail, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useSponsorCRM, SponsorProspect } from '@/hooks/use-sponsor-crm';
import { buildSponsorEmail, getSponsorMeta } from '@/utils/sponsorOutreachEmail';

const TIER_LABELS: Record<number, string> = {
  1: 'Tier 1 — National enterprise',
  2: 'Tier 2 — National consumer brands',
  3: 'Tier 3 — Regional & Black-owned banks',
  4: 'Tier 4 — AI & technology',
};

const copy = async (text: string, label: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  } catch {
    toast.error('Could not copy — try selecting the text manually');
  }
};

const ProspectRow: React.FC<{ prospect: SponsorProspect }> = ({ prospect }) => {
  const meta = getSponsorMeta(prospect);
  const email = buildSponsorEmail(prospect);

  return (
    <Card className="bg-white/5 border-white/10 p-4 space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold text-white">{prospect.company_name}</p>
          <p className="text-xs text-blue-300">{prospect.industry}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {meta.target_label && (
            <Badge className="bg-amber-500/20 text-amber-300 text-xs">{meta.target_label}</Badge>
          )}
          {meta.owner && (
            <Badge variant="secondary" className="bg-white/10 text-blue-200 text-xs">
              {meta.owner}
            </Badge>
          )}
        </div>
      </div>

      {meta.pitch_angle && <p className="text-sm text-blue-100/80">{meta.pitch_angle}</p>}

      <div className="flex flex-wrap items-center gap-2">
        {prospect.website && (
          <Button asChild size="sm" variant="outline" className="border-white/20 h-8">
            <a href={prospect.website} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-3 h-3 mr-1" /> Website
            </a>
          </Button>
        )}
        {meta.portal_url && (
          <Button asChild size="sm" variant="outline" className="border-white/20 h-8">
            <a href={meta.portal_url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-3 h-3 mr-1" /> Partnership portal
            </a>
          </Button>
        )}
        {meta.phone && (
          <Button asChild size="sm" variant="outline" className="border-white/20 h-8">
            <a href={`tel:${meta.phone.replace(/[^\d+]/g, '')}`}>
              <Phone className="w-3 h-3 mr-1" /> {meta.phone}
            </a>
          </Button>
        )}
        <Button
          size="sm"
          className="h-8 bg-gradient-to-r from-purple-500 to-blue-500"
          onClick={() => copy(`Subject: ${email.subject}\n\n${email.body}`, 'Email')}
        >
          <Copy className="w-3 h-3 mr-1" /> Copy email
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="border-white/20 h-8"
          onClick={() => copy(email.subject, 'Subject line')}
        >
          <Mail className="w-3 h-3 mr-1" /> Copy subject
        </Button>
      </div>
    </Card>
  );
};

export const SponsorTargetList: React.FC = () => {
  const { prospects, isLoading } = useSponsorCRM();
  const [search, setSearch] = useState('');

  const grouped = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filtered = prospects.filter((p) =>
      term ? p.company_name.toLowerCase().includes(term) || (p.industry || '').toLowerCase().includes(term) : true,
    );
    return filtered.reduce<Record<number, SponsorProspect[]>>((acc, p) => {
      const tier = getSponsorMeta(p).tier ?? 4;
      (acc[tier] ||= []).push(p);
      return acc;
    }, {});
  }, [prospects, search]);

  if (isLoading) {
    return <p className="text-blue-200">Loading target list…</p>;
  }

  const tiers = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="space-y-6">
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-blue-300" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search companies or industries"
          className="pl-9 bg-white/5 border-white/20"
        />
      </div>

      {tiers.length === 0 && <p className="text-blue-200">No prospects match that search.</p>}

      {tiers.map((tier) => (
        <div key={tier} className="space-y-3">
          <h3 className="text-white font-semibold">
            {TIER_LABELS[tier] ?? 'Other'}{' '}
            <span className="text-blue-300 text-sm font-normal">({grouped[tier].length})</span>
          </h3>
          <div className="grid gap-3 md:grid-cols-2">
            {grouped[tier].map((p) => (
              <ProspectRow key={p.id} prospect={p} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SponsorTargetList;
