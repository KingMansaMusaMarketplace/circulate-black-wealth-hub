// Corporate Sponsorship Agreement — canonical text used by the online
// signing flow. Bump AGREEMENT_VERSION whenever the wording changes so the
// signature record always points at the exact text the sponsor accepted.

export const AGREEMENT_VERSION = 'v1.0-2026-08';

export interface SponsorTier {
  key: string;
  name: string;
  annualCents: number;
  annualLabel: string;
  description: string;
}

export const SPONSOR_TIERS: SponsorTier[] = [
  {
    key: 'founding_sponsor',
    name: 'Founding Sponsor',
    annualCents: 2100000,
    annualLabel: '$21,000',
    description: 'For regional brands building a community footprint.',
  },
  {
    key: 'bronze',
    name: 'Bronze Partner',
    annualCents: 6000000,
    annualLabel: '$60,000',
    description: 'Foundation-level support for measurable impact.',
  },
  {
    key: 'silver',
    name: 'Silver Partner',
    annualCents: 18000000,
    annualLabel: '$180,000',
    description: 'Elevated visibility and strategic engagement.',
  },
  {
    key: 'gold',
    name: 'Gold Partner',
    annualCents: 30000000,
    annualLabel: '$300,000',
    description: 'Recommended for national brands.',
  },
  {
    key: 'platinum',
    name: 'Platinum Partner',
    annualCents: 60000000,
    annualLabel: '$600,000',
    description: 'Exclusive tier for transformational partners.',
  },
];

export const PAYMENT_SCHEDULES = [
  { key: 'annual', label: 'Annual — one payment', divisor: 1 },
  { key: 'quarterly', label: 'Quarterly — four payments', divisor: 4 },
  { key: 'monthly', label: 'Monthly — twelve payments', divisor: 12 },
] as const;

export type PaymentScheduleKey = (typeof PAYMENT_SCHEDULES)[number]['key'];

export function getTier(key: string): SponsorTier | undefined {
  return SPONSOR_TIERS.find((t) => t.key === key);
}

export function installmentCents(annualCents: number, schedule: PaymentScheduleKey): number {
  const found = PAYMENT_SCHEDULES.find((s) => s.key === schedule);
  return Math.round(annualCents / (found?.divisor ?? 1));
}

export function formatUsd(cents: number): string {
  return `$${(cents / 100).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

export interface AgreementSection {
  heading: string;
  body: string;
}

export const AGREEMENT_SECTIONS: AgreementSection[] = [
  {
    heading: '1. Parties and Scope',
    body: 'This Corporate Sponsorship Agreement ("Agreement") is entered into between 1325.AI (a Mansa Musa Marketplace company) ("1325.AI") and the sponsoring organization identified on the Order Form ("Sponsor"). It governs the sponsorship tier, benefits, and payment terms selected by Sponsor on the Order Form, which is incorporated into this Agreement by reference.',
  },
  {
    heading: '2. Deliverables',
    body: '1325.AI shall provide the benefits associated with the sponsorship tier selected on the Order Form, as described in the Corporate Partnership Prospectus in effect on the date of signature. 1325.AI may substitute a benefit of equal or greater value where a stated benefit becomes impractical, with prior written notice to Sponsor.',
  },
  {
    heading: '3. Term and Renewal',
    body: 'The initial term is twelve (12) months from the date of signature. The Agreement renews automatically for successive twelve-month terms at the then-current rate unless either party gives written notice of non-renewal at least thirty (30) days before the end of the then-current term.',
  },
  {
    heading: '4. Fees and Payment',
    body: 'Sponsor shall pay the amount and on the schedule selected on the Order Form. Invoices are payable net thirty (30) days from the invoice date. Amounts unpaid after the due date may accrue interest at 1.5% per month or the maximum rate permitted by law, whichever is lower. All fees are stated in U.S. dollars and are exclusive of applicable taxes.',
  },
  {
    heading: '5. Brand Usage and Approvals',
    body: 'Each party grants the other a limited, non-exclusive, non-transferable license to use its name, logo, and trademarks solely to perform this Agreement. Neither party may alter the other\u2019s marks. Sponsor shall have a reasonable opportunity to review placements of its marks; approval shall not be unreasonably withheld or delayed.',
  },
  {
    heading: '6. Intellectual Property',
    body: 'All platform technology, software, data models, and related intellectual property remain the exclusive property of 1325.AI, including subject matter disclosed in U.S. Provisional Patent Application No. 63/969,202 \u2014 27 claims pending. Nothing in this Agreement conveys any license to that intellectual property beyond the limited brand license in Section 5.',
  },
  {
    heading: '7. Data and Privacy',
    body: 'Reporting provided to Sponsor consists of aggregated and de-identified metrics. 1325.AI does not sell or transfer personally identifiable information of platform users or listed businesses to Sponsor. Each party shall comply with applicable data protection laws in performing this Agreement.',
  },
  {
    heading: '8. Confidentiality',
    body: 'Each party shall protect the other\u2019s non-public business, technical, and financial information with at least the care it uses for its own confidential information, and shall not disclose it except to personnel and advisors with a need to know who are bound by comparable obligations. These obligations survive termination for three (3) years.',
  },
  {
    heading: '9. Representations and Warranties',
    body: 'Each party represents that it has full authority to enter into this Agreement, that the individual signing is authorized to bind it, and that its performance will not violate any other agreement or applicable law.',
  },
  {
    heading: '10. Termination and Refunds',
    body: 'Either party may terminate for material breach that remains uncured thirty (30) (30) days after written notice. Amounts paid for benefits already delivered are non-refundable. Where 1325.AI terminates without cause, Sponsor shall receive a pro-rata refund of prepaid fees for undelivered benefits.',
  },
  {
    heading: '11. Limitation of Liability and Indemnification',
    body: 'Neither party shall be liable for indirect, incidental, special, or consequential damages. Each party\u2019s aggregate liability arising out of this Agreement shall not exceed the total fees paid by Sponsor in the twelve (12) months preceding the claim. Each party shall indemnify the other against third-party claims arising from its own gross negligence, willful misconduct, or infringement of third-party intellectual property.',
  },
  {
    heading: '12. General',
    body: 'This Agreement is governed by the laws of the State of Illinois, without regard to conflict-of-law principles, and the parties consent to exclusive venue in Cook County, Illinois. This Agreement, together with the Order Form, is the entire agreement between the parties and supersedes prior discussions. Amendments must be in writing. If any provision is held unenforceable, the remainder stays in effect. Neither party may assign this Agreement without the other\u2019s written consent, except to a successor in interest.',
  },
];
