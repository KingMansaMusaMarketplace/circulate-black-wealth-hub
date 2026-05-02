/**
 * Lightweight server-side agent router for Kayla's chat.
 *
 * The chat doesn't actually invoke specialist edge functions per
 * request (that would 5x latency), but it CAN reliably tell the
 * frontend which specialists are conceptually contributing to a given
 * answer. This produces the "Coordinating: Kayla · Cash-Flow Analyst…"
 * chips with a server-confirmed, RAG-influenced agent set rather than
 * a pure client guess.
 */

export interface ChipAgent {
  id: string;
  name: string;
}

interface AgentRoute {
  id: string;
  name: string;
  triggers: string[];
}

const ROUTES: AgentRoute[] = [
  { id: "cashflow", name: "Cash-Flow Analyst", triggers: ["cash", "runway", "forecast", "burn", "revenue", "expenses", "profit"] },
  { id: "grants", name: "Grant-Finder", triggers: ["grant", "funding", "capital", "loan", "sba", "cdfi"] },
  { id: "pricing", name: "Pricing Optimizer", triggers: ["price", "pricing", "discount", "margin", "charge"] },
  { id: "segments", name: "Customer Segments", triggers: ["customer", "segment", "audience", "churn", "retention"] },
  { id: "reviews", name: "Review Manager", triggers: ["review", "reputation", "rating", "complaint"] },
  { id: "seo", name: "SEO Specialist", triggers: ["seo", "search ranking", "visibility", "google", "keyword"] },
  { id: "social", name: "Content Creator", triggers: ["post", "social", "instagram", "caption", "tweet", "campaign"] },
  { id: "compliance", name: "Compliance Officer", triggers: ["compliance", "license", "permit", "regulation", "eeo", "ofccp"] },
  { id: "tax", name: "Tax Preparer", triggers: ["tax", "deduction", "filing", "irs", "1099"] },
  { id: "b2b", name: "B2B Scout", triggers: ["partner", "b2b", "collaboration", "supplier", "vendor"] },
  { id: "investor", name: "Investor Readiness", triggers: ["investor", "pitch", "raise", "valuation", "equity"] },
  { id: "inventory", name: "Inventory Manager", triggers: ["inventory", "stock", "sku", "reorder"] },
  { id: "legal", name: "Legal Templates", triggers: ["contract", "nda", "legal agreement", "terms of service"] },
  { id: "loyalty", name: "Loyalty Manager", triggers: ["loyalty", "rewards", "points", "tier"] },
];

export function routeAgents(message: string, max = 3): ChipAgent[] {
  const m = (message || "").toLowerCase();
  const matched = ROUTES.filter((r) => r.triggers.some((t) => m.includes(t)));
  if (matched.length === 0) return [{ id: "kayla", name: "Kayla" }];
  return [
    { id: "kayla", name: "Kayla" },
    ...matched.slice(0, max).map((r) => ({ id: r.id, name: r.name })),
  ];
}
