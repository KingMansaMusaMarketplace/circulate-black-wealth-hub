## Goal
Make the Directory page the new landing page at `/`, preserve the current homepage at `/about-1325`, and keep signup pathways intact.

## Changes

**1. Route swap** (`src/App.tsx` or wherever routes are declared)
- `/` → renders `DirectoryPage`
- `/about-1325` → renders `HomePage` (nothing lost — investors, press, and internal CTAs still land on the full story)
- `/directory` → redirect to `/` (consolidates SEO ranking, keeps old links working)

**2. Slim signup strip on the new home (Directory)**
- One-line bar above the Directory content: "🌍 The Global Black-Owned Business Directory — Join 1325.AI" + two buttons: **"Add your business"** and **"Sign up free"**
- Dismissible, uses existing brand tokens (mansagold / mansablue). Keeps Directory clean but preserves the signup nudge the old homepage provided.

**3. Head metadata (SEO)**
- New `/` (Directory): title → *"1325.AI — The Global Black-Owned Business Directory"*; description → discovery-focused copy
- New `/about-1325` (old Home): title → *"About 1325.AI — Our Mission & The Movement"*; canonical + og:url self-reference the new path
- Update `index.html` sitewide fallback title/description to match the new `/`
- Verify `OrganizationStructuredData` + `WebsiteStructuredData` render on the new `/`

**4. Internal link cleanup**
- Header/footer "Home" links → `/` (unchanged behavior, new content)
- Any CTA that currently says "Browse Directory" and points to `/directory` → point to `/`
- "Learn more / About" style links → `/about-1325`
- Sweep `WelcomePage`, nav components, and any hard-coded `/directory` or `/` links

**5. Sitemap**
- `public/sitemap.xml`: `/` priority 1.0, add `/about-1325` at 0.7, keep `/directory` entry removed or 301'd

## Out of scope
- No changes to business data, search, filters, Supabase, auth, loyalty, or edge functions
- No visual redesign of Directory itself — just adds the signup strip on top
- No changes to `public/_redirects` (Lovable hosting handles SPA fallback automatically)

## Technical notes
- Redirect from `/directory` → `/` uses React Router's `<Navigate to="/" replace />`
- Old homepage keeps its full component tree (Hero, PromiseBanner, BusinessSubmissionBox, etc.) — only its URL changes
- Social preview crawlers see `index.html` head only (SPA limitation) — I'll update that so shares of `1325.ai` show the new directory-focused title/description

## What you need to do after I build it
1. Click **Rescan** in the SEO tab so Google gets the new sitemap
2. Test these URLs after publish: `/` (should show directory), `/directory` (should redirect to `/`), `/about-1325` (should show old homepage)
3. If you share the link on LinkedIn/Facebook and see the old preview, use their link-preview debugger to force a re-fetch (crawlers cache previews)

Ready to build — approve and I'll ship it.
