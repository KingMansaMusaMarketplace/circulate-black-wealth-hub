# 1325.AI — MCP Native Listing Submissions

Prepared for Thomas Bowling to submit under 1325.AI, Inc.

## Current status
- **Official MCP Registry (Anthropic-backed open standard):** ✅ Listed — `ai.1325/mcp` v0.1.0, status `active`.
  Search URL: https://registry.modelcontextprotocol.io/v0.1/servers?search=ai.1325/mcp
- **Live endpoint:** `https://agoclnqfyinwjxdmjnns.supabase.co/functions/v1/mcp`
- **Branded URL (aspirational):** `https://1325.ai/mcp` — requires a reverse-proxy rewrite at the domain/CDN layer (not a code change). Recommend adding a Cloudflare Worker or edge redirect that forwards `1325.ai/mcp*` → the Supabase function URL, preserving method, headers, and body. Until then, the Supabase URL is the canonical one.

---

## 1) OpenAI ChatGPT — Custom Connector Directory

**Where to submit:** https://platform.openai.com/docs/mcp (Partner listing form linked from the ChatGPT Connectors page). Requires an OpenAI organization account under 1325.AI, Inc.

**Application copy (paste-ready):**

> **Connector name:** 1325.AI Directory
> **Publisher:** 1325.AI, Inc. (Illinois File #75201745)
> **Contact:** Thomas@1325.AI · +1 (312) 900-6004
> **Website:** https://1325.ai
> **MCP server URL:** https://agoclnqfyinwjxdmjnns.supabase.co/functions/v1/mcp
> **Auth:** OAuth 2.1 (Supabase Auth authorization server, dynamic client registration)
> **Categories:** Local business discovery · Small business tools · Community
>
> **Short description (140 chars):** Search verified Black-owned businesses, book services, redeem loyalty QR rewards, and access Kayla AI — the 1325.AI directory.
>
> **Long description:** 1325.AI is the largest verified directory of Black-owned businesses in the United States, with 44,000+ live listings across 50 states. This connector lets ChatGPT search the directory, surface businesses by city / category / rating, retrieve business profiles, check loyalty balances, and hand off to Kayla — our AI concierge — for bookings and support. All tools respect user identity via OAuth; per-user data is protected by row-level security.
>
> **Verified MCP Registry entry:** ai.1325/mcp — https://registry.modelcontextprotocol.io/v0.1/servers?search=ai.1325/mcp

---

## 2) Cursor — MCP Directory

**Where to submit:** https://cursor.com/mcp (Submit server form). Cursor pulls from the official MCP Registry automatically for many entries; if the listing hasn't propagated, submit manually.

**Application copy (paste-ready):**

> **Server name:** 1325.AI
> **Publisher:** 1325.AI, Inc.
> **Homepage:** https://1325.ai
> **MCP URL:** https://agoclnqfyinwjxdmjnns.supabase.co/functions/v1/mcp
> **Transport:** Streamable HTTP
> **Auth:** OAuth 2.1 (DCR supported)
> **Registry ID:** ai.1325/mcp
> **Description:** Verified Black-owned business directory, loyalty QR rewards, and Kayla AI concierge — usable inside Cursor for research, market analysis, and community outreach workflows.

---

## 3) Anthropic Claude — Connectors Directory

The Claude Connectors Directory is **separate from the open MCP Registry**. Claude does **not** auto-discover from the open registry; it only shows connectors that are manually submitted to and approved by Anthropic.

- **Where to submit:** https://claude.ai/admin-settings/directory/submissions/new
- **Who can submit:** A Claude.ai **Team or Enterprise** organization owner, or someone with Directory management access.
- **Server URL:** https://agoclnqfyinwjxdmjnns.supabase.co/functions/v1/mcp
- **Transport:** Streamable HTTP
- **Auth:** OAuth 2.1 (dynamic client registration via Supabase Auth)

**Application copy (paste-ready):**

> **Server name:** 1325.AI
> **Tagline (55 chars):** Search verified Black-owned businesses in the U.S.
> **Description:** 1325.AI is the largest verified directory of Black-owned businesses in the United States, with 44,000+ live listings across 50 states. This connector lets Claude search the directory, find businesses by city / category / rating, retrieve rich business profiles, check loyalty balances, and hand off to Kayla — our AI concierge — for bookings and support. All tools use OAuth and respect user identity; per-user data is protected by row-level security.
> **Categories:** Directory, Commerce, Local business, Community
> **Documentation URL:** https://1325.ai
> **Privacy policy URL:** https://1325.ai/privacy
> **Support contact:** support@1325.ai
> **Icon:** Use the 1325.AI logo / favicon

**What you need before submitting:**
- A Claude.ai **Team or Enterprise** organization under 1325.AI, Inc.
- A published privacy policy at a URL you control (https://1325.ai/privacy is live).
- A test account the reviewer can use to authenticate and run the tools end-to-end.
- You must run every tool yourself first (via MCP Inspector or as a custom connector) and confirm it works.
- Read the review criteria first: https://claude.com/docs/connectors/building/review-criteria

**Review window:** Anthropic typically reviews in 2–6 weeks, depending on queue.

---

## What Thomas needs to do

1. Log in to OpenAI Platform with a 1325.AI business account and submit form #1.
2. Log in to Cursor with a 1325.AI business account and submit form #2.
3. (Optional) Stand up the branded `1325.ai/mcp` proxy — I can wire the Cloudflare Worker code on request, but the DNS/Worker deploy must be done by whoever owns the 1325.ai Cloudflare account.

Typical review windows: OpenAI 2–6 weeks · Cursor 1–3 weeks.
