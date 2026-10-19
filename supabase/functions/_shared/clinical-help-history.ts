import { canonicalQuestion, validSelection, type HelpSelection } from './clinical-help-intake.ts';
export type HelpTurn = { selection: HelpSelection; reply?: { text: string; proof: string } };
const encoder = new TextEncoder();
async function signature(key: string, selection: HelpSelection, text: string): Promise<string> {
  const cryptoKey = await crypto.subtle.importKey('raw', encoder.encode(key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const data = encoder.encode(JSON.stringify({ selection, text }));
  return Array.from(new Uint8Array(await crypto.subtle.sign('HMAC', cryptoKey, data)), v => v.toString(16).padStart(2, '0')).join('');
}
export async function sealReply(key: string, selection: HelpSelection, text: string) { return { text, proof: await signature(key, selection, text) }; }
export async function readHelpHistory(value: unknown, key: string) {
  if (!Array.isArray(value) || !value.length || value.length > 40) throw new Error('Invalid product conversation');
  const messages: { role: 'user' | 'assistant'; content: string }[] = [];
  for (let i = 0; i < value.length; i++) {
    const turn = value[i];
    if (!turn || typeof turn !== 'object' || Object.keys(turn).some(k => !['selection','reply'].includes(k)) || !validSelection(turn.selection)) throw new Error('Only product topic choices are accepted');
    messages.push({ role: 'user', content: canonicalQuestion(turn.selection) });
    if (i < value.length - 1 && !turn.reply) throw new Error('Previous answer is incomplete. Clear the conversation before continuing.');
    if (turn.reply) {
      const r = turn.reply;
      if (Object.keys(r).sort().join(',') !== 'proof,text' || typeof r.text !== 'string' || r.text.length > 30000 || typeof r.proof !== 'string' || !/^[a-f0-9]{64}$/.test(r.proof)) throw new Error('Invalid answer receipt');
      const expected = await signature(key, turn.selection, r.text);
      let mismatch = 0;
      for (let j = 0; j < 64; j++) mismatch |= expected.charCodeAt(j) ^ r.proof.charCodeAt(j);
      if (mismatch) throw new Error('Unverified answer history is blocked');
      messages.push({ role: 'assistant', content: r.text });
    }
  }
  if (value[value.length - 1].reply) throw new Error('A new product question is required');
  return messages;
}