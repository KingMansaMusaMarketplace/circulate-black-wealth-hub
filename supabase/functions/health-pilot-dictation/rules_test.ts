import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';
import { MAX_SECONDS, SAMPLE_RATE, checkWav, makeRateLimiter, openAiHeaders } from './rules.ts';

function wav(seconds: number, rate = SAMPLE_RATE): Uint8Array {
  const samples = Math.round(seconds * rate);
  const bytes = new Uint8Array(44 + samples * 2);
  const v = new DataView(bytes.buffer);
  const tag = (o: number, s: string) => { for (let i = 0; i < 4; i++) v.setUint8(o + i, s.charCodeAt(i)); };
  tag(0, 'RIFF'); v.setUint32(4, 36 + samples * 2, true); tag(8, 'WAVE'); tag(12, 'fmt ');
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true); v.setUint32(24, rate, true);
  v.setUint32(28, rate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); tag(36, 'data'); v.setUint32(40, samples * 2, true);
  return bytes;
}

Deno.test('accepts a 10-second and a full 2-minute recording', () => {
  assertEquals(checkWav(wav(10)).ok, true);
  assertEquals(checkWav(wav(MAX_SECONDS)).ok, true);
});
Deno.test('rejects recordings over 2 minutes', () => {
  assertEquals(checkWav(wav(MAX_SECONDS + 5)).ok, false);
});
Deno.test('rejects empty recordings and other formats', () => {
  assertEquals(checkWav(wav(0.2)).ok, false);
  assertEquals(checkWav(wav(5, 48000)).ok, false);
  assertEquals(checkWav(new TextEncoder().encode('not audio at all, just some words here........')).ok, false);
});
Deno.test('limits each person to 30 recordings per 10 minutes', () => {
  const allow = makeRateLimiter();
  for (let i = 0; i < 30; i++) assertEquals(allow('doc', 1000 + i), true);
  assertEquals(allow('doc', 2000), false);
  assertEquals(allow('other-doc', 2000), true);
  assertEquals(allow('doc', 1000 + 10 * 60 * 1000 + 1), true);
});
Deno.test('refuses to call OpenAI without the BAA organization ID', () => {
  assertEquals(openAiHeaders('k', null), null);
  assertEquals(openAiHeaders('k', 'org_wrongformat'), null);
  assertEquals(openAiHeaders('k', 'org-czqhan7Np7MxI9Hh6CXcd4ei', 'proj_abc')?.['OpenAI-Organization'], 'org-czqhan7Np7MxI9Hh6CXcd4ei');
});
