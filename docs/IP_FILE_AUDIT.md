# IP and Sensitive File Audit — 1325.AI

## Purpose

This document lists the files in the Lovable workspace that contain patent language, proprietary system design, or confidential business information. After the workspace upgrade to Lovable Business, these files should be reviewed and, where possible, moved out of the Lovable workspace to a separate, private document store.

## Files that should be moved out of Lovable

These documents are legal or patent-related and are not required for the deployed app to run. They should be stored in a private repository, legal document vault, or your attorney's system.

### Patent filing documents

| File | Why it is sensitive |
|------|---------------------|
| `docs/PATENT_CLAIM_2_TEMPORAL_FOUNDING_STATUS.md` | Describes the temporal founding-member system, trigger logic, and provisional filing claim language. |
| `docs/PATENT_CLAIMS_28-40_PROPOSED_ADDITIONS.md` | Proposed additions to the patent filing. |
| `docs/PATENT_CLAIM_REVISION_STRATEGY.md` | Patent revision strategy and claim language. |
| `docs/USPTO_COMPLETE_FILING_PACKAGE.md` | Complete provisional filing package. |
| `docs/USPTO_FILING_CHECKLIST.md` | Filing checklist and procedural details. |
| `docs/USPTO_FORMAL_CLAIMS.md` | Formal patent claims. |
| `docs/USPTO_FORMAL_CLAIMS_28-40.md` | Claims 28–40. |
| `docs/USPTO_FORMAL_CLAIMS_41-45.md` | Claims 41–45. |
| `docs/USPTO_PROVISIONAL_PATENT_APPLICATION.md` | Provisional application text. |
| `docs/USPTO_PROVISIONAL_PATENT_APPLICATION_COMPREHENSIVE.md` | Comprehensive provisional application. |
| `docs/USPTO_PROVISIONAL_SPECIFICATION_28-40.md` | Provisional specification for claims 28–40. |
| `docs/USPTO_SYSTEM_DIAGRAMS.md` | System diagrams for the patent. |
| `docs/USPTO_SYSTEM_DIAGRAMS_28-40.md` | System diagrams for claims 28–40. |

### Security and architecture audits

| File | Why it is sensitive |
|------|---------------------|
| `docs/SECURITY_DEFINER_AUDIT_MAY_2026.md` | Lists which database functions are public vs. locked, useful for attackers. |
| `docs/SECURITY_DEFINER_VIEW_ANALYSIS.md` | Describes system views and security architecture. |
| `docs/PRIORITY_1_SECURITY_FIXES.md` | Likely contains security gap analysis. |
| `docs/SECURITY_ACKNOWLEDGMENTS.md` | Acknowledgments of security issues. |

### Internal operations and partnerships

| File | Why it is sensitive |
|------|---------------------|
| `docs/CORPORATE_SPONSORSHIP_IMPLEMENTATION.md` | Sponsorship implementation details and pricing. |
| `docs/SPONSOR_DASHBOARD.md` | Sponsor dashboard internals. |
| `docs/SPONSOR_LOGO_PLACEMENT.md` | Sponsor logo placement rules. |
| `docs/SPONSOR_METRICS_AUTOMATION.md` | Sponsorship metric calculation logic and API endpoint details. |
| `docs/MCP_REGISTRY_SUBMISSION.md` / `MCP_REGISTRY_SUBMISSIONS.md` | Partnership submission details. |

## Files that can stay in Lovable

These files are operational documents that help the team manage the app and do not expose core IP or legal strategy. Review them anyway for any embedded secrets or customer data.

- `docs/ADMIN_NOTIFICATIONS.md`
- `docs/APPSTORE_WHATS_NEW_1.4.1.md`
- `docs/DIGEST_SCHEDULER_SETUP.md`
- `docs/FINAL_PRE_LAUNCH_VERIFICATION.md`
- `docs/LAUNCH_READINESS_MAY_2026.md`
- `docs/MAURICE_ISSUES_FIX.md`
- `docs/MAURICE_ISSUES_ROOT_CAUSE_ANALYSIS.md`
- `docs/NOTIFICATION_BATCHING.md`
- `docs/NOTIFICATION_PREFERENCES.md`
- `docs/PRE_LAUNCH_CHECKLIST.md`
- `docs/PRE_LAUNCH_MAURICE_TEST_SCRIPT.md`
- `docs/SIGNUP_FLOWS_VERIFICATION.md`
- `docs/STEP_5_PRICING_PAGE.md`
- `docs/USER_EXPERIENCE_IMPROVEMENTS.md`
- `docs/BACKEND_SOVEREIGNTY.md` (this document)
- `docs/IP_FILE_AUDIT.md` (this document)

## Files in `src/` that embed patent-relevant concepts

These files contain **runtime business logic** that may be tied to patent claims (for example, the founding-member temporal cutoff). They must stay in the project because the app needs them to run. However, they should be reviewed to make sure they do not contain hardcoded secrets or overly detailed legal comments.

- `src/lib/constants/founding-member.ts`
- `src/lib/sponsorship/agreementTerms.ts`
- `src/components/HomePage/FoundingSuccessPage.tsx`
- `src/pages/FoundersWallPage.tsx`
- `src/hooks/qr-code/use-qr-code-scanning.ts`
- `src/config/site.ts`
- `src/utils/seoUtils.ts`

Recommendation: remove any comments that include patent numbers, filing dates, or legal strategy from the source code. Keep the code; remove the legal commentary.

## Recommended next steps

1. After upgrading to Lovable Business, create a private external repository (e.g., a private GitHub repo or Google Drive) for all patent and legal documents.
2. Move the files listed under "Patent filing documents" and "Security and architecture audits" to that external store.
3. Delete the copies from the Lovable workspace.
4. Review the `src/` files listed above and strip any patent-related comments or legal language.
5. Do **not** move or delete files that are required for the app to build or run.

## Reminder

This document is part of a workspace-hardening plan. The most important protection is the **Business plan upgrade**, which excludes the remaining workspace data from Lovable AI training. Moving these files reduces the amount of IP exposed inside the workspace even further.
