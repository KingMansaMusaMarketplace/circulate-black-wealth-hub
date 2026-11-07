import { assert, assertEquals, assertNotEquals, assertStringIncludes } from 'https://deno.land/std@0.224.0/assert/mod.ts';
import { CODE_MINUTES, MAX_ATTEMPTS, hashSigninCode, isSigninCode, newSigninCode, sameHash, sendAllowed, signinCodeEmail } from './signin-code.ts';

Deno.test('sign-in codes are exactly 6 digits', () => {
  for (let i = 0; i < 200; i++) assert(/^[0-9]{6}$/.test(newSigninCode()));
  assertEquals(newSigninCode(() => new Uint8Array([0, 0, 0, 7])), '000007');
  assertEquals(isSigninCode('123456'), true);
  assertEquals(isSigninCode('12345'), false);
  assertEquals(isSigninCode('12a456'), false);
});

Deno.test('codes expire in 10 minutes and lock after 5 wrong tries', () => {
  assertEquals(CODE_MINUTES, 10);
  assertEquals(MAX_ATTEMPTS, 5);
});

Deno.test('a code only matches the viewing it was issued for', async () => {
  const a = await hashSigninCode('secret', 'request-a', '123456');
  assertEquals(sameHash(a, await hashSigninCode('secret', 'request-a', '123456')), true);
  assertNotEquals(a, await hashSigninCode('secret', 'request-b', '123456'));
  assertEquals(sameHash(a, await hashSigninCode('secret', 'request-a', '654321')), false);
});

Deno.test('at most 5 codes per hour, 45 seconds apart', () => {
  const now = new Date('2026-11-07T12:00:00Z');
  const ago = (s: number) => new Date(now.getTime() - s * 1000);
  assertEquals(sendAllowed([], now).ok, true);
  assertEquals(sendAllowed([ago(20)], now), { ok: false, reason: 'wait' });
  assertEquals(sendAllowed([ago(60)], now).ok, true);
  assertEquals(sendAllowed([ago(100), ago(200), ago(300), ago(400), ago(500)], now), { ok: false, reason: 'too_many' });
  assertEquals(sendAllowed([ago(4000), ago(4100), ago(4200), ago(4300), ago(4400)], now).ok, true);
});

Deno.test('code email shows the code and escapes the name', () => {
  const m = signinCodeEmail('<Dr. Test>', '042817');
  assertStringIncludes(m.text, '042817');
  assertStringIncludes(m.html, '042817');
  assertStringIncludes(m.html, '&lt;Dr. Test&gt;');
  assertEquals(m.subject.includes('042817'), false);
});
