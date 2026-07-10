# Publishing 1325.AI to the official MCP Registry

**What this is:** the Model Context Protocol (MCP) Registry is the public catalog
that AI assistants like Claude and ChatGPT pull from when their users search for
tools. Getting 1325.AI listed here means agents can *discover* us on their own —
we go from "someone has to paste a URL" to "1325.AI shows up when they look for a
Black-business tool." Registry URL: <https://registry.modelcontextprotocol.io>.

> **OpenAI's ChatGPT connector marketplace isn't open to third-party submissions
> yet.** As soon as it opens we'll drop the same `server.json` in — this file is
> reusable across both marketplaces.

---

## What we already prepared for you

Everything below is already committed to the repo — you don't have to touch any
of it:

| File | What it is |
| --- | --- |
| `server.json` | The submission manifest (name, description, live MCP URL). |
| `public/.well-known/mcp-registry-auth` | A one-line "domain ownership" file the registry fetches from `https://1325.ai/.well-known/mcp-registry-auth` to prove we own `1325.ai`. |

You just need to **publish the site once** (so the auth file is live at
`https://1325.ai/.well-known/mcp-registry-auth`), then run **four terminal
commands** to submit. That's it.

---

## Step 1 — Publish the site

Click **Publish** in Lovable so the new `.well-known/mcp-registry-auth` file is
live. You can verify by visiting this URL in your browser — it should show a
single line starting with `v=MCPv1;`:

<https://1325.ai/.well-known/mcp-registry-auth>

---

## Step 2 — Install the `mcp-publisher` command (one-time, ~30 seconds)

Open the **Terminal** app on your Mac and paste this whole block:

```bash
brew install mcp-publisher
```

(If you don't have Homebrew, install it first from <https://brew.sh>.)

---

## Step 3 — Log in with our domain key

Paste this entire block into Terminal. It tells the registry "I own 1325.ai"
using the private key that pairs with the public key already live on our site:

```bash
mcp-publisher login dns \
  --domain 1325.ai \
  --private-key ae691e6e29464c780684db0b342697221832d4218efeff494791d033652e1725
```

You should see: `✓ Successfully logged in`.

> **Keep that key private.** It's the "password" that proves domain ownership to
> the registry. Don't post it anywhere public. If it ever leaks, tell me and
> I'll rotate it (regenerate the pair and update the `.well-known` file).

---

## Step 4 — Submit

Still in Terminal, `cd` into your project folder (or wherever you downloaded
`server.json`), then run:

```bash
mcp-publisher publish
```

Expected output:

```
Publishing to https://registry.modelcontextprotocol.io...
✓ Successfully published
✓ Server ai.1325/mcp version 0.1.0
```

---

## Step 5 — Verify we're listed

Paste this into Terminal (or open it in a browser):

```bash
curl "https://registry.modelcontextprotocol.io/v0.1/servers?search=ai.1325/mcp"
```

You should see a JSON blob that includes `"name":"ai.1325/mcp"`. You're live.

You can also search the public registry page at
<https://registry.modelcontextprotocol.io> for **1325.AI**.

---

## Later — publishing an update

When we add tools or change the description, just:

1. Bump `"version"` in `server.json` (e.g. `0.1.0` → `0.2.0`).
2. Run `mcp-publisher publish` again.

Login stays valid for a while; if it expires, re-run Step 3.

---

## What this does *not* do

- It does **not** put us on OpenAI's connector list — that marketplace isn't
  open to third-party submissions yet. Same `server.json` will work when it is.
- It does **not** replace the "Connect to ChatGPT" page at `/connect-chatgpt` —
  that's still how users on Claude/ChatGPT paste our URL today. The registry
  just makes us *discoverable* so they don't have to.
