import type { SponsorProspect } from '@/hooks/use-sponsor-crm';

const SIGNATURE = [
  'Thomas D. Bowling',
  'Founder & CEO, 1325.AI, Inc.',
  'Partner@1325.AI · (312) 900-6004 · https://1325.ai',
].join('\n');

const MCP_PARAGRAPH =
  'We also operate a live MCP server — the Model Context Protocol, the standard AI assistants like ChatGPT and Claude use to pull real data. That means our verified businesses, and the sponsors attached to them, are already discoverable inside AI assistants when someone asks for a Black-owned business near them. The system is covered under U.S. Provisional Patent Application No. 63/969,202 — 45 claims pending.';

const PLATFORM_PARAGRAPH =
  '1325.AI is the largest verified directory of Black-owned businesses in the United States — roughly 47,000 live listings across all 50 states, each one ownership-verified rather than self-reported. Owners use the platform for booking, loyalty, payments, and marketing, supported by 42 Agentic AI Employees that handle the back office most small businesses cannot afford to staff.';

export interface SponsorEmail {
  subject: string;
  body: string;
}

interface CustomFields {
  tier?: number;
  owner?: string;
  target_label?: string;
  portal_url?: string;
  phone?: string;
  pitch_angle?: string;
  opening_line?: string;
}

export const getSponsorMeta = (prospect: SponsorProspect): CustomFields =>
  (prospect.custom_fields ?? {}) as CustomFields;

/**
 * Builds the ready-to-send outreach email.
 * The MCP paragraph is only included for Tier 1 targets — for regional
 * and local sponsors it reads as jargon and hurts the pitch.
 */
export const buildSponsorEmail = (prospect: SponsorProspect): SponsorEmail => {
  const meta = getSponsorMeta(prospect);
  const includeMcp = meta.tier === 1;

  const subject = `${prospect.company_name} + 1325.AI — 47,000 verified Black-owned businesses`;

  const paragraphs = [
    'Hello,',
    `I'm Thomas Bowling, founder of 1325.AI. ${meta.opening_line ?? ''}`.trim(),
    PLATFORM_PARAGRAPH,
    ...(includeMcp ? [MCP_PARAGRAPH] : []),
    `I'd like 20 minutes to walk you through a corporate sponsorship that puts ${prospect.company_name} in front of this network year-round, not campaign-by-campaign.`,
    SIGNATURE,
  ];

  return { subject, body: paragraphs.join('\n\n') };
};
