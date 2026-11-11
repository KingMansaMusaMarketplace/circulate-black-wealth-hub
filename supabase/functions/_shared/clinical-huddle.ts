// Kayla's morning huddle: a short spoken briefing built from counts only (never patient names,
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

export type HuddleCounts = { visitsToday: number; checkedIn: number; openLabs: number; urgentLabs: number; draftNotes: number; completed?: number };

/** Three huddles across the clinic day, each led by different Agentic team members. */
export const HUDDLE_SESSIONS = ['morning', 'midday', 'afternoon'] as const;
export type HuddleSession = typeof HUDDLE_SESSIONS[number];

/** 45-second briefing. `now` is a date or the doctor's local hour (0–23). */
export function huddleScript(c: HuddleCounts, doctorName?: string, now: Date | number = new Date()): string {
  const hour = typeof now === 'number' ? now : now.getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const who = doctorName?.trim() ? `, ${doctorName.trim()}` : '';
  const parts = [`${greet}${who}. Here is your huddle from Kayla and the team.`];
  parts.push(c.visitsToday
    ? `${cap(TEAM_VOICE.schedule)} shows ${plural(c.visitsToday, 'visit')} on today's schedule${c.checkedIn ? `, and ${plural(c.checkedIn, 'patient')} already checked in` : ''}.`
    : `${cap(TEAM_VOICE.schedule)} shows no visits booked for today.`);
  parts.push(c.openLabs
    ? `${cap(TEAM_VOICE.labs)} has ${plural(c.openLabs, 'lab order')} waiting${c.urgentLabs ? `, including ${c.urgentLabs} marked urgent or stat` : ''}.`
    : 'There are no lab orders waiting.');
  parts.push(c.draftNotes
    ? `${cap(TEAM_VOICE.notes)} has ${plural(c.draftNotes, 'visit note')} still in draft, ready for your review and signature.`
    : 'All visit notes are signed.');
  parts.push('These are made-up test patients for the pilot. Have a great day.');
  return parts.join(' ');
}

/** Midday check-in: progress so far, labs and medication safety. Counts only. */
export function middayScript(c: HuddleCounts): string {
  const done = c.completed ?? 0;
  const left = Math.max(0, c.visitsToday - done);
  return [
    'Good afternoon. Here is your midday check-in from Kayla and the team.',
    c.visitsToday ? `${cap(TEAM_VOICE.schedule)} shows ${plural(done, 'visit')} finished so far, with ${plural(left, 'visit')} still ahead today.` : `${cap(TEAM_VOICE.schedule)} shows no visits booked for today.`,
    c.urgentLabs ? `${cap(TEAM_VOICE.labs)} wants your eyes first on ${plural(c.urgentLabs, 'lab order')} marked urgent or stat.` : c.openLabs ? `${cap(TEAM_VOICE.labs)} has ${plural(c.openLabs, 'lab order')} in progress, none marked urgent.` : 'No lab orders are waiting.',
    `${cap(TEAM_VOICE.pharmacy)} reminds you to confirm allergies and current medicines before signing any new prescription this afternoon.`,
    'These are made-up test patients for the pilot. Enjoy your lunch.',
  ].join(' ');
}

/** Afternoon wrap-up: documentation and closing the day. Counts only. */
export function afternoonScript(c: HuddleCounts): string {
  const done = c.completed ?? 0;
  return [
    'Good evening. Here is your end-of-day wrap-up from Kayla and the team.',
    c.visitsToday ? `${cap(TEAM_VOICE.schedule)} shows ${plural(done, 'visit')} completed out of ${c.visitsToday} on today's schedule.` : 'There were no visits on today\'s schedule.',
    c.draftNotes ? `${cap(TEAM_VOICE.notes)} has ${plural(c.draftNotes, 'visit note')} waiting for your signature before you leave.` : `${cap(TEAM_VOICE.notes)} confirms every visit note is signed.`,
    c.openLabs ? `${cap(TEAM_VOICE.labs)} will keep watching ${plural(c.openLabs, 'open lab order')} overnight and flag results in the morning.` : 'There are no open lab orders to carry into tomorrow.',
    'These are made-up test patients for the pilot. Great work today.',
  ].join(' ');
}

/** The script for one session. Morning keeps the original briefing. */
export function sessionScript(session: HuddleSession, c: HuddleCounts, hour: number): string {
  return session === 'midday' ? middayScript(c) : session === 'afternoon' ? afternoonScript(c) : huddleScript(c, undefined, hour);
}

/** Counts from the three pilot lists (statuses and priorities only). */
export function huddleCounts(appointments: { status: string }[], openLabs: { priority: string }[], draftNotes: unknown[]): HuddleCounts {
  return {
    visitsToday: appointments.filter((x) => x.status !== 'cancelled').length,
    checkedIn: appointments.filter((x) => x.status === 'checked_in').length,
    openLabs: openLabs.length,
    urgentLabs: openLabs.filter((x) => x.priority !== 'routine').length,
    draftNotes: draftNotes.length,
    completed: appointments.filter((x) => x.status === 'done').length,
  };
}

/** The doctor's "today" and local hour from their clock offset (minutes, as Date.getTimezoneOffset gives). */
export function localDay(tzOffsetMinutes: number, now = new Date()): { start: Date; end: Date; hour: number } {
  const local = new Date(now.getTime() - tzOffsetMinutes * 60000);
  const startLocal = Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate());
  const start = new Date(startLocal + tzOffsetMinutes * 60000);
  return { start, end: new Date(start.getTime() + 86400000), hour: local.getUTCHours() };
}
