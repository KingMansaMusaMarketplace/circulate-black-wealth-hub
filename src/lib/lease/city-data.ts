export interface CityData {
  slug: string;       // URL slug (lowercase)
  name: string;       // Display name
  state: string;      // 2-letter
  searchCity: string; // value passed to search RPC
  blurb: string;
  neighborhoods: string[];
  faqs: { q: string; a: string }[];
}

export const LEASE_CITIES: CityData[] = [
  {
    slug: "chicago",
    name: "Chicago",
    state: "IL",
    searchCity: "Chicago",
    blurb:
      "Chicago is one of Mansa Stays' launch cities. We connect renters with Black-owned landlords across the South Side, West Side, and Downtown — yearly leases with transparent terms and no broker fees for tenants.",
    neighborhoods: ["Bronzeville", "Hyde Park", "South Shore", "Pilsen", "Logan Square", "Austin", "Chatham", "Woodlawn"],
    faqs: [
      { q: "What's the average rent in Chicago?", a: "Rents vary widely by neighborhood. South Side and West Side neighborhoods often offer apartments starting around $900–$1,400/mo, while Downtown and North Side units typically range from $1,800 to $3,000+/mo." },
      { q: "Are Section 8 vouchers accepted on Mansa Stays?", a: "Many of our Chicago landlords accept Housing Choice Vouchers (Section 8). Use the 'Section 8 accepted' filter to see them." },
      { q: "How does the $99 success fee work?", a: "Tenants pay nothing to use Mansa Stays. The $99 fee is paid by the landlord only after both parties confirm the lease in-app, and it's fully refundable within 7 days." },
    ],
  },
  {
    slug: "atlanta",
    name: "Atlanta",
    state: "GA",
    searchCity: "Atlanta",
    blurb:
      "Atlanta is one of Mansa Stays' launch cities. From Westside and SWATS to Old Fourth Ward and Decatur, we make it easy to rent direct from Black-owned property owners on yearly leases.",
    neighborhoods: ["West End", "Old Fourth Ward", "East Atlanta", "Kirkwood", "Cascade Heights", "Adamsville", "Edgewood", "Grant Park"],
    faqs: [
      { q: "What's the average rent in Atlanta?", a: "Atlanta rents range from about $1,100/mo for apartments in outer neighborhoods to $2,500+ for in-town units in Midtown, Inman Park, and Buckhead." },
      { q: "Are pets allowed?", a: "Many Atlanta landlords on Mansa Stays allow pets. Use the 'Pets OK' filter and check each listing for pet deposit details." },
      { q: "Is Mansa Stays a real estate broker?", a: "No. Mansa Stays is a listing platform connecting renters directly with landlords. Lease signing, deposits, and background checks are handled by the parties themselves." },
    ],
  },
];

export const findCityBySlug = (slug?: string): CityData | null =>
  LEASE_CITIES.find((c) => c.slug === slug?.toLowerCase()) || null;

export const CITY_SLUGS = LEASE_CITIES.map((c) => c.slug);
