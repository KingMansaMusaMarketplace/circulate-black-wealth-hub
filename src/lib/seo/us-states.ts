// 50 US states + DC for SEO landing pages.
// slug = lowercase URL slug, code = USPS abbreviation, name = full name.

export interface USState {
  slug: string;
  code: string;
  name: string;
}

export const US_STATES: USState[] = [
  { slug: "alabama", code: "AL", name: "Alabama" },
  { slug: "alaska", code: "AK", name: "Alaska" },
  { slug: "arizona", code: "AZ", name: "Arizona" },
  { slug: "arkansas", code: "AR", name: "Arkansas" },
  { slug: "california", code: "CA", name: "California" },
  { slug: "colorado", code: "CO", name: "Colorado" },
  { slug: "connecticut", code: "CT", name: "Connecticut" },
  { slug: "delaware", code: "DE", name: "Delaware" },
  { slug: "district-of-columbia", code: "DC", name: "District of Columbia" },
  { slug: "florida", code: "FL", name: "Florida" },
  { slug: "georgia", code: "GA", name: "Georgia" },
  { slug: "hawaii", code: "HI", name: "Hawaii" },
  { slug: "idaho", code: "ID", name: "Idaho" },
  { slug: "illinois", code: "IL", name: "Illinois" },
  { slug: "indiana", code: "IN", name: "Indiana" },
  { slug: "iowa", code: "IA", name: "Iowa" },
  { slug: "kansas", code: "KS", name: "Kansas" },
  { slug: "kentucky", code: "KY", name: "Kentucky" },
  { slug: "louisiana", code: "LA", name: "Louisiana" },
  { slug: "maine", code: "ME", name: "Maine" },
  { slug: "maryland", code: "MD", name: "Maryland" },
  { slug: "massachusetts", code: "MA", name: "Massachusetts" },
  { slug: "michigan", code: "MI", name: "Michigan" },
  { slug: "minnesota", code: "MN", name: "Minnesota" },
  { slug: "mississippi", code: "MS", name: "Mississippi" },
  { slug: "missouri", code: "MO", name: "Missouri" },
  { slug: "montana", code: "MT", name: "Montana" },
  { slug: "nebraska", code: "NE", name: "Nebraska" },
  { slug: "nevada", code: "NV", name: "Nevada" },
  { slug: "new-hampshire", code: "NH", name: "New Hampshire" },
  { slug: "new-jersey", code: "NJ", name: "New Jersey" },
  { slug: "new-mexico", code: "NM", name: "New Mexico" },
  { slug: "new-york", code: "NY", name: "New York" },
  { slug: "north-carolina", code: "NC", name: "North Carolina" },
  { slug: "north-dakota", code: "ND", name: "North Dakota" },
  { slug: "ohio", code: "OH", name: "Ohio" },
  { slug: "oklahoma", code: "OK", name: "Oklahoma" },
  { slug: "oregon", code: "OR", name: "Oregon" },
  { slug: "pennsylvania", code: "PA", name: "Pennsylvania" },
  { slug: "rhode-island", code: "RI", name: "Rhode Island" },
  { slug: "south-carolina", code: "SC", name: "South Carolina" },
  { slug: "south-dakota", code: "SD", name: "South Dakota" },
  { slug: "tennessee", code: "TN", name: "Tennessee" },
  { slug: "texas", code: "TX", name: "Texas" },
  { slug: "utah", code: "UT", name: "Utah" },
  { slug: "vermont", code: "VT", name: "Vermont" },
  { slug: "virginia", code: "VA", name: "Virginia" },
  { slug: "washington", code: "WA", name: "Washington" },
  { slug: "west-virginia", code: "WV", name: "West Virginia" },
  { slug: "wisconsin", code: "WI", name: "Wisconsin" },
  { slug: "wyoming", code: "WY", name: "Wyoming" },
];

export function getStateBySlug(slug: string): USState | undefined {
  return US_STATES.find((s) => s.slug === slug.toLowerCase());
}
