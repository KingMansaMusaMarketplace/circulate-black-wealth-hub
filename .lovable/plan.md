

## Add Caribbean Islands to Kayla's Discovery System

### What changes

**1. Add Caribbean cities/islands to `TARGET_CITIES`** (~25 entries covering major Caribbean nations with significant Afro-Caribbean populations):
- Jamaica: Kingston, Montego Bay
- Trinidad & Tobago: Port of Spain, San Fernando
- Bahamas: Nassau, Freeport
- Barbados: Bridgetown
- Haiti: Port-au-Prince, Cap-Haïtien
- Dominican Republic: Santo Domingo, Santiago
- US Virgin Islands: Charlotte Amalie, Christiansted
- Puerto Rico: San Juan, Ponce
- Curaçao: Willemstad
- Antigua: St. John's
- St. Lucia: Castries
- Grenada: St. George's
- St. Kitts: Basseterre
- Bermuda: Hamilton
- Cayman Islands: George Town
- Turks & Caicos: Providenciales
- Belize: Belize City

Each entry will use a country code as the "state" field (e.g., `"JM"`, `"TT"`, `"BS"`, `"BB"`, `"HT"`, `"DO"`, `"USVI"`, `"PR"`, `"CW"`, `"AG"`, `"LC"`, `"GD"`, `"KN"`, `"BM"`, `"KY"`, `"TC"`, `"BZ"`).

**2. Add `CARIBBEAN_CODES` set** with all the country codes above.

**3. Update helper functions:**
- `isCaribbean(state)` — checks if code is in the Caribbean set
- `locationLabel` — appends the country name for Caribbean entries (e.g., "Kingston, Jamaica")
- `ethnicLabel` — returns `"Afro-Caribbean"` or `"Black-owned"` for Caribbean searches

**4. Redeploy** the `kayla-auto-discover` edge function.

### File modified
- `supabase/functions/kayla-auto-discover/index.ts`

### Technical notes
- A mapping object from code to country name will be used for `locationLabel` (e.g., `{ JM: "Jamaica", TT: "Trinidad & Tobago", ... }`)
- The Caribbean will naturally rotate into Kayla's search cycles alongside US, Canada, and Mexico

