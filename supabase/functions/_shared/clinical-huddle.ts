// Kayla's daily huddles: short spoken briefings built from counts only (never patient names,
// notes or results). Shared by the workspace screen and the Kayla voice service, so the words on
// screen are exactly the words Kayla says. The voice service builds the script itself from the
// clinic's own test-patient counts; the browser never sends text to be spoken.

/** Kayla speaks for the whole Agentic team: one voice, introducing the coordinator whose work it is. */
export const TEAM_VOICE = {
  schedule: 'our scheduling coordinator',
  labs: 'our lab coordinator',
  notes: 'our documentation specialist',
  pharmacy: 'our medication safety coordinator',
} as const;

export const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export type HuddleCounts = { visitsToday: number; checkedIn: number; openLabs: number; urgentLabs: number; draftNotes: number; completed?: number; tomorrowVisits?: number };

/** What changed since the previous huddle (counts only). */
export type HuddleUpdates = {
  booked: number; checkedIn: number; completed: number; discharged: number; leftAma: number;
  noShows: number; cancelled: number; newPrescriptions: number; stoppedMedicines: number; newLabs: number;
};
export const NO_UPDATES: HuddleUpdates = { booked: 0, checkedIn: 0, completed: 0, discharged: 0, leftAma: 0, noShows: 0, cancelled: 0, newPrescriptions: 0, stoppedMedicines: 0, newLabs: 0 };

/** Four huddles across 24 hours, at shift changes, each led by different Agentic team members. */
export const HUDDLE_SESSIONS = ['morning', 'afternoon', 'evening', 'night'] as const;
export type HuddleSession = typeof HUDDLE_SESSIONS[number];
/** Local hour of each huddle; each one reports updates since the huddle before it. */
export const HUDDLE_HOURS: Record<HuddleSession, number> = { morning: 7, afternoon: 13, evening: 19, night: 23 };
export const PREVIOUS_HUDDLE: Record<HuddleSession, HuddleSession> = { morning: 'night', afternoon: 'morning', evening: 'afternoon', night: 'evening' };
const SPOKEN_HOUR: Record<HuddleSession, string> = { morning: '7 AM', afternoon: '1 PM', evening: '7 PM', night: '11 PM' };

/** The most recent huddle for a local hour (0–23): before 7 AM still belongs to last night's huddle. */
export function latestSession(hour: number): HuddleSession {
  if (hour >= 23 || hour < 7) return 'night';
  if (hour < 13) return 'morning';
  if (hour < 19) return 'afternoon';
  return 'evening';
}

/** One sentence (or two) of patient updates since the previous huddle. Counts only. */
export function updatesSentence(session: HuddleSession, u: HuddleUpdates): string {
  const since = `since the ${SPOKEN_HOUR[PREVIOUS_HUDDLE[session]]} huddle`;
  const items = [
    u.booked && plural(u.booked, 'new visit') + ' booked',
    u.checkedIn && `${plural(u.checkedIn, 'patient')} checked in`,
    u.completed && `${plural(u.completed, 'visit')} completed`,
    u.discharged && `${plural(u.discharged, 'patient')} discharged`,
    u.leftAma && `${plural(u.leftAma, 'patient')} left against medical advice`,
    u.noShows && plural(u.noShows, 'no-show'),
    u.cancelled && `${plural(u.cancelled, 'visit')} cancelled`,
    u.newPrescriptions && plural(u.newPrescriptions, 'new prescription'),
    u.stoppedMedicines && `${plural(u.stoppedMedicines, 'medicine')} stopped`,
    u.newLabs && plural(u.newLabs, 'new lab order'),
  ].filter((x): x is string => typeof x === 'string');
  if (!items.length) return `No patient updates ${since}.`;
  const list = items.length === 1 ? items[0] : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
  const ama = u.leftAma ? ' Please review each against-medical-advice departure and confirm the risks discussion is documented in the chart.' : '';
  return `Patient updates ${since}: ${list}.${ama}`;
}

/** Morning huddle (7 AM): today's schedule, labs and notes, plus overnight updates. */
export function huddleScript(c: HuddleCounts, doctorName?: string, now: Date | number = new Date(), u: HuddleUpdates = NO_UPDATES): string {
  const hour = typeof now === 'number' ? now : now.getHours();
  const greet = hour >= 5 && hour < 12 ? 'Good morning' : hour >= 12 && hour < 17 ? 'Good afternoon' : 'Good evening';
  const who = doctorName?.trim() ? `, ${doctorName.trim()}` : '';
  return [
    `${greet}${who}. Here is your 7 AM morning huddle from Kayla and the team.`,
    c.visitsToday
      ? `${cap(TEAM_VOICE.schedule)} shows ${plural(c.visitsToday, 'visit')} on today's schedule${c.checkedIn ? `, and ${plural(c.checkedIn, 'patient')} already checked in` : ''}.`
      : `${cap(TEAM_VOICE.schedule)} shows no visits booked for today.`,
    c.openLabs
      ? `${cap(TEAM_VOICE.labs)} has ${plural(c.openLabs, 'lab order')} waiting${c.urgentLabs ? `, including ${c.urgentLabs} marked urgent or stat` : ''}.`
      : 'There are no lab orders waiting.',
    c.draftNotes
      ? `${cap(TEAM_VOICE.notes)} has ${plural(c.draftNotes, 'visit note')} still in draft, ready for your review and signature.`
      : 'All visit notes are signed.',
    updatesSentence('morning', u),
    'These are made-up test patients for the pilot. Have a great day.',
  ].join(' ');
}

/** Afternoon huddle (1 PM): progress so far, urgent labs and medication safety. */
export function afternoonScript(c: HuddleCounts, u: HuddleUpdates = NO_UPDATES): string {
  const done = c.completed ?? 0;
  const left = Math.max(0, c.visitsToday - done);
  return [
    'Good afternoon. Here is your 1 PM afternoon huddle from Kayla and the team.',
    c.visitsToday ? `${cap(TEAM_VOICE.schedule)} shows ${plural(done, 'visit')} finished so far, with ${plural(left, 'visit')} still ahead today.` : `${cap(TEAM_VOICE.schedule)} shows no visits booked for today.`,
    c.urgentLabs ? `${cap(TEAM_VOICE.labs)} wants your eyes first on ${plural(c.urgentLabs, 'lab order')} marked urgent or stat.` : c.openLabs ? `${cap(TEAM_VOICE.labs)} has ${plural(c.openLabs, 'lab order')} in progress, none marked urgent.` : 'No lab orders are waiting.',
    `${cap(TEAM_VOICE.pharmacy)} reminds you to confirm allergies and current medicines before signing any new prescription this afternoon.`,
    updatesSentence('afternoon', u),
    'These are made-up test patients for the pilot.',
  ].join(' ');
}

/** Evening huddle (7 PM): shift handoff, notes to sign and labs carried into the night. */
export function eveningScript(c: HuddleCounts, u: HuddleUpdates = NO_UPDATES): string {
  const done = c.completed ?? 0;
  return [
    'Good evening. Here is your 7 PM shift handoff huddle from Kayla and the team.',
    c.visitsToday ? `${cap(TEAM_VOICE.schedule)} shows ${plural(done, 'visit')} finished out of ${c.visitsToday} on today's schedule${c.checkedIn ? `, with ${plural(c.checkedIn, 'patient')} still checked in` : ''}.` : 'There were no visits on today\'s schedule.',
    c.draftNotes ? `${cap(TEAM_VOICE.notes)} has ${plural(c.draftNotes, 'visit note')} waiting for signature before handoff.` : `${cap(TEAM_VOICE.notes)} confirms every visit note is signed.`,
    c.openLabs ? `${cap(TEAM_VOICE.labs)} is handing ${plural(c.openLabs, 'open lab order')} to the evening team${c.urgentLabs ? `, ${c.urgentLabs} of them urgent or stat` : ''}.` : 'There are no open lab orders to hand off.',
    updatesSentence('evening', u),
    'These are made-up test patients for the pilot. Thank you for a great shift.',
  ].join(' ');
}

/** Night huddle (11 PM): overnight watch and tomorrow's readiness. */
export function nightScript(c: HuddleCounts, u: HuddleUpdates = NO_UPDATES): string {
  const tomorrow = c.tomorrowVisits ?? 0;
  return [
    'Good evening. Here is your 11 PM night huddle from Kayla and the team.',
    c.urgentLabs ? `${cap(TEAM_VOICE.labs)} is watching ${plural(c.urgentLabs, 'urgent or stat lab order')} overnight and will flag results right away.` : c.openLabs ? `${cap(TEAM_VOICE.labs)} is watching ${plural(c.openLabs, 'open lab order')} overnight, none marked urgent.` : 'There are no open lab orders overnight.',
    c.draftNotes ? `${cap(TEAM_VOICE.notes)} still has ${plural(c.draftNotes, 'visit note')} unsigned for the morning team.` : 'Every visit note is signed.',
    tomorrow ? `${cap(TEAM_VOICE.schedule)} shows ${plural(tomorrow, 'visit')} booked for tomorrow.` : `${cap(TEAM_VOICE.schedule)} shows no visits booked for tomorrow yet.`,
    updatesSentence('night', u),
    'These are made-up test patients for the pilot. Have a safe night.',
  ].join(' ');
}

/** The script for one session. */
export function sessionScript(session: HuddleSession, c: HuddleCounts, hour: number, u: HuddleUpdates = NO_UPDATES): string {
  if (session === 'afternoon') return afternoonScript(c, u);
  if (session === 'evening') return eveningScript(c, u);
  if (session === 'night') return nightScript(c, u);
  return huddleScript(c, undefined, hour, u);
}

/** Visit statuses that mean the patient's visit is over. */
export const FINISHED_VISIT = ['completed', 'discharged', 'left_ama'] as const;

/** Counts from the pilot lists (statuses and priorities only). */
export function huddleCounts(appointments: { status: string }[], openLabs: { priority: string }[], draftNotes: unknown[], tomorrow: { status: string }[] = []): HuddleCounts {
  return {
    visitsToday: appointments.filter((x) => x.status !== 'cancelled').length,
    checkedIn: appointments.filter((x) => x.status === 'checked_in').length,
    openLabs: openLabs.length,
    urgentLabs: openLabs.filter((x) => x.priority !== 'routine').length,
    draftNotes: draftNotes.length,
    completed: appointments.filter((x) => (FINISHED_VISIT as readonly string[]).includes(x.status)).length,
    tomorrowVisits: tomorrow.filter((x) => x.status !== 'cancelled').length,
  };
}

type Stamp = string | null | undefined;
const inWindow = (t: Stamp, from: Date, to: Date) => { if (!t) return false; const v = new Date(t).getTime(); return v >= from.getTime() && v <= to.getTime(); };

/** Patient updates inside a time window, from statuses and timestamps only. A closed visit can't change
 * again, so its last-updated time is when it was closed. */
export function huddleUpdates(
  window: { from: Date; to: Date },
  appts: { status: string; created_at: Stamp; checked_in_at: Stamp; updated_at: Stamp }[],
  prescriptions: { status: string; created_at: Stamp; updated_at: Stamp }[],
  labs: { created_at: Stamp }[],
): HuddleUpdates {
  const { from, to } = window;
  const closed = (s: string) => appts.filter((a) => a.status === s && inWindow(a.updated_at, from, to)).length;
  return {
    booked: appts.filter((a) => inWindow(a.created_at, from, to)).length,
    checkedIn: appts.filter((a) => inWindow(a.checked_in_at, from, to)).length,
    completed: closed('completed'), discharged: closed('discharged'), leftAma: closed('left_ama'),
    noShows: closed('no_show'), cancelled: closed('cancelled'),
    newPrescriptions: prescriptions.filter((p) => inWindow(p.created_at, from, to)).length,
    stoppedMedicines: prescriptions.filter((p) => p.status === 'stopped' && inWindow(p.updated_at, from, to)).length,
    newLabs: labs.filter((l) => inWindow(l.created_at, from, to)).length,
  };
}

/** The doctor's "today" and local hour from their clock offset (minutes, as Date.getTimezoneOffset gives). */
export function localDay(tzOffsetMinutes: number, now = new Date()): { start: Date; end: Date; hour: number } {
  const local = new Date(now.getTime() - tzOffsetMinutes * 60000);
  const startLocal = Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate());
  const start = new Date(startLocal + tzOffsetMinutes * 60000);
  return { start, end: new Date(start.getTime() + 86400000), hour: local.getUTCHours() };
}

/** Updates window for a huddle: from the most recent time the previous huddle was due, up to now. */
export function updatesWindow(session: HuddleSession, tzOffsetMinutes: number, now = new Date()): { from: Date; to: Date } {
  const day = localDay(tzOffsetMinutes, now);
  let from = new Date(day.start.getTime() + HUDDLE_HOURS[PREVIOUS_HUDDLE[session]] * 3600000);
  if (from.getTime() > now.getTime()) from = new Date(from.getTime() - 86400000);
  return { from, to: now };
}
