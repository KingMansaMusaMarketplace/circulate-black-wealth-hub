
## Add National Black Farmers Association to the Directory

### What This Does
Inserts the **National Black Farmers Association (NBFA)** — founded by John Boyd Jr. — into the business directory database as a verified listing.

### Data to Be Inserted

| Field | Value |
|---|---|
| Name | National Black Farmers Association (NBFA) |
| Category | Agriculture |
| Address | Baskerville, VA 23915 |
| City | Baskerville |
| State | VA |
| Phone | (804) 691-8528 |
| Email | Johnwesleyboydjr@gmail.com |
| Website | https://www.blackfarmers.org |
| Description | Non-profit org representing African American farmers and families across the U.S. Advocates for civil rights, land retention, fair lending, agricultural education, and rural economic development for Black and small farmers. |
| is_verified | true |
| listing_status | live |

### Technical Steps

1. **Insert via SQL** — Use the Supabase insert tool to add the record to the `businesses` table with a generated UUID, the standard placeholder `owner_id`, and all contact fields populated.

2. **Set listing_status to `live`** — So it immediately appears in the `business_directory` view (which filters for `is_verified = true` OR `listing_status = live`).

3. **Category** — Will be inserted as `"Agriculture"` to align with the existing category taxonomy in the directory.

4. **No banner/logo image** needed at insert time — The directory will use a placeholder; a local asset can be added as a follow-up to meet the institutional visual standard.

### Files / Resources Affected
- Supabase `businesses` table — 1 new row inserted
- No code changes required; the directory will pick it up automatically from the `business_directory` view
