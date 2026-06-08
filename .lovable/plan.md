## Plan: Move Business Signup Form Higher on /business-signup

### Goal
Increase conversions by showing the signup form earlier, before users drop off while scrolling through 28 feature cards.

### Current Problem
The Quick Business Signup form is buried at the very bottom of `/business-signup`, after a long hero, quick links, and 28 detailed feature cards. Many visitors never scroll far enough to see it.

### Change
1. **Add** a second instance of the `BusinessSignupForm` (with the beta banner) immediately after the "All Included — No Hidden Fees" heading and before the 28-card services grid.
2. **Keep** the existing form at the bottom of the page for visitors who read through all features and then decide to sign up.

### File Changed
- `src/pages/BusinessSignupPage.tsx` — insert form component + beta banner after line ~535 (closing `</div>` of the section header) and before the grid.

### No other files touched.

### Result
Eager visitors see the signup form early. Thorough visitors still find it at the bottom after reading all features.