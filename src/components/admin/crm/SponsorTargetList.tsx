import React, { useMemo, useState } from 'react';
import { Copy, ExternalLink, Phone, Mail, Search, CheckCircle2, Download } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useSponsorCRM, SponsorProspect, PIPELINE_STAGES } from '@/hooks/use-sponsor-crm';
import { buildSponsorEmail, getSponsorMeta } from '@/utils/sponsorOutreachEmail';
import { downloadSponsorCsv } from '@/utils/sponsorCsv';

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

const addBusinessDays = (days: number) => {
  const date = new Date();
  let added = 0;
  while (added < days) {
    date.setDate(date.getDate() + 1);
    const day = date.getDay();
    if (day !== 0 && day !== 6) added += 1;
  }
  return date;
};

interface RowProps {
  prospect: SponsorProspect;
  onSelect?: (prospect: SponsorProspect) => void;
}

const ProspectRow: React.FC<RowProps> = ({ prospect, onSelect }) => {
  const meta = getSponsorMeta(prospect);
  const email = buildSponsorEmail(prospect);
  const { logActivity, updateProspect } = useSponsorCRM();

  const stageLabel = PIPELINE_STAGES.find((s) => s.value === prospect.pipeline_stage)?.label;
  const contacted = !!prospect.last_contact_at;

  const markContacted = () => {
    logActivity({
      prospect_id: prospect.id,
      activity_type: 'email',
      subject: email.subject,
      body: email.body,
      completed_at: new Date().toISOString(),
      is_completed: true,
    } as any);
    updateProspect({
      id: prospect.id,
      pipeline_stage: 'outreach',
      last_contact_at: new Date().toISOString(),
      next_follow_up: addBusinessDays(5).toISOString(),
      follow_up_notes: 'Follow up on initial sponsorship outreach',
    } as any);
    toast.success(`${prospect.company_name} marked as contacted — follow-up set for 5 business days`);
  };

  return (
    <Card className="bg-white/5 border-white/10 p-4 space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <button type="button" className="min-w-0 text-left" onClick={() => onSelect?.(prospect)}>
          <p className="font-semibold text-white hover:text-purple-300 transition-colors">
            {prospect.company_name}
          </p>
          <p className="text-xs text-blue-300">{prospect.industry}</p>
        </button>
        <div className="flex flex-wrap items-center gap-2">
          {stageLabel && (
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-200 text-xs">
              {stageLabel}
            </Badge>
          )}
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

      {contacted && (
        <p className="text-xs text-emerald-300">
          Last contacted {new Date(prospect.last_contact_at as string).toLocaleDateString()}
        </p>
      )}

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
        <Button
          size="sm"
          variant="outline"
          className="border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10 h-8"
          onClick={markContacted}
        >
          <CheckCircle2 className="w-3 h-3 mr-1" /> Mark contacted
        </Button>
      </div>
    </Card>
  );
};

interface Props {
  onSelect?: (prospect: SponsorProspect) => void;
}

export const SponsorTargetList: React.FC<Props> = ({ onSelect }) => {
  const { prospects, isLoading } = useSponsorCRM();
  const [search, setSearch] = useState('');
  const [owner, setOwner] = useState<string>('all');

  const owners = useMemo(() => {
    const set = new Set<string>();
    prospects.forEach((p) => {
      const o = getSponsorMeta(p).owner;
      if (o) set.add(o);
    });
    return Array.from(set).sort();
  }, [prospects]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return prospects.filter((p) => {
      const meta = getSponsorMeta(p);
      const matchesTerm = term
        ? p.company_name.toLowerCase().includes(term) || (p.industry || '').toLowerCase().includes(term)
        : true;
      const matchesOwner = owner === 'all' ? true : meta.owner === owner;
      return matchesTerm && matchesOwner;
    });
  }, [prospects, search, owner]);

  const grouped = useMemo(
    () =>
      filtered.reduce<Record<number, SponsorProspect[]>>((acc, p) => {
        const tier = getSponsorMeta(p).tier ?? 4;
        (acc[tier] ||= []).push(p);
        return acc;
      }, {}),
    [filtered],
  );

  if (isLoading) {
    return <p className="text-blue-200">Loading target list…</p>;
  }

  const tiers = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-md flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-blue-300" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search companies or industries"
            className="pl-9 bg-white/5 border-white/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {['all', ...owners].map((o) => (
            <Button
              key={o}
              size="sm"
              variant={owner === o ? 'default' : 'outline'}
              className={owner === o ? 'bg-gradient-to-r from-purple-500 to-blue-500 h-8' : 'border-white/20 h-8'}
              onClick={() => setOwner(o)}
            >
              {o === 'all' ? 'All owners' : o}
            </Button>
          ))}
        </div>

        <Button
          size="sm"
          variant="outline"
          className="border-white/20 h-8 ml-auto"
          onClick={() => downloadSponsorCsv(filtered)}
        >
          <Download className="w-3 h-3 mr-1" /> Export CSV
        </Button>
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
              <ProspectRow key={p.id} prospect={p} onSelect={onSelect} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SponsorTargetList;
