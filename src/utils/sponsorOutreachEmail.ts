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

/** Which message in the 3-touch cadence to generate. */
export type OutreachTouch = 1 | 2 | 3;

export const OUTREACH_TOUCHES: { touch: OutreachTouch; label: string; hint: string }[] = [
  { touch: 1, label: 'Touch 1 — Intro', hint: 'First contact. Who we are and the ask for 20 minutes.' },
  { touch: 2, label: 'Touch 2 — Value', hint: 'Send 5–7 business days later. Adds proof and a concrete offer.' },
  { touch: 3, label: 'Touch 3 — Close out', hint: 'Send 10–14 days after touch 2. Polite break-up that often gets a reply.' },
];

interface CustomFields {
  tier?: number;
  owner?: string;
  target_label?: string;
  portal_url?: string;
  phone?: string;
  pitch_angle?: string;
  opening_line?: string;
  touch_count?: number;
  last_touch_at?: string;
}

export const getSponsorMeta = (prospect: SponsorProspect): CustomFields =>
  (prospect.custom_fields ?? {}) as CustomFields;

/** How many outreach messages have already gone out to this prospect. */
export const getTouchCount = (prospect: SponsorProspect): number =>
  Number(getSponsorMeta(prospect).touch_count ?? 0);

/** The touch we recommend sending next (capped at 3). */
export const getNextTouch = (prospect: SponsorProspect): OutreachTouch => {
  const sent = getTouchCount(prospect);
  return (Math.min(sent + 1, 3) as OutreachTouch) || 1;
};

/**
 * Builds a ready-to-send outreach email for a given touch in the cadence.
 * The MCP paragraph is only included for Tier 1 targets — for regional
 * and local sponsors it reads as jargon and hurts the pitch.
 */
export const buildSponsorEmail = (
  prospect: SponsorProspect,
  touch: OutreachTouch = 1,
): SponsorEmail => {
  const meta = getSponsorMeta(prospect);
  const includeMcp = meta.tier === 1;
  const company = prospect.company_name;
  const greeting = prospect.primary_contact_name
    ? `Hello ${prospect.primary_contact_name.split(' ')[0]},`
    : 'Hello,';

  if (touch === 2) {
    return {
      subject: `Following up — ${company} + 1325.AI`,
      body: [
        greeting,
        `I reached out last week about a corporate sponsorship with 1325.AI and wanted to add the part that usually matters most.`,
        'Sponsorship is not a logo placement. Every partner gets a named placement on the Sponsor Wall, category presence across the directory, a quarterly community impact report with real numbers (businesses reached, dollars circulated, engagement by market), and co-branded campaigns we build and run for you.',
        ...(includeMcp ? [MCP_PARAGRAPH] : []),
        `Founding Sponsor commitments start at $21,000 for the year. If ${company} is interested, I can send the one-page prospectus or hold 20 minutes this week or next.`,
        SIGNATURE,
      ].join('\n\n'),
    };
  }

  if (touch === 3) {
    return {
      subject: `Closing the loop — ${company} + 1325.AI`,
      body: [
        greeting,
        `I have written twice about a sponsorship with 1325.AI and do not want to keep filling your inbox, so this is my last note on it.`,
        `If the timing is wrong, that is completely fine — just tell me when to circle back, or point me to whoever owns community and supplier-diversity partnerships at ${company} and I will take it from there.`,
        'If it is worth a look, reply with a day and I will send an invite. Either way, thank you for the time.',
        SIGNATURE,
      ].join('\n\n'),
    };
  }

  return {
    subject: `${company} + 1325.AI — 47,000 verified Black-owned businesses`,
    body: [
      greeting,
      `I'm Thomas Bowling, founder of 1325.AI. ${meta.opening_line ?? ''}`.trim(),
      PLATFORM_PARAGRAPH,
      ...(includeMcp ? [MCP_PARAGRAPH] : []),
      `I'd like 20 minutes to walk you through a corporate sponsorship that puts ${company} in front of this network year-round, not campaign-by-campaign.`,
      SIGNATURE,
    ].join('\n\n'),
  };
};
