/**
 * The 50+ main category groups used to browse the directory.
 *
 * Every business keeps its own specific category text (e.g. "Natural Hair
 * Braiding Salon"); these groups are what people browse by so the directory
 * stays usable as it grows past 200,000 listings.
 *
 * The `name` values MUST match public.resolve_category_group() in the database.
 */

export interface CategoryGroup {
  name: string;
  icon: string;
}

export const CATEGORY_GROUPS: CategoryGroup[] = [
  { name: 'Restaurants & Food', icon: '🍽️' },
  { name: 'Bars & Nightlife', icon: '🍸' },
  { name: 'Coffee, Tea & Juice', icon: '☕' },
  { name: 'Bakeries & Desserts', icon: '🧁' },
  { name: 'Catering & Food Trucks', icon: '🚚' },
  { name: 'Grocery & Markets', icon: '🛒' },
  { name: 'Hair Salons', icon: '💇🏾' },
  { name: 'Barbershops', icon: '💈' },
  { name: 'Nail & Lash', icon: '💅🏾' },
  { name: 'Skin, Spa & Massage', icon: '🧖🏾' },
  { name: 'Beauty & Cosmetics', icon: '💄' },
  { name: 'Health & Medical', icon: '🩺' },
  { name: 'Dental', icon: '🦷' },
  { name: 'Mental Health & Counseling', icon: '🧠' },
  { name: 'Pharmacy & Wellness', icon: '💊' },
  { name: 'Fitness & Studios', icon: '🏋🏾' },
  { name: 'Pets & Veterinary', icon: '🐾' },
  { name: 'Home Improvement & Contractors', icon: '🔨' },
  { name: 'Plumbing, HVAC & Electrical', icon: '🔧' },
  { name: 'Cleaning Services', icon: '🧽' },
  { name: 'Landscaping & Lawn', icon: '🌿' },
  { name: 'Moving & Storage', icon: '📦' },
  { name: 'Construction & Development', icon: '🏗️' },
  { name: 'Real Estate', icon: '🏠' },
  { name: 'Automotive Repair', icon: '🔩' },
  { name: 'Auto Sales & Transportation', icon: '🚗' },
  { name: 'Trucking & Logistics', icon: '🚛' },
  { name: 'Legal Services', icon: '⚖️' },
  { name: 'Accounting & Tax', icon: '🧾' },
  { name: 'Financial Services & Insurance', icon: '📈' },
  { name: 'Banking & Credit', icon: '🏦' },
  { name: 'Business Consulting', icon: '💼' },
  { name: 'Marketing & Advertising', icon: '📣' },
  { name: 'Technology & IT', icon: '💻' },
  { name: 'Photography & Video', icon: '📷' },
  { name: 'Media & Publishing', icon: '📰' },
  { name: 'Music & Entertainment', icon: '🎤' },
  { name: 'Arts & Galleries', icon: '🎨' },
  { name: 'Events & Venues', icon: '🎉' },
  { name: 'Fashion & Apparel', icon: '👗' },
  { name: 'Jewelry & Accessories', icon: '💍' },
  { name: 'Retail & Shopping', icon: '🛍️' },
  { name: 'Books, Print & Signage', icon: '📚' },
  { name: 'Education & Tutoring', icon: '🎓' },
  { name: 'Childcare & Youth Programs', icon: '🧒🏾' },
  { name: 'Churches & Faith', icon: '⛪' },
  { name: 'Nonprofits & Community', icon: '🤝🏾' },
  { name: 'Farms & Agriculture', icon: '🌾' },
  { name: 'Travel & Hospitality', icon: '✈️' },
  { name: 'Funeral & Memorial', icon: '🕊️' },
  { name: 'Laundry & Repair', icon: '🧺' },
  { name: 'Security Services', icon: '🛡️' },
  { name: 'Professional & Other Services', icon: '🏢' },
];

export const GROUP_ICONS: Record<string, string> = CATEGORY_GROUPS.reduce(
  (acc, g) => {
    acc[g.name] = g.icon;
    return acc;
  },
  {} as Record<string, string>
);

export const getGroupIcon = (group?: string | null): string =>
  (group && GROUP_ICONS[group]) || '🏢';

/** Friendly country names for the places people can browse. */
export const COUNTRY_NAMES: Record<string, string> = {
  US: 'United States',
  CA: 'Canada',
  GB: 'United Kingdom',
  JM: 'Jamaica',
  BS: 'Bahamas',
  TT: 'Trinidad & Tobago',
  BB: 'Barbados',
  HT: 'Haiti',
  GH: 'Ghana',
  NG: 'Nigeria',
  BM: 'Bermuda',
  AG: 'Antigua & Barbuda',
  TC: 'Turks & Caicos',
  LC: 'Saint Lucia',
  GD: 'Grenada',
  CW: 'Curaçao',
  KN: 'Saint Kitts & Nevis',
  BZ: 'Belize',
  DO: 'Dominican Republic',
  VG: 'British Virgin Islands',
  MX: 'Mexico',
  OTHER: 'Other countries & territories',
};

export const getCountryName = (code?: string | null): string =>
  (code && COUNTRY_NAMES[code]) || code || 'Unknown';

/** US state / territory codes to full names, plus Canadian provinces. */
export const STATE_NAMES: Record<string, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia',
  HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
  KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
  MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri',
  MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey',
  NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio',
  OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina',
  SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont',
  VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
  DC: 'Washington, D.C.', PR: 'Puerto Rico', VI: 'U.S. Virgin Islands', GU: 'Guam',
  ON: 'Ontario', QC: 'Quebec', BC: 'British Columbia', AB: 'Alberta', MB: 'Manitoba',
  NS: 'Nova Scotia', SK: 'Saskatchewan', NB: 'New Brunswick',
};

export const getStateName = (code?: string | null): string =>
  (code && STATE_NAMES[code]) || code || '';

/** US regions so 50 states stay browsable on a phone. */
export const US_REGIONS: { name: string; states: string[] }[] = [
  { name: 'South', states: ['AL', 'AR', 'DC', 'DE', 'FL', 'GA', 'KY', 'LA', 'MD', 'MS', 'NC', 'OK', 'SC', 'TN', 'TX', 'VA', 'WV'] },
  { name: 'Midwest', states: ['IA', 'IL', 'IN', 'KS', 'MI', 'MN', 'MO', 'ND', 'NE', 'OH', 'SD', 'WI'] },
  { name: 'Northeast', states: ['CT', 'MA', 'ME', 'NH', 'NJ', 'NY', 'PA', 'RI', 'VT'] },
  { name: 'West', states: ['AK', 'AZ', 'CA', 'CO', 'HI', 'ID', 'MT', 'NM', 'NV', 'OR', 'UT', 'WA', 'WY'] },
  { name: 'Territories', states: ['PR', 'VI', 'GU'] },
];

export const getRegionForState = (code?: string | null): string | undefined =>
  US_REGIONS.find((r) => code && r.states.includes(code))?.name;
