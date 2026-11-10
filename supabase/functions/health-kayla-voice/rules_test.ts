import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';
import { KAYLA_VOICE_ID, makeRateLimiter, parseVoiceRequest, safeAudioUrl, speechFor, speechParts, speechPayload } from './rules.ts';
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
  assertEquals(speechFor('x'.repeat(9001)), null);
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
