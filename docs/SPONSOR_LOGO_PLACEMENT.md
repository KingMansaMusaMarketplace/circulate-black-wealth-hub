# Corporate Sponsor Logo Placement System

This document explains how the sponsor logo placement system works and how to integrate it across the platform.

## Overview

The logo placement system displays corporate sponsor logos throughout the platform based on their subscription tier. Higher tiers get more prominent placements and better visual treatment.

## Tier-Based Placements

### Bronze Tier
- **Locations**: Footer only
- **Visual Effect**: Grayscale with opacity (becomes colored on hover)
- **Size**: Small to medium

### Silver Tier
- **Locations**: Footer, Business Directory
- **Visual Effect**: Slightly reduced opacity, full color
- **Size**: Medium

### Gold Tier
- **Locations**: Footer, Business Directory, Sidebar
- **Visual Effect**: Full color with subtle scale on hover
- **Size**: Medium to large

### Platinum Tier
- **Locations**: All placements (Footer, Directory, Sidebar, Homepage, Top Banner)
- **Visual Effect**: Full color, shadow effect, scale animation on hover
- **Size**: Large
- **Special**: Featured in dismissible top banner

## Components

### SponsorLogo
Individual sponsor logo component with tier-based styling.

```tsx
import { SponsorLogo } from '@/components/sponsors/SponsorLogo';

<SponsorLogo
  logoUrl="https://example.com/logo.png"
  companyName="Company Name"
  websiteUrl="https://company.com"
  tier="platinum"
  size="large"
/>
```

**Props:**
- `logoUrl` (string, required): URL to the sponsor's logo image
- `companyName` (string, required): Company name for alt text and title
- `websiteUrl` (string, optional): External link to company website
- `tier` ('bronze' | 'silver' | 'gold' | 'platinum', required): Sponsor tier
- `size` ('small' | 'medium' | 'large', optional): Display size, defaults to 'medium'
- `className` (string, optional): Additional CSS classes

### SponsorLogoGrid
Grid display of active sponsor logos, automatically filtered by tier.

```tsx
import { SponsorLogoGrid } from '@/components/sponsors/SponsorLogoGrid';

<SponsorLogoGrid
  placement="homepage"
  maxLogos={12}
  className="my-8"
/>
```

**Props:**
- `placement` ('homepage' | 'footer' | 'sidebar' | 'directory', required): Where the grid is placed
- `maxLogos` (number, optional): Maximum number of logos to display, defaults to 12
- `className` (string, optional): Additional CSS classes

### SponsorBanner
Top banner featuring platinum/gold tier sponsors (dismissible).

```tsx
import { SponsorBanner } from '@/components/sponsors/SponsorBanner';

<SponsorBanner />
```

**Features:**
- Automatically shows highest-tier sponsor
- User can dismiss (preference saved in localStorage)
- Only shows for platinum and gold tiers
- Auto-refreshes every 10 minutes

## Integration Examples

### Homepage
```tsx
import { SponsorBanner } from '@/components/sponsors/SponsorBanner';
import { SponsorLogoGrid } from '@/components/sponsors/SponsorLogoGrid';

export default function HomePage() {
  return (
    <>
      <SponsorBanner />
      <main>
        {/* Your homepage content */}
        
        <section className="py-16">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-8">
              Our Corporate Partners
            </h2>
            <SponsorLogoGrid
              placement="homepage"
              maxLogos={8}
            />
          </div>
        </section>
      </main>
    </>
  );
}
```

### Footer
```tsx
import { SponsorLogoGrid } from '@/components/sponsors/SponsorLogoGrid';

export function Footer() {
  return (
    <footer className="bg-muted py-8">
      <div className="container">
        <SponsorLogoGrid
          placement="footer"
          maxLogos={16}
        />
        {/* Other footer content */}
      </div>
    </footer>
  );
}
```

### Business Directory Sidebar
```tsx
import { SponsorLogoGrid } from '@/components/sponsors/SponsorLogoGrid';

export function DirectorySidebar() {
  return (
    <aside className="w-64 space-y-6">
      <div>
        <h3 className="font-semibold mb-4">Filters</h3>
        {/* Filter components */}
      </div>
      
      <div>
        <SponsorLogoGrid
          placement="sidebar"
          maxLogos={6}
        />
      </div>
    </aside>
  );
}
```

## Custom Hook

### useSponsorBenefits
Access sponsor benefits and placement information.

```tsx
import { useSponsorBenefits, getLogoPlacementsByTier } from '@/hooks/use-sponsor-benefits';

const { data: benefits } = useSponsorBenefits(subscriptionId);
const placements = getLogoPlacementsByTier('platinum');
// ['footer', 'directory', 'sidebar', 'homepage', 'banner']
```

## Data Requirements

### Corporate Subscriptions Table
Sponsors need the following fields:
- `logo_url`: Direct URL to their logo image (required for display)
- `company_name`: Company name
- `website_url`: External link (optional)
- `tier`: Subscription tier (bronze/silver/gold/platinum)
- `status`: Must be 'active' to show

### Logo Upload
Logos should be uploaded to Supabase Storage:

```typescript
const { data, error } = await supabase.storage
  .from('sponsor-logos')
  .upload(`${subscriptionId}/logo.png`, logoFile, {
    contentType: 'image/png',
    upsert: true,
  });

// Get public URL
const { data: publicUrl } = supabase.storage
  .from('sponsor-logos')
  .getPublicUrl(`${subscriptionId}/logo.png`);
```

## Logo Guidelines for Sponsors

**Format:**
- PNG with transparent background (preferred)
- SVG (acceptable)
- JPG with white background (acceptable)

**Dimensions:**
- Minimum: 400px width
- Maximum: 2000px width
- Maintain aspect ratio
- Recommended: 1200px × 400px (3:1 ratio)

**File Size:**
- Maximum: 500KB
- Optimized for web

**Content:**
- Company logo only
- No taglines or additional text
- High contrast for visibility

## Performance Considerations

- Logos are lazy-loaded using native browser `loading="lazy"`
- Logo grid data is cached for 5 minutes
- Banner data is cached for 10 minutes
- Only active sponsors are queried
- Logos are sorted by tier for optimal display

## Accessibility

- All logos include proper `alt` text with company name
- Links include `title` attributes
- Keyboard navigation supported
- External links include `rel="noopener noreferrer sponsored"`

## SEO

- Sponsor links are marked with `rel="sponsored"` for search engines
- Logo images use descriptive alt text
- External links open in new tabs

## Testing

```tsx
// Test with mock data
const mockSponsors = [
  {
    id: '1',
    company_name: 'Test Company',
    tier: 'platinum',
    logo_url: 'https://example.com/logo.png',
    website_url: 'https://example.com',
  },
];
```

## Troubleshooting

### Logos not appearing
1. Check sponsor status is 'active'
2. Verify logo_url is valid and accessible
3. Check browser console for errors
4. Verify Supabase RLS policies allow reading corporate_subscriptions

### Wrong tier styling
1. Ensure tier value matches exactly: 'bronze', 'silver', 'gold', 'platinum'
2. Check CSS classes are loading correctly

### Banner not showing
1. Only platinum/gold tiers show banner
2. Check if user dismissed it (clear localStorage)
3. Verify query is returning data
