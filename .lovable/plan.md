## Add Twin Power Mobile Carwash and Detailing to the Directory

I'll insert this business into your Supabase `businesses` table as an unclaimed listing, marked **verified** so it shows the badge in the directory.

### Business details (pulled from tpmcd.com)

| Field | Value |
|---|---|
| Business name | Twin Power Mobile Carwash and Detailing |
| Category | Mobile Auto Detailing |
| City / State | New York, NY |
| Phone | (716) 313-0556 |
| Website | https://tpmcd.com |
| Description | Professional mobile car detailing — exterior, interior, basic, and truck/SUV packages. They come to you for premium auto detailing at your convenience. Mon–Fri 9am–5pm. |
| Logo | Logo URL from their site |
| Verified | ✅ Yes |
| Listing status | Active |
| Owner | Placeholder owner (the same unclaimed-business owner used for 44k+ other directory listings) — can be claimed later if the real owner signs up |

### What this changes

- One new row added to the `businesses` table — no schema changes, no code changes.
- Business will appear in the directory search, filterable by **Mobile Auto Detailing** category and **New York** location.
- Since it's marked verified, it gets the verified badge.

### What you'll need to do after

1. Open the directory page in the preview and search "Twin Power" — confirm it appears.
2. If you want to claim it to a real owner later, just tell me the user's email and I'll reassign it.

No code edits, no migrations — just a single data insert.