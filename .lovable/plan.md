

### Plan: Update YouTube channel URL to use `www.` prefix

**File: `src/config/site.ts`**
- Change line 60: `channelUrl: 'https://youtube.com/@1325AI'` → `'https://www.youtube.com/@1325AI'`

That single config value is read by every "Visit Channel" button across the site (HomePage, HowItWorks, etc.), so this one edit propagates everywhere.

### Out of scope
- No changes to `social.youtube` (already correct).
- No edge function or API key changes.

