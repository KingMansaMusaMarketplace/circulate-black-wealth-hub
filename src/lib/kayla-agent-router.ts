/**
 * Lightweight client-side router that maps a user message to the Kayla
 * agents most likely to be relevant, so the chat UI can show
 * orchestrator chips ("Coordinating: Cash-Flow · Grant-Finder…") while
 * the backend streams the response.
 *
 * This is intentionally heuristic — the real orchestration happens
 * server-side. The chips are a UX signal that a *team* is at work.
 */

export interface AgentRoute {
  id: string;
  name: string;
  /** lowercase keyword/phrase triggers */
  triggers: string[];
}

const ROUTES: AgentRoute[] = [
  { id: 'cashflow', name: 'Cash-Flow Analyst', triggers: ['cash', 'runway', 'forecast', 'burn', 'revenue', 'expenses'] },
  { id: 'grants', name: 'Grant-Finder', triggers: ['grant', 'funding', 'capital', 'loan', 'sba'] },
  { id: 'pricing', name: 'Pricing Optimizer', triggers: ['price', 'pricing', 'discount', 'margin', 'charge'] },
  { id: 'segments', name: 'Customer Segments', triggers: ['customer', 'segment', 'audience', 'churn', 'retention'] },
  { id: 'reviews', name: 'Review Manager', triggers: ['review', 'reputation', 'rating', 'feedback from customer', 'complaint'] },
  { id: 'seo', name: 'SEO Specialist', triggers: ['seo', 'search', 'visibility', 'google', 'keyword'] },
  { id: 'social', name: 'Content Creator', triggers: ['post', 'social', 'instagram', 'caption', 'tweet', 'campaign'] },
  { id: 'compliance', name: 'Compliance Officer', triggers: ['compliance', 'license', 'permit', 'regulation', 'eeo'] },
  { id: 'tax', name: 'Tax Preparer', triggers: ['tax', 'deduction', 'filing', 'irs', '1099'] },
  { id: 'b2b', name: 'B2B Scout', triggers: ['partner', 'b2b', 'collaboration', 'supplier', 'vendor'] },
  { id: 'investor', name: 'Investor Readiness', triggers: ['investor', 'pitch', 'raise', 'valuation', 'equity'] },
  { id: 'inventory', name: 'Inventory Manager', triggers: ['inventory', 'stock', 'sku', 'reorder'] },
  { id: 'legal', name: 'Legal Templates', triggers: ['contract', 'nda', 'legal', 'agreement', 'terms'] },
  { id: 'loyalty', name: 'Loyalty Manager', triggers: ['loyalty', 'rewards', 'points', 'tier'] },
];

export function routeAgents(message: string, max = 3): { id: string; name: string }[] {
  const m = message.toLowerCase();
  const matched = ROUTES.filter(r => r.triggers.some(t => m.includes(t)));
  // Always include Kayla as the orchestrator if any specialist matched.
  if (matched.length === 0) return [{ id: 'kayla', name: 'Kayla' }];
  return [{ id: 'kayla', name: 'Kayla' }, ...matched.slice(0, max).map(r => ({ id: r.id, name: r.name }))];
}
