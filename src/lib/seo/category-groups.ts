// SEO category groups: maps high-volume search terms (e.g. "restaurants",
// "hair salons") to the granular business categories used in the database.
// Used by the city+category landing pages and the landing sitemap.

export interface CategoryGroup {
  /** URL slug, e.g. "restaurants" */
  slug: string;
  /** Plural label used in headings, e.g. "Restaurants" */
  label: string;
  /** Singular label for FAQ copy, e.g. "Restaurant" */
  singular: string;
  /** Database category names that belong in this group */
  categories: string[];
}

export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    slug: "restaurants",
    label: "Restaurants",
    singular: "Restaurant",
    categories: [
      "Restaurant",
      "Soul Food Restaurant",
      "Caribbean Restaurant",
      "Jamaican Restaurant",
      "Barbecue Restaurant",
      "African Restaurant",
      "Soul Food Catering",
    ],
  },
  {
    slug: "hair-salons",
    label: "Hair Salons",
    singular: "Hair Salon",
    categories: ["Hair Salon", "Natural Hair Salon", "African Hair Braiding Salon"],
  },
  {
    slug: "barbershops",
    label: "Barbershops",
    singular: "Barbershop",
    categories: ["Barbershop"],
  },
  {
    slug: "nail-salons",
    label: "Nail Salons",
    singular: "Nail Salon",
    categories: ["Nail Salon"],
  },
  {
    slug: "spas",
    label: "Spas & Beauty",
    singular: "Spa",
    categories: ["Day Spa", "Yoga Studio"],
  },
  {
    slug: "coffee-shops",
    label: "Coffee Shops & Cafes",
    singular: "Coffee Shop",
    categories: ["Coffee Shop", "Juice Bar"],
  },
  {
    slug: "contractors",
    label: "Contractors",
    singular: "Contractor",
    categories: [
      "General Contractor",
      "Roofing Contractor",
      "Electrical Contractor",
    ],
  },
  {
    slug: "auto-services",
    label: "Auto Services",
    singular: "Auto Service",
    categories: ["Auto Repair Shop", "Mobile Auto Detailing"],
  },
  {
    slug: "boutiques",
    label: "Clothing Boutiques",
    singular: "Boutique",
    categories: ["Women's Clothing Boutique"],
  },
  {
    slug: "creative-studios",
    label: "Creative & Recording Studios",
    singular: "Studio",
    categories: [
      "Recording Studio",
      "Music Recording Studio",
      "Dance Studio",
      "Tattoo Studio",
    ],
  },
  {
    slug: "real-estate",
    label: "Real Estate",
    singular: "Real Estate Brokerage",
    categories: ["Real Estate Brokerage"],
  },
  {
    slug: "florists",
    label: "Florists",
    singular: "Florist",
    categories: ["Florist"],
  },
  {
    slug: "mental-health",
    label: "Mental Health & Wellness",
    singular: "Mental Health Practice",
    categories: ["Mental Health Counseling Practice"],
  },
];

export function getCategoryGroupBySlug(slug: string): CategoryGroup | undefined {
  return CATEGORY_GROUPS.find((g) => g.slug === slug);
}

// Top US cities (matching slug format from list_landing_cities: slugify(city + '-' + state))
// These are the cities targeted on day one — the sitemap pulls the full list dynamically.
export const TOP_CITY_SLUGS: string[] = [
  "atlanta-ga",
  "chicago-il",
  "new-york-ny",
  "brooklyn-ny",
  "houston-tx",
  "philadelphia-pa",
  "washington-dc",
  "memphis-tn",
  "detroit-mi",
  "los-angeles-ca",
  "baltimore-md",
  "columbus-oh",
  "kansas-city-mo",
  "new-orleans-la",
  "dallas-tx",
  "charlotte-nc",
  "durham-nc",
  "oakland-ca",
  "st-louis-mo",
  "jacksonville-fl",
  "indianapolis-in",
  "birmingham-al",
  "richmond-va",
  "seattle-wa",
  "austin-tx",
];

export function cityLabelFromSlug(slug: string): string {
  // "atlanta-ga" -> "Atlanta, GA"
  const parts = slug.split("-");
  if (parts.length < 2) return slug;
  const state = parts[parts.length - 1].toUpperCase();
  const city = parts
    .slice(0, -1)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
  return `${city}, ${state}`;
}
