# 1325.AI PLATFORM BLUE BOOK
## Technical Reference Manual

---

**Document Classification:** Internal Technical Documentation  
**Version:** 1.0.0  
**Publication Date:** January 29, 2026  
**Author:** 1325.AI Engineering Team  
**Patent Reference:** USPTO Provisional Application 63/969,202  

---

# EXECUTIVE SUMMARY

1325.AI is a comprehensive multi-tenant vertical marketplace operating system designed to support community-focused businesses through an integrated ecosystem of patented technologies. This Blue Book serves as the definitive technical reference for all platform systems, covering architecture, implementation details, API specifications, and operational procedures.

The platform implements 27 patent-protected innovations spanning economic circulation tracking, coalition loyalty networks, AI-powered services, fraud detection, and community finance instruments. This manual documents every major subsystem from both frontend and backend perspectives.

---

# TABLE OF CONTENTS

1. [Platform Architecture Overview](#1-platform-architecture-overview)
2. [Database Schema and Data Model](#2-database-schema-and-data-model)
3. [Authentication and Security](#3-authentication-and-security)
4. [Core Business Directory System](#4-core-business-directory-system)
5. [Coalition Loyalty Program (Claims 3, 17)](#5-coalition-loyalty-program)
6. [Economic Circulation Multiplier Attribution Logic - CMAL (Claim 2)](#6-cmal-engine)
7. [Temporal Founding Member System (Claim 1)](#7-temporal-founding-member-system)
8. [QR Transaction Processing (Claim 9, 17)](#8-qr-transaction-processing)
9. [Fraud Detection Engine (Claim 4)](#9-fraud-detection-engine)
10. [Voice AI Concierge - Kayla (Claims 6, 11, 12)](#10-voice-ai-concierge)
11. [B2B Matching Engine (Claim 5)](#11-b2b-matching-engine)
12. [Sales Agent Network (Claim 7)](#12-sales-agent-network)
13. [Partner Referral System (Claims 21-27)](#13-partner-referral-system)
14. [Developer Platform & API Licensing](#14-developer-platform)
15. [Susu Community Finance Protocol (Claim 15)](#15-susu-protocol)
16. [Economic Karma System (Claim 14)](#16-economic-karma-system)
17. [Gamification & Achievements (Claim 8)](#17-gamification-system)
18. [Corporate Sponsorship Program](#18-corporate-sponsorship)
19. [AI Recommendation Engine (Claim 10)](#19-ai-recommendation-engine)
20. [Notification & Email Systems](#20-notification-systems)
21. [Mobile Application (Capacitor)](#21-mobile-application)
22. [Admin Dashboard & Tools](#22-admin-dashboard)
23. [Frontend Component Architecture](#23-frontend-architecture)
24. [Edge Function Reference](#24-edge-function-reference)
25. [Deployment & Operations](#25-deployment-operations)
26. [Patent Claims Summary](#26-patent-claims-summary)
27. [Appendices](#27-appendices)

---

# 1. PLATFORM ARCHITECTURE OVERVIEW

## 1.1 Technology Stack

### Frontend Layer
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3.1 | UI component library |
| TypeScript | 5.x | Type-safe JavaScript |
| Vite | 5.x | Build tool and dev server |
| TailwindCSS | 3.x | Utility-first CSS framework |
| shadcn/ui | Latest | Pre-built accessible components |
| Framer Motion | 12.10.0 | Animation library |
| TanStack Query | 5.56.2 | Server state management |
| React Router | 6.26.2 | Client-side routing |

### Backend Layer
| Technology | Version | Purpose |
|------------|---------|---------|
| Supabase | Latest | Backend-as-a-Service |
| PostgreSQL | 15+ | Primary database |
| Deno | 1.x | Edge function runtime |
| Stripe Connect | Latest | Payment processing |
| Mapbox | 3.x | Geolocation services |

### AI/ML Layer
| Technology | Purpose |
|------------|---------|
| OpenAI GPT-4o | Chat and analysis |
| OpenAI Realtime API | Voice interactions |
| Google Gemini 2.5 Flash | Fast inference |
| OpenAI Whisper | Speech-to-text |

### Mobile Layer
| Technology | Version | Purpose |
|------------|---------|---------|
| Capacitor | 7.4.3 | Native iOS/Android wrapper |
| Capacitor Plugins | 7.x | Native device access |

## 1.2 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Web App   │  │  iOS App    │  │ Android App │  │  Voice UI   │        │
│  │   (React)   │  │ (Capacitor) │  │ (Capacitor) │  │ (WebSocket) │        │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘        │
└─────────┼────────────────┼────────────────┼────────────────┼────────────────┘
          │                │                │                │
          ▼                ▼                ▼                ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API LAYER                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                     Supabase Edge Functions                           │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │   │
│  │  │ CMAL API │ │Voice API │ │ Susu API │ │Fraud API │ │Gateway   │   │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘   │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │   │
│  │  │ Auth     │ │ Payments │ │ Email    │ │ AI/ML    │ │ Webhooks │   │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘   │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
          │                                                    │
          ▼                                                    ▼
┌─────────────────────────────────┐    ┌──────────────────────────────────────┐
│         DATA LAYER              │    │           EXTERNAL SERVICES          │
├─────────────────────────────────┤    ├──────────────────────────────────────┤
│  ┌─────────────────────────┐    │    │  ┌────────────┐  ┌────────────┐      │
│  │   PostgreSQL Database   │    │    │  │   Stripe   │  │   OpenAI   │      │
│  │   - Businesses          │    │    │  │  Connect   │  │  Realtime  │      │
│  │   - Users/Profiles      │    │    │  └────────────┘  └────────────┘      │
│  │   - Transactions        │    │    │  ┌────────────┐  ┌────────────┐      │
│  │   - Coalition Points    │    │    │  │   Resend   │  │   Mapbox   │      │
│  │   - Fraud Alerts        │    │    │  │   Email    │  │    Maps    │      │
│  └─────────────────────────┘    │    │  └────────────┘  └────────────┘      │
│  ┌─────────────────────────┐    │    │  ┌────────────┐  ┌────────────┐      │
│  │   Supabase Storage      │    │    │  │  Lovable   │  │  PostHog   │      │
│  │   - Business Images     │    │    │  │ AI Gateway │  │ Analytics  │      │
│  │   - QR Codes            │    │    │  └────────────┘  └────────────┘      │
│  │   - Documents           │    │    │                                      │
│  └─────────────────────────┘    │    │                                      │
└─────────────────────────────────┘    └──────────────────────────────────────┘
```

## 1.3 Project Directory Structure

```
1325.AI/
├── src/
│   ├── components/          # React components (200+ components)
│   │   ├── admin/           # Admin dashboard components
│   │   ├── ai/              # AI chat and recommendation components
│   │   ├── auth/            # Authentication components
│   │   ├── b2b/             # B2B marketplace components
│   │   ├── business/        # Business profile components
│   │   ├── coalition/       # Coalition loyalty components
│   │   ├── developers/      # Developer portal components
│   │   ├── directory/       # Business directory components
│   │   ├── karma/           # Economic karma components
│   │   ├── loyalty/         # Loyalty program components
│   │   ├── partner/         # Partner portal components
│   │   ├── qr/              # QR code components
│   │   ├── sales-agent/     # Sales agent components
│   │   ├── susu/            # Susu circles components
│   │   ├── ui/              # Base UI components (shadcn)
│   │   ├── wallet/          # Digital wallet components
│   │   └── ...              # Other component directories
│   ├── hooks/               # Custom React hooks (90+ hooks)
│   ├── lib/                 # Utility libraries
│   │   ├── api/             # API client functions
│   │   ├── auth/            # Authentication utilities
│   │   ├── security/        # Security utilities
│   │   ├── services/        # Business logic services
│   │   └── utils/           # General utilities
│   ├── pages/               # Route page components (150+ pages)
│   │   ├── admin/           # Admin pages
│   │   ├── business/        # Business pages
│   │   └── developers/      # Developer portal pages
│   ├── contexts/            # React context providers
│   ├── types/               # TypeScript type definitions
│   └── integrations/        # Third-party integrations
│       └── supabase/        # Supabase client and types
├── supabase/
│   ├── functions/           # Edge functions (90+ functions)
│   │   ├── _shared/         # Shared utilities
│   │   ├── cmal-api/        # CMAL Engine API
│   │   ├── voice-api/       # Voice AI API
│   │   ├── susu-api/        # Susu Protocol API
│   │   ├── fraud-api/       # Fraud Detection API
│   │   └── ...              # Other edge functions
│   ├── migrations/          # Database migrations
│   └── config.toml          # Supabase configuration
├── docs/                    # Documentation
├── public/                  # Static assets
└── capacitor/               # Mobile app configuration
```

---

# 2. DATABASE SCHEMA AND DATA MODEL

## 2.1 Core Entity Relationship Overview

The database consists of approximately 80+ tables organized into functional domains:

### 2.1.1 User Domain
- `profiles` - Extended user information linked to auth.users
- `user_roles` - Role-based access control (admin, moderator, user)
- `user_preferences` - User settings and preferences
- `user_achievements` - Achievement unlocks and progress
- `user_streaks` - Activity streak tracking

### 2.1.2 Business Domain
- `businesses` - Core business listings
- `business_hours` - Operating hours
- `business_images` - Photo gallery
- `business_certifications` - Verification documents
- `business_capabilities` - B2B service offerings
- `business_needs` - B2B procurement needs

### 2.1.3 Transaction Domain
- `transactions` - Financial transactions
- `qr_codes` - QR code registry
- `qr_scans` - Scan events with geolocation
- `platform_transactions` - Platform-wide transaction log
- `wallet_transactions` - Digital wallet ledger

### 2.1.4 Loyalty Domain
- `coalition_points` - Customer point balances
- `coalition_transactions` - Point movement audit trail
- `coalition_members` - Participating businesses
- `loyalty_points` - Business-specific loyalty
- `loyalty_rewards` - Reward catalog

### 2.1.5 Agent Domain
- `sales_agents` - Agent profiles
- `referrals` - Referral tracking
- `agent_commissions` - Commission ledger
- `agent_team_overrides` - Multi-level commissions
- `agent_badges` - Gamification badges

### 2.1.6 Partner Domain
- `directory_partners` - Partner directory owners
- `partner_referrals` - Business referrals
- `partner_payouts` - Payout requests
- `technical_partners` - Developer-partners

### 2.1.7 Developer Domain
- `developer_accounts` - Developer profiles
- `api_keys` - API key management
- `api_usage_logs` - Usage tracking
- `api_rate_limits` - Rate limit state

### 2.1.8 Finance Domain
- `susu_circles` - Rotating savings groups
- `susu_memberships` - Circle participants
- `susu_escrow` - Escrow transactions
- `economic_karma` - Karma scores
- `withdrawal_requests` - Cash-out requests

### 2.1.9 AI/Analytics Domain
- `ai_recommendations` - Personalized suggestions
- `fraud_alerts` - Detected anomalies
- `activity_log` - Platform activity
- `sponsor_impact_metrics` - Sponsorship ROI

## 2.2 Key Table Schemas

### 2.2.1 Businesses Table

```sql
CREATE TABLE public.businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id),
  business_name TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  category TEXT NOT NULL,
  subcategory TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  logo_url TEXT,
  cover_image_url TEXT,
  average_rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  verification_level TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  discount_percent INTEGER,
  stripe_account_id TEXT,
  stripe_charges_enabled BOOLEAN DEFAULT false,
  loyalty_enabled BOOLEAN DEFAULT false,
  coalition_member BOOLEAN DEFAULT false,
  points_per_dollar DECIMAL(5,2) DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_businesses_category ON businesses(category);
CREATE INDEX idx_businesses_city_state ON businesses(city, state);
CREATE INDEX idx_businesses_verified ON businesses(is_verified) WHERE is_verified = true;
CREATE INDEX idx_businesses_location ON businesses USING gist (
  ll_to_earth(lat, lng)
) WHERE lat IS NOT NULL AND lng IS NOT NULL;
```

### 2.2.2 Coalition Points Table

```sql
CREATE TABLE public.coalition_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  points INTEGER DEFAULT 0 CHECK (points >= 0),
  lifetime_earned INTEGER DEFAULT 0,
  tier TEXT DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
  tier_updated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Automatic tier promotion trigger
CREATE OR REPLACE FUNCTION public.update_coalition_tier()
RETURNS TRIGGER AS $$
BEGIN
  NEW.tier := CASE
    WHEN NEW.lifetime_earned >= 15000 THEN 'platinum'
    WHEN NEW.lifetime_earned >= 5000 THEN 'gold'
    WHEN NEW.lifetime_earned >= 1000 THEN 'silver'
    ELSE 'bronze'
  END;
  IF NEW.tier != OLD.tier THEN
    NEW.tier_updated_at := now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### 2.2.3 Sales Agents Table

```sql
CREATE TABLE public.sales_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) UNIQUE ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  referral_code TEXT UNIQUE NOT NULL,
  recruited_by_agent_id UUID REFERENCES sales_agents(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'terminated')),
  tier TEXT DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum', 'diamond')),
  commission_rate DECIMAL(5,2) DEFAULT 10.00,
  team_override_rate DECIMAL(5,2) DEFAULT 2.50,
  lifetime_referrals INTEGER DEFAULT 0,
  total_earned DECIMAL(12,2) DEFAULT 0,
  total_pending DECIMAL(12,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  test_passed BOOLEAN DEFAULT false,
  test_score INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 2.2.4 Developer Accounts Table

```sql
CREATE TABLE public.developer_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  company_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  website_url TEXT,
  tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'pro', 'enterprise')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended')),
  monthly_cmal_limit INTEGER DEFAULT 1000,
  monthly_voice_limit INTEGER DEFAULT 100,
  monthly_susu_limit INTEGER DEFAULT 50,
  monthly_fraud_limit INTEGER DEFAULT 100,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id UUID REFERENCES developer_accounts(id) ON DELETE CASCADE,
  name TEXT DEFAULT 'Default Key',
  key_prefix TEXT NOT NULL,  -- First 8 characters
  key_hash TEXT NOT NULL,    -- SHA-256 hash
  environment TEXT DEFAULT 'sandbox' CHECK (environment IN ('sandbox', 'production')),
  scopes TEXT[] DEFAULT ARRAY['cmal', 'voice', 'susu', 'fraud'],
  rate_limit_per_minute INTEGER DEFAULT 60,
  last_used_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

## 2.3 Row-Level Security (RLS) Policies

All tables implement Row-Level Security for data protection:

### 2.3.1 Security Definer Functions

```sql
-- Admin check function (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Business ownership check
CREATE OR REPLACE FUNCTION public.owns_business(_user_id UUID, _business_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.businesses
    WHERE id = _business_id AND owner_id = _user_id
  )
$$;
```

### 2.3.2 Policy Examples

```sql
-- Businesses: Public read, owner write
CREATE POLICY "Verified businesses are publicly visible"
  ON businesses FOR SELECT
  USING (is_verified = true AND is_active = true);

CREATE POLICY "Owners can manage their businesses"
  ON businesses FOR ALL
  USING (auth.uid() = owner_id);

-- Coalition points: Owner only
CREATE POLICY "Users can view their own coalition points"
  ON coalition_points FOR SELECT
  USING (auth.uid() = customer_id);

-- Admin override
CREATE POLICY "Admins have full access"
  ON businesses FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));
```

---

# 3. AUTHENTICATION AND SECURITY

## 3.1 Authentication Flow

The platform uses Supabase Auth with the following providers:

- **Email/Password** - Primary authentication
- **Magic Link** - Passwordless email login
- **Google OAuth** - Social login
- **Phone OTP** - SMS verification (optional)

### 3.1.1 AuthContext Implementation

```typescript
// src/contexts/AuthContext.tsx
interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, metadata?: object) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
}
```

### 3.1.2 Session Management

- JWT tokens with 1-hour expiration
- Automatic token refresh
- Secure cookie storage
- Session persistence across page reloads

## 3.2 Role-Based Access Control

### 3.2.1 Role Hierarchy

```
┌─────────────────────────────────────────┐
│              super_admin                │
│  (Full platform access, all systems)    │
└────────────────────┬────────────────────┘
                     │
┌────────────────────┼────────────────────┐
│                    │                    │
▼                    ▼                    ▼
┌─────────┐    ┌─────────┐    ┌─────────┐
│  admin  │    │moderator│    │  agent  │
└────┬────┘    └────┬────┘    └────┬────┘
     │              │              │
     ▼              ▼              ▼
┌──────────────────────────────────────┐
│            authenticated             │
│      (Standard user access)          │
└──────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────┐
│             anonymous                │
│      (Public read-only access)       │
└──────────────────────────────────────┘
```

### 3.2.2 Permission Matrix

| Feature | Anonymous | User | Agent | Moderator | Admin |
|---------|-----------|------|-------|-----------|-------|
| View businesses | ✓ | ✓ | ✓ | ✓ | ✓ |
| Write reviews | ✗ | ✓ | ✓ | ✓ | ✓ |
| Earn points | ✗ | ✓ | ✓ | ✓ | ✓ |
| Refer businesses | ✗ | ✗ | ✓ | ✓ | ✓ |
| Moderate content | ✗ | ✗ | ✗ | ✓ | ✓ |
| View all users | ✗ | ✗ | ✗ | ✗ | ✓ |
| System settings | ✗ | ✗ | ✗ | ✗ | ✓ |

## 3.3 Security Measures

### 3.3.1 Input Validation

All user inputs are validated using Zod schemas:

```typescript
const businessSchema = z.object({
  business_name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/),
  website: z.string().url().optional(),
  category: z.enum(['restaurant', 'retail', 'services', ...]),
});
```

### 3.3.2 Rate Limiting

Edge functions implement rate limiting:

```typescript
const RATE_LIMITS = {
  anonymous: { requests: 10, window: 60 },
  authenticated: { requests: 60, window: 60 },
  premium: { requests: 200, window: 60 },
};

const rateLimit = new Map<string, { count: number; reset: number }>();
```

### 3.3.3 Fraud Prevention

See Section 9 for the comprehensive fraud detection system.

---

# 4. CORE BUSINESS DIRECTORY SYSTEM

## 4.1 Business Listing Architecture

### 4.1.1 Business Discovery Flow

```
User Search Query
       │
       ▼
┌──────────────────┐
│ Natural Language │
│ Search Parsing   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ PostgreSQL Full  │
│ Text Search      │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Geospatial       │
│ Distance Filter  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Category/Rating  │
│ Filters          │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Personalized     │
│ Ranking (AI)     │
└────────┬─────────┘
         │
         ▼
   Search Results
```

### 4.1.2 Directory API

```typescript
// src/hooks/use-business-directory.ts
interface UseBusinessDirectoryOptions {
  category?: string;
  city?: string;
  state?: string;
  minRating?: number;
  featured?: boolean;
  verified?: boolean;
  nearMe?: boolean;
  lat?: number;
  lng?: number;
  radius?: number; // miles
  searchTerm?: string;
  page?: number;
  pageSize?: number;
  sortBy?: 'rating' | 'distance' | 'name' | 'newest';
}

interface DirectoryResult {
  businesses: Business[];
  totalCount: number;
  totalPages: number;
  categories: string[];
}
```

### 4.1.3 Business Verification Levels

| Level | Requirements | Benefits |
|-------|--------------|----------|
| Unverified | Basic registration | Listed in directory |
| Email Verified | Confirmed email | Contact info visible |
| Phone Verified | SMS confirmation | Priority in search |
| Document Verified | Business license | Verified badge |
| Premium Verified | On-site inspection | Featured placement |

## 4.2 Business Profile Components

### 4.2.1 Key Components

- `BusinessCard.tsx` - Card display in listings
- `BusinessDetailPage.tsx` - Full business profile
- `BusinessDashboardPage.tsx` - Owner dashboard
- `BusinessFormPage.tsx` - Registration/editing
- `BusinessHours.tsx` - Operating hours display
- `BusinessGallery.tsx` - Photo carousel
- `BusinessReviews.tsx` - Review section

### 4.2.2 Business Dashboard Metrics

```typescript
interface BusinessMetrics {
  totalViews: number;
  totalFavorites: number;
  totalReviews: number;
  averageRating: number;
  loyaltyPointsDistributed: number;
  qrScansToday: number;
  revenueThisMonth: number;
  newCustomersThisWeek: number;
}
```

---

# 5. COALITION LOYALTY PROGRAM

**Patent Reference:** Claims 3, 17

## 5.1 Overview

The Coalition Loyalty Network enables cross-business point earning and redemption, creating network effects that benefit the entire ecosystem.

## 5.2 Tier System

| Tier | Points Required | Multiplier | Benefits |
|------|-----------------|------------|----------|
| Bronze | 0 | 1.0x | Base earning |
| Silver | 1,000 | 1.25x | Early access to rewards |
| Gold | 5,000 | 1.5x | VIP events, priority |
| Platinum | 15,000 | 2.0x | Exclusive rewards, concierge |

## 5.3 Points Flow

```
Customer Transaction ($100 at Restaurant)
               │
               ▼
┌─────────────────────────────────┐
│ Base Points: $100 × 10 = 1,000  │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│ Apply Tier Multiplier (Gold)    │
│ 1,000 × 1.5 = 1,500 points      │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│ Check Promo/Bonus Multipliers   │
│ (2x Weekend = 3,000 points)     │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│ Update coalition_points         │
│ Record coalition_transactions   │
│ Check tier promotion            │
└─────────────────────────────────┘
```

## 5.4 Award Points Function

```sql
CREATE OR REPLACE FUNCTION public.award_coalition_points(
  p_customer_id UUID,
  p_business_id UUID,
  p_base_points INTEGER,
  p_description TEXT DEFAULT 'Points earned'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_multiplier DECIMAL(4,2);
  v_tier TEXT;
  v_final_points INTEGER;
  v_new_total INTEGER;
  v_new_lifetime INTEGER;
BEGIN
  -- Get current tier
  SELECT tier INTO v_tier 
  FROM coalition_points 
  WHERE customer_id = p_customer_id;
  
  -- Create record if doesn't exist
  IF v_tier IS NULL THEN
    INSERT INTO coalition_points (customer_id, points, lifetime_earned, tier)
    VALUES (p_customer_id, 0, 0, 'bronze');
    v_tier := 'bronze';
  END IF;
  
  -- Apply tier multiplier
  v_multiplier := CASE v_tier
    WHEN 'platinum' THEN 2.0
    WHEN 'gold' THEN 1.5
    WHEN 'silver' THEN 1.25
    ELSE 1.0
  END;
  
  v_final_points := FLOOR(p_base_points * v_multiplier);
  
  -- Atomic update
  UPDATE coalition_points 
  SET 
    points = points + v_final_points,
    lifetime_earned = lifetime_earned + v_final_points,
    updated_at = now()
  WHERE customer_id = p_customer_id
  RETURNING points, lifetime_earned INTO v_new_total, v_new_lifetime;
  
  -- Record transaction
  INSERT INTO coalition_transactions (
    customer_id, source_business_id, transaction_type, points, description
  ) VALUES (
    p_customer_id, p_business_id, 'earn', v_final_points, p_description
  );
  
  RETURN jsonb_build_object(
    'base_points', p_base_points,
    'multiplier', v_multiplier,
    'final_points', v_final_points,
    'new_total', v_new_total,
    'new_lifetime', v_new_lifetime,
    'tier', v_tier
  );
END;
$$;
```

## 5.5 Cross-Business Redemption

Points earned at any coalition member can be redeemed at any other member:

```typescript
interface RedemptionRequest {
  customerId: string;
  businessId: string; // Where to redeem
  pointsToRedeem: number;
  rewardId?: string; // Optional specific reward
}

interface RedemptionResult {
  success: boolean;
  pointsRedeemed: number;
  newBalance: number;
  redemptionCode: string;
  expiresAt: string;
}
```

---

# 6. CMAL ENGINE

**Patent Reference:** Claim 2

## 6.1 Economic Circulation Multiplier Attribution Logic

The CMAL (Circulatory Multiplier Attribution Logic) engine calculates community economic impact using a proprietary 2.3x multiplier derived from Federal Reserve Bank studies on minority business economics.

## 6.2 Core Formula

```
Economic Impact = Transaction Amount × Base Multiplier × Tier Multiplier × Category Multiplier

Where:
- Base Multiplier = 2.3 (circulation constant)
- Tier Multiplier = 1.0-2.0 (based on user tier)
- Category Multiplier = 0.95-1.35 (based on business category)
```

## 6.3 Category Multipliers

| Category | Multiplier | Rationale |
|----------|------------|-----------|
| Construction | 1.35 | High local labor |
| Manufacturing | 1.30 | Supply chain depth |
| Education | 1.25 | Knowledge retention |
| Healthcare | 1.20 | Essential services |
| Services | 1.15 | Direct employment |
| Restaurant | 1.10 | Food ecosystem |
| Technology | 1.10 | Innovation factor |
| Retail | 1.00 | Baseline |
| Finance | 1.00 | Baseline |
| Entertainment | 0.95 | Discretionary |

## 6.4 API Endpoint

```typescript
// POST /cmal-api/calculate
interface CalculateRequest {
  transaction_amount: number;
  business_category?: string;
  user_tier?: string;
  location?: string;
  metadata?: Record<string, unknown>;
}

interface CalculateResponse {
  original_amount: number;
  multiplied_impact: number;
  circulation_score: number;       // 0-100
  base_multiplier: number;         // 2.3
  tier_multiplier: number;         // 1.0-2.0
  category_multiplier: number;     // 0.95-1.35
  effective_multiplier: number;    // Combined
  attribution: {
    local_retention: number;       // 40% of impact
    community_benefit: number;     // 35% of impact
    economic_velocity: number;     // 25% of impact
  };
  patent_notice: string;
}
```

## 6.5 Attribution Tracking

For multi-business transactions (e.g., supply chains):

```typescript
// POST /cmal-api/attribute
interface AttributeRequest {
  transaction_id: string;
  chain_of_businesses: Array<{
    business_id: string;
    amount: number;
    category?: string;
  }>;
}

interface AttributeResponse {
  transaction_id: string;
  total_circulation: number;
  velocity_score: number;
  attribution_breakdown: Array<{
    business_id: string;
    amount: number;
    impact: number;
    percentage: number;
  }>;
}
```

---

# 7. TEMPORAL FOUNDING MEMBER SYSTEM

**Patent Reference:** Claim 1

## 7.1 Overview

Users who register before March 31, 2026 receive permanent "Founding Member" status with lifetime benefits that cannot be revoked.

## 7.2 Database Implementation

```sql
-- Schema modification
ALTER TABLE public.profiles ADD COLUMN is_founding_member BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN founding_member_since TIMESTAMPTZ;

-- Automatic assignment trigger
CREATE OR REPLACE FUNCTION public.set_founding_member_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_cutoff_timestamp CONSTANT TIMESTAMPTZ := '2026-03-31T23:59:59Z';
BEGIN
  IF NEW.created_at < v_cutoff_timestamp THEN
    NEW.is_founding_member := true;
    NEW.founding_member_since := NEW.created_at;
  END IF;
  RETURN NEW;
END;
$$;

-- Immutability protection
CREATE OR REPLACE FUNCTION public.prevent_founding_member_revocation()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF OLD.is_founding_member = true AND NEW.is_founding_member = false THEN
    RAISE EXCEPTION 'Founding member status cannot be revoked';
  END IF;
  RETURN NEW;
END;
$$;
```

## 7.3 Founding Member Benefits

| Benefit | Description |
|---------|-------------|
| 2x Point Multiplier | Permanent double points on all transactions |
| Priority Support | First in support queue |
| Beta Access | Early access to new features |
| Reduced Fees | Lower platform transaction fees |
| Distinguished Badge | Visual recognition across platform |
| Premium Features | Free access to premium tier |

---

# 8. QR TRANSACTION PROCESSING

**Patent Reference:** Claims 9, 17

## 8.1 QR Code Types

| Type | Purpose | Points | Discount |
|------|---------|--------|----------|
| loyalty | Check-in only | 25 base | 15% |
| payment | Process payment | 10/dollar | varies |
| checkin | Quick check-in | 25 base | none |
| promo | Special promotion | varies | varies |
| menu | View menu | 5 | none |

## 8.2 Transaction Processing Flow

```
Customer Scans QR Code
        │
        ▼
┌───────────────────────┐
│ Validate QR Code      │
│ - Check expiration    │
│ - Verify business     │
│ - Check usage limits  │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│ Fraud Check           │
│ - Velocity analysis   │
│ - Location verify     │
│ - Daily limit check   │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│ Process Transaction   │
│ - Create PaymentIntent│
│ - Split commission    │
│ - Record transaction  │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│ Award Points          │
│ - Calculate points    │
│ - Apply multipliers   │
│ - Update balance      │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│ Notify Parties        │
│ - Customer receipt    │
│ - Business alert      │
│ - Agent commission    │
└───────────────────────┘
```

## 8.3 Commission Structure

```typescript
const PLATFORM_COMMISSION_RATE = 0.075; // 7.5%

function calculateCommission(transactionAmount: number): CommissionBreakdown {
  const amountInCents = Math.round(transactionAmount * 100);
  const platformCommission = Math.round(amountInCents * PLATFORM_COMMISSION_RATE);
  const businessAmount = amountInCents - platformCommission;
  
  return {
    totalAmount: amountInCents,
    platformCommission,
    businessAmount,
    commissionRate: PLATFORM_COMMISSION_RATE,
  };
}
```

## 8.4 Atomic Check-in System

The unique daily index prevents duplicate point claims:

```sql
CREATE UNIQUE INDEX idx_qr_scans_unique_daily 
ON qr_scans(qr_code_id, customer_id, scan_date);
```

This ensures one check-in per customer per business per day.

---

# 9. FRAUD DETECTION ENGINE

**Patent Reference:** Claim 4

## 9.1 Detection Categories

| Category | Description | Severity Range |
|----------|-------------|----------------|
| velocity_abuse | Action frequency exceeds human limits | medium-critical |
| location_mismatch | Impossible geographic travel | high-critical |
| qr_scan_abuse | Coordinated scanning patterns | medium-high |
| transaction_anomaly | Unusual amounts/frequencies | low-high |
| account_suspicious | New accounts with high activity | low-medium |
| review_manipulation | Burst review patterns | medium-high |

## 9.2 Geospatial Velocity Formula

```
V = D / Δt

Where:
- V = Implied velocity (mph)
- D = Haversine distance between coordinates (miles)
- Δt = Time difference between actions (hours)

THRESHOLD: V_max = 600 mph (accounting for air travel)

If V > V_max → AUTOMATIC ESCROW HOLD + CRITICAL ALERT
```

## 9.3 AI-Powered Analysis

The fraud detection engine uses Google Gemini 2.5 Flash for pattern analysis:

```typescript
const systemPrompt = `You are an expert fraud detection AI...

CRITICAL PATTERNS TO DETECT:
1. Impossible Travel: If V > 600 mph between scans → CRITICAL
2. Transaction Anomalies: > 3 standard deviations from average
3. Velocity Abuse: > 20 scans/hour or > 50 transactions/day
4. Account Suspicious: High activity within 24h of creation
5. Review Manipulation: Burst patterns from related accounts
`;
```

## 9.4 Alert Response Flow

```
Alert Generated (AI Confidence > 0.7)
              │
              ▼
┌─────────────────────────────┐
│ Insert into fraud_alerts    │
│ with status = 'pending'     │
└──────────────┬──────────────┘
               │
               ▼
        ┌──────┴──────┐
        │  Severity?  │
        └──────┬──────┘
               │
    ┌──────────┼──────────┐
    ▼          ▼          ▼
 low/med    high      critical
    │          │          │
    ▼          ▼          ▼
  Queue    Immediate   AUTO HOLD
  review   review      + Alert Admin
```

---

# 10. VOICE AI CONCIERGE - KAYLA

**Patent Reference:** Claims 6, 11, 12

## 10.1 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Application                       │
│  ┌───────────────────────────────────────────────────────┐  │
│  │   WebSocket Connection to Edge Function               │  │
│  │   Audio: PCM16 format (16-bit, mono)                  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│               realtime-voice Edge Function                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │   Bidirectional WebSocket Bridge                       │  │
│  │   - Upgrades HTTP to WebSocket                         │  │
│  │   - Injects session configuration                      │  │
│  │   - Relays messages bidirectionally                    │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   OpenAI Realtime API                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │   Model: gpt-4o-realtime-preview                       │  │
│  │   Voice: shimmer                                       │  │
│  │   VAD: server-side with configurable threshold         │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 10.2 Persona Configuration

```typescript
const sessionConfig = {
  modalities: ['text', 'audio'],
  instructions: `You are Kayla - a real person at Mansa Musa Marketplace.

HOW TO SOUND HUMAN:
- Use contractions: "I'm", "you'll", "it's"
- Add filler words: "So...", "Well...", "You know what?"
- Show emotion: "Oh I love that question!"
- Keep responses SHORT - 2-4 sentences max

WHAT YOU KNOW:
- QR check-ins: scan at businesses, get 25 points + 15% off
- Susu circles: African rotating savings tradition
- Coalition points: redeemable at any member business
- Contact: 312.709.6006 or contact@mansamusamarketplace.com`,
  voice: 'shimmer',
  temperature: 0.8,
  turn_detection: {
    type: 'server_vad',
    threshold: 0.5,
    prefix_padding_ms: 300,
    silence_duration_ms: 800,
  },
};
```

## 10.3 Tool Registry

| Tool | Purpose | Parameters |
|------|---------|------------|
| search_businesses | Query directory | category, city, query, min_rating |
| get_business_details | Single business | business_id |
| check_availability | Hours check | business_id, date |
| get_recommendations | AI suggestions | user_id, preferences |
| check_coalition_points | Balance lookup | user_id |
| start_booking | Initiate reservation | business_id, service_id, datetime |

---

# 11. B2B MATCHING ENGINE

**Patent Reference:** Claim 5

## 11.1 Matching Algorithm

### Scoring Weights

| Factor | Weight | Condition |
|--------|--------|-----------|
| Category Match | 30 | Exact category alignment |
| Same City | 20 | Identical city location |
| Same State | 10 | Same state, different city |
| Service Area Overlap | 15 | Service area includes need |
| Budget Compatibility | 15 | Price within budget |
| Rating Bonus | 15 max | 3 points per star |
| Timeline Match | 10 | Lead time meets urgency |

### Urgency Mapping

| Urgency | Max Days |
|---------|----------|
| immediate | 3 |
| within_week | 7 |
| within_month | 30 |
| planning | 90 |
| flexible | 180 |

## 11.2 Connection Lifecycle

```
PENDING → CONTACTED → NEGOTIATING → CONTRACTED → COMPLETED
                                  ↘
                                   DECLINED
```

## 11.3 AI Enhancement

Top matches receive AI-generated recommendations:

```typescript
const recommendation = await generateAIRecommendation({
  need: businessNeed,
  match: topMatch,
  prompt: "You are a B2B matchmaker helping Black-owned businesses connect. Provide a brief, compelling 1-sentence recommendation.",
});
```

---

# 12. SALES AGENT NETWORK

**Patent Reference:** Claim 7

## 12.1 Tier Progression

| Tier | Referrals | Commission Rate | Override Rate |
|------|-----------|-----------------|---------------|
| Bronze | 0-24 | 10% | 2.5% |
| Silver | 25-99 | 12% | 2.5% |
| Gold | 100-199 | 13% | 3.0% |
| Platinum | 200-499 | 14% | 3.5% |
| Diamond | 500+ | 15% | 4.0% |

## 12.2 Commission Types

1. **Direct Commission**: Percentage of subscription from referred user
2. **Team Override**: Percentage of recruited agent's commissions
3. **Recruitment Bonus**: $50 one-time when recruited agent activates

## 12.3 Referral Flow

```
Agent shares referral link/code
            │
            ▼
┌────────────────────────────┐
│ New user signs up with     │
│ referral code attribution  │
└──────────────┬─────────────┘
               │
               ▼
┌────────────────────────────┐
│ User subscribes to         │
│ premium plan ($X/month)    │
└──────────────┬─────────────┘
               │
               ▼
┌────────────────────────────┐
│ Calculate agent commission │
│ commission = $X × tier_rate│
└──────────────┬─────────────┘
               │
               ▼
┌────────────────────────────┐
│ If agent was recruited:    │
│ Calculate team override    │
│ for recruiter agent        │
└──────────────┬─────────────┘
               │
               ▼
┌────────────────────────────┐
│ Record in commissions      │
│ table, notify agents       │
└────────────────────────────┘
```

---

# 13. PARTNER REFERRAL SYSTEM

**Patent Reference:** Claims 21-27

## 13.1 Partner Program Overview

Directory owners can earn revenue by referring businesses:

- **$5 Flat Fee**: Per business signup
- **10% Revenue Share**: Recurring from subscriptions

## 13.2 Attribution Tracking

- URL parameter: `?ref=PARTNER_CODE`
- Cookie persistence: 30-day window
- First-touch attribution preserved

## 13.3 Founding Partner Tier

Partners who join before September 1, 2026 receive:
- **15% Revenue Share** (vs standard 10%)
- **Priority Support**
- **Co-marketing opportunities**
- **Permanent "Founding Partner" badge**

## 13.4 Partner Portal Features

| Feature | Description |
|---------|-------------|
| Dashboard | Performance metrics and earnings |
| Referral Links | Unique tracking URLs |
| Marketing Hub | Branded materials with referral code |
| Embed Codes | Widget for partner websites |
| Payout Management | Request and track payments |
| Analytics | Funnel visualization |

## 13.5 Technical Partner Tier

Developers who build apps using platform APIs can become Technical Partners:
- **5% Revenue Share** on businesses onboarded through their apps
- Access to preferential API pricing
- Featured in Developer Showcase

---

# 14. DEVELOPER PLATFORM

## 14.1 API Overview

### Available APIs

| API | Description | Pricing |
|-----|-------------|---------|
| CMAL Engine | Economic impact calculation | $0.002/call |
| Voice AI | Real-time voice assistant | $0.05/minute |
| Susu Protocol | Rotating savings management | $0.01/transaction |
| Fraud Detection | Pattern analysis | $0.01/analysis |

### Pricing Tiers

| Tier | Price | CMAL | Voice | Susu | Fraud |
|------|-------|------|-------|------|-------|
| Free | $0/mo | 1,000 | 100 min | 50 | 100 |
| Pro | $299/mo | 50,000 | 5,000 min | 1,000 | 5,000 |
| Enterprise | Custom | Unlimited | Unlimited | Unlimited | Unlimited |

## 14.2 API Authentication

```typescript
// Header-based authentication
Authorization: Bearer 1325_live_xxxxxxxxxxxxxxxx

// Or X-API-Key header
X-API-Key: 1325_live_xxxxxxxxxxxxxxxx
```

### Key Structure
- Prefix: `1325_live_` or `1325_sandbox_`
- Body: 32 random alphanumeric characters
- Stored: SHA-256 hash only

## 14.3 Rate Limiting

- **Free**: 60 requests/minute
- **Pro**: 300 requests/minute
- **Enterprise**: Custom

Rate limit headers:
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1706543400
```

## 14.4 SDK Examples

### JavaScript/TypeScript

```typescript
import { Client } from '@1325ai/sdk';

const client = new Client({
  apiKey: '1325_live_xxx',
});

const impact = await client.cmal.calculate({
  transactionAmount: 150.00,
  businessCategory: 'restaurant',
  userTier: 'gold',
});

console.log(impact.multipliedImpact); // 517.50
```

### Python

```python
from onetwofive import Client

client = Client(api_key='1325_live_xxx')

impact = client.cmal.calculate(
    transaction_amount=150.00,
    business_category='restaurant',
    user_tier='gold'
)

print(impact.multiplied_impact)  # 517.50
```

---

# 15. SUSU PROTOCOL

**Patent Reference:** Claim 15

## 15.1 Overview

Susu circles are traditional African rotating savings groups digitized with automated escrow management.

## 15.2 Circle Configuration

```typescript
interface SusuCircle {
  id: string;
  name: string;
  contributionAmount: number;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  memberCount: number;
  currency: string;
  totalPoolPerRound: number;
  platformFeePercentage: 1.5; // Fixed
  status: 'awaiting_members' | 'active' | 'completed' | 'cancelled';
}
```

## 15.3 Payout Rotation

```
Round 1: Member A receives pool (minus 1.5% fee)
Round 2: Member B receives pool (minus 1.5% fee)
...
Round N: Member N receives pool (minus 1.5% fee)

All members contribute each round.
Rotation order set at circle creation.
```

## 15.4 Escrow Management

All contributions are held in escrow until payout:

```sql
CREATE TABLE public.susu_escrow (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id UUID REFERENCES susu_circles(id),
  transaction_type TEXT CHECK (transaction_type IN ('contribution', 'payout', 'fee', 'refund')),
  amount DECIMAL(12,2) NOT NULL,
  from_user_id UUID,
  to_user_id UUID,
  round_number INTEGER,
  status TEXT DEFAULT 'pending',
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

# 16. ECONOMIC KARMA SYSTEM

**Patent Reference:** Claim 14

## 16.1 Karma Earning Events

| Event | Karma Points |
|-------|--------------|
| Transaction ($10) | 10 × 2.3 × 0.1 = 2.3 |
| Business Referral | 50 |
| User Referral | 25 |
| Review Submission | 10-20 (length-based) |
| Coalition Redemption | 5 |
| Group Challenge | Varies |

## 16.2 Karma Decay

- **5% monthly reduction** for users with no activity in 30 days
- Incentivizes continued engagement
- Minimum karma floor of 0

## 16.3 Karma Benefits

| Karma Level | Benefits |
|-------------|----------|
| 0-99 | Standard access |
| 100-499 | 5% bonus on points |
| 500-999 | Priority recommendations |
| 1000+ | VIP status, concierge access |

---

# 17. GAMIFICATION SYSTEM

**Patent Reference:** Claim 8

## 17.1 Achievement Categories

| Category | Examples |
|----------|----------|
| Shopping | First purchase, 10 purchases, $1000 spent |
| Social | First review, 10 reviews, shared 5 businesses |
| Loyalty | Bronze tier, Gold tier, 1000 points redeemed |
| Community | Referred 5 users, joined Susu circle |
| Special | Founding member, First 100 users |

## 17.2 Streak System

| Streak Type | Trigger | Multiplier |
|-------------|---------|------------|
| daily_visit | App open | 1.0x → 1.5x |
| weekly_purchase | Any purchase | 1.0x → 1.25x |
| review_streak | Submit review | 1.0x → 1.5x |
| referral_streak | Successful referral | 1.0x → 2.0x |

## 17.3 Group Challenges

```typescript
interface GroupChallenge {
  id: string;
  title: string;
  description: string;
  challengeType: 'spending' | 'visits' | 'referrals' | 'reviews' | 'coalition_points';
  targetValue: number;
  currentValue: number;
  participantCount: number;
  reward: {
    type: 'points' | 'badge' | 'discount';
    value: number;
  };
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'expired';
}
```

---

# 18. CORPORATE SPONSORSHIP PROGRAM

## 18.1 Sponsorship Tiers

| Tier | Price | Businesses | Benefits |
|------|-------|------------|----------|
| Community Champion | $500/mo | 10 | Basic dashboard, logo placement |
| Economic Ally | $2,000/mo | 50 | Enhanced metrics, co-marketing |
| Wealth Builder | $10,000/mo | 250 | Full analytics, dedicated support |
| Economic Architect | Custom | Unlimited | White-label, custom integration |

## 18.2 Impact Metrics

Sponsors receive real-time dashboards showing:

- Businesses supported
- Total transactions
- Economic impact (2.3x multiplier)
- Community reach
- ROI calculation

## 18.3 Sponsor Attribution

```sql
CREATE TABLE public.sponsor_impact_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES corporate_subscriptions(id),
  metric_date DATE NOT NULL,
  businesses_supported INTEGER DEFAULT 0,
  total_transactions INTEGER DEFAULT 0,
  community_reach INTEGER DEFAULT 0,
  economic_impact DECIMAL(14,2) DEFAULT 0,
  raw_transaction_value DECIMAL(14,2) DEFAULT 0,
  circulation_multiplier DECIMAL(4,2) DEFAULT 2.3,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

# 19. AI RECOMMENDATION ENGINE

**Patent Reference:** Claim 10

## 19.1 Recommendation Flow

```
User Interactions + Preferences
              │
              ▼
┌─────────────────────────────┐
│ Collect Context:            │
│ - Preferred categories      │
│ - Recent views/favorites    │
│ - Purchase history          │
│ - Geographic preferences    │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ Candidate Retrieval:        │
│ - Verified businesses       │
│ - Active listings           │
│ - Rating threshold          │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ AI Scoring (Gemini 2.5):    │
│ - Analyze user-business fit │
│ - Generate scores 0.75-1.0  │
│ - Create explanations       │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ Store & Serve:              │
│ - Cache for 24 hours        │
│ - Track click-through       │
│ - Refresh on significant    │
│   interaction changes       │
└─────────────────────────────┘
```

## 19.2 Recommendation Response

```typescript
interface Recommendation {
  businessId: string;
  businessName: string;
  category: string;
  score: number; // 0.75-1.0
  reason: string; // AI-generated
  expiresAt: string;
}
```

---

# 20. NOTIFICATION SYSTEMS

## 20.1 Email Templates

| Template | Trigger | Service |
|----------|---------|---------|
| send-welcome-email | User signup | Resend |
| send-verification-email | Email verification | Resend |
| send-password-reset | Password reset request | Resend |
| send-booking-confirmation | Booking created | Resend |
| send-review-request | Post-transaction | Resend |
| send-commission-report | Weekly/Monthly | Resend |
| send-sponsor-email | Sponsor updates | Resend |

## 20.2 Push Notifications

Using Capacitor Push Notifications:

```typescript
const notifications = [
  'points_earned',
  'tier_upgrade',
  'new_recommendation',
  'booking_reminder',
  'susu_contribution_due',
  'payout_received',
  'commission_approved',
];
```

## 20.3 In-App Notifications

```sql
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  link TEXT,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

# 21. MOBILE APPLICATION

## 21.1 Capacitor Configuration

```typescript
// capacitor.config.ts
const config: CapacitorConfig = {
  appId: 'com.1325ai.marketplace',
  appName: 'Mansa Musa Marketplace',
  webDir: 'dist',
  bundledWebRuntime: false,
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    SplashScreen: {
      launchAutoHide: false,
      androidScaleType: 'CENTER_CROP',
    },
  },
};
```

## 21.2 Native Features

| Feature | Plugin | Purpose |
|---------|--------|---------|
| Camera | @capacitor/camera | QR scanning, photo upload |
| Geolocation | @capacitor/geolocation | Near me, fraud detection |
| Push | @capacitor/push-notifications | Real-time alerts |
| Haptics | @capacitor/haptics | Tactile feedback |
| Share | @capacitor/share | Social sharing |
| Biometric | Custom | Secure authentication |

## 21.3 Build Commands

```bash
# Build web assets
npm run build

# Sync with iOS
npx cap sync ios

# Open in Xcode
npx cap open ios

# Sync with Android
npx cap sync android

# Open in Android Studio
npx cap open android
```

---

# 22. ADMIN DASHBOARD

## 22.1 Dashboard Sections

| Section | Description |
|---------|-------------|
| Overview | Key platform metrics |
| Users | User management, roles |
| Businesses | Verification, moderation |
| Agents | Sales agent network |
| Partners | Partner management |
| Developers | API developer oversight |
| Financial | Revenue, payouts |
| Fraud | Alert review |
| System | Configuration |

## 22.2 Admin Roles

| Role | Permissions |
|------|-------------|
| super_admin | Full access, all systems |
| admin | Standard admin operations |
| moderator | Content moderation only |
| support | User support, limited access |

## 22.3 Audit Logging

All admin actions are logged:

```sql
CREATE TABLE public.admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

# 23. FRONTEND ARCHITECTURE

## 23.1 Component Organization

```
src/components/
├── ui/              # Base UI (shadcn/ui)
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   └── ...
├── layout/          # Layout components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Sidebar.tsx
│   └── Layout.tsx
├── forms/           # Form components
│   ├── BusinessForm.tsx
│   ├── ReviewForm.tsx
│   └── ...
├── features/        # Feature-specific
│   ├── loyalty/
│   ├── coalition/
│   ├── susu/
│   └── ...
└── shared/          # Shared/common
    ├── LoadingSpinner.tsx
    ├── ErrorBoundary.tsx
    └── ...
```

## 23.2 State Management

### React Query for Server State

```typescript
// Query configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
      retry: 3,
      refetchOnWindowFocus: true,
    },
  },
});
```

### Context for Global State

```typescript
// Key contexts
- AuthContext: User authentication state
- ThemeContext: Light/dark mode
- NotificationContext: In-app notifications
- LocationContext: Geolocation data
```

## 23.3 Routing Structure

```typescript
const routes = [
  { path: '/', element: <HomePage /> },
  { path: '/directory', element: <DirectoryPage /> },
  { path: '/business/:id', element: <BusinessDetailPage /> },
  { path: '/dashboard', element: <DashboardPage />, protected: true },
  { path: '/admin/*', element: <AdminDashboardPage />, role: 'admin' },
  { path: '/developers/*', element: <DeveloperPortal /> },
  { path: '/partner/*', element: <PartnerPortal />, protected: true },
  // ... 150+ routes
];
```

## 23.4 Design System

### Color Tokens

```css
:root {
  --mansagold: 43 96% 56%;
  --mansablue: 217 91% 30%;
  --mansablue-light: 217 85% 45%;
  --mansablue-dark: 217 91% 20%;
  
  --background: 222 47% 4%;
  --foreground: 0 0% 98%;
  --primary: 43 96% 56%;
  --secondary: 217 91% 30%;
  --accent: 43 96% 56%;
  --muted: 217 33% 17%;
}
```

### Typography

```css
.font-display { font-family: 'Playfair Display', serif; }
.font-sans { font-family: 'Inter', sans-serif; }
.font-mono { font-family: 'JetBrains Mono', monospace; }
```

---

# 24. EDGE FUNCTION REFERENCE

## 24.1 Function Inventory

### Authentication & Users
| Function | JWT | Description |
|----------|-----|-------------|
| send-welcome-email | No | Welcome email on signup |
| send-verification-email | No | Email verification |
| send-password-reset | No | Password reset flow |
| delete-account | Yes | Account deletion |

### Payments & Transactions
| Function | JWT | Description |
|----------|-----|-------------|
| create-checkout | No | Stripe checkout session |
| create-payment-intent | Yes | Payment processing |
| process-qr-transaction | Yes | QR-based payment |
| stripe-webhook | No | Stripe webhook handler |
| stripe-partner-webhook | No | Partner commission webhook |

### AI & Recommendations
| Function | JWT | Description |
|----------|-----|-------------|
| ai-chat | Yes | AI chat interface |
| ai-assistant | Yes | Kayla assistant |
| ai-recommendations | No | Personalized suggestions |
| generate-ai-business-insights | Yes | Business analytics |
| parse-search-query | No | NL search parsing |

### Voice
| Function | JWT | Description |
|----------|-----|-------------|
| realtime-voice | Yes | Voice WebSocket bridge |
| voice-api | No | Voice API for developers |
| voice-concierge-tools | No | Tool execution |
| transcribe-audio | Yes | Speech-to-text |
| text-to-speech | Yes | Text-to-speech |

### APIs
| Function | JWT | Description |
|----------|-----|-------------|
| api-gateway | No | Developer API gateway |
| cmal-api | No | CMAL Engine API |
| susu-api | No | Susu Protocol API |
| fraud-api | No | Fraud Detection API |

### Notifications
| Function | JWT | Description |
|----------|-----|-------------|
| send-notification-email | No | General notifications |
| send-booking-confirmation | No | Booking alerts |
| send-commission-report | No | Agent reports |
| process-notification-batches | No | Batch processing |

## 24.2 Common Patterns

### CORS Headers

```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};
```

### Error Response

```typescript
function errorResponse(message: string, statusCode: number = 400): Response {
  return new Response(
    JSON.stringify({ error: message }),
    { 
      status: statusCode, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}
```

---

# 25. DEPLOYMENT & OPERATIONS

## 25.1 Environment Configuration

### Required Environment Variables

```bash
# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Stripe
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# OpenAI
OPENAI_API_KEY=sk-xxx

# Resend
RESEND_API_KEY=re_xxx

# Mapbox
MAPBOX_ACCESS_TOKEN=pk.xxx
```

## 25.2 Deployment Workflow

```
Developer Push → GitHub
        │
        ▼
  GitHub Actions CI
  - Lint & Type Check
  - Run Tests
        │
        ▼
  Lovable Cloud Build
  - Vite Build
  - Edge Function Deploy
        │
        ▼
   Preview Environment
        │
        ▼
   Production Deploy
```

## 25.3 Monitoring

### Key Metrics

- API response times
- Edge function execution duration
- Database query performance
- Error rates by endpoint
- User engagement metrics

### Alerting Thresholds

| Metric | Warning | Critical |
|--------|---------|----------|
| API latency | > 500ms | > 2000ms |
| Error rate | > 1% | > 5% |
| DB connections | > 80% | > 95% |
| Edge function duration | > 10s | > 30s |

---

# 26. PATENT CLAIMS SUMMARY

## 26.1 Claims Overview

| Claim | Title | Status |
|-------|-------|--------|
| 1 | Temporal Founding Member Status | Filed |
| 2 | CMAL - Economic Circulation Multiplier | Filed |
| 3 | Cross-Business Coalition Loyalty | Filed |
| 4 | Geospatial Velocity Fraud Detection | Filed |
| 5 | AI-Powered B2B Matching Engine | Filed |
| 6 | Real-Time Voice AI Bridge | Filed |
| 7 | Multi-Tier Sales Agent Network | Filed |
| 8 | Gamification & Achievement System | Filed |
| 9 | QR-Code Transaction Processing | Filed |
| 10 | AI Personalized Recommendations | Filed |
| 11 | Voice AI Bridge Extended | Filed |
| 12 | AI Tool Registry for Voice | Filed |
| 13 | Atomic Fraud Alert Batch Insertion | Filed |
| 14 | Economic Karma Scoring | Filed |
| 15 | Susu Digital Escrow Protocol | Filed |
| 16 | Biometric Verification | Filed |
| 17 | QR Atomic Check-in | Filed |
| 18 | Community Impact Analytics | Filed |
| 19 | Closed-Loop Digital Wallet | Filed |
| 20 | Circulation Velocity Analytics | Filed |
| 21 | Partner Referral Attribution | Filed |
| 22 | Founding Partner Tier | Filed |
| 23 | Partner Marketing Automation | Filed |
| 24 | Multi-Entity Referral Tracking | Filed |
| 25 | Partner Performance Dashboard | Filed |
| 26 | Partner Embed Widget System | Filed |
| 27 | Partner Payout Processing | Filed |

## 26.2 Filing Information

- **Application Type:** Provisional Patent Application
- **Application Number:** 63/969,202
- **Filing Date:** January 27, 2026
- **Applicant:** Thomas D. Bowling
- **Status:** Pending

---

# 27. APPENDICES

## Appendix A: API Response Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 429 | Rate Limited |
| 500 | Server Error |

## Appendix B: Webhook Events

| Event | Payload |
|-------|---------|
| business.created | Business object |
| business.verified | Business object |
| transaction.completed | Transaction object |
| points.earned | Points transaction |
| tier.upgraded | User + new tier |
| commission.approved | Commission object |
| payout.processed | Payout object |

## Appendix C: Database Functions

| Function | Purpose |
|----------|---------|
| award_coalition_points | Grant loyalty points |
| update_coalition_tier | Tier progression |
| set_founding_member_status | Founding member assignment |
| prevent_founding_member_revocation | Immutability enforcement |
| update_agent_tier | Agent tier progression |
| validate_api_key | API key validation |
| check_api_rate_limit | Rate limiting |
| log_api_usage | Usage tracking |
| insert_fraud_alerts_batch | Batch alert insertion |

## Appendix D: External Service Integrations

| Service | Purpose | Documentation |
|---------|---------|---------------|
| Supabase | Backend services | supabase.com/docs |
| Stripe | Payments | stripe.com/docs |
| OpenAI | AI services | platform.openai.com |
| Resend | Email | resend.com/docs |
| Mapbox | Maps | docs.mapbox.com |
| PostHog | Analytics | posthog.com/docs |

---

# DOCUMENT CONTROL

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-01-29 | 1325.AI Engineering | Initial release |

---

**CONFIDENTIAL AND PROPRIETARY**

This document contains confidential and proprietary information of 1325.AI. It is intended solely for the use of authorized personnel. Unauthorized reproduction, distribution, or disclosure of this document or its contents is strictly prohibited.

**© 2024-2026 1325.AI - All Rights Reserved**

Protected under USPTO Provisional Application 63/969,202
