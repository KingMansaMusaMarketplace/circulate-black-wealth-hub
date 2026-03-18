

## Add United Kingdom to Kayla's Discovery System

### What changes

**1. Add ~20 UK cities to `TARGET_CITIES`** covering areas with significant Black British populations:
- London, Birmingham, Manchester, Bristol, Leeds, Liverpool, Nottingham, Leicester, Luton, Croydon, Hackney, Brixton, Tottenham, Peckham, Lewisham, Wolverhampton, Coventry, Sheffield, Reading, Milton Keynes

Each entry uses a region/country code as the "state" field (e.g., `"ENG"`, `"SCT"`, `"WAL"`), or more granular like `"LDN"` for London boroughs.

**2. Add `UK_CODES` set** — `new Set(["ENG", "SCT", "WAL"])`

**3. Add `UK_NAMES` mapping** — `{ ENG: "England", SCT: "Scotland", WAL: "Wales" }`

**4. Update helper functions:**
- Add `isUK(state)` check
- Update `locationLabel` — appends "United Kingdom" (e.g., "London, England, United Kingdom")
- Update `ethnicLabel` — returns `"Black British"` for UK searches

**5. Redeploy** the edge function.

### File modified
- `supabase/functions/kayla-auto-discover/index.ts`

### Technical details
- UK entries inserted after the Caribbean block in `TARGET_CITIES`
- Helper chain updated: `isCaribbean → isUK → isMexican → isCanadian → default`
- Uses `"Black British"` as the ethnic label for culturally appropriate search queries

