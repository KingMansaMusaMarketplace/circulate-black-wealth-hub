import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, ExternalLink } from 'lucide-react';
import { SPONSOR_TIER_SLOTS, getTierSlot } from '@/config/sponsorSlots';
import type { SponsorProspect } from '@/hooks/use-sponsor-crm';

interface Props {
  prospect: SponsorProspect | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const initials = (name: string) =>
  name
    .replace(/[^A-Za-z0-9 ]/g, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');

/**
 * Shows a sales rep exactly how a prospect would appear on the public
 * Sponsor Wall at each tier. Nothing is written or published — this is a
 * mock rendered from the same tier config the public /sponsors page uses.
 */
export const SponsorWallPreviewDialog: React.FC<Props> = ({ prospect, open, onOpenChange }) => {
  const defaultTier = getTierSlot(prospect?.expected_tier ?? '')?.tier ?? 'founding';
  const [tier, setTier] = useState<string>(defaultTier);

  React.useEffect(() => {
    setTier(getTierSlot(prospect?.expected_tier ?? '')?.tier ?? 'founding');
  }, [prospect?.id, prospect?.expected_tier]);

  if (!prospect) return null;
  const slot = getTierSlot(tier) ?? SPONSOR_TIER_SLOTS[SPONSOR_TIER_SLOTS.length - 1];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-950 border-white/10 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle>Sponsor Wall preview — {prospect.company_name}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-wrap gap-2">
          {SPONSOR_TIER_SLOTS.map((t) => (
            <Button
              key={t.tier}
              size="sm"
              variant={tier === t.tier ? 'default' : 'outline'}
              className={
                tier === t.tier
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-600 h-8 text-black'
                  : 'border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white h-8'
              }
              onClick={() => setTier(t.tier)}
            >
              {t.label}
            </Button>
          ))}
        </div>

        {/* Mock wall tile */}
        <div className="rounded-xl border border-amber-400/30 bg-gradient-to-b from-[#050a18] to-black p-6">
          <p className="text-[11px] uppercase tracking-[0.3em] text-amber-300/80 mb-4">
            1325.AI Sponsor Wall
          </p>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-black font-black text-xl">
              {initials(prospect.company_name) || '1325'}
            </div>
            <div className="min-w-0">
              <p className="text-lg font-semibold text-white truncate">{prospect.company_name}</p>
              <Badge className="bg-amber-500/20 text-amber-300 mt-1">{slot.label}</Badge>
              {prospect.website && (
                <p className="text-xs text-blue-300 truncate mt-1">{prospect.website}</p>
              )}
            </div>
          </div>
          <p className="text-sm text-blue-100/80 mt-4">{slot.blurb}</p>
          <p className="text-xs text-blue-300/70 mt-2">
            {slot.monthly} · {slot.annual} annual · {slot.maxSlots} slot
            {slot.maxSlots > 1 ? 's' : ''} at this tier
          </p>
        </div>

        <ul className="text-sm text-blue-100/80 space-y-1">
          {[
            'Named placement on the public Sponsor Wall',
            'Category presence across the directory and homepage strip',
            'Quarterly community impact report with real reach numbers',
            'Co-branded campaigns built and run by the 1325.AI team',
          ].map((b) => (
            <li key={b} className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" /> {b}
            </li>
          ))}
        </ul>

        <div className="flex justify-end">
          <Button asChild variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white">
            <a href="/sponsors" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-1" /> Open live Sponsor Wall
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SponsorWallPreviewDialog;
