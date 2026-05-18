import { Building2, Home, Building, Warehouse, Layers } from "lucide-react";

export type PropertyTypeSlug = "apartments" | "houses" | "condos" | "lofts" | "townhouses";
export type PropertyTypeValue = "apartment" | "house" | "condo" | "loft" | "townhouse";

export interface PropertyTypeDef {
  value: PropertyTypeValue;      // DB value (singular)
  slug: PropertyTypeSlug;        // URL slug (plural)
  label: string;                 // UI label singular
  labelPlural: string;
  icon: typeof Home;
  shortDesc: string;
  seoIntro: (city?: string) => string;
}

export const PROPERTY_TYPES: PropertyTypeDef[] = [
  {
    value: "apartment", slug: "apartments", label: "Apartment", labelPlural: "Apartments", icon: Building2,
    shortDesc: "Units in multi-family buildings",
    seoIntro: (city) =>
      `Browse Black-owned apartments for yearly lease${city ? ` in ${city}` : " nationwide"}. Direct from landlords on Mansa Stays — no broker fees for tenants, Section 8 friendly listings welcome.`,
  },
  {
    value: "house", slug: "houses", label: "House", labelPlural: "Houses", icon: Home,
    shortDesc: "Single-family homes, often with a yard",
    seoIntro: (city) =>
      `Find single-family houses for rent${city ? ` in ${city}` : " across the U.S."} on Mansa Stays. Yearly leases direct from Black-owned property owners — pets often welcome, family-friendly neighborhoods.`,
  },
  {
    value: "condo", slug: "condos", label: "Condo", labelPlural: "Condos", icon: Building,
    shortDesc: "Owner-occupied units with shared amenities",
    seoIntro: (city) =>
      `Lease a condo${city ? ` in ${city}` : " nationwide"} from verified Black-owned landlords. Modern amenities, secure buildings, transparent yearly leases on Mansa Stays.`,
  },
  {
    value: "loft", slug: "lofts", label: "Loft", labelPlural: "Lofts", icon: Layers,
    shortDesc: "Open-plan, often converted industrial spaces",
    seoIntro: (city) =>
      `Rent a loft${city ? ` in ${city}` : ""} on Mansa Stays. Open-concept spaces with high ceilings and exposed brick, leased directly by Black-owned property owners.`,
  },
  {
    value: "townhouse", slug: "townhouses", label: "Townhouse", labelPlural: "Townhouses", icon: Warehouse,
    shortDesc: "Multi-story attached homes",
    seoIntro: (city) =>
      `Townhouses for rent${city ? ` in ${city}` : ""} — multi-level living with private entrances, leased directly by Black-owned landlords on Mansa Stays.`,
  },
];

export const findBySlug = (slug?: string): PropertyTypeDef | null =>
  PROPERTY_TYPES.find((p) => p.slug === slug?.toLowerCase()) || null;

export const findByValue = (value?: string | null): PropertyTypeDef | null =>
  value ? PROPERTY_TYPES.find((p) => p.value === value.toLowerCase()) || null : null;

export const PROPERTY_TYPE_SLUGS = PROPERTY_TYPES.map((p) => p.slug);
