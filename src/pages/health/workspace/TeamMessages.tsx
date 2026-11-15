import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { toast } from 'sonner';
import { Bell, FlaskConical, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { supabase } from '@/integrations/supabase/client';
import { roleLabel } from '@/lib/clinical/pilot-roles';
import { MESSAGE_MAX_LENGTH, MESSAGE_POLL_SECONDS, validateTeamMessage } from '@/lib/clinical/team-messages';
import { db, Row } from './hc';

/** Opens the team message drawer from anywhere in the workspace, optionally about one test patient. */
export const TEAM_MESSAGE_EVENT = 'hc-team-message';
export function openTeamMessage(patientId?: string) {
  window.dispatchEvent(new CustomEvent(TEAM_MESSAGE_EVENT, { detail: { patientId } }));
}

const EVERYONE = 'everyone';
const NO_PATIENT = 'none';
// Patient names always show as initials here, matching the pilot's default privacy setting.
const initials = (p?: Row) => (p ? `${String(p.first_name ?? '').charAt(0)}. ${String(p.last_name ?? '').charAt(0)}.` : 'a test patient');

export default function TeamMessages({ clinicId, userId }: { clinicId: string; userId: string }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Row[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [members, setMembers] = useState<Row[]>([]);
  const [patients, setPatients] = useState<Row[]>([]);
  const [to, setTo] = useState(EVERYONE); const [about, setAbout] = useState(NO_PATIENT); const [body, setBody] = useState('');
  const [sending, setSending] = useState(false); const [loadError, setLoadError] = useState('');
  const sendingRef = useRef(false); const version = useRef(0);

  const load = useCallback(async () => {
    const v = ++version.current;
    const [msg, mem, pts] = await Promise.all([
      db.from('hc_team_messages').select('id,sender_id,sender_email,recipient_id,patient_id,body,created_at').eq('clinic_id', clinicId).order('created_at', { ascending: false }).limit(100),
      db.from('hc_members').select('user_id,email,role,display_name').eq('clinic_id', clinicId).order('created_at'),
      db.from('hc_pilot_patients').select('id,first_name,last_name').eq('clinic_id', clinicId).eq('is_real', false).order('last_name').limit(200),
    ]);
    if (v !== version.current) return;
    if (msg.error) { setLoadError('Messages could not be loaded. Check your approved viewing and try again.'); return; }
    setLoadError('');
    const rows: Row[] = msg.data ?? [];
    setMessages(rows); setMembers(mem.data ?? []); setPatients(pts.data ?? []);
    const ids = rows.map((m) => m.id);
    if (ids.length) {
      const { data: reads } = await db.from('hc_team_message_reads').select('message_id').eq('user_id', userId).in('message_id', ids);
      if (v === version.current) setReadIds(new Set((reads ?? []).map((r: Row) => r.message_id)));
    }
  }, [clinicId, userId]);

  useEffect(() => {
    void load();
    const timer = window.setInterval(() => { if (document.visibilityState === 'visible') void load(); }, MESSAGE_POLL_SECONDS * 1000);
    return () => { window.clearInterval(timer); ++version.current; };
  }, [load]);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const patientId = (e as CustomEvent<{ patientId?: string }>).detail?.patientId;
      setAbout(patientId ?? NO_PATIENT); setOpen(true);
    };
    window.addEventListener(TEAM_MESSAGE_EVENT, onOpen);
    return () => window.removeEventListener(TEAM_MESSAGE_EVENT, onOpen);
  }, []);

  const unread = useMemo(() => messages.filter((m) => m.sender_id !== userId && !readIds.has(m.id)), [messages, readIds, userId]);

  // Opening the drawer marks what you can see as read.
  useEffect(() => {
    if (!open || unread.length === 0) return;
    const ids = unread.map((m) => m.id);
    void db.from('hc_team_message_reads').upsert(ids.map((id) => ({ message_id: id, user_id: userId })), { onConflict: 'message_id,user_id', ignoreDuplicates: true })
      .then(({ error }: { error: unknown }) => { if (!error) setReadIds((prev) => new Set([...prev, ...ids])); });
  }, [open, unread, userId]);

  const memberLabel = (id?: string | null) => {
    if (!id) return 'Everyone';
    if (id === userId) return 'You';
    const m = members.find((x) => x.user_id === id);
    return m ? (m.display_name || m.email) : 'A teammate';
  };
  const patientById = useMemo(() => Object.fromEntries(patients.map((p) => [p.id, p])), [patients]);

  const send = async () => {
    if (sendingRef.current) return;
    const problem = validateTeamMessage(body);
    if (problem) { toast.error(problem); return; }
    sendingRef.current = true; setSending(true);
    try {
      const { data, error } = await db.from('hc_team_messages').insert({
        clinic_id: clinicId, sender_id: userId, recipient_id: to === EVERYONE ? null : to,
        patient_id: about === NO_PATIENT ? null : about, body: body.trim(),
      }).select('id').single();
      if (error || !data?.id) { toast.error(error?.message ?? 'Message could not be sent.'); return; }
      setBody(''); toast.success('Message sent.');
      // Email alert is best effort and carries no message words.
      void supabase.functions.invoke('health-access', { body: { action: 'team_alert', message_id: data.id } }).catch(() => {});
      await load();
    } finally { sendingRef.current = false; setSending(false); }
  };

  return (
    <>
      <Button variant="ghost" size="sm" className="relative" aria-label={unread.length ? `Team messages, ${unread.length} unread` : 'Team messages'} onClick={() => setOpen(true)}>
        <Bell className="h-4 w-4" /><span className="ml-1 hidden sm:inline">Team messages</span>
        {unread.length > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[11px] font-bold text-destructive-foreground">{unread.length > 99 ? '99+' : unread.length}</span>}
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="theme-clinical dark flex w-full flex-col gap-4 overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Team messages</SheetTitle>
            <SheetDescription>Messages stay inside 1325 Clinical. Teammates get an email that only says a new message is waiting.</SheetDescription>
          </SheetHeader>
          <p className="flex items-start gap-2 rounded-md border border-mansagold/40 bg-mansagold/10 p-2 text-xs text-foreground"><FlaskConical className="mt-0.5 h-3.5 w-3.5 shrink-0" />Test patients only. Do not type real patient information.</p>
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Select value={to} onValueChange={setTo}>
                <SelectTrigger className="h-9" aria-label="Send to"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={EVERYONE}>Everyone on the team</SelectItem>
                  {members.filter((m) => m.user_id !== userId).map((m) => <SelectItem key={`msg-to:${m.user_id}`} value={m.user_id}>{(m.display_name || m.email)} · {roleLabel(m.role)}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={about} onValueChange={setAbout}>
                <SelectTrigger className="h-9" aria-label="About a test patient"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_PATIENT}>No patient</SelectItem>
                  {patients.map((p) => <SelectItem key={`msg-about:${p.id}`} value={p.id}>Test patient {initials(p)}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Textarea aria-label="Message" placeholder="e.g. Please call to reschedule the follow-up." value={body} maxLength={MESSAGE_MAX_LENGTH} onChange={(e) => setBody(e.target.value)} rows={3} />
            <div className="flex items-center justify-between text-xs text-muted-foreground"><span>{body.length}/{MESSAGE_MAX_LENGTH}</span>
              <Button size="sm" disabled={sending} onClick={() => void send()} className="bg-mansagold text-mansablue hover:bg-mansagold-dark"><Send className="mr-1 h-4 w-4" />Send</Button></div>
          </div>
          {loadError && <p role="alert" className="text-sm text-destructive">{loadError} <Button size="sm" variant="link" onClick={() => void load()}>Retry</Button></p>}
          <ul className="space-y-2" aria-label="Messages">
            {messages.length === 0 && !loadError && <li className="text-sm text-muted-foreground">No messages yet.</li>}
            {messages.map((m) => (
              <li key={`team-msg:${m.id}`} className={`rounded-md border p-3 text-sm ${m.sender_id !== userId && !readIds.has(m.id) ? 'border-mansagold' : ''}`}>
                <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{m.sender_id === userId ? 'You' : (m.sender_email ?? 'A teammate')}</span>
                  <span>to {memberLabel(m.recipient_id)}</span>
                  <span>· {formatDistanceToNow(parseISO(m.created_at), { addSuffix: true })}</span>
                  {m.patient_id && <Badge variant="outline" className="text-[10px]">About test patient {initials(patientById[m.patient_id])}</Badge>}
                </div>
                <p className="whitespace-pre-wrap break-words">{m.body}</p>
              </li>
            ))}
          </ul>
        </SheetContent>
      </Sheet>
    </>
  );
}
