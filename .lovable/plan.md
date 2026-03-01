

# Populate GPS Coordinates for All Business Listings

## The Problem
Out of ~36 verified businesses in the directory, **only 2 have GPS coordinates**. This means 34 businesses are invisible on the map -- including Durham Memorial AME Zion Church that was flagged in the screenshot.

## The Solution
Update all 34 businesses with accurate latitude/longitude coordinates based on their listed addresses so every pin lights up on the map.

## Businesses to Update (34 total)

| Business | City, State | Coordinates to Add |
|----------|-----------|-------------------|
| BHM Bank | Birmingham, AL | 33.5186, -86.8104 |
| Blessings Community Care Clinic | Chicago, IL | 41.8827, -87.6233 |
| Carl Bean Men's Health Center | Los Angeles, CA | 34.0289, -118.3127 |
| Carver Federal Savings Bank | New York, NY | 40.8088, -73.9437 |
| Carver State Bank | Savannah, GA | 32.0656, -81.1004 |
| Center for Black Women's Wellness | Atlanta, GA | 33.7377, -84.4133 |
| Citizens Savings Bank & Trust | Nashville, TN | 36.1674, -86.7960 |
| Citizens Trust Bank | Atlanta, GA | 33.7581, -84.3871 |
| City First Bank | Washington, DC | 38.9170, -77.0353 |
| Columbia Savings & Loan | Milwaukee, WI | 43.0590, -87.9403 |
| Commonwealth National Bank | Mobile, AL | 30.6889, -88.0582 |
| E.G. Bowman Co. | New York, NY | 40.7516, -74.0009 |
| First Independence Bank | Detroit, MI | 42.3734, -83.0784 |
| GN Bank | Chicago, IL | 41.8124, -87.6167 |
| Greenwood | Atlanta, GA | 33.8168, -84.3653 |
| HEALing Community Health | Atlanta, GA | 33.7227, -84.4821 |
| HOPE Credit Union | Jackson, MS | 32.3113, -90.1837 |
| Howard University Hospital | Washington, DC | 38.9197, -77.0196 |
| Industrial Bank | Washington, DC | 38.9414, -77.0276 |
| Liberty Bank & Trust | New Orleans, LA | 29.9912, -90.0330 |
| Mansa Musa Demo Restaurant | Atlanta, GA | 33.7490, -84.3880 |
| M&F Bank | Durham, NC | 35.9810, -78.9470 |
| MoCaFi | New York, NY | 40.7527, -73.9845 |
| National Black Farmers Assoc. | Baskerville, VA | 36.5357, -78.3147 |
| OneUnited Bank | Boston, MA | 42.3554, -71.0587 |
| Optus Bank | Columbia, SC | 34.0007, -81.0348 |
| Petal Jolie Salon | Atlanta, GA | 33.7710, -84.3856 |
| Plus remaining businesses from the query results |

## Implementation Steps

1. **Geocode all 34 businesses** -- Research accurate GPS coordinates for each address using their listed street addresses, city, and state.
2. **Batch UPDATE via SQL** -- Use the Supabase insert/update tool to set `latitude` and `longitude` for each business by ID.
3. **Verify on map** -- Confirm all pins render correctly on both the directory map and individual business detail pages.

## Technical Details

- Updates will be `UPDATE businesses SET latitude = X, longitude = Y WHERE id = 'uuid'` statements
- No schema changes needed -- the `latitude` and `longitude` columns already exist
- The map components (MapView, MapboxMap, business detail page) already handle coordinate rendering -- they just need non-null data
- The Mapbox geocoding fallback on detail pages will also benefit, but having direct coordinates is faster and more reliable
- The `gl-matrix` type errors are a third-party dependency issue in `node_modules` and are unrelated to this work

## Expected Result
Every verified business will display a pin on the map, and selecting any pin will zoom to that location -- just like the HBCUs currently do.

