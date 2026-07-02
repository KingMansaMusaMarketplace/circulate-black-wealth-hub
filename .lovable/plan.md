
## Where to put "The Promise"

**Recommendation:** Place it as its own **"Promise Banner"** section directly **below the Hero and above the rest of the homepage sections**. This is the highest-value real estate after the hero — visitors have just read the headline and are deciding whether to keep scrolling. A short, bold promise here answers the "so what?" question in one line.

### Why not other spots
- **Inside the Hero:** Would compete with the headline and search bar, making the hero feel crowded (the same overlap problem we just fixed on the dossier).
- **Footer or mid-page:** Too far down. Most visitors never scroll that far, so the promise gets wasted.
- **Homepage sub-sections:** Would blend in with feature copy instead of standing out as a brand pledge.

### What it will look like (plain English)
A full-width band with:
- A subtle **dark navy → black gradient** background so it stands out from the hero above and the content below.
- A **thin MansaGold top and bottom border** to frame it as a "statement."
- The word **"The Promise"** in small gold uppercase (eyebrow label).
- The full sentence in **large white serif-ish display type**, centered, max width ~900px so it reads like a pledge, not a paragraph.
- One small **"Read our founding story →"** text link underneath (optional — points to /about or the investor page).
- Fades in on scroll (same motion style as the rest of the homepage).

### Where in the code it goes
- New component: `src/components/HomePage/PromiseBanner.tsx`
- Inserted in `src/pages/HomePage.tsx` **between `<Hero />` and `<HomePageSections />`**, wrapped in a `SectionErrorBoundary` like the other sections.
- Uses only semantic design tokens (`bg-background`, `text-foreground`, `border-mansagold`) — no hardcoded colors, so it stays on-brand in dark mode.

### Copy (exactly as you wrote it)
> **The Promise**
> 1325.AI helps Black-owned businesses make more money, save time, and keep wealth circulating — without hiring a full staff or learning new technology.

### Optional add-ons (say yes/no)
1. Add three small icon chips under the sentence: **💰 Make More** · **⏱ Save Time** · **🔄 Circulate Wealth** — reinforces the three benefits visually.
2. Add a **"See how it works"** button that jumps to the Kayla demo section.
3. Also surface the same promise on the **About page** hero and the **Business Signup** page for consistency.

### What you need to do
Just reply with:
- **"Go"** to build it as described, or
- **"Go + 1, 2, 3"** to include any of the optional add-ons, or
- Tell me a different spot if you'd rather see it inside the hero or elsewhere.
