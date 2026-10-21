import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';
import { createDecisionToken, verifyDecisionToken } from './email-decision-token.ts';
const id='00000000-0000-0000-0000-000000000001';
Deno.test('tokens', async () => {
  const t = await createDecisionToken('s','investor',id,'approve');
  assertEquals(await verifyDecisionToken('s','investor',id,'approve',t), true);
  assertEquals(await verifyDecisionToken('s','investor',id,'deny',t), false);
  assertEquals(await verifyDecisionToken('x','investor',id,'approve',t), false);
  assertEquals(await verifyDecisionToken('s','business',id,'approve',t), false);
  assertEquals(await verifyDecisionToken('s','investor',id,'approve',t, Date.now()+15*86400000), false);
});
