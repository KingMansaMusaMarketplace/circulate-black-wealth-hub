# Team Edition Manual v2 — Make It Feel Like 1325.AI

You're right — v1 reads generic because it has no visuals and the agents are just a list. v2 fixes that without exposing secret sauce.

## What changes from v1

**1. Add real visuals (the biggest fix)**
- Cover page: 1325.AI logo + brand mark, not just text
- Capture 4–6 live screenshots from the running preview:
  - Home/landing
  - Directory page (with the featured business work we just did)
  - A business detail page
  - Kayla chat / Kayla Team page
  - Loyalty / QR scan flow
  - Investor portal entry (blurred if needed)
- Each screenshot framed in a clean macOS-style window with a subtle MansaBlue→black gradient background (using the product-shot skill)
- Brand divider bars in MansaGold between sections
- A simple visual diagram of the ecosystem: **Customer ↔ Business ↔ Kayla + 41 Agents** (boxes and arrows, no architecture)

**2. Founder story section (new, 1 page)**
- Why "1325" — the year and the meaning
- The moment the vision clicked
- Why this team, why now
- Written in your voice from the email (plain, personal, gratitude-forward)
- *I'll draft this from your email + memory; you edit before final*

**3. Customer scenarios (new, 1–2 pages)**
Three short "a day in the life" vignettes, no tech jargon:
- **Maya, the customer** — walks into a Black-owned coffee shop, scans the QR, earns points, gets a personalized rec from Kayla
- **James, the business owner** — signs up, Kayla helps him write his listing, his first 5 customers come through the directory in week one
- **The team** — bi-weekly sync, Kayla surfaces which businesses need attention, agents handle outreach overnight

**4. Agent personas (upgrade, not list)**
Instead of 42 one-liners, feature **8–10 "headliner" agents** with:
- Name + role + a one-sentence personality
- A sample thing they'd say ("Hey, I noticed 3 new businesses in Atlanta haven't been verified — want me to start outreach?")
- The other 32 grouped by department in a clean visual roster (still named, but compact)

**5. Keep from v1**
- Your personal letter (cover/intro)
- Vision & mission
- What's live today
- Roadmap & team-wins section
- All the same exclusions: no architecture, no patent/USPTO, no investor $ figures

## Visual style
- MansaBlue `#003366` + MansaGold `#FFB300` on near-black
- Inter/Arial body, larger type than v1 (more breathing room)
- Each section gets a hero strip with gold accent line
- ~12–14 pages (slightly longer than v1 because of visuals, but easier to skim)

## Technical notes (for me)
- Use Playwright headless against the local preview to capture screenshots → `/tmp/shots/`
- Pipe each through the product-shot skill for the window-frame treatment
- Build PDF with ReportLab (same as v1), embed PNGs as full-width figures
- Output: `/mnt/documents/1325AI_Team_Edition_v2.pdf`
- Visual QA pass: render every page to PNG and inspect before delivering

## What I need from you
Just a **"go"** and I'll build v2. Two optional tweaks you can call now:
1. Want me to **pick the 8–10 headliner agents** myself (I'll choose the ones most visible to the team — Kayla, the outreach lead, the loyalty agent, etc.), or do you want to name them?
2. Any screen you specifically **don't** want screenshotted (e.g. investor portal)?
