/**
 * Corporate sponsor slot capacity.
 *
 * Controls how many partner slots we advertise per tier on the public
 * Sponsor Wall and /sponsors page. Keeping this in config (instead of the
 * database) lets leadership adjust scarcity messaging without a migration.
 */
export type SponsorTier = 'platinum' | 'gold' | 'silver' | 'bronze' | 'founding';

export interface SponsorTierSlot {
  tier: SponsorTier;
  label: string;
  /** Total slots we will ever sell at this tier. */
  maxSlots: number;
  /** Annual commitment, display only. */
  annual: string;
  monthly: string;
  blurb: string;
}

export const SPONSOR_TIER_SLOTS: SponsorTierSlot[] = [
  {
    tier: 'platinum',
    label: 'Platinum Partner',
    maxSlots: 1,
    annual: '$600,000',
    monthly: '$50,000 / month',
    blurb: 'Exclusive homepage takeover and category exclusivity.',
  },
  {
    tier: 'gold',
    label: 'Gold Partner',
    maxSlots: 3,
    annual: '$300,000',
    monthly: '$25,000 / month',
    blurb: 'Premium directory placement and rotating homepage banner.',
  },
  {
    tier: 'silver',
    label: 'Silver Partner',
    maxSlots: 6,
    annual: '$180,000',
    monthly: '$15,000 / month',
    blurb: 'Footer, sidebar and directory placement with monthly features.',
  },
  {
    tier: 'bronze',
    label: 'Bronze Partner',
    maxSlots: 10,
    annual: '$60,000',
    monthly: '$5,000 / month',
    blurb: 'Foundation-level support with monthly impact reporting.',
  },
  {
    tier: 'founding',
    label: 'Founding Sponsor',
    maxSlots: 25,
    annual: '$21,000',
    monthly: '$1,750 / month',
    blurb: 'For regional brands building a community footprint.',
  },
];

/** Never show more than this many "available" tiles in one strip. */
export const MAX_OPEN_TILES_IN_STRIP = 4;

export const getTierSlot = (tier: string) =>
  SPONSOR_TIER_SLOTS.find((t) => t.tier === (tier as SponsorTier));
