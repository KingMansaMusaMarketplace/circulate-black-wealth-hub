
# EatOkra Partnership Pitch Page Implementation Plan

## Overview
Create a dedicated partnership landing page specifically designed to pitch **EatOkra** on migrating their 22,500+ restaurant listings to the 1325.AI platform. This page will be publicly accessible at `/partner/eatokra` and serve as a comprehensive pitch document that can be shared directly with EatOkra's leadership.

---

## Strategic Approach

### Why EatOkra First?
- **Perfect Vertical Fit**: Restaurant bookings and reservations are the #1 use case for our native Stripe Connect booking system
- **Clear Value Add**: EatOkra currently links to external sites; 1325.AI enables in-platform reservations with 92.5% revenue retention
- **Manageable Scale**: 22,500 listings is substantial but not overwhelming for initial migration
- **Revenue Model Alignment**: Per-transaction booking fees create recurring revenue for both parties

### Core Pitch Themes
1. **From Directory to Transaction Platform**: Transform discovery into direct bookings
2. **Revenue Share Model**: 10% recurring commission on all transactions from migrated businesses
3. **Founding Partner Status**: Locked-in benefits before September 2026 deadline
4. **Technical Migration Support**: Automated import tools and white-glove onboarding

---

## Page Structure

### Section 1: Hero Banner
- Bold headline: "EatOkra + 1325.AI: From Discovery to Direct Revenue"
- Subheadline emphasizing the partnership opportunity
- EatOkra logo placeholder alongside 1325.AI branding
- CTA button: "Schedule a Partnership Call"

### Section 2: The Opportunity (Problem/Solution)
- **Current State**: EatOkra lists 22,500+ restaurants but loses users to external booking platforms (OpenTable, Yelp, Google)
- **Opportunity Cost**: Each external redirect = lost transaction data and potential revenue
- **1325.AI Solution**: Native booking engine keeps users in-platform, captures transaction fees

### Section 3: Feature Comparison Matrix
Styled like existing `PitchSlide8Competitive.tsx` with high-contrast design:

| Feature | EatOkra Today | EatOkra + 1325.AI |
|---------|---------------|-------------------|
| Restaurant Discovery | Yes | Yes |
| Native Booking | No (external links) | Yes (Stripe Connect) |
| Revenue Per Booking | $0 | 7.5% platform fee |
| Partner Revenue Share | N/A | 10% of platform fees |
| Customer Loyalty Tools | No | Yes |
| Real-time Analytics | Limited | Full dashboard |
| Mobile Apps (iOS/Android) | No | Yes |
| Community Finance (Susu) | No | Yes |

### Section 4: Revenue Calculator
Interactive component showing potential earnings:
- Input: Average bookings per restaurant per month
- Input: Average booking value
- Output: Monthly/Annual revenue for EatOkra as partner
- Example: 22,500 restaurants × 10 bookings × $50 avg × 7.5% × 10% = **$84,375/month partner revenue**

### Section 5: Migration Path
Visual timeline showing:
1. **Partnership Agreement** (Week 1)
2. **API Integration** - Firecrawl-powered import of existing listings (Week 2-3)
3. **Business Outreach** - Co-branded emails to restaurant owners (Week 4-6)
4. **Launch** - Full integration with tracking dashboard (Week 7-8)

### Section 6: Partner Benefits Summary
Cards highlighting:
- **$5 per signup bonus** for every restaurant that joins
- **10% recurring revenue share** on all booking fees
- **Founding Partner badge** - permanent recognition
- **Co-branded marketing materials** - generated automatically
- **Dedicated partner dashboard** - real-time analytics

### Section 7: Social Proof / Why Now
- Founding Member deadline urgency (September 2026)
- Current traction metrics from database
- Testimonial placeholder for early partners

### Section 8: Call to Action
- Primary: "Schedule Partnership Discussion" (Calendly or contact form)
- Secondary: "Download Partnership Overview PDF"
- Contact info for partnership inquiries

---

## Technical Implementation

### New Files to Create

```text
src/pages/partners/
├── EatOkraPartnershipPage.tsx    # Main landing page
└── index.ts                       # Exports

src/components/partnerships/
├── PartnershipHero.tsx           # Reusable hero for partner pitches
├── PartnerRevenueCalculator.tsx  # Interactive earnings calculator
├── MigrationTimeline.tsx         # Visual migration steps
├── PartnerComparisonTable.tsx    # Before/after feature matrix
└── index.ts
```

### Route Configuration
Add route in `App.tsx`:
```tsx
<Route path="/partner/eatokra" element={<EatOkraPartnershipPage />} />
```

### Design System
Following existing pitch deck style from `PitchSlide8Competitive.tsx`:
- Background: `bg-black/80` with gradient overlays
- Borders: `border-2 border-mansagold` for emphasis
- Text: High-contrast white and gold typography
- Cards: Glassmorphism effect with backdrop blur
- Animations: Framer Motion entrance animations

### Revenue Calculator Logic
```typescript
interface CalculatorInputs {
  restaurantCount: number;      // Default: 22500
  bookingsPerMonth: number;     // Default: 10
  avgBookingValue: number;      // Default: 50
}

const calculateRevenue = (inputs: CalculatorInputs) => {
  const platformFeeRate = 0.075;  // 7.5%
  const partnerShareRate = 0.10;  // 10% of platform fees
  
  const totalBookingValue = inputs.restaurantCount * inputs.bookingsPerMonth * inputs.avgBookingValue;
  const platformFees = totalBookingValue * platformFeeRate;
  const partnerRevenue = platformFees * partnerShareRate;
  
  return {
    monthly: partnerRevenue,
    annual: partnerRevenue * 12,
    perRestaurant: partnerRevenue / inputs.restaurantCount
  };
};
```

---

## Reusability
This page structure is designed to be templated for other directories:
- `BuyBlackPartnershipPage.tsx`
- `BlackDirectoryPartnershipPage.tsx`
- `OBWSPartnershipPage.tsx`

Each can reuse the same components with customized:
- Logo and branding
- Listing count and vertical focus
- Specific value propositions

---

## Success Metrics
After launch, track:
- Page views and time on page
- CTA button clicks (partnership call scheduling)
- PDF downloads
- Conversion to partnership discussions
