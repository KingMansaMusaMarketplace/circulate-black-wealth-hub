# Add YouTube Channel to 1325.AI

Connect `https://www.youtube.com/@1325AI` to the site so Google treats it as an official 1325.AI property, and give visitors a clickable way to find the channel.

## What this does (plain English)
1. **Invisible SEO signal** — Tells Google "this YouTube channel belongs to 1325.AI." Over the next few weeks, branded searches ("1325.ai", "mansa musa marketplace") start showing your video carousel and Knowledge Panel on Google.
2. **Visible footer icon** — A small YouTube icon appears in the site footer on every page so visitors can jump to your channel.

## Changes

### 1. `index.html` — Organization JSON-LD
Add the YouTube URL to the `sameAs` array inside the existing Organization structured data block. This is the standard Google-recognized way to claim a social profile.

```json
"sameAs": [
  "https://www.youtube.com/@1325AI"
]
```
(If a `sameAs` array already exists, append; don't duplicate.)

### 2. Site footer component
Locate the existing footer component (likely `src/components/Footer.tsx` or similar). Add a YouTube icon link:
- Lucide `Youtube` icon
- Opens `https://www.youtube.com/@1325AI` in a new tab
- `aria-label="1325.AI on YouTube"` for accessibility
- `rel="noopener noreferrer"` for security
- Styled to match any existing social icons (if none exist, use brand colors: MansaGold hover on True Black background)

## What you'll see after publishing
- **Immediately:** YouTube icon visible in the footer on every page.
- **3–14 days:** Google re-crawls, picks up the `sameAs` signal, and starts associating your channel with the 1325.AI brand.
- **30–60 days:** Video results from your channel begin appearing under branded searches; your Knowledge Panel on Google starts pulling in YouTube data (subscriber count, recent videos).

## What you need to do
1. Approve this plan.
2. After it's built, click **Publish** so the change goes live.
3. Optional but recommended: on YouTube, go to your channel's **Customization → Basic info → Links** and add `https://1325.ai` as a link. The two-way link is what makes Google fully trust the connection.

## Out of scope
- No homepage video embed (you chose "Both — SEO + footer icon," not the embed option).
- No other social profiles (you chose YouTube only — easy to add more later).
