

## Crawl Protection: robots.txt + noindex Meta Tags

### 1. Update `robots.txt`

Block sensitive paths from all crawlers while keeping the public directory crawlable:

- `/admin/*` - All admin routes
- `/dashboard/*` and `/business-dashboard/*` - User dashboards
- `/app-functionality-test` - Test pages
- `/api/*` - API endpoints
- Supabase edge function paths

### 2. Add `noindex` Meta Tags to Private Pages

Add `<meta name="robots" content="noindex, nofollow">` via `react-helmet-async` to the following admin/private pages:

- `AdminFraudDetectionPage`
- `AdminSentimentAnalysisPage`
- `AdminVerificationPage`
- `AdminBusinessImport`
- Any other admin/dashboard pages found in the codebase

This ensures even if a crawler ignores `robots.txt`, search engines won't index these pages.

---

### Technical Details

**robots.txt changes:**
```
User-agent: *
Allow: /
Disallow: /admin
Disallow: /dashboard
Disallow: /business-dashboard
Disallow: /app-functionality-test
Disallow: /api/

# Block aggressive scrapers
User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Disallow: /

User-agent: MJ12bot
Disallow: /

# Allow legitimate crawlers
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

Sitemap: https://1325.ai/sitemap.xml
```

**Meta tag pattern** (added to each admin page's existing `<Helmet>` block):
```jsx
<meta name="robots" content="noindex, nofollow" />
```

**Files to modify:**
- `public/robots.txt`
- `src/pages/AdminFraudDetectionPage.tsx`
- `src/pages/AdminSentimentAnalysisPage.tsx`
- `src/pages/AdminVerificationPage.tsx`
- `src/pages/AdminBusinessImport.tsx` (add Helmet with noindex)
- Other admin/dashboard pages found during implementation

