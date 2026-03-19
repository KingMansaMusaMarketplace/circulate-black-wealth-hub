

# Fix: Kayla Can't Search Directory for Specific Services

## Root Cause

Kayla's tool functions in `kayla-tools/index.ts` have two search-related issues:

1. **`search_businesses`** only accepts a single `query` string and searches `business_name`, `category`, and `city` using OR logic. When the user says "plumber in Chicago", OpenAI passes `query: "plumber"` — this never filters by city. There is no `city` parameter on this tool.

2. **`get_nearby_businesses`** filters by city but its optional `category` filter does exact-ish matching (`ILIKE '%plumber%'`). Categories in the database are labels like "Plumbing", "Home Services", "Services" — not always matching user terms like "plumber". Neither tool searches the `description` column where specific services are often mentioned.

3. **No description search** — the `description` field (which often contains service details like "plumbing", "electrician", etc.) is never included in search queries.

## Solution

### Step 1: Enhance `search_businesses` tool in `kayla-tools/index.ts`

Add a `city` parameter to the `search_businesses` function so it can filter by both service type and location simultaneously. Also add `description` to the OR search fields.

```
searchBusinesses(supabase, { query, category, city, limit })
```

- If `city` is provided, add `.ilike("city", "%Chicago%")` as an AND filter
- Add `description.ilike.%query%` to the OR clause so service descriptions are searched
- This way "plumber in Chicago" becomes: `(business_name ILIKE '%plumber%' OR category ILIKE '%plumber%' OR description ILIKE '%plumber%') AND city ILIKE '%Chicago%'`

### Step 2: Enhance `get_nearby_businesses` in `kayla-tools/index.ts`

Add `description` to the search when a category filter is provided, using OR logic between `category` and `description`:

```
.or(`category.ilike.%${category}%,description.ilike.%${category}%`)
```

### Step 3: Update tool definitions in `realtime-token/index.ts`

Add the `city` parameter to the `search_businesses` tool schema so OpenAI knows it can pass a city:

```json
{
  "name": "search_businesses",
  "parameters": {
    "properties": {
      "query": { ... },
      "category": { ... },
      "city": { "type": "string", "description": "City to filter results by" },
      "limit": { ... }
    }
  }
}
```

Also update the `get_nearby_businesses` tool description to clarify it also searches descriptions.

### Files Changed

1. `supabase/functions/kayla-tools/index.ts` — enhance `searchBusinesses()` and `getNearbyBusinesses()`
2. `supabase/functions/realtime-token/index.ts` — add `city` param to `search_businesses` tool schema

