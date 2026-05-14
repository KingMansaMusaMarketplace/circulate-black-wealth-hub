# Verify mansamusamarketplace.com in Google Search Console

## Goal
Add `mansamusamarketplace.com` as a verified property in your Google Search Console so search data flows in for that domain (which redirects to 1325.AI).

## Steps

1. **Request a verification token from Google** via the Search Console API (using your already-connected GSC account).
2. **Add the meta tag to `index.html`** inside the `<head>` so it's served on the live site.
3. **You publish the site** by clicking the Publish button (frontend changes require a publish to go live).
4. **Tell Google to verify** the domain via the API — Google fetches your homepage and confirms the meta tag.
5. **Add the verified site** as a property in your Search Console list via the API.
6. **Confirm** the property appears in your GSC property dropdown.

## What you need to do
- Approve this plan
- After I add the meta tag, click **Publish → Update** so the change goes live
- Tell me when published, and I'll trigger the Google verification step

## Technical details
- Method: META tag (no DNS changes needed in Vercel)
- Identifier registered: `https://mansamusamarketplace.com/`
- File changed: `index.html` (single line added inside `<head>`)
- API: Google Site Verification + Search Console via Lovable connector gateway
- Existing `1325.ai` and `mansamusamarketplace.com` properties are unaffected
