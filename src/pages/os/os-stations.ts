// Fixed sample content for the 1325 OS walkthrough. Sample business only — no live data.
export interface OsTool { name: string; items: string[]; sample: string }
export interface OsStation { id: string; title: string; summary: string; tools: OsTool[] }

export const SAMPLE_BUSINESS = 'Bronzeville Artisan Roastery & Café (sample)';

export const OS_STATIONS: OsStation[] = [
  { id: 'command', title: 'AI Command & Kayla Autopilot', summary: 'Kayla works around the clock, briefs you every morning and reacts to every event.', tools: [
    { name: 'Kayla — Your AI Employee', items: ['Autonomous task execution', 'Daily briefing & proactive alerts', 'Voice & text interaction', 'Professor-level business expertise'], sample: '14 tasks finished overnight' },
    { name: 'Voice AI Assistant', items: ['Low-latency voice', 'Natural conversation flow', 'Voice commands for tasks', 'Multilingual support'], sample: '"Kayla, what were yesterday’s sales?"' },
    { name: 'Daily Briefing & Alerts', items: ['Revenue & booking summaries', 'New review notifications', 'Upcoming expiration alerts', 'Growth opportunity highlights'], sample: '7:00 AM briefing ready' },
    { name: 'Event-Driven Automation', items: ['Instant reaction to reviews & bookings', 'Automated follow-ups', 'Smart notification routing', '2-minute retry safety net'], sample: '3 follow-ups sent after new bookings' },
  ]},
  { id: 'marketing', title: 'Marketing & Revenue Studio', summary: 'Reviews, reputation, search visibility, social posts and email campaigns in one place.', tools: [
    { name: 'AI Review Responses', items: ['Instant professional responses', 'Sentiment analysis & tone matching', 'Reputation score tracking', 'Escalation for critical feedback'], sample: 'Draft reply ready for a 5-star review' },
    { name: 'SEO Audit & Optimization', items: ['Visibility Score (0–100)', 'Profile completeness analysis', 'Keyword optimization suggestions', 'Local search ranking boosts'], sample: 'Sample visibility score: 88 / 100' },
    { name: 'Reputation Monitoring', items: ['Sentiment trend tracking', 'Competitive benchmarking', 'Alert on negative reviews', 'Monthly reputation reports'], sample: 'Sentiment trend: steady' },
    { name: 'Social Media Content', items: ['Instagram, Facebook, X & LinkedIn', 'Tone & hashtag optimization', 'Seasonal & trending topics', 'One-click copy & post'], sample: '4 weekend posts drafted' },
    { name: 'Email Campaigns', items: ['Customer segment targeting', 'AI-written subject lines & body', 'Campaign performance tracking', 'Drip sequence automation'], sample: '"Fall roast" campaign drafted' },
    { name: 'Auto-Discovery Engine', items: ['Daily discovery of new business listings', 'Multi-page data enrichment', 'Verified website & phone required', 'Global coverage with local focus'], sample: 'New nearby partners suggested' },
  ]},
  { id: 'commerce', title: 'Storefront & Commerce', summary: 'Take payments, reward loyal customers, book appointments and manage stock and prices.', tools: [
    { name: 'QR Payment System', items: ['Unique QR code for your business', 'Customers scan & pay easily', 'Automatic loyalty points', 'Real-time payment tracking'], sample: 'Scan-to-pay code ready' },
    { name: 'Loyalty Engine', items: ['Bronze / Silver / Gold / Platinum tiers', 'Points multipliers (up to 2x)', 'Automated tier progression', '8+ ready-to-use rewards'], sample: '12 customers moved up a tier' },
    { name: 'Online Booking System', items: ['Customers book online anytime', 'Automatic email confirmations', 'Calendar sync & availability', 'Reminders to reduce no-shows'], sample: '6 tastings booked this week' },
    { name: 'Inventory Management', items: ['Real-time stock tracking', 'Low-stock alerts & reorder suggestions', 'Vendor recommendations', 'Cost & margin analysis'], sample: 'Low stock: Ethiopian beans' },
    { name: 'Price Optimization', items: ['Market-based price suggestions', 'Margin impact analysis', 'Seasonal pricing strategies', 'Competitor price benchmarking'], sample: 'Suggested: latte +$0.25' },
  ]},
  { id: 'finance', title: 'CFO & Financial Suite', summary: 'Accounting, cash forecasts, grants, lending, investor and tax readiness.', tools: [
    { name: 'Full Accounting Suite', items: ['Profit & Loss statements', 'Invoice & expense tracking', 'Bank reconciliation', 'Tax rate management'], sample: 'Sample P&L for October ready' },
    { name: 'Cash Flow Forecasting', items: ['30/60/90-day projections', 'Revenue trend analysis', 'Expense pattern detection', 'Cash runway alerts'], sample: 'Sample 90-day projection drawn' },
    { name: 'Grant Matching', items: ['AI-matched grant recommendations', 'Eligibility pre-screening', 'Application deadline tracking', 'Success probability scoring'], sample: 'Sample match: small-business grant' },
    { name: 'Credit & Lending Readiness', items: ['Credit readiness score', 'Document preparation checklist', 'Lender matching suggestions', 'Financial health benchmarks'], sample: 'Checklist: 7 of 10 documents' },
    { name: 'Investment Readiness', items: ['Investor readiness scorecard', 'Pitch deck data preparation', 'Financial ratio benchmarks', 'Growth trajectory analysis'], sample: 'Scorecard drafted' },
    { name: 'Tax Preparation', items: ['Quarterly tax estimates', 'Deduction category tracking', 'Tax document organization', 'Accountant-ready summaries'], sample: 'Quarterly estimate prepared' },
  ]},
  { id: 'operations', title: 'Operations & Legal Vault', summary: 'Documents, contracts, licenses and suppliers — nothing slips through the cracks.', tools: [
    { name: 'Records Management', items: ['Upload & auto-extract details', 'Expiration date monitoring', 'Plain-language document search', 'Compliance alerts'], sample: 'Food license renews in 45 days' },
    { name: 'Legal Templates', items: ['10+ template categories', 'Auto-filled business info', 'Service agreements & NDAs', 'Independent contractor forms'], sample: 'Supplier agreement drafted' },
    { name: 'Compliance Monitoring', items: ['License expiration alerts', 'Permit renewal reminders', 'Regulatory checklist tracking', 'Auto-generated compliance reports'], sample: '2 renewals on the calendar' },
    { name: 'Supplier Diversity Tracking', items: ['Business-to-business matching', 'Diversity spend reporting', 'Supplier performance scores', 'Community economic multiplier'], sample: '3 local suppliers tracked' },
  ]},
  { id: 'community', title: 'Community Wealth & Impact', summary: 'Show customers and partners the good your business does.', tools: [
    { name: 'Community Impact Scorecard', items: ['Community impact score', 'Impact badges & certifications', 'Community engagement metrics', 'Public impact profile'], sample: 'Impact badge earned' },
    { name: 'Business Profile & Directory', items: ['Public business listing', 'Customer reviews & ratings', 'Photo gallery showcase', 'Contact & location info'], sample: 'Listing live in the directory' },
    { name: 'Analytics Dashboard', items: ['Sales & revenue trends', 'Customer behavior analytics', 'Peak hours identification', 'AI-generated recommendations'], sample: 'Busiest hour: 8–9 AM' },
  ]},
];

export const OS_TOOL_COUNT = OS_STATIONS.reduce((n, s) => n + s.tools.length, 0);
