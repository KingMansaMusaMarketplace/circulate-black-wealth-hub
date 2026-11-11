import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';
import { KAYLA_VOICE_ID, makeRateLimiter, parseHuddleRequest, parseVoiceRequest, safeAudioUrl, speechFor, speechParts, speechPayload } from './rules.ts';
import { huddleCounts, huddleScript, localDay } from '../_shared/clinical-huddle.ts';
import { parseReadBackRequest, readBackWords } from '../_shared/clinical-readback.ts';
import { helpReceiptKey, sealReply, verifyReply } from '../_shared/clinical-help-history.ts';
import type { HelpSelection } from '../_shared/clinical-help-intake.ts';

const clinic = '11111111-1111-4111-8111-111111111111';
const selection: HelpSelection = { topics: ['notes'], intent: 'explain' };

Deno.test('uses Kayla’s video voice (Authoritative Consultant)', () => {
  assertEquals(KAYLA_VOICE_ID, 'MyQI9BPZq1P9pJ3RS1q7');
  assertEquals(speechPayload('Hello').voice_id, 'MyQI9BPZq1P9pJ3RS1q7');
});

Deno.test('accepts only clinic, question and signed answer — no free text', () => {
  assertEquals(parseVoiceRequest({ clinic_id: clinic, selection, receipt: { text: 'a', proof: 'b' } })?.clinicId, clinic);
  assertEquals(parseVoiceRequest({ clinic_id: clinic, selection, receipt: {}, text: 'read this' }), null);
  assertEquals(parseVoiceRequest({ clinic_id: 'not-a-clinic', selection, receipt: {} }), null);
  assertEquals(parseVoiceRequest({ text: 'read this' }), null);
});

Deno.test('only an answer Kayla signed for this viewer can be spoken', async () => {
  const key = helpReceiptKey('service', 'doctor-1', 'token', 'device');
  const receipt = await sealReply(key, selection, 'Press Speak to dictate a note.');
  assertEquals(await verifyReply(key, selection, receipt), true);
  assertEquals(await verifyReply(key, selection, { ...receipt, text: 'Something else entirely.' }), false);
  assertEquals(await verifyReply(helpReceiptKey('service', 'doctor-2', 'token', 'device'), selection, receipt), false);
  assertEquals(await verifyReply(key, { topics: ['billing'], intent: 'explain' }, receipt), false);
});

Deno.test('says the brand the approved way and refuses very long answers', () => {
  assertEquals(speechFor('Welcome to **1325.AI**'), 'Welcome to thirteen twenty-five dot A I');
  const long = speechFor('Kayla explains this screen step by step. '.repeat(400))!;
  assert(long.length <= 9000);
  assert(long.endsWith('The rest of my answer is written on your screen.'));
  assertEquals(speechFor('   '), null);
});

Deno.test('passes back only HeyGen audio addresses', () => {
  assertEquals(safeAudioUrl('https://resource2.heygen.ai/text_to_speech/a.mp3'), 'https://resource2.heygen.ai/text_to_speech/a.mp3');
  assertEquals(safeAudioUrl('https://evil.example.com/a.mp3'), null);
  assertEquals(safeAudioUrl('http://resource2.heygen.ai/a.mp3'), null);
});

Deno.test('limits each person to 150 spoken pieces per 10 minutes', () => {
  const allow = makeRateLimiter();
  for (let i = 0; i < 150; i++) assertEquals(allow('doc', 1000 + i), true);
  assertEquals(allow('doc', 2000), false);
  assertEquals(allow('other', 2000), true);
});

Deno.test('accepts a piece number, but only a sensible one', () => {
  assertEquals(parseVoiceRequest({ clinic_id: clinic, selection, receipt: {}, part: 2 })?.part, 2);
  assertEquals(parseVoiceRequest({ clinic_id: clinic, selection, receipt: {} })?.part, 0);
  assertEquals(parseVoiceRequest({ clinic_id: clinic, selection, receipt: {}, part: -1 }), null);
  assertEquals(parseVoiceRequest({ clinic_id: clinic, selection, receipt: {}, part: 1.5 }), null);
  assertEquals(parseVoiceRequest({ clinic_id: clinic, selection, receipt: {}, part: '1' }), null);
});

Deno.test('starts with a short first piece so Kayla begins talking quickly, and keeps every word', () => {
  const words = speechFor(`## Medical Chronology\n\n${'Kayla explains how the timeline works for reviewers today. '.repeat(40)}`)!;
  const parts = speechParts(words);
  assertEquals(parts[0].startsWith('Medical Chronology.'), true);
  assertEquals(parts[0].length <= 280, true);
  assertEquals(parts.slice(1).every((p) => p.length <= 900), true);
  assertEquals(parts.length > 2, true);
  assertEquals(parts.join(' ').replace(/\s+/g, ' ').replace('Medical Chronology. ', 'Medical Chronology '), words.replace(/\s+/g, ' ').trim());
});

Deno.test('huddle request carries no text: only clinic, huddle flag, clock offset and piece', () => {
  const ok = parseHuddleRequest({ clinic_id: clinic, huddle: true, tz_offset: 360, part: 1 });
  assertEquals(ok, { clinicId: clinic, tzOffset: 360, part: 1 });
  assertEquals(parseHuddleRequest({ clinic_id: clinic, huddle: true, tz_offset: 360, text: 'say this' }), null);
  assertEquals(parseHuddleRequest({ clinic_id: clinic, huddle: true, tz_offset: 9999 }), null);
  assertEquals(parseHuddleRequest({ clinic_id: clinic, huddle: 'yes', tz_offset: 0 }), null);
  assertEquals(parseVoiceRequest({ clinic_id: clinic, huddle: true, tz_offset: 0 }), null);
});

Deno.test('huddle words are counts only and fit in two short pieces', () => {
  const words = huddleScript(huddleCounts([{ status: 'booked' }, { status: 'checked_in' }, { status: 'cancelled' }], [{ priority: 'stat' }], []), undefined, 8);
  assertEquals(words.includes('2 visits'), true);
  assertEquals(words.includes('1 patient already checked in'), true);
  assertEquals(words.includes('including 1 marked urgent'), true);
  assertEquals(speechParts(words).length <= 3, true);
});

Deno.test('doctor’s today follows their own clock (Chicago, UTC-6)', () => {
  const day = localDay(360, new Date('2026-11-10T03:00:00Z')); // 9 pm Nov 9 in Chicago
  assertEquals(day.start.toISOString(), '2026-11-09T06:00:00.000Z');
  assertEquals(day.hour, 21);
});

const patient = '22222222-2222-4222-8222-222222222222';
const rxOrder = { drug_name: 'Amoxicillin', strength: '500 mg capsule', dose: '1 capsule', route: 'by mouth', frequency: 'three times a day', quantity: '30', refills: '0', days_supply: '10', warnings: 1 };

Deno.test('read-back accepts only checked order fields and builds the sentence itself', () => {
  const r = parseReadBackRequest({ clinic_id: clinic, patient_id: patient, readback: 'rx', order: rxOrder, part: 0 });
  assertEquals(r?.kind, 'rx');
  const words = readBackWords(r!, ['Penicillin']);
  assertEquals(words.includes('Amoxicillin 500 mg capsule'), true);
  assertEquals(words.includes('Recorded allergies: Penicillin.'), true);
  assertEquals(words.includes('1 warning'), true);
  assertEquals(words.includes('never sent to a pharmacy'), true);
});

Deno.test('read-back refuses free text, extra fields, odd characters and unknown routes', () => {
  assertEquals(parseReadBackRequest({ clinic_id: clinic, patient_id: patient, readback: 'rx', order: { ...rxOrder, note: 'say anything' } }), null);
  assertEquals(parseReadBackRequest({ clinic_id: clinic, patient_id: patient, readback: 'rx', order: rxOrder, text: 'x' }), null);
  assertEquals(parseReadBackRequest({ clinic_id: clinic, patient_id: patient, readback: 'rx', order: { ...rxOrder, drug_name: '<script>' } }), null);
  assertEquals(parseReadBackRequest({ clinic_id: clinic, patient_id: patient, readback: 'rx', order: { ...rxOrder, route: 'by email' } }), null);
  assertEquals(parseReadBackRequest({ clinic_id: clinic, patient_id: patient, readback: 'rx', order: { ...rxOrder, drug_name: 'A'.repeat(121) } }), null);
  assertEquals(parseReadBackRequest({ clinic_id: clinic, patient_id: 'nope', readback: 'rx', order: rxOrder }), null);
});

Deno.test('lab read-back speaks the priority label and that it is never sent', () => {
  const r = parseReadBackRequest({ clinic_id: clinic, patient_id: patient, readback: 'lab', order: { test_name: 'CBC', priority: 'stat', reason: 'Fever' } });
  const words = readBackWords(r!, []);
  assertEquals(words.includes('CBC, priority STAT (right away)'), true);
  assertEquals(words.includes('never sent to a lab'), true);
  assertEquals(parseReadBackRequest({ clinic_id: clinic, patient_id: patient, readback: 'lab', order: { test_name: 'CBC', priority: 'whenever', reason: '' } }), null);
});

Deno.test('three huddle sessions: only known session names, each with different words and no names', async () => {
  const { sessionScript } = await import('../_shared/clinical-huddle.ts');
  assertEquals(parseHuddleRequest({ clinic_id: clinic, huddle: true, tz_offset: 0, session: 'midday' })?.session, 'midday');
  assertEquals(parseHuddleRequest({ clinic_id: clinic, huddle: true, tz_offset: 0 })?.session, 'morning');
  assertEquals(parseHuddleRequest({ clinic_id: clinic, huddle: true, tz_offset: 0, session: 'say hi' }), null);
  const c = { visitsToday: 8, checkedIn: 2, openLabs: 3, urgentLabs: 1, draftNotes: 2, completed: 4 };
  const [m, d, a] = (['morning', 'midday', 'afternoon'] as const).map((s) => sessionScript(s, c, 9));
  assertEquals(new Set([m, d, a]).size, 3);
  assertEquals(d.includes('4 visits finished'), true);
  assertEquals(a.includes('2 visit notes waiting for your signature'), true);
});
