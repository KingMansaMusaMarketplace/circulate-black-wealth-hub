# 1325.AI Platform — Technical Scope Document
### For Agency / Development Partner Evaluation

**Prepared by:** Thomas D. Bowling, Inventor & Chief Architect  
**Date:** March 2026  
**Patent Filing:** USPTO 63/969,202  
**Jurisdiction:** Cook County, Illinois  

---

## 1. PLATFORM OVERVIEW

1325.AI (Mansa) is an **Economic Super-App** serving as a multi-tenant vertical marketplace operating system for Black-owned businesses. The platform integrates discovery, transactions, banking, community finance, and gamification into a single ecosystem.

**Live URL:** https://circulate-black-wealth-hub.lovable.app

---

## 2. TECHNOLOGY STACK

| Layer | Technology |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Framer Motion |
| **Backend** | Supabase (PostgreSQL, Auth, Edge Functions, Realtime, Storage) |
| **Payments** | Stripe Connect (marketplace payouts), Stripe Subscriptions |
| **Maps** | Mapbox GL JS (3D directory, geospatial features) |
| **AI — Reasoning** | Google Gemini (Flash/Pro 3) |
| **AI — Voice** | OpenAI GPT-4o Realtime API, Whisper (STT), TTS |
| **AI — Audio** | ElevenLabs (TTS, Music Generation) |
| **Analytics** | PostHog |
| **Mobile** | Capacitor (iOS & Android) |
| **Email** | Resend |

---

## 3. SCALE & COMPLEXITY

| Metric | Count |
|---|---|
| **Database Tables** | 250+ |
| **Edge Functions (Deno)** | 110+ |
| **Patent Claims** | 27 (documented in 180+ page Blue Book) |
| **Third-Party Integrations** | 10+ (Stripe, Mapbox, OpenAI, Gemini, ElevenLabs, Resend, PostHog, Perplexity, Firecrawl, Apple IAP) |

---

## 4. CORE MODULES REQUIRING MAINTENANCE

### 4.1 Business Directory & Discovery
- 3D Mapbox-powered business directory with geospatial search
- Business profiles with verified contact info, reviews, ratings
- Category-based filtering, multi-city support
- HBCU-specific badging and proximity alerts
- Business scraping and lead enrichment pipeline

### 4.2 Payments & Commerce
- Stripe Connect marketplace (7.5% platform commission)
- Booking engine with host payouts
- Corporate sponsorship tiers (Bronze/Silver/Gold/Platinum)
- Subscription management (Apple IAP + Stripe)
- Invoice generation and commission tracking

### 4.3 AI Systems (Patent-Protected)
- **CMAL Engine** — Community Marketplace AI Logic (public API)
- **Economic Karma** — Social scoring with decay algorithms
- **AI Agent** — Rule-based automation for business owners
- **Voice Concierge** — Real-time voice AI assistant (WebSocket bridge)
- **Review Sentiment Analysis** — Automated review processing
- **AI Recommendations** — Personalized business suggestions
- **Business Insights** — AI-generated analytics

### 4.4 Community Finance (Patent-Protected)
- **Susu Circles** — Digital rotating savings with escrow
- **Coalition Points** — Multi-business loyalty system

### 4.5 Sales & Growth Engine
- Sales agent/ambassador management with commission tracking
- B2B business-to-business matching and connections
- External lead discovery, import, enrichment, and invitation
- QR code campaigns and transaction processing
- Partner/Developer API ecosystem with usage-based billing

### 4.6 Admin Dashboard
- User & business management
- Sponsor CRM (Kanban pipeline)
- Fraud detection system
- Notification management (email batching, digests)
- Content moderation and verification workflows

### 4.7 Mobile App
- Capacitor-based iOS & Android builds
- Push notifications, camera, geolocation, haptics
- Apple IAP subscription validation

---

## 5. EDGE FUNCTIONS (110+)

Key categories of the 110+ Supabase Edge Functions:

| Category | Examples | Count |
|---|---|---|
| **AI/ML** | ai-chat, ai-agent, ai-recommendations, compare-businesses, cmal-api, economic-karma, parse-search-query | ~15 |
| **Payments** | create-checkout, create-booking, stripe-webhook, process-referral, create-host-connect-account | ~12 |
| **Email/Notifications** | send-welcome-email, send-booking-confirmation, send-notification-digest, send-bulk-email | ~25 |
| **Voice** | realtime-voice, realtime-token, voice-api, voice-concierge-tools, text-to-speech, transcribe-audio | ~6 |
| **B2B/Leads** | b2b-web-search, b2b-match, auto-enrich-leads, send-b2b-invitation, validate-business-leads | ~8 |
| **Business Operations** | scrape-business-website, generate-business-description, generate-branded-qr, import-businesses-csv | ~15 |
| **Sponsorship** | create-corporate-checkout, calculate-sponsor-impact, send-sponsor-email, update-sponsor-metrics-manual | ~8 |
| **Susu/Finance** | susu-api, susu-escrow, coalition-earn-points | ~3 |
| **Admin/System** | admin-ai-assistant, detect-fraud, fraud-api, generate-sitemap, api-gateway | ~10 |
| **Other** | Apple webhooks, subscription checks, image enhancement, QR processing | ~8+ |

---

## 6. DATABASE ARCHITECTURE

- **250+ PostgreSQL tables** with Row Level Security (RLS) policies
- Key domains: businesses, users, profiles, bookings, payments, reviews, referrals, commissions, susu circles, sponsorships, leads, AI actions, notifications, API keys, developer accounts
- Security-definer functions for role-based access
- Automated triggers for timestamps, audit logging, and cascading updates

---

## 7. ROLES NEEDED

Based on the platform's architecture, three core roles are required:

### Role 1: Full-Stack React/Supabase Developer (Primary)
- React 18 + TypeScript frontend development
- Supabase Edge Functions (Deno/TypeScript)
- PostgreSQL + RLS policy management
- Stripe Connect integration maintenance
- **Estimated:** 80-120 hrs/month

### Role 2: Mobile Developer
- Capacitor builds for iOS & Android
- Native plugin integration (push notifications, camera, etc.)
- App Store / Google Play submission and updates
- **Estimated:** 20-40 hrs/month

### Role 3: DevOps / Backend Engineer
- CI/CD pipeline management
- Supabase infrastructure monitoring
- Performance optimization and scaling
- Security audits and penetration testing
- **Estimated:** 20-40 hrs/month

---

## 8. ONGOING RESPONSIBILITIES

### Weekly
- Bug triage and fixes
- Security patch application
- Performance monitoring review

### Monthly
- Feature releases (as directed)
- Database optimization and query review
- Edge Function performance audit
- Mobile app updates (if applicable)
- Dependency updates

### Quarterly
- Security audit
- Infrastructure scaling review
- API documentation updates
- Disaster recovery testing

---

## 9. INTELLECTUAL PROPERTY NOTICE

This platform contains **27 patent claims** filed under USPTO 63/969,202. All development partners must sign an NDA before receiving codebase access. Key patent-protected systems include:

- CMAL (Community Marketplace AI Logic) Engine
- Economic Karma scoring system
- Susu Digital Circles with escrow
- Multi-tenant marketplace operating system architecture
- Voice AI concierge bridge architecture

**Trade secret protections are governed under Cook County, Illinois jurisdiction.**

---

## 10. BUDGET EXPECTATIONS

| Engagement Level | Monthly Estimate | Scope |
|---|---|---|
| **Maintenance Only** | $3,000 – $5,000 | Bug fixes, security, monitoring |
| **Maintenance + Features** | $8,000 – $15,000 | Above + new feature development |
| **Full Team** | $15,000 – $25,000 | All 3 roles, continuous development |

---

## 11. SECURITY & COMPLIANCE

The platform is built on SOC 2-compliant infrastructure providers and follows industry security best practices. Formal certifications are on the roadmap pending enterprise customer demand.

### Current Security Posture

| Control | Status | Notes |
|---|---|---|
| **Row Level Security (RLS)** | ✅ Active | Enforced across 250+ PostgreSQL tables |
| **Encrypted Secrets Management** | ✅ Active | Supabase Vault + environment-scoped keys |
| **JWT Authentication** | ✅ Active | Supabase Auth with refresh token rotation |
| **Security-Definer Functions** | ✅ Active | Role-based access control (RBAC) |
| **Audit Logging** | ✅ Active | Activity log + auth attempt tracking |
| **Rate Limiting** | ✅ Active | Per-endpoint and per-API-key throttling |
| **Fraud Detection** | ✅ Active | Geospatial + behavioral anomaly detection |
| **HTTPS/TLS** | ✅ Enforced | All traffic encrypted in transit |

### Inherited Compliance (via infrastructure providers)

| Provider | Certifications |
|---|---|
| **Supabase** (Database, Auth, Storage) | SOC 2 Type II, HIPAA-eligible (Enterprise tier) |
| **Stripe** (Payments) | PCI-DSS Level 1, SOC 1/2, ISO 27001 |
| **AWS** (underlying cloud) | SOC 1/2/3, ISO 27001, HIPAA, FedRAMP |
| **Apple / Google** (Mobile) | App Store + Play Store security review |

### Certification Roadmap

| Framework | Current Status | Target Timeline | Estimated Investment |
|---|---|---|---|
| **SOC 2 Type I** | Not started | 3-6 months post-engagement | $30K – $50K |
| **SOC 2 Type II** | Not started | 12-18 months (after Type I) | $50K – $100K |
| **ISO 27001** | Not started | 12 months (parallel track) | $25K – $80K |
| **HIPAA Compliance** | N/A — no PHI stored | On-demand for healthcare clients | Requires Supabase Enterprise BAA |

**Note:** No Protected Health Information (PHI) is currently stored or processed. HIPAA compliance would only be pursued if expanding into healthcare verticals requiring a Business Associate Agreement (BAA).

### Agency Responsibilities (Security)

- Quarterly security audits and penetration testing
- Dependency vulnerability scanning (npm audit, Snyk)
- RLS policy review on schema changes
- Incident response plan maintenance
- Pre-certification readiness assessment (when initiated)

---

## 12. HOW TO RESPOND

Agencies/developers interested in this engagement should provide:

1. **Relevant experience** with React, Supabase, and Stripe Connect
2. **Team composition** and availability
3. **Monthly retainer quote** for each engagement level
4. **References** from similar-scale projects
5. **NDA willingness** before codebase access

**Contact:** Thomas D. Bowling  
**Platform:** https://circulate-black-wealth-hub.lovable.app

---

*This document is confidential and intended for evaluation purposes only.*
