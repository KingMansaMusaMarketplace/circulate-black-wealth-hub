# USPTO PROVISIONAL PATENT FILING CHECKLIST

## Pre-Filing Verification for 1325.ai / Mansa Musa Marketplace

---

**Filing Date:** January 22, 2026  
**Applicant/Inventor:** Thomas D. Bowling  
**Title:** System and Method for a Multi-Tenant Vertical Marketplace Operating System

---

## REQUIRED DOCUMENTS

### Core Filing Documents

| Document | Status | File Name | Notes |
|----------|--------|-----------|-------|
| ☐ Specification (Technical Description) | READY | `USPTO_PROVISIONAL_PATENT_APPLICATION_COMPREHENSIVE.md` | ~2000 lines, 14 claims |
| ☐ Formal Claims | READY | `USPTO_FORMAL_CLAIMS.md` | 14 independent + 25 dependent claims |
| ☐ System Diagrams | READY | `USPTO_SYSTEM_DIAGRAMS.md` | 9 Mermaid diagrams |
| ☐ Abstract | READY | Included in main specification | ~300 words |
| ☐ Inventor Declaration | PENDING | Signature required | |
| ☐ Application Data Sheet (ADS) | PENDING | USPTO Form PTO/AIA/14 | |
| ☐ Filing Fee Payment | PENDING | See fee schedule below | |

---

## FILING FEE SCHEDULE

### Entity Status Determination

| Entity Type | Qualification Criteria | Fee Reduction |
|-------------|------------------------|---------------|
| **Micro Entity** | Gross income < $206,109/year AND not assigned to large entity AND filed < 5 applications | 75% reduction |
| **Small Entity** | < 500 employees AND not assigned to large entity | 50% reduction |
| **Large Entity** | Does not qualify for above | Full fee |

### Fee Amounts (as of January 2026)

| Fee Type | Micro Entity | Small Entity | Large Entity |
|----------|--------------|--------------|--------------|
| Basic Filing Fee | $80 | $160 | $320 |
| Provisional Application Filing Fee | $80 | $160 | $320 |

**RECOMMENDED:** File as Micro Entity if qualifications are met.

---

## CLAIM INVENTORY

### Independent Claims (14 total)

| Claim # | Title | Primary Edge Function | Status |
|---------|-------|----------------------|--------|
| 1 | Temporal Founding Member System | N/A (Database Trigger) | ✅ Documented |
| 2 | CMAL Engine (2.3x Multiplier) | `calculate-sponsor-impact` | ✅ Documented |
| 3 | Coalition Loyalty Network | `coalition-earn-points` | ✅ Documented |
| 4 | Geospatial Fraud Detection | `detect-fraud` | ✅ Documented |
| 5 | B2B Matching Engine | `b2b-match` | ✅ Documented |
| 6 | Voice AI Bridge | `realtime-voice` | ✅ Documented |
| 7 | Multi-Tier Commission Network | `process-referral` | ✅ Documented |
| 8 | Gamification System | N/A (Database + Frontend) | ✅ Documented |
| 9 | QR Transaction Processing | `process-qr-transaction` | ✅ Documented |
| 10 | AI Recommendations | `generate-ai-recommendations` | ✅ Documented |
| 11 | Voice AI Bridge (Extended) | `realtime-voice` | ✅ NEW |
| 12 | Voice Concierge Tools | `voice-concierge-tools` | ✅ NEW |
| 13 | Atomic Batch Insertion | `detect-fraud` (RPC) | ✅ NEW |
| 14 | Economic Karma System | Proposed | ✅ NEW |

### Dependent Claims (25+ total)

Each independent claim has 2-4 dependent claims narrowing scope:
- Total dependent claims: 25+
- All documented in `USPTO_FORMAL_CLAIMS.md`

---

## PATENT HEADER VERIFICATION

### Edge Functions with Patent Headers

| Function | Patent Claim | Header Added |
|----------|--------------|--------------|
| `detect-fraud/index.ts` | Claim 4 | ✅ Yes |
| `calculate-sponsor-impact/index.ts` | Claim 2/3 | ✅ Yes |
| `b2b-match/index.ts` | Claim 5 | ☐ Pending |
| `realtime-voice/index.ts` | Claim 6/11 | ☐ Pending |
| `process-referral/index.ts` | Claim 7 | ☐ Pending |
| `coalition-earn-points/index.ts` | Claim 3 | ☐ Pending |
| `process-qr-transaction/index.ts` | Claim 9 | ☐ Pending |
| `generate-ai-recommendations/index.ts` | Claim 10 | ☐ Pending |
| `voice-concierge-tools/index.ts` | Claim 12 | ☐ Pending |
| `compare-businesses/index.ts` | Claim 5 | ☐ Pending |

---

## KEY CONSTANTS TO PROTECT

| Constant | Value | Location | Claim |
|----------|-------|----------|-------|
| CIRCULATION_MULTIPLIER | 2.3 | calculate-sponsor-impact | Claim 2 |
| REACH_MULTIPLIER | 10 | calculate-sponsor-impact | Claim 2 |
| COMMISSION_RATE | 7.5% | process-qr-transaction | Claim 9 |
| POINTS_PER_DOLLAR | 10 | process-qr-transaction | Claim 9 |
| FOUNDING_CUTOFF | 2026-03-31T23:59:59Z | Database migration | Claim 1 |
| FRAUD_VELOCITY_THRESHOLD | 600 mph | detect-fraud | Claim 4 |

### B2B Matching Weights

| Weight | Points | Claim |
|--------|--------|-------|
| CATEGORY_MATCH | 30 | Claim 5 |
| SAME_CITY | 20 | Claim 5 |
| SAME_STATE | 10 | Claim 5 |
| SERVICE_AREA_OVERLAP | 15 | Claim 5 |
| BUDGET_COMPATIBILITY | 15 | Claim 5 |
| RATING_BONUS_MAX | 15 | Claim 5 |
| TIMELINE_MATCH | 10 | Claim 5 |

### Coalition Tier Thresholds

| Tier | Min Points | Multiplier | Claim |
|------|------------|------------|-------|
| Bronze | 0 | 1.0x | Claim 3 |
| Silver | 1,000 | 1.25x | Claim 3 |
| Gold | 5,000 | 1.5x | Claim 3 |
| Platinum | 15,000 | 2.0x | Claim 3 |

### Agent Commission Tiers

| Tier | Referrals | Rate | Claim |
|------|-----------|------|-------|
| Bronze | 0-24 | 10% | Claim 7 |
| Silver | 25-99 | 12% | Claim 7 |
| Gold | 100-199 | 13% | Claim 7 |
| Platinum | 200-499 | 14% | Claim 7 |
| Diamond | 500+ | 15% | Claim 7 |

---

## FILING PROCESS

### Step 1: Prepare Documents

1. ☐ Export `USPTO_PROVISIONAL_PATENT_APPLICATION_COMPREHENSIVE.md` to PDF
2. ☐ Export `USPTO_FORMAL_CLAIMS.md` to PDF
3. ☐ Export `USPTO_SYSTEM_DIAGRAMS.md` to PDF (render Mermaid diagrams)
4. ☐ Complete Inventor Declaration (signature)
5. ☐ Complete Application Data Sheet (USPTO Form PTO/AIA/14)

### Step 2: File via EFS-Web

1. ☐ Go to https://www.uspto.gov/patents/apply
2. ☐ Log in or create USPTO account
3. ☐ Select "Patent" → "Provisional Application"
4. ☐ Upload specification PDF
5. ☐ Upload claims PDF
6. ☐ Upload drawings/diagrams PDF
7. ☐ Upload ADS
8. ☐ Pay filing fee (credit card, deposit account, or EFT)
9. ☐ Receive confirmation number and filing receipt

### Step 3: Post-Filing

1. ☐ Save filing receipt with Application Number
2. ☐ Calendar 12-month deadline for non-provisional filing
3. ☐ Calendar 12-month deadline for PCT filing (international)
4. ☐ Update codebase with provisional application number
5. ☐ Consider defensive publication of additional features

---

## INTERNATIONAL FILING (PCT) TIMELINE

| Deadline | Action | Notes |
|----------|--------|-------|
| Filing Date | Provisional Filed | January 22, 2026 |
| +12 months | Non-Provisional OR PCT Filing | January 22, 2027 |
| +18 months | Publication (if PCT) | July 22, 2027 |
| +30 months | National Phase Entry | July 22, 2028 |

### Priority Countries to Consider

1. **United States** - Primary market
2. **European Patent Office (EPO)** - Covers 38 countries
3. **United Kingdom** - Post-Brexit separate filing
4. **Canada** - North American expansion
5. **Nigeria** - Largest African economy, diaspora connection
6. **Ghana** - Growing tech hub, diaspora connection
7. **Kenya** - East African tech leader
8. **South Africa** - Continental economic leader
9. **Brazil** - Largest Latin American economy
10. **India** - Massive market potential

---

## LEGAL NOTICES VERIFICATION

### Required Notices in Codebase

| Location | Notice Type | Status |
|----------|-------------|--------|
| Edge function headers | Patent pending | Partial |
| README.md | Copyright | ☐ Verify |
| Main specification | Legal safeguards | ✅ Yes |
| System diagrams | Copyright | ✅ Yes |

### Notice Template

```
/**
 * PATENT PROTECTED - Provisional Application Filed
 * ================================================
 * Title: System and Method for a Multi-Tenant Vertical Marketplace 
 *        Operating System Featuring Temporal Incentives, Circulatory 
 *        Multiplier Attribution, and Geospatial Velocity Fraud Detection
 * 
 * Application Number: [TO BE ADDED AFTER FILING]
 * Filing Date: January 22, 2026
 * 
 * © 2024-2026 Thomas D. Bowling. All rights reserved.
 * Unauthorized replication, implementation, or distribution is prohibited.
 */
```

---

## FINAL PRE-FILING VERIFICATION

Before submitting to USPTO, verify:

- [ ] All 14 independent claims are documented
- [ ] All dependent claims (25+) are documented
- [ ] All system diagrams render correctly
- [ ] Algorithm constants match codebase
- [ ] Technology equivalents matrix is comprehensive
- [ ] Doctrine of equivalents language is included
- [ ] PCT preservation language is included
- [ ] Filing fee is prepared
- [ ] Inventor declaration is signed
- [ ] ADS is completed

---

## CONTACT INFORMATION FOR FILING

**Applicant/Inventor:**  
Thomas D. Bowling  
1000 E. 111th Street, Suite 1100  
Chicago, Illinois 60628  

**Platform:**  
1325.ai / Mansa Musa Marketplace  
Contact: 312.709.6006  
Email: contact@mansamusamarketplace.com

---

© 2024-2026 Thomas D. Bowling. All rights reserved.
