import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Copy, Mail, Trash2, Save, Phone, ExternalLink, Clock, LayoutTemplate, Crown } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  useSponsorCRM,
  SponsorProspect,
  PipelineStage,
  PIPELINE_STAGES,
} from '@/hooks/use-sponsor-crm';
import { buildSponsorEmail, getSponsorMeta } from '@/utils/sponsorOutreachEmail';

interface Props {
  prospect: SponsorProspect | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ACTIVITY_TYPES = ['email', 'call', 'meeting', 'note', 'portal_submission'];

const toDateInput = (value: string | null) => (value ? value.slice(0, 10) : '');

export const SponsorProspectDrawer: React.FC<Props> = ({ prospect, open, onOpenChange }) => {
  const {
    updateProspect,
    updatingProspect,
    moveToStage,
    logActivity,
    loggingActivity,
    deleteProspect,
    useProspectActivities,
  } = useSponsorCRM();

  const { data: activities = [] } = useProspectActivities(prospect?.id ?? null);

  const [form, setForm] = useState({
    primary_contact_name: '',
    primary_contact_title: '',
    primary_contact_email: '',
    primary_contact_phone: '',
    deal_value: '',
    probability: '',
    expected_tier: '',
    next_follow_up: '',
    notes: '',
  });

  const [activity, setActivity] = useState({ activity_type: 'email', subject: '', outcome_notes: '' });

  useEffect(() => {
    if (!prospect) return;
    setForm({
      primary_contact_name: prospect.primary_contact_name ?? '',
      primary_contact_title: prospect.primary_contact_title ?? '',
      primary_contact_email: prospect.primary_contact_email ?? '',
      primary_contact_phone: prospect.primary_contact_phone ?? '',
      deal_value: prospect.deal_value != null ? String(prospect.deal_value) : '',
      probability: prospect.probability != null ? String(prospect.probability) : '',
      expected_tier: prospect.expected_tier ?? '',
      next_follow_up: toDateInput(prospect.next_follow_up),
      notes: prospect.notes ?? '',
    });
    setActivity({ activity_type: 'email', subject: '', outcome_notes: '' });
  }, [prospect?.id]);

  const meta = prospect ? getSponsorMeta(prospect) : {};
  const email = useMemo(() => (prospect ? buildSponsorEmail(prospect) : null), [prospect?.id]);

  if (!prospect) return null;

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied`);
    } catch {
      toast.error('Could not copy — select the text manually');
    }
  };

  const handleSave = () => {
    updateProspect({
      id: prospect.id,
      primary_contact_name: form.primary_contact_name || null,
      primary_contact_title: form.primary_contact_title || null,
      primary_contact_email: form.primary_contact_email || null,
      primary_contact_phone: form.primary_contact_phone || null,
      deal_value: form.deal_value ? parseFloat(form.deal_value) : null,
      probability: form.probability ? parseInt(form.probability, 10) : 0,
      expected_tier: form.expected_tier || null,
      next_follow_up: form.next_follow_up ? new Date(form.next_follow_up).toISOString() : null,
      notes: form.notes || null,
    } as any);
    toast.success('Saved');
  };

  const handleLogActivity = () => {
    if (!activity.subject.trim()) {
      toast.error('Add a short subject for this activity');
      return;
    }
    logActivity({
      prospect_id: prospect.id,
      activity_type: activity.activity_type,
      subject: activity.subject,
      outcome_notes: activity.outcome_notes || null,
      completed_at: new Date().toISOString(),
      is_completed: true,
    } as any);
    setActivity({ activity_type: 'email', subject: '', outcome_notes: '' });
  };

  const mailtoHref = email
    ? `mailto:${prospect.primary_contact_email ?? ''}?subject=${encodeURIComponent(
        email.subject,
      )}&body=${encodeURIComponent(email.body)}`
    : '#';

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl overflow-y-auto bg-slate-950 border-white/10 text-white"
      >
        <SheetHeader>
          <SheetTitle className="text-white">{prospect.company_name}</SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-6">
          {/* Meta */}
          <div className="flex flex-wrap gap-2">
            {prospect.industry && (
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-200">
                {prospect.industry}
              </Badge>
            )}
            {meta.target_label && (
              <Badge className="bg-amber-500/20 text-amber-300">{meta.target_label}</Badge>
            )}
            {meta.owner && (
              <Badge variant="secondary" className="bg-white/10 text-blue-200">
                Owner: {meta.owner}
              </Badge>
            )}
          </div>

          {meta.pitch_angle && <p className="text-sm text-blue-100/80">{meta.pitch_angle}</p>}

          <div className="flex flex-wrap gap-2">
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
          </div>

          <Separator className="bg-white/10" />

          {/* Stage */}
          <div>
            <Label className="text-blue-200">Pipeline stage</Label>
            <Select
              value={prospect.pipeline_stage}
              onValueChange={(value) => moveToStage({ id: prospect.id, stage: value as PipelineStage })}
            >
              <SelectTrigger className="bg-white/5 border-white/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PIPELINE_STAGES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Editable fields */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-blue-200">Contact name</Label>
              <Input
                value={form.primary_contact_name}
                onChange={(e) => setForm((f) => ({ ...f, primary_contact_name: e.target.value }))}
                className="bg-white/5 border-white/20"
              />
            </div>
            <div>
              <Label className="text-blue-200">Title</Label>
              <Input
                value={form.primary_contact_title}
                onChange={(e) => setForm((f) => ({ ...f, primary_contact_title: e.target.value }))}
                className="bg-white/5 border-white/20"
              />
            </div>
            <div>
              <Label className="text-blue-200">Email</Label>
              <Input
                value={form.primary_contact_email}
                onChange={(e) => setForm((f) => ({ ...f, primary_contact_email: e.target.value }))}
                className="bg-white/5 border-white/20"
              />
            </div>
            <div>
              <Label className="text-blue-200">Phone</Label>
              <Input
                value={form.primary_contact_phone}
                onChange={(e) => setForm((f) => ({ ...f, primary_contact_phone: e.target.value }))}
                className="bg-white/5 border-white/20"
              />
            </div>
            <div>
              <Label className="text-blue-200">Deal value ($)</Label>
              <Input
                type="number"
                value={form.deal_value}
                onChange={(e) => setForm((f) => ({ ...f, deal_value: e.target.value }))}
                className="bg-white/5 border-white/20"
              />
            </div>
            <div>
              <Label className="text-blue-200">Probability (%)</Label>
              <Input
                type="number"
                value={form.probability}
                onChange={(e) => setForm((f) => ({ ...f, probability: e.target.value }))}
                className="bg-white/5 border-white/20"
              />
            </div>
            <div>
              <Label className="text-blue-200">Expected tier</Label>
              <Input
                value={form.expected_tier}
                onChange={(e) => setForm((f) => ({ ...f, expected_tier: e.target.value }))}
                className="bg-white/5 border-white/20"
                placeholder="founding / gold / platinum"
              />
            </div>
            <div>
              <Label className="text-blue-200">Next follow-up</Label>
              <Input
                type="date"
                value={form.next_follow_up}
                onChange={(e) => setForm((f) => ({ ...f, next_follow_up: e.target.value }))}
                className="bg-white/5 border-white/20"
              />
            </div>
          </div>

          <div>
            <Label className="text-blue-200">Notes</Label>
            <Textarea
              rows={4}
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              className="bg-white/5 border-white/20"
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              disabled={updatingProspect}
              className="bg-gradient-to-r from-purple-500 to-blue-500"
            >
              <Save className="w-4 h-4 mr-1" /> {updatingProspect ? 'Saving…' : 'Save changes'}
            </Button>
            <Button
              variant="outline"
              className="border-red-500/40 text-red-300 hover:bg-red-500/10"
              onClick={() => {
                if (window.confirm(`Delete ${prospect.company_name} from the CRM?`)) {
                  deleteProspect(prospect.id);
                  onOpenChange(false);
                }
              }}
            >
              <Trash2 className="w-4 h-4 mr-1" /> Delete
            </Button>
          </div>

          <Separator className="bg-white/10" />

          {/* Outreach email */}
          {email && (
            <div className="space-y-2">
              <h4 className="text-white font-semibold">Outreach email</h4>
              <p className="text-xs text-blue-300">Subject: {email.subject}</p>
              <pre className="whitespace-pre-wrap text-xs text-blue-100/80 bg-white/5 border border-white/10 rounded-lg p-3 max-h-56 overflow-y-auto">
                {email.body}
              </pre>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-purple-500 to-blue-500"
                  onClick={() => copy(`Subject: ${email.subject}\n\n${email.body}`, 'Email')}
                >
                  <Copy className="w-3 h-3 mr-1" /> Copy email
                </Button>
                <Button asChild size="sm" variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                  <a href={mailtoHref}>
                    <Mail className="w-3 h-3 mr-1" /> Open in email app
                  </a>
                </Button>
              </div>
            </div>
          )}

          <Separator className="bg-white/10" />

          {/* Log activity */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold">Log activity</h4>
            <div className="grid grid-cols-2 gap-3">
              <Select
                value={activity.activity_type}
                onValueChange={(value) => setActivity((a) => ({ ...a, activity_type: value }))}
              >
                <SelectTrigger className="bg-white/5 border-white/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ACTIVITY_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t.replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                value={activity.subject}
                onChange={(e) => setActivity((a) => ({ ...a, subject: e.target.value }))}
                placeholder="What happened?"
                className="bg-white/5 border-white/20"
              />
            </div>
            <Textarea
              rows={2}
              value={activity.outcome_notes}
              onChange={(e) => setActivity((a) => ({ ...a, outcome_notes: e.target.value }))}
              placeholder="Outcome / next step"
              className="bg-white/5 border-white/20"
            />
            <Button size="sm" onClick={handleLogActivity} disabled={loggingActivity} className="bg-white/10">
              {loggingActivity ? 'Logging…' : 'Log activity'}
            </Button>
          </div>

          {/* Timeline */}
          <div className="space-y-2 pb-8">
            <h4 className="text-white font-semibold">History</h4>
            {activities.length === 0 && (
              <p className="text-sm text-blue-300">No activity logged yet.</p>
            )}
            {activities.map((a) => (
              <div key={a.id} className="bg-white/5 border border-white/10 rounded-lg p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm text-white">{a.subject || a.activity_type}</span>
                  <span className="text-xs text-blue-300 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(a.completed_at || a.created_at).toLocaleDateString()}
                  </span>
                </div>
                {a.outcome_notes && (
                  <p className="text-xs text-blue-100/70 mt-1">{a.outcome_notes}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SponsorProspectDrawer;
