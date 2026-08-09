# Move Patent and Legal Files Out of the Project

Goal: get the sensitive patent, USPTO, and security-audit documents out of the Lovable project and into a private store you control, without breaking the app.

Good news from checking the code first: none of these documents are read by the running app. The admin "Legal & IP" page only shows a *list of filenames* — it never opens the files. So deleting them will not break anything.

## Before we delete anything: you download them

I cannot upload to your Google Drive or a private repo for you. So the order is: I package the files for you → you download and file them safely → you tell me "saved" → I delete them from the project.

Step 1 for you: decide where they will live. Any of these work:
- A private Google Drive folder (simplest)
- A private GitHub repository
- Your patent attorney's document portal (Allgaier Patent Solutions)

## The files, one by one

### Group A — USPTO patent filings (highest sensitivity, 10 files)

| # | File | Size |
|---|------|------|
| 1 | `docs/USPTO_COMPLETE_FILING_PACKAGE.md` | 66 KB |
| 2 | `docs/USPTO_PROVISIONAL_PATENT_APPLICATION_COMPREHENSIVE.md` | 70 KB |
| 3 | `docs/USPTO_FORMAL_CLAIMS.md` | 53 KB |
| 4 | `docs/USPTO_FORMAL_CLAIMS_28-40.md` | 38 KB |
| 5 | `docs/USPTO_FORMAL_CLAIMS_41-45.md` | 21 KB |
| 6 | `docs/USPTO_PROVISIONAL_PATENT_APPLICATION.md` | 40 KB |
| 7 | `docs/USPTO_PROVISIONAL_SPECIFICATION_28-40.md` | 26 KB |
| 8 | `docs/USPTO_SYSTEM_DIAGRAMS.md` | 16 KB |
| 9 | `docs/USPTO_SYSTEM_DIAGRAMS_28-40.md` | 18 KB |
| 10 | `docs/USPTO_FILING_CHECKLIST.md` | 9 KB |

### Group B — Patent strategy and claim analysis (3 files)

| # | File | Size |
|---|------|------|
| 11 | `docs/PATENT_CLAIM_REVISION_STRATEGY.md` | 12 KB |
| 12 | `docs/PATENT_CLAIMS_28-40_PROPOSED_ADDITIONS.md` | 9 KB |
| 13 | `docs/PATENT_CLAIM_2_TEMPORAL_FOUNDING_STATUS.md` | 2 KB |

### Group C — Security architecture audits (4 files)

These map out which database functions are locked and which are open. Useful to an attacker.

| # | File | Size |
|---|------|------|
| 14 | `docs/SECURITY_DEFINER_AUDIT_MAY_2026.md` | 4 KB |
| 15 | `docs/SECURITY_DEFINER_VIEW_ANALYSIS.md` | 3 KB |
| 16 | `docs/PRIORITY_1_SECURITY_FIXES.md` | 9 KB |
| 17 | `docs/SECURITY_ACKNOWLEDGMENTS.md` | 5 KB |

### Group D — Sponsor and partnership internals (optional, 5 files)

Lower risk. These are business docs, not legal IP. You may want to keep them in the project for convenience.

`docs/CORPORATE_SPONSORSHIP_IMPLEMENTATION.md`, `docs/SPONSOR_DASHBOARD.md`, `docs/SPONSOR_LOGO_PLACEMENT.md`, `docs/SPONSOR_METRICS_AUTOMATION.md`, `docs/MCP_REGISTRY_SUBMISSION.md`

## What I will do

1. **Package everything for download.** Bundle Groups A, B, and C into a single dated ZIP archive placed in your documents area, so you get all 17 files in one download instead of 17 separate ones. I will also produce a plain-text inventory listing every file and its purpose, so your attorney knows what is in the box.
2. **Wait for your confirmation** that the archive is saved in Drive / GitHub / your attorney's portal.
3. **Delete the 17 files** from the project after you confirm.
4. **Update the admin Legal & IP page** so the document list no longer points at deleted files — it will show the filing metadata (Application No. 63/969,202, 45 claims pending, key dates) and a note that the source documents are held in the external private store.
5. **Update `docs/IP_FILE_AUDIT.md`** to record what was moved, when, and where, so there is an audit trail.

## What I will NOT touch

- `src/lib/constants/founding-member.ts` and the other source files that implement patented logic — the app needs them to run. Removing them would break the site.
- Any operational docs (launch checklists, notification docs, App Store responses).
- The public patent-export page at `/patent-export`, unless you tell me to take it down.

## Technical notes

- Verified: no build step, edge function, or route reads these markdown files at runtime. `src/components/admin/LegalIPDocuments.tsx` holds only hardcoded filename strings and shows a toast — it never fetches file contents.
- One entry in that component (`PATENT_CLAIMS_21-27_PARTNER_SYSTEM.md`) already points at a file that does not exist in the project. That dead entry gets cleaned up in step 4.
- The two USPTO PDFs referenced at `/documents/patents/...` are not in the repo either — worth confirming where those live.
- Deletion removes the files from the working tree; they remain in Lovable's project history, which is why the Business-plan training exclusion you just enabled is the real protection.

## Your next step

Approve this plan, and I will build the download archive first. Nothing gets deleted until you tell me the files are safely saved.
