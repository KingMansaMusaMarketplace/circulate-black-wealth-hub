import { compileHelpQuestion, validSelection } from '../_shared/clinical-help-intake.ts';
import { sealReply, readHelpHistory } from '../_shared/clinical-help-history.ts';
import { helpGatewayFailure } from '../_shared/clinical-help-errors.ts';
function assert(value: unknown, message: string) { if (!value) throw Error(message); }
Deno.test('product question compiles to server catalog choices only', () => {
  assert(validSelection(compileHelpQuestion('How does chart preparation work?')), 'Expected product choice');
  for (const text of ['Jane has chest pain', 'notes for patient Jane', 'notes https://example.com', 'notes case 123']) assert(compileHelpQuestion(text) === null, 'Unsafe question accepted');
});
Deno.test('assistant history requires viewer-bound signatures', async () => {
  const selection = { topics: ['notes'], intent: 'steps' as const };
  const reply = await sealReply('sample-viewer', selection, 'Fictional sources only.');
  assert((await readHelpHistory([{ selection, reply }, { selection }], 'sample-viewer')).length === 3, 'History missing');
  let rejected = false;
  try { await readHelpHistory([{ selection, reply }, { selection }], 'other-viewer'); } catch { rejected = true; }
  assert(rejected, 'Cross-viewer history accepted');
});
Deno.test('AI access denials remain terminal and preserve the safe message', () => {
  const failure = helpGatewayFailure(403, { message: 'Provider access denied' });
  assert(failure.status === 403 && failure.paused && failure.message === 'Provider access denied', 'Denial altered');
});