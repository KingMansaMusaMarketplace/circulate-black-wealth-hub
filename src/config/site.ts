/**
 * Centralized site configuration
 * Update these values when rebranding or changing domain
 */
export const siteConfig = {
  // Domain and URLs
  url: 'https://1325.ai',
  domain: '1325.ai',
  
  // Brand identity
  name: '1325.AI',
  tagline: 'Building the Future of Digital Commerce | AI',
  description: 'AI-powered protocol connecting consumers with verified community businesses, enabling wealth circulation and economic empowerment through intelligent discovery and rewards.',
  
  // Infrastructure positioning (Agentic Commerce Protocol)
  infrastructureTagline: 'The Agentic Commerce Protocol for Community Wealth',
  investorDescription: '1325.AI is the agentic commerce protocol — the infrastructure layer where autonomous AI organizations discover, transact, and circulate wealth across an underserved $1.6T market. While 99% of AI companies build assistants, we built the rails AI agents transact on. We own the transaction ledger, the supply chain graph, and the orchestration layer that powers Level 3 AI organizations for every business on the network.',

  // Agentic AI Maturity (Dan Martell's 3 Levels framework)
  agenticMaturity: {
    level1: 'Assistants — single-prompt AI tools (ChatGPT, Claude). 99% of users.',
    level2: 'Agent Operators — autonomous task completion (Manus, Claude Code). 0.3% of users.',
    level3: 'AI Organizations — orchestrated agent teams running entire operations. 0.05% of users. This is where 1325.AI lives.',
  },

  // Architecture Pillars (Protocol stack)
  iaasPillars: {
    infrastructure: ['Agentic Commerce Rails', 'Circulation Protocol', 'Patent-Protected Orchestration'],
    dataPlatform: ['Transaction Ledger', 'Supply Chain Graph', 'Behavioral Intelligence Engine'],
    applications: ['Business AI Org (Kayla + sub-agents)', 'Consumer Discovery Agent', 'Developer Agent Portal'],
  },
  
  // Patent portfolio
  patentPortfolio: {
    claimsCount: 27,
    status: 'Provisional Patent Filed',
    keyProtections: ['Geospatial Fraud Detection', 'B2B Matching Algorithms', 'Voice AI Integration'],
  },
  
  // Legacy brand (for transition period)
  legacyName: 'Mansa Musa Marketplace',
  legacyDomain: 'mansamusamarketplace.com',
  
  // Contact
  supportEmail: 'support@1325.ai',
  contactEmail: 'contact@1325.ai',
  businessEmail: 'business@1325.ai',
  partnershipEmail: 'partners@1325.ai',
  phone: '312.709.6006',
  
  // Social (to be updated)
  social: {
    twitter: 'https://twitter.com/1325ai',
    instagram: 'https://instagram.com/1325ai',
    linkedin: 'https://linkedin.com/company/1325ai',
    youtube: 'https://youtube.com/@1325AI',
  },

  // YouTube channel
  youtube: {
    channelHandle: '@1325AI',
    channelUrl: 'https://youtube.com/@1325AI',
    // Channel ID — resolved at runtime via API key, used by edge function
    channelId: '', // populated when API key is added
  },
  
  // SEO
  seo: {
    title: '1325.AI | The Intelligence Layer for Black Economic Power',
    defaultTitle: '1325.AI',
    titleTemplate: '%s | 1325.AI',
  },
  
  // Founding info
  foundingDate: '2024',
  
  // App info
  app: {
    iosUrl: 'https://apps.apple.com/app/1325-ai',
    androidUrl: 'https://play.google.com/store/apps/details?id=com.1325ai',
  }
} as const;

export type SiteConfig = typeof siteConfig;
