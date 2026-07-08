# Enable Agent Integrations (MCP) for 1325.AI

## Goal
Publish 1325.AI as an MCP server so AI assistants (ChatGPT, Claude, Cursor, etc.) can call a small, curated set of app tools on behalf of a signed-in user — under existing Supabase auth + RLS.

## Why now
- New distribution channel: every ChatGPT/Claude user becomes a potential funnel into the directory and rewards.
- Being on the connector list early = discovery moat.
- Uses infrastructure already in place (Supabase auth, RLS, edge functions).

## Auth model: OAuth 2.1 (protected)
The app has user accounts and per-user data (points, scans, redemptions), so a public no-login MCP server is not appropriate. We wire OAuth so each assistant connects **as a real signed-in 1325.AI user**, and every tool call runs under that user's RLS — same rules as the web app.

- Supabase Auth = authorization server (already exists).
- MCP function = resource server (verifies bearer tokens).
- New consent page at `/.lovable/oauth/consent` so users see what they're approving.
- Login route updated to preserve the consent redirect (password, signup, Google).

## v1 tool set (5 tools)

Read-mostly, low-risk, high-value. Each has a clear title + description that will appear in ChatGPT/Claude's connector list.

| Tool | Auth | What it does |
|---|---|---|
| `search_directory` | Public data (still OAuth-gated) | Search businesses by category, city, keyword |
| `get_business` | Public data | Full details for one business by id/slug |
| `list_rewards` | Public data | List active rewards across the marketplace |
| `get_my_points_balance` | Per-user (RLS) | Signed-in user's total points + per-business balances |
| `get_my_recent_scans` | Per-user (RLS) | Signed-in user's last 20 QR scans |

**Explicitly out of scope for v1** (add later after v1 proves out):
- Redeeming rewards, scanning QR codes, booking, payments
- Admin / staff / operator tools
- Kayla agent internals, scoring formulas, sponsor metrics
- Anything touching patent-scored logic (63/969,202)
- Partner commission or founding-member internals

## Brand + metadata
- Server name: `1325-ai-mcp`
- Server title: **"1325.AI"** (per brand rule — not "Mansa Musa Marketplace")
- Description: "Search the 1325.AI directory of Black-owned businesses, browse rewards, and view your loyalty points."
- Favicon: use existing 1325.AI favicon so it shows in the ChatGPT connector list.

## Technical build (what actually gets created)

1. Install `@lovable.dev/mcp-js` + `zod`.
2. Create `src/lib/mcp/tools/` with one file per tool (5 files).
3. Create `src/lib/mcp/index.ts` — registers all 5 tools + OAuth issuer config bound to this project's Supabase.
4. Add `mcpPlugin()` to `vite.config.ts` — auto-generates `supabase/functions/mcp/index.ts` at build time (do not hand-edit).
5. Create `/​.lovable/oauth/consent` route (`src/pages/OAuthConsent.tsx`) with Approve/Deny UI.
6. Update login/signup flow to preserve the `?next=` consent redirect on password, magic-link, AND Google sign-in paths (otherwise "Add to Lovable" silently drops users back on `/`).
7. Run `supabase--configure_oauth_server` to enable OAuth 2.1 + dynamic client registration on Supabase.
8. Deploy the `mcp` edge function.
9. Validate the manifest so it shows up correctly in Lovable's connector list.

## What YOU (the user) will need to do

1. **Approve this plan** — I'll build steps 1–9.
2. **After deploy, test the connection once from ChatGPT:**
   - ChatGPT → Settings → Connectors → Add → paste the MCP URL I give you
   - Sign in with your 1325.AI account
   - Approve the connection on the consent screen
   - Ask ChatGPT: "Using 1325.AI, find hair salons in Chicago" — should return live results.
3. **Tell me if you want v2 tools** (redeem rewards, scan QR from assistant, etc.) once v1 is confirmed working.

## Risks + mitigations
- **DB exposure risk:** Mitigated — every tool uses the signed-in user's token → RLS enforced. No service-role key touches MCP code.
- **IP leak risk:** Mitigated — no scoring/patent logic exposed; only customer-facing surfaces.
- **Support load:** Low — v1 is read-mostly; nothing can be broken by a bad tool call.
- **Rollback:** Deleting `src/lib/mcp/index.ts` and re-deploying removes the MCP server entirely.

## Success criteria
- ChatGPT + Claude can both connect via OAuth, see the 5 tools, and successfully call `search_directory` and `get_my_points_balance` for a real signed-in user.
- Manifest validates with no errors.
- Nothing in the existing web/iOS app changes visibly for regular users.
