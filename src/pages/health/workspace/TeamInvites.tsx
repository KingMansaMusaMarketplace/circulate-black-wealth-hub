import React, { useCallback, useEffect, useRef, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';
import { MailPlus, RotateCw, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { FunctionsHttpError } from '@supabase/supabase-js';
import { TEAM_ROLES, roleLabel } from '@/lib/clinical/pilot-roles';
import { INVITE_STAGE_LABELS, inviteErrorMessage, inviteStage, validateInvite } from '@/lib/clinical/team-messages';
import { db, Row } from './hc';

async function callAccess(body: Record<string, unknown>): Promise<{ ok: boolean; reason?: string; error?: string; [k: string]: unknown }> {
  const { data, error } = await supabase.functions.invoke('health-access', { body });
  if (!error) return data;
  if (error instanceof FunctionsHttpError) { try { return await error.context.json(); } catch { /* fall through */ } }
  return { ok: false };
}

/** Owner-only: invite staff through 1325, then watch each invitation's status. */
export default function TeamInvites({ clinicId, onJoinedChange }: { clinicId: string; onJoinedChange?: () => void }) {
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [role, setRole] = useState('front_desk');
  const [busy, setBusy] = useState(false); const pending = useRef(false);
  const [invites, setInvites] = useState<Row[]>([]); const [loadError, setLoadError] = useState('');
  const version = useRef(0);
  const load = useCallback(async () => {
    const v = ++version.current;
    const { data, error } = await db.rpc('hc_list_team_invites', { _clinic: clinicId });
    if (v !== version.current) return;
    if (error) { setLoadError('Invitations could not be loaded. Check your approved viewing and try again.'); return; }
    setLoadError(''); setInvites(data ?? []);
    if ((data ?? []).some((i: Row) => i.status === 'joined')) onJoinedChange?.();
  }, [clinicId]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { void load(); return () => { ++version.current; }; }, [load]);

  const run = async (fn: () => Promise<void>) => {
    if (pending.current) return; pending.current = true; setBusy(true);
    try { await fn(); } finally { pending.current = false; setBusy(false); }
  };
  const send = () => run(async () => {
    const problem = validateInvite({ full_name: name, email });
    if (problem) { toast.error(problem); return; }
    const res = await callAccess({ action: 'staff_invite', clinic_id: clinicId, email: email.trim(), full_name: name.trim(), role });
    if (!res?.ok) { toast.error(inviteErrorMessage(res?.reason, res?.error)); await load(); return; }
    toast.success(`Invitation sent to 1325 for review. Once approved, ${name.trim()} gets an email from Thomas at 1325.AI (ask them to check Spam).`);
    setName(''); setEmail(''); await load();
  });
  const resend = (id: string) => run(async () => {
    const res = await callAccess({ action: 'staff_invite_resend', invite_id: id });
    if (!res?.ok) { toast.error(inviteErrorMessage(res?.reason, res?.error)); return; }
    toast.success(res.refiled
      ? 'Asked 1325 to review it again. They are emailed once approved.'
      : res.approved
        ? (res.invitee_email_accepted ? 'Reminder email sent.' : 'The reminder email could not be confirmed. Try again later.')
        : 'Still waiting for 1325 to review. They are emailed once approved.');
    await load();
  });
  const cancel = (id: string) => run(async () => {
    const { data, error } = await db.rpc('hc_cancel_team_invite', { _invite: id });
    if (error || data !== true) { toast.error('The invitation could not be cancelled.'); return; }
    toast.success('Invitation cancelled.'); await load();
  });

  return (
    <section aria-labelledby="team-invite-title" className="space-y-3 rounded-lg border border-mansagold/40 bg-mansagold/5 p-4">
      <h3 id="team-invite-title" className="font-semibold">Invite a team member</h3>
      <p className="text-xs text-muted-foreground">This sends a request to 1325 for them. 1325 approves every person. Once approved they get an email from “Thomas at 1325.AI” and sign in with this same email and join your clinic automatically.</p>
      <div className="grid gap-2 md:grid-cols-[1fr_1fr_150px_auto]">
        <Input aria-label="Their full name" placeholder="Their full name" value={name} onChange={(e) => setName(e.target.value)} maxLength={120} />
        <Input aria-label="Their email" type="email" placeholder="Their email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} />
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="h-9" aria-label="Invite role"><SelectValue /></SelectTrigger>
          <SelectContent>{TEAM_ROLES.map((r) => <SelectItem key={`invite-role:${r}`} value={r}>{roleLabel(r)}</SelectItem>)}</SelectContent>
        </Select>
        <Button disabled={busy} onClick={send} className="bg-mansagold text-mansablue hover:bg-mansagold-dark"><MailPlus className="mr-1 h-4 w-4" />Send invite</Button>
      </div>
      {loadError && <p role="alert" className="text-sm text-destructive">{loadError} <Button size="sm" variant="link" onClick={() => void load()}>Retry</Button></p>}
      {invites.length > 0 && (
        <Table><TableHeader><TableRow><TableHead>Invited</TableHead><TableHead>Role</TableHead><TableHead>Status</TableHead><TableHead>Sent</TableHead><TableHead /></TableRow></TableHeader>
          <TableBody>{invites.map((i) => {
            const stage = inviteStage(i.status, i.request_status);
            return (
              <TableRow key={`invite:${i.id}`}>
                <TableCell><div className="font-medium">{i.full_name}</div><div className="text-xs text-muted-foreground">{i.email}</div></TableCell>
                <TableCell>{roleLabel(i.role)}</TableCell>
                <TableCell><Badge variant={stage === 'joined' ? 'default' : stage === 'not_approved' ? 'destructive' : 'outline'}>{INVITE_STAGE_LABELS[stage]}</Badge></TableCell>
                <TableCell className="text-xs text-muted-foreground">{format(parseISO(i.created_at), 'MMM d, h:mm a')}</TableCell>
                <TableCell className="whitespace-nowrap text-right">{i.status === 'requested' && <>
                  <Button size="sm" variant="ghost" disabled={busy} onClick={() => resend(i.id)}><RotateCw className="mr-1 h-3.5 w-3.5" />Resend</Button>
                  <Button size="sm" variant="ghost" disabled={busy} onClick={() => cancel(i.id)}><X className="mr-1 h-3.5 w-3.5" />Cancel</Button>
                </>}</TableCell>
              </TableRow>
            );
          })}</TableBody></Table>
      )}
    </section>
  );
}
