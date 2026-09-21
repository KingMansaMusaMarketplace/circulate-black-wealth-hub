# Make the three homepage links look clickable

Right now "For Investors", "Meet the Team", and "Founder Video" sit under the main buttons as plain uppercase words with a small gold dot beside each. Nothing tells a visitor they can be clicked.

## What changes

Turn each of the three into a clearly tappable pill button:

- A thin outlined rounded button with a subtle dark background behind each label, so it reads as a button instead of a line of text.
- A small icon in front of each label: a chart icon for For Investors, a people icon for Meet the Team, a play icon for Founder Video.
- The gold dot is replaced by a small arrow that slides forward on hover (the play icon keeps its meaning for the video).
- On hover/tap the border and text turn gold and the button lifts slightly, matching the existing gold and white buttons above.
- Founder Video keeps its "opens in a new tab" behavior and gains a matching label for screen readers.
- Comfortable tap size on phones (at least 44px tall) and the three wrap neatly on narrow screens.

Nothing else on the homepage moves; the buttons stay in the same spot, just below the three main calls to action.

## Technical notes

Single-file change in `src/pages/HomePage.tsx`, lines 128-146: replace the bare `Link`/`a` row with pill-styled anchors using existing semantic classes (`border-white/25`, `bg-white/5`, `text-mansagold` on hover) and Lucide icons (`TrendingUp`, `Users`, `PlayCircle`, `ArrowRight`). No routing, data, or copy changes.
