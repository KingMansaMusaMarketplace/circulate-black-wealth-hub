import { PRODUCT_HELP } from './clinical-product-catalog.ts';

export const HELP_INTENTS = ['explain', 'steps', 'limits', 'location', 'compare', 'team'] as const;
export type HelpIntent = typeof HELP_INTENTS[number];
export type HelpSelection = { topics: string[]; intent: HelpIntent };
const words = (text: string) => text.toLowerCase().replace(/1325(?:\.ai)?/g, 'platform').replace(/[’']/g, '').replace(/[^a-z\s-]/g, ' ').split(/[\s-]+/).filter(Boolean);
const aliases: Record<string, string[]> = {
  overview: ['platform', 'emr', 'system', 'features', 'functionality', 'clinical'],
  notes: ['notes', 'note', 'documentation', 'dictation'], review: ['cme', 'review', 'records'],
  charts: ['chart', 'charts', 'evidence'], prep: ['preparation', 'prep'], chronology: ['timeline', 'chronology'],
  team: ['employees', 'agentic', 'team', 'agents'], explorer: ['dataminer', 'explorer', 'search'],
  signoff: ['sign', 'signing', 'signed', 'export', 'pdf', 'report'], account: ['login', 'signin', 'account'],
  access: ['approval', 'access', 'timer', 'minutes', 'extension'], readiness: ['ready', 'readiness', 'hipaa'],
};
const grammar = words('please tell me about what can does do how is are the a an in on of to for with and or it its this that these those you your we our us i my would could should may will be become work works working use using used know knowing explain exactly more detail detailed details all whole everything full features functionality help show find open go get give need want like have has today currently available unavailable live locked planned fictional sample data only versus vs compare comparison different differences difference next then also step steps by why when where which who do not dont cant cannot yes no thanks thank thankyou hello hi kayla doctor doctors nurse nurses staff visitor visitors overview workflows workflow capabilities options screen screens page pages tab tabs button buttons navigation walkthrough guide guides limitations limits status privacy safety sound voice audio speaking talk talking communicate communication answer answers questions question overview employees agentic agents team platform emr clinical system');
const vocabulary = new Set([...grammar, 'walk', 'through', ...PRODUCT_HELP.flatMap(t => words(`${t.feature} ${t.question}`)), ...Object.values(aliases).flat()]);
// A closed product vocabulary, not probabilistic PHI detection. Unknown text is never sent.
const forbidden = /\b(patient|patients|symptom|symptoms|diagnosis|diagnoses|pain|creatinine|dose|dosage|drug|drugs|dob|born|address|phone|email|mrn|ssn|password|token)\b/i;
export function compileHelpQuestion(text: string, previous: string[] = []): HelpSelection | null {
  if (!text.trim() || text.length > 600 || forbidden.test(text)) return null;
  const normalized = text.replace(/1325(?:\.ai)?/gi, 'platform').replace(/\b42\b/g, 'employees');
  if (/[^a-zA-Z\s?.,!‘’'()-]/.test(normalized)) return null;
  const tokens = words(normalized);
  if (!tokens.length || tokens.some(word => !vocabulary.has(word))) return null;
  const scores = PRODUCT_HELP.map(topic => {
    const meaningful = [...words(topic.feature), ...(aliases[topic.id] ?? [])].filter(w => !['clinical', 'ai', 'the', 'and', 'of', 'platform'].includes(w));
    return { id: topic.id, score: tokens.filter(w => meaningful.includes(w)).length };
  }).filter(t => t.score > 0).sort((a, b) => b.score - a.score);
  const topics = scores.length ? scores.slice(0, 3).map(t => t.id) : previous.length ? previous : tokens.some(t => aliases.overview.includes(t)) ? ['overview'] : [];
  if (!topics.length) return null;
  const intent: HelpIntent = tokens.some(t => ['compare','versus','vs','difference','differences'].includes(t)) ? 'compare' : tokens.some(t => ['employees','agentic','agents','team'].includes(t)) ? 'team' : tokens.some(t => ['where','find','open','location'].includes(t)) ? 'location' : tokens.some(t => ['steps','step','how','next','workflow','workflows'].includes(t)) ? 'steps' : tokens.some(t => ['live','locked','available','unavailable','limits','limitations','ready'].includes(t)) ? 'limits' : 'explain';
  return { topics, intent };
}
export function validSelection(value: unknown): value is HelpSelection {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const v = value as Record<string, unknown>;
  return Object.keys(v).sort().join(',') === 'intent,topics' && HELP_INTENTS.includes(v.intent as HelpIntent) && Array.isArray(v.topics) && v.topics.length > 0 && v.topics.length <= 3 && v.topics.every(id => typeof id === 'string' && PRODUCT_HELP.some(t => t.id === id));
}
export function canonicalQuestion(selection: HelpSelection): string {
  const labels: Record<HelpIntent, string> = { explain: 'Explain in detail', steps: 'Explain the step-by-step workflow', limits: 'Explain availability and limitations', location: 'Explain where to find this', compare: 'Compare these product features', team: 'Explain how Kayla coordinates the 42 Agentic AI Employees, without claiming unperformed work' };
  return `${labels[selection.intent]}: ${selection.topics.map(id => PRODUCT_HELP.find(t => t.id === id)?.feature).join(', ')}.`;
}