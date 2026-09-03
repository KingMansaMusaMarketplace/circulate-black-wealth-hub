import React, { useMemo, useState } from 'react';
import {
  Copy,
  ExternalLink,
  Phone,
  Mail,
  Search,
  CheckCircle2,
  Download,
  UserSearch,
  CalendarClock,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useSponsorCRM, SponsorProspect } from '@/hooks/use-sponsor-crm';
import {
  buildSponsorEmail,
  getSponsorMeta,
  getNextTouch,
  getTouchCount,
  OUTREACH_TOUCHES,
  OutreachTouch,
} from '@/utils/sponsorOutreachEmail';
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

export const addBusinessDays = (days: number) => {
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
  selected: boolean;
  onToggleSelect: (id: string) => void;
}

const ProspectRow: React.FC<RowProps> = ({ prospect, onSelect, selected, onToggleSelect }) => {
  const { updateProspect, logActivity } = useSponsorCRM();
  const meta = getSponsorMeta(prospect);
  const sent = getTouchCount(prospect);
  const [touch, setTouch] = useState<OutreachTouch>(getNextTouch(prospect));
  const email = useMemo(() => buildSponsorEmail(prospect, touch), [prospect, touch]);

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
      pipeline_stage: prospect.pipeline_stage === 'research' ? 'outreach' : prospect.pipeline_stage,
      last_contact_at: new Date().toISOString(),
      next_follow_up: addBusinessDays(5).toISOString(),
      custom_fields: {
        ...meta,
        touch_count: Math.min(touch, 3),
        last_touch_at: new Date().toISOString(),
      },
    } as any);

    toast.success(`Logged touch ${touch} — follow-up set for 5 business days`);
    setTouch((t) => (Math.min(t + 1, 3) as OutreachTouch));
  };

  return (
    <Card className="bg-white/5 border-white/10 p-4 space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex items-start gap-3 min-w-0">
          <Checkbox
            checked={selected}
            onCheckedChange={() => onToggleSelect(prospect.id)}
            className="mt-1 border-white/30"
            aria-label={`Select ${prospect.company_name}`}
          />
          <button className="text-left min-w-0" onClick={() => onSelect?.(prospect)}>
            <p className="font-semibold text-white hover:text-amber-300 transition-colors">
              {prospect.company_name}
            </p>
            <p className="text-xs text-blue-300">{prospect.industry}</p>
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {sent > 0 && (
            <Badge className="bg-emerald-500/20 text-emerald-300 text-xs">{sent} sent</Badge>
          )}
          {!prospect.primary_contact_name && (
            <Badge className="bg-orange-500/20 text-orange-300 text-xs">Needs a name</Badge>
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

      {/* Touch selector */}
      <div className="flex flex-wrap items-center gap-1">
        {OUTREACH_TOUCHES.map((t) => (
          <Button
            key={t.touch}
            size="sm"
            variant={touch === t.touch ? 'default' : 'outline'}
            title={t.hint}
            className={
              touch === t.touch
                ? 'h-7 text-xs bg-gradient-to-r from-purple-500 to-blue-500'
                : 'h-7 text-xs border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white'
            }
            onClick={() => setTouch(t.touch)}
          >
            {t.label}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {prospect.website && (
          <Button asChild size="sm" variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white h-8">
            <a href={prospect.website} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-3 h-3 mr-1" /> Website
            </a>
          </Button>
        )}
        {meta.portal_url && (
          <Button asChild size="sm" variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white h-8">
            <a href={meta.portal_url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-3 h-3 mr-1" /> Partnership portal
            </a>
          </Button>
        )}
        {meta.phone && (
          <Button asChild size="sm" variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white h-8">
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
          className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white h-8"
          onClick={() => copy(email.subject, 'Subject line')}
        >
          <Mail className="w-3 h-3 mr-1" /> Copy subject
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="border-emerald-500/40 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20 hover:text-white h-8"
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
  /** Only show prospects that still have no named contact. */
  needsContactOnly?: boolean;
}

export const SponsorTargetList: React.FC<Props> = ({ onSelect, needsContactOnly = false }) => {
  const { prospects, isLoading, bulkUpdate, bulkUpdating } = useSponsorCRM();
  const [search, setSearch] = useState('');
  const [owner, setOwner] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

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
      const matchesContact = needsContactOnly ? !p.primary_contact_name : true;
      return matchesTerm && matchesOwner && matchesContact;
    });
  }, [prospects, search, owner, needsContactOnly]);

  const grouped = useMemo(
    () =>
      filtered.reduce<Record<number, SponsorProspect[]>>((acc, p) => {
        const tier = getSponsorMeta(p).tier ?? 4;
        (acc[tier] ||= []).push(p);
        return acc;
      }, {}),
    [filtered],
  );

  const toggleSelect = (id: string) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const allVisibleSelected = filtered.length > 0 && filtered.every((p) => selectedIds.includes(p.id));
  const toggleSelectAll = () =>
    setSelectedIds(allVisibleSelected ? [] : filtered.map((p) => p.id));

  const bulkMarkContacted = () => {
    if (!window.confirm(`Mark ${selectedIds.length} prospect(s) as contacted today?`)) return;
    bulkUpdate({
      ids: selectedIds,
      updates: {
        last_contact_at: new Date().toISOString(),
        next_follow_up: addBusinessDays(5).toISOString(),
        pipeline_stage: 'outreach',
      },
    });
    toast.success(`${selectedIds.length} marked contacted`);
    setSelectedIds([]);
  };

  const bulkSetFollowUp = (days: number) => {
    bulkUpdate({ ids: selectedIds, updates: { next_follow_up: addBusinessDays(days).toISOString() } });
    toast.success(`Follow-up set for ${selectedIds.length} prospect(s)`);
    setSelectedIds([]);
  };

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
              className={owner === o ? 'bg-gradient-to-r from-purple-500 to-blue-500 h-8' : 'border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white h-8'}
              onClick={() => setOwner(o)}
            >
              {o === 'all' ? 'All owners' : o}
            </Button>
          ))}
        </div>

        <Button
          size="sm"
          variant="outline"
          className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white h-8 ml-auto"
          onClick={() => downloadSponsorCsv(filtered)}
        >
          <Download className="w-3 h-3 mr-1" /> Export CSV
        </Button>
      </div>

      {/* Bulk action bar */}
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-3">
        <Button
          size="sm"
          variant="outline"
          className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white h-8"
          onClick={toggleSelectAll}
        >
          {allVisibleSelected ? 'Clear selection' : `Select all (${filtered.length})`}
        </Button>
        <span className="text-xs text-blue-200">{selectedIds.length} selected</span>
        {selectedIds.length > 0 && (
          <>
            <Button
              size="sm"
              disabled={bulkUpdating}
              className="h-8 bg-gradient-to-r from-emerald-500 to-teal-500"
              onClick={bulkMarkContacted}
            >
              <CheckCircle2 className="w-3 h-3 mr-1" /> Mark contacted
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={bulkUpdating}
              className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white h-8"
              onClick={() => bulkSetFollowUp(5)}
            >
              <CalendarClock className="w-3 h-3 mr-1" /> Follow up in 5 days
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={bulkUpdating}
              className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white h-8"
              onClick={() => bulkSetFollowUp(10)}
            >
              <CalendarClock className="w-3 h-3 mr-1" /> Follow up in 10 days
            </Button>
          </>
        )}
      </div>

      {needsContactOnly && (
        <p className="text-sm text-orange-200 flex items-center gap-2">
          <UserSearch className="w-4 h-4" />
          These companies have a portal or phone number but no named decision-maker yet. Find a name,
          open the company, and save it.
        </p>
      )}

      {tiers.length === 0 && <p className="text-blue-200">No prospects match that filter.</p>}

      {tiers.map((tier) => (
        <div key={tier} className="space-y-3">
          <h3 className="text-white font-semibold">
            {TIER_LABELS[tier] ?? 'Other'}{' '}
            <span className="text-blue-300 text-sm font-normal">({grouped[tier].length})</span>
          </h3>
          <div className="grid gap-3 md:grid-cols-2">
            {grouped[tier].map((p) => (
              <ProspectRow
                key={p.id}
                prospect={p}
                onSelect={onSelect}
                selected={selectedIds.includes(p.id)}
                onToggleSelect={toggleSelect}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SponsorTargetList;
