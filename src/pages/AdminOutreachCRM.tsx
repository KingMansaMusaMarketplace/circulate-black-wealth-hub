import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import RequireAdmin from '@/components/auth/RequireAdmin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Plus,
  Mail,
  ExternalLink,
  Trash2,
  MessageSquarePlus,
  Linkedin,
} from 'lucide-react';
import {
  useOutreachTargets,
  useOutreachTouches,
  STATUS_LABELS,
  TIER_LABELS,
  CHANNEL_LABELS,
  type OutreachTarget,
  type OutreachStatus,
  type OutreachTier,
  type OutreachChannel,
} from '@/hooks/use-outreach-crm';

const STATUS_COLORS: Record<OutreachStatus, string> = {
  researched: 'bg-slate-500/20 text-slate-200 border-slate-500/40',
  intro_sent: 'bg-blue-500/20 text-blue-200 border-blue-500/40',
  replied: 'bg-cyan-500/20 text-cyan-200 border-cyan-500/40',
  meeting_booked: 'bg-purple-500/20 text-purple-200 border-purple-500/40',
  in_discussion: 'bg-amber-500/20 text-amber-200 border-amber-500/40',
  allied: 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40',
  declined: 'bg-red-500/20 text-red-200 border-red-500/40',
  paused: 'bg-zinc-500/20 text-zinc-200 border-zinc-500/40',
};

const AdminOutreachCRMInner: React.FC = () => {
  const { targets, isLoading, createTarget, updateTarget, deleteTarget } =
    useOutreachTargets();

  const [showAdd, setShowAdd] = useState(false);
  const [activeTargetId, setActiveTargetId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | OutreachStatus>('all');
  const [search, setSearch] = useState('');

  const [form, setForm] = useState({
    directory_name: '',
    tier: 'tier_2' as OutreachTier,
    owner_name: '',
    owner_title: '',
    website: '',
    contact_method: 'email' as OutreachChannel,
    contact_value: '',
    linkedin_url: '',
    location: '',
    notes: '',
  });

  const funnel = useMemo(() => {
    const counts: Record<OutreachStatus, number> = {
      researched: 0,
      intro_sent: 0,
      replied: 0,
      meeting_booked: 0,
      in_discussion: 0,
      allied: 0,
      declined: 0,
      paused: 0,
    };
    targets.forEach((t) => {
      counts[t.status] = (counts[t.status] ?? 0) + 1;
    });
    return counts;
  }, [targets]);

  const filtered = useMemo(() => {
    return targets.filter((t) => {
      if (filter !== 'all' && t.status !== filter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          t.directory_name.toLowerCase().includes(q) ||
          (t.owner_name?.toLowerCase().includes(q) ?? false) ||
          (t.notes?.toLowerCase().includes(q) ?? false)
        );
      }
      return true;
    });
  }, [targets, filter, search]);

  const activeTarget = targets.find((t) => t.id === activeTargetId) || null;

  const handleAdd = () => {
    if (!form.directory_name.trim()) return;
    createTarget.mutate(
      { ...form },
      {
        onSuccess: () => {
          setShowAdd(false);
          setForm({
            directory_name: '',
            tier: 'tier_2',
            owner_name: '',
            owner_title: '',
            website: '',
            contact_method: 'email',
            contact_value: '',
            linkedin_url: '',
            location: '',
            notes: '',
          });
        },
      }
    );
  };

  const buildMailto = (t: OutreachTarget) => {
    const isEmail = t.contact_method === 'email' && t.contact_value;
    if (!isEmail) return null;
    const subject = encodeURIComponent(
      `Quick intro — 1325.AI Alliance for ${t.directory_name}`
    );
    const body = encodeURIComponent(
      `Hi ${t.owner_name?.split(' ')[0] || 'there'},\n\n` +
        `I run 1325.AI / Mansa Musa Marketplace. We've built an agentic AI layer (33 AI employees, ~4 roles covered, $12,100+/mo savings) that we white-label for Black business directories like ${t.directory_name}.\n\n` +
        `Worth a 30-minute intro call to see if it's a fit?\n\n` +
        `Best,\nThomas`
    );
    return `mailto:${t.contact_value}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#000000] via-[#050a18] to-[#030712] p-6">
      <Helmet>
        <title>Directory Outreach CRM — Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-mansagold to-amber-400 bg-clip-text text-transparent">
              Directory Outreach CRM
            </h1>
            <p className="text-blue-200/70 mt-1">
              Track 1325.AI alliance conversations with Black directory owners.
            </p>
          </div>
          <Button
            onClick={() => setShowAdd(true)}
            className="bg-gradient-to-r from-mansagold to-amber-500 text-slate-900 font-semibold"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Target
          </Button>
        </div>

        {/* Funnel */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {(Object.keys(STATUS_LABELS) as OutreachStatus[]).map((s) => (
            <Card
              key={s}
              onClick={() => setFilter(filter === s ? 'all' : s)}
              className={`cursor-pointer bg-slate-800/60 backdrop-blur-xl border transition-all hover:scale-105 ${
                filter === s ? 'border-mansagold' : 'border-white/10'
              }`}
            >
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-white">{funnel[s]}</div>
                <div className="text-xs text-blue-200/70 mt-1">{STATUS_LABELS[s]}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <Input
            placeholder="Search directory, owner, notes…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm bg-slate-800/60 border-white/10 text-white"
          />
          {filter !== 'all' && (
            <Button variant="outline" size="sm" onClick={() => setFilter('all')}>
              Clear filter: {STATUS_LABELS[filter]}
            </Button>
          )}
          <div className="text-sm text-blue-200/70 ml-auto">
            {filtered.length} of {targets.length} shown
          </div>
        </div>

        {/* Table */}
        <Card className="bg-slate-800/60 backdrop-blur-xl border-white/10">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-blue-200/70">Directory</TableHead>
                  <TableHead className="text-blue-200/70">Tier</TableHead>
                  <TableHead className="text-blue-200/70">Owner</TableHead>
                  <TableHead className="text-blue-200/70">Status</TableHead>
                  <TableHead className="text-blue-200/70">Next Action</TableHead>
                  <TableHead className="text-blue-200/70 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-blue-200/70 py-8">
                      Loading…
                    </TableCell>
                  </TableRow>
                )}
                {!isLoading && filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-blue-200/70 py-8">
                      No targets yet. Click "Add Target" to get started.
                    </TableCell>
                  </TableRow>
                )}
                {filtered.map((t) => {
                  const mailto = buildMailto(t);
                  return (
                    <TableRow key={t.id} className="border-white/10 hover:bg-white/5">
                      <TableCell>
                        <div className="font-medium text-white">{t.directory_name}</div>
                        {t.website && (
                          <a
                            href={t.website.startsWith('http') ? t.website : `https://${t.website}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-blue-300/80 hover:text-mansagold inline-flex items-center gap-1"
                          >
                            <ExternalLink className="h-3 w-3" /> {t.website}
                          </a>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-blue-200 border-white/20">
                          {TIER_LABELS[t.tier]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-white text-sm">{t.owner_name || '—'}</div>
                        {t.owner_title && (
                          <div className="text-xs text-blue-200/60">{t.owner_title}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={t.status}
                          onValueChange={(v) =>
                            updateTarget.mutate({
                              id: t.id,
                              updates: { status: v as OutreachStatus },
                            })
                          }
                        >
                          <SelectTrigger
                            className={`h-8 w-[160px] border ${STATUS_COLORS[t.status]}`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {(Object.keys(STATUS_LABELS) as OutreachStatus[]).map((s) => (
                              <SelectItem key={s} value={s}>
                                {STATUS_LABELS[s]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-white">{t.next_action || '—'}</div>
                        {t.next_action_date && (
                          <div className="text-xs text-blue-200/60">{t.next_action_date}</div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {mailto && (
                            <Button
                              size="icon"
                              variant="ghost"
                              asChild
                              title="Send intro email"
                            >
                              <a href={mailto}>
                                <Mail className="h-4 w-4 text-mansagold" />
                              </a>
                            </Button>
                          )}
                          {t.linkedin_url && (
                            <Button
                              size="icon"
                              variant="ghost"
                              asChild
                              title="Open LinkedIn"
                            >
                              <a href={t.linkedin_url} target="_blank" rel="noreferrer">
                                <Linkedin className="h-4 w-4 text-blue-300" />
                              </a>
                            </Button>
                          )}
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setActiveTargetId(t.id)}
                            title="Log touch / view history"
                          >
                            <MessageSquarePlus className="h-4 w-4 text-blue-200" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              if (confirm(`Remove ${t.directory_name}?`)) {
                                deleteTarget.mutate(t.id);
                              }
                            }}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4 text-red-400" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Add Target Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-2xl bg-slate-900 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Add Outreach Target</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Directory Name *</Label>
              <Input
                value={form.directory_name}
                onChange={(e) => setForm({ ...form, directory_name: e.target.value })}
                placeholder="The Black Directory"
              />
            </div>
            <div>
              <Label>Tier</Label>
              <Select
                value={form.tier}
                onValueChange={(v) => setForm({ ...form, tier: v as OutreachTier })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(TIER_LABELS) as OutreachTier[]).map((t) => (
                    <SelectItem key={t} value={t}>
                      {TIER_LABELS[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Location</Label>
              <Input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Atlanta, GA"
              />
            </div>
            <div>
              <Label>Owner Name</Label>
              <Input
                value={form.owner_name}
                onChange={(e) => setForm({ ...form, owner_name: e.target.value })}
                placeholder="Brian Smith"
              />
            </div>
            <div>
              <Label>Owner Title</Label>
              <Input
                value={form.owner_title}
                onChange={(e) => setForm({ ...form, owner_title: e.target.value })}
                placeholder="Founder & CEO"
              />
            </div>
            <div>
              <Label>Website</Label>
              <Input
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                placeholder="theblackdirectory.com"
              />
            </div>
            <div>
              <Label>LinkedIn URL</Label>
              <Input
                value={form.linkedin_url}
                onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })}
                placeholder="linkedin.com/in/…"
              />
            </div>
            <div>
              <Label>Contact Method</Label>
              <Select
                value={form.contact_method}
                onValueChange={(v) =>
                  setForm({ ...form, contact_method: v as OutreachChannel })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(CHANNEL_LABELS) as OutreachChannel[]).map((c) => (
                    <SelectItem key={c} value={c}>
                      {CHANNEL_LABELS[c]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Contact Value</Label>
              <Input
                value={form.contact_value}
                onChange={(e) => setForm({ ...form, contact_value: e.target.value })}
                placeholder="brian@…"
              />
            </div>
            <div className="col-span-2">
              <Label>Notes</Label>
              <Textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdd(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={!form.directory_name.trim() || createTarget.isPending}
              className="bg-mansagold text-slate-900 hover:bg-amber-500"
            >
              {createTarget.isPending ? 'Adding…' : 'Add Target'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Touch Log Drawer */}
      {activeTarget && (
        <TouchLogDialog
          target={activeTarget}
          open={!!activeTargetId}
          onClose={() => setActiveTargetId(null)}
          onUpdateNextAction={(next_action, next_action_date) =>
            updateTarget.mutate({
              id: activeTarget.id,
              updates: { next_action, next_action_date },
            })
          }
        />
      )}
    </div>
  );
};

const TouchLogDialog: React.FC<{
  target: OutreachTarget;
  open: boolean;
  onClose: () => void;
  onUpdateNextAction: (na: string | null, nad: string | null) => void;
}> = ({ target, open, onClose, onUpdateNextAction }) => {
  const { touches, isLoading, logTouch } = useOutreachTouches(target.id);
  const [channel, setChannel] = useState<OutreachChannel>('email');
  const [direction, setDirection] = useState<'outbound' | 'inbound'>('outbound');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [nextAction, setNextAction] = useState(target.next_action || '');
  const [nextActionDate, setNextActionDate] = useState(target.next_action_date || '');

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-3xl bg-slate-900 border-white/10 text-white max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{target.directory_name} — Touch Log</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Log new touch */}
          <Card className="bg-slate-800/60 border-white/10">
            <CardHeader>
              <CardTitle className="text-base text-mansagold">Log Touch</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Channel</Label>
                  <Select value={channel} onValueChange={(v) => setChannel(v as OutreachChannel)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {(Object.keys(CHANNEL_LABELS) as OutreachChannel[]).map((c) => (
                        <SelectItem key={c} value={c}>{CHANNEL_LABELS[c]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Direction</Label>
                  <Select value={direction} onValueChange={(v) => setDirection(v as any)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="outbound">Outbound (we sent)</SelectItem>
                      <SelectItem value="inbound">Inbound (they replied)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Subject</Label>
                <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
              </div>
              <div>
                <Label>Notes / Body</Label>
                <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3} />
              </div>
              <Button
                onClick={() => {
                  logTouch.mutate(
                    { target_id: target.id, channel, direction, subject, body },
                    {
                      onSuccess: () => {
                        setSubject('');
                        setBody('');
                      },
                    }
                  );
                }}
                disabled={logTouch.isPending}
                className="bg-mansagold text-slate-900 hover:bg-amber-500"
              >
                {logTouch.isPending ? 'Logging…' : 'Log Touch'}
              </Button>
            </CardContent>
          </Card>

          {/* Next action */}
          <Card className="bg-slate-800/60 border-white/10">
            <CardHeader>
              <CardTitle className="text-base text-mansagold">Next Action</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <Label>Action</Label>
                <Input value={nextAction} onChange={(e) => setNextAction(e.target.value)} />
              </div>
              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={nextActionDate}
                  onChange={(e) => setNextActionDate(e.target.value)}
                />
              </div>
              <Button
                size="sm"
                className="col-span-3 bg-mansablue hover:bg-blue-700"
                onClick={() =>
                  onUpdateNextAction(nextAction || null, nextActionDate || null)
                }
              >
                Save Next Action
              </Button>
            </CardContent>
          </Card>

          {/* History */}
          <div>
            <h3 className="text-sm font-semibold text-blue-200/80 mb-2">History</h3>
            {isLoading && <div className="text-blue-200/70 text-sm">Loading…</div>}
            {!isLoading && touches.length === 0 && (
              <div className="text-blue-200/70 text-sm">No touches yet.</div>
            )}
            <div className="space-y-2">
              {touches.map((tch) => (
                <div
                  key={tch.id}
                  className="p-3 rounded-lg bg-slate-800/40 border border-white/5"
                >
                  <div className="flex justify-between items-center text-xs text-blue-200/70">
                    <span>
                      {CHANNEL_LABELS[tch.channel]} · {tch.direction}
                    </span>
                    <span>{new Date(tch.occurred_at).toLocaleString()}</span>
                  </div>
                  {tch.subject && (
                    <div className="text-white text-sm mt-1 font-medium">{tch.subject}</div>
                  )}
                  {tch.body && (
                    <div className="text-blue-100/80 text-sm mt-1 whitespace-pre-wrap">
                      {tch.body}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const AdminOutreachCRM: React.FC = () => (
  <RequireAdmin>
    <AdminOutreachCRMInner />
  </RequireAdmin>
);

export default AdminOutreachCRM;
