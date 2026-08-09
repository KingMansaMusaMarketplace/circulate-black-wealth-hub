# Protect 1325.AI IP and Backend on Lovable

You are currently on a **Pro plan**. Your project is published as **public** and the Lovable badge is already hidden. The goal is to make sure your source code, patent material, and backend architecture are not exposed to Lovable's AI training or to the public.

## What is already true today

- **Your backend is NOT on Lovable.** It lives in your own Supabase project (`agoclnqfyinwjxdmjnns`). Lovable does not host your database, users, transactions, or business data. Supabase does.
- **Your source code IS visible to Lovable.** While you build, the Lovable editor and AI can read your project files, code, prompts, and generated outputs. On a Pro plan, that content may be used for AI model training unless you opt out.
- **Your published website is public.** Anyone with the URL can visit it, but they cannot see your source code or backend.
- **Your patent documents are in the project.** Files like `docs/PATENT_CLAIM_2_TEMPORAL_FOUNDING_STATUS.md` are in the Lovable workspace, so they are visible to the Lovable editor.

## Recommended path: upgrade to Business or Enterprise

Because you want maximum privacy and are willing to pay for it, the plan is to upgrade your Lovable workspace to **Business** or **Enterprise**. On those plans, workspace data is excluded from AI model training by default.

For your situation, **Business is the right choice for now**. It solves the immediate problem: your workspace data is excluded from AI training by default, and you can make the project private with restricted access. It is also less expensive than Enterprise while still giving you the core protections you need.

**Choose Enterprise only if** one of these is true:
- You need audit logs for compliance or investor due diligence.
- You want single sign-on (SSO) or automatic user provisioning for a larger team.
- You want the option to self-host the code or keep data in a specific region.
- You want a dedicated Lovable account team for support and contract negotiation.

For a single founder protecting patent IP, **Business is the practical next step**. You can upgrade to Enterprise later if your team or compliance needs grow.

| Plan | Training Data | Best For | Recommendation |
|------|---------------|----------|----------------|
| **Pro** | Must opt out per individual | Current plan | Not enough for your IP risk |
| **Business** | Workspace excluded from training by default | Teams that need privacy + role controls | **Get this now** |
| **Enterprise** | Workspace excluded + SCIM, audit logs, self-hosted options | Maximum control and compliance | Consider later |


## What this plan will do

1. **Upgrade the workspace** (you do this in Lovable settings).
2. **Lock down the project** after upgrade: make the published site private, restrict editor access, and set workspace roles.
3. **Audit sensitive files** in `docs/` and `src/` to decide what should stay, move, or be removed from the Lovable workspace.
4. **Document the backend sovereignty** so it is clear that user data and transactions live on Supabase, not Lovable.
5. **Turn on individual training opt-out** for every workspace member until the upgrade is complete.

## Steps

### Step 1: Upgrade the Lovable workspace

- Go to **Settings → Plans & credits** in your Lovable workspace.
- Choose **Business** or **Enterprise** and complete the upgrade.
- If you choose Enterprise, contact Lovable sales to discuss the Data Processing Agreement and any self-hosted options.

### Step 2: Lock down project visibility and access

After the upgrade is active:

- Set the **published site** to **private** so only workspace members can view it.
- Set **project editor access** to **Restricted** so only the owner and invited collaborators can open or edit the project.
- Configure workspace roles: Owner, Admin, Editor, and Viewer.

### Step 3: Audit sensitive IP files

I will review files in the project that contain patent claims, proprietary logic, or confidential business information. For each file, we will decide one of three actions:

- **Keep** in Lovable because it is part of the deployed app.
- **Move** to an external private repository (e.g., a private GitHub repo or legal document store) if it is not needed for the app to run.
- **Remove** from the project if it is outdated or no longer needed.

High-priority files to review:

- `docs/PATENT_CLAIM_2_TEMPORAL_FOUNDING_STATUS.md`
- `docs/SECURITY_DEFINER_AUDIT_MAY_2026.md`
- `docs/SECURITY_DEFINER_VIEW_ANALYSIS.md`
- `docs/MAURICE_ISSUES_FIX.md`
- `docs/SPONSOR_METRICS_AUTOMATION.md`
- Any other documents marked confidential or containing patent language.

### Step 4: Document backend sovereignty

I will create a short internal document in the project that explains:

- The app is a React frontend built in Lovable.
- The backend is Supabase (`agoclnqfyinwjxdmjnns`), not Lovable.
- User data, transactions, and business records live in Supabase and are protected by Row Level Security (RLS) policies.
- Lovable does not have access to the Supabase database or service-role key.

This document is useful for investors, partners, and your own legal team.

### Step 5: Enable individual training opt-out until upgrade completes

Until the workspace upgrade is confirmed, every workspace member should go to **Account Settings → Privacy** and turn on **Data collection opt out**. This is a free, immediate step that prevents Lovable from using that individual's prompts and code for AI training.

## What this plan will NOT do

- It will not move your Supabase backend. Your backend is already external and under your control.
- It will not guarantee that the public internet cannot see your published website. After the upgrade, we will make the published site private.
- It will not give you full self-hosting of the code. If you want the code to leave Lovable entirely, that requires a separate migration plan.

## Next decision

After you approve this plan, I will first confirm the workspace upgrade is in place, then make the visibility changes and start the sensitive-file audit. If you prefer to skip the upgrade and instead move the code to a private GitHub repo, tell me and I will write a different plan.
