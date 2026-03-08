

# Add Dr. Rachael Institute to the Business Directory

## Business Details (scraped from website)

| Field | Value |
|-------|-------|
| **Name** | Dr. Rachael Institute |
| **Description** | Dr. Rachael Ross's proven, all-natural formulas and training systems for men's health. Certified sexual health education, science-backed supplements, and performance systems. |
| **Category** | Health Services |
| **Address** | 1619 West 5th Avenue |
| **City** | Gary |
| **State** | Indiana |
| **Phone** | +1 (219)-359-3387 |
| **Email** | info@drrachaelinstitute.com |
| **Website** | https://drrachaelinstitute.com |
| **Logo URL** | https://drrachaelinstitute.com/cdn/shop/files/Dr_Rachael_Color_logo_-_no_background.png?v=1748619320 |
| **Banner URL** | https://drrachaelinstitute.com/cdn/shop/files/image_6251b41d-9046-452c-8e03-f09a4c64dcbb.png?v=1754989818&width=480 |
| **Latitude** | 41.6017175 |
| **Longitude** | -87.3577263 |
| **Zip Code** | 46404 |

## Implementation

A single Supabase migration to insert the business into the `businesses` table using the placeholder `owner_id` (`bd72a75e-1310-4f40-9c74-380443b09d9b`) per established convention. The listing will be marked as verified (`is_verified = true`) so it appears in the directory immediately.

No code changes needed — the existing directory fetch logic and mappers will display it automatically.

