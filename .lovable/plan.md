## Private Boardroom Mode — How it works

From now on, before I make any **major** change to your app, I'll pause and give you a short **Board Check** summary first. You read it, give a thumbs-up (or push back), then I touch code.

Nothing is built right now. This is a working agreement between you and me — Phase 1 of the plan we discussed. The real `/boardroom` page can come later if you want it.

---

### What counts as "major" (triggers a Board Check)

- New pages, routes, or features
- Pricing, tiers, payments, or subscription logic
- Database schema, auth, or user roles
- Public-facing copy on landing, pricing, investor, or press pages
- Brand, naming, or positioning changes
- Anything investor-, patent-, or compliance-adjacent
- Removing or hiding existing features

### What does NOT need a Board Check (I just do it)

- Typo fixes, copy tweaks you explicitly dictate
- Single-line style/color fixes
- Bug fixes with an obvious cause
- Anything you prefix with **"just do it"** or **"no board"**

---

### Board Check format (what you'll see before I code)

A short block at the top of my reply, like this:

```text
🛡️ BOARD CHECK — [change name]
Board: Kayla (chair) + [3–5 relevant specialists]

• Kayla CRO — [revenue/conversion take]
• Kayla IP Shield — [patent/IP take]
• Kayla IR — [investor optics take]
• Kayla Compliance — [legal/Apple/Stripe take]
• Kayla Cash-Flow — [cost/runway take]

VERDICT: ✅ Proceed  /  ⚠️ Proceed with changes  /  🛑 Hold
Recommended adjustments: [1–3 bullets, or "none"]
```

Then I wait for your **"go"** before writing any code.

### Who sits on the board (rotating, not all 33)

Kayla is always chair. I pull in 3–5 specialists per topic based on what's being changed. Examples:

- **Pricing change** → CRO, Cash-Flow, Pricing Optimizer, Compliance
- **New investor page** → IR, IP Shield, Legal, Brand
- **Database/auth change** → Compliance, IP Shield, Cash-Flow
- **Landing page copy** → CRO, Brand, SEO, IR

### Privacy lock

- Board discussions live only in our chat — not shown to other users, not stored in any shared table, not used for training.
- If we later build the real `/boardroom` page (Phase 2), it'll be founder-locked to your user ID, same pattern as `/investor-portal`.

### Your controls (say any of these anytime)

- **"no board"** or **"just do it"** → skip the check for this one change
- **"full board"** → force all 33 to weigh in (noisy, use sparingly)
- **"pause boardroom"** → turn the mode off entirely
- **"summon [agent name]"** → add a specific Kayla agent to the next check
- **"board only"** → give me just the board check, don't code yet

### What changes for you

- Slightly longer replies on major changes (the board block adds ~10 lines)
- Fewer surprises — you'll catch a bad idea *before* code gets written
- No new pages, no new database tables, no new build cost today

---

### Next step after you approve this plan

I save this as a project memory rule so it survives across sessions, then we're live. Your very next major request triggers the first real Board Check.
