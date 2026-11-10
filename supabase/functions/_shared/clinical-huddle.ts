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

export type HuddleCounts = { visitsToday: number; checkedIn: number; openLabs: number; urgentLabs: number; draftNotes: number };

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

/** Counts from the three pilot lists (statuses and priorities only). */
export function huddleCounts(appointments: { status: string }[], openLabs: { priority: string }[], draftNotes: unknown[]): HuddleCounts {
  return {
    visitsToday: appointments.filter((x) => x.status !== 'cancelled').length,
    checkedIn: appointments.filter((x) => x.status === 'checked_in').length,
    openLabs: openLabs.length,
    urgentLabs: openLabs.filter((x) => x.priority !== 'routine').length,
    draftNotes: draftNotes.length,
  };
}

/** The doctor's "today" and local hour from their clock offset (minutes, as Date.getTimezoneOffset gives). */
export function localDay(tzOffsetMinutes: number, now = new Date()): { start: Date; end: Date; hour: number } {
  const local = new Date(now.getTime() - tzOffsetMinutes * 60000);
  const startLocal = Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate());
  const start = new Date(startLocal + tzOffsetMinutes * 60000);
  return { start, end: new Date(start.getTime() + 86400000), hour: local.getUTCHours() };
}
