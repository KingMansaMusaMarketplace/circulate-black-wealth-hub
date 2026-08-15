import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Copy, FileText, ChevronDown, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Reusable partnership outreach letter generator.
 * Locked language: "U.S. Provisional Patent Application No. 63/969,202 — 45 claims pending".
 */

const DEFAULTS = {
  recipientName: '',
  orgName: '',
  orgUrl: '',
  memberCount: 100000,
  conversionPct: 10,
  monthlyRate: 299,
  revSharePct: 20,
  senderName: 'Clarence Smith',
  senderTitle: 'VP of Sales, 1325.AI',
  senderEmail: 'Partner@1325.AI',
  videoUrl: 'https://www.1325.ai/ultimate-deep-dive.html',
};

const money = (n: number) =>
  n >= 1_000_000
    ? `$${(n / 1_000_000).toFixed(1)}M`
    : `$${Math.round(n).toLocaleString('en-US')}`;

const PartnershipLetterGenerator: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [f, setF] = useState(DEFAULTS);

  const set = (k: keyof typeof DEFAULTS, v: string | number) =>
    setF((prev) => ({ ...prev, [k]: v }));

  const converted = Math.round((f.memberCount * f.conversionPct) / 100);
  const grossAnnual = converted * f.monthlyRate * 12;
  const partnerAnnual = (grossAnnual * f.revSharePct) / 100;

  const org = f.orgName || '[Organization]';
  const who = f.recipientName || '[Name]';

  const letter = useMemo(
    () => `Subject: A partnership proposal for ${org} — shared values, shared revenue

Dear ${who},

Please don't read this as anything other than an invitation. We've followed the work you and your team are doing at ${org}${f.orgUrl ? ` (${f.orgUrl})` : ''}, and we find it genuinely commendable.

We believe our two organizations share the same values, and we'd like to explore a collaboration.

1325.AI has built the rails for what comes next: an agentic commerce protocol protected by U.S. Provisional Patent Application No. 63/969,202 — 45 claims pending. In plain terms, we've built the infrastructure layer that lets AI agents discover, verify, and transact with Black-owned businesses at global scale — and a team of 42 Agentic AI Employees that handles the back office for those businesses.

What that means for ${org}: your members get an AI back office covering roughly four roles per business — bookkeeping, scheduling, marketing, customer support — for a fraction of what those hires cost. Most partners see savings north of $18,000 a month per business.

Beyond the operational benefit to your members, the income opportunity is real. A conservative ${f.conversionPct}% conversion of your ${f.memberCount.toLocaleString('en-US')} members at $${f.monthlyRate}/month generates approximately ${money(grossAnnual)} in annual platform revenue. Under our standard ${f.revSharePct}% revenue share, that is roughly ${money(partnerAnnual)} a year to ${org} — recurring, with no infrastructure for you to build or maintain.

I've attached a short briefing from Thomas D. Bowling, our Founder & Chief Architect, for you to review as you consider this:
${f.videoUrl}

Would you be open to a 30-minute call in the next two weeks?

Warm regards,

${f.senderName}
${f.senderTitle}
${f.senderEmail}`,
    [org, who, f, grossAnnual, partnerAnnual],
  );

  const copy = async () => {
    await navigator.clipboard.writeText(letter);
    toast.success('Letter copied — paste it into your email');
  };

  return (
    <Card className="bg-slate-800/60 backdrop-blur-xl border-white/10">
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base text-mansagold flex items-center gap-2">
              <FileText className="h-4 w-4" /> Partnership Letter Generator
            </CardTitle>
            <ChevronDown
              className={`h-4 w-4 text-blue-200/70 transition-transform ${open ? 'rotate-180' : ''}`}
            />
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <Label className="text-blue-200/70 text-xs">Recipient name</Label>
                <Input
                  value={f.recipientName}
                  onChange={(e) => set('recipientName', e.target.value)}
                  placeholder="David Derryck"
                  className="bg-slate-900/60 border-white/10 text-white"
                />
              </div>
              <div>
                <Label className="text-blue-200/70 text-xs">Organization</Label>
                <Input
                  value={f.orgName}
                  onChange={(e) => set('orgName', e.target.value)}
                  placeholder="BuyBlack.org"
                  className="bg-slate-900/60 border-white/10 text-white"
                />
              </div>
              <div>
                <Label className="text-blue-200/70 text-xs">Website</Label>
                <Input
                  value={f.orgUrl}
                  onChange={(e) => set('orgUrl', e.target.value)}
                  placeholder="https://www.buyblack.org"
                  className="bg-slate-900/60 border-white/10 text-white"
                />
              </div>
              <div>
                <Label className="text-blue-200/70 text-xs">Members</Label>
                <Input
                  type="number"
                  value={f.memberCount}
                  onChange={(e) => set('memberCount', Number(e.target.value) || 0)}
                  className="bg-slate-900/60 border-white/10 text-white"
                />
              </div>
              <div>
                <Label className="text-blue-200/70 text-xs">Conversion %</Label>
                <Input
                  type="number"
                  value={f.conversionPct}
                  onChange={(e) => set('conversionPct', Number(e.target.value) || 0)}
                  className="bg-slate-900/60 border-white/10 text-white"
                />
              </div>
              <div>
                <Label className="text-blue-200/70 text-xs">Monthly rate ($)</Label>
                <Input
                  type="number"
                  value={f.monthlyRate}
                  onChange={(e) => set('monthlyRate', Number(e.target.value) || 0)}
                  className="bg-slate-900/60 border-white/10 text-white"
                />
              </div>
              <div>
                <Label className="text-blue-200/70 text-xs">Revenue share %</Label>
                <Input
                  type="number"
                  value={f.revSharePct}
                  onChange={(e) => set('revSharePct', Number(e.target.value) || 0)}
                  className="bg-slate-900/60 border-white/10 text-white"
                />
              </div>
              <div>
                <Label className="text-blue-200/70 text-xs">Sender</Label>
                <Input
                  value={f.senderName}
                  onChange={(e) => set('senderName', e.target.value)}
                  className="bg-slate-900/60 border-white/10 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="rounded-lg border border-white/10 bg-slate-900/60 p-3">
                <div className="text-xs text-blue-200/70">Converted members</div>
                <div className="text-xl font-bold text-white">
                  {converted.toLocaleString('en-US')}
                </div>
              </div>
              <div className="rounded-lg border border-white/10 bg-slate-900/60 p-3">
                <div className="text-xs text-blue-200/70">Annual platform revenue</div>
                <div className="text-xl font-bold text-white">{money(grossAnnual)}</div>
              </div>
              <div className="rounded-lg border border-mansagold/40 bg-slate-900/60 p-3">
                <div className="text-xs text-blue-200/70">Partner share / year</div>
                <div className="text-xl font-bold text-mansagold">{money(partnerAnnual)}</div>
              </div>
            </div>

            <div>
              <Label className="text-blue-200/70 text-xs">Letter (editable before copying)</Label>
              <Textarea
                readOnly
                value={letter}
                rows={18}
                className="bg-slate-900/60 border-white/10 text-white font-mono text-xs leading-relaxed"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={copy}
                className="bg-gradient-to-r from-mansagold to-amber-500 text-slate-900 font-semibold"
              >
                <Copy className="mr-2 h-4 w-4" /> Copy letter
              </Button>
              <Button variant="outline" onClick={() => setF(DEFAULTS)}>
                <RotateCcw className="mr-2 h-4 w-4" /> Reset
              </Button>
              <p className="text-xs text-blue-200/60 self-center">
                Patent language is locked: "U.S. Provisional Patent Application No. 63/969,202 — 45
                claims pending".
              </p>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default PartnershipLetterGenerator;
