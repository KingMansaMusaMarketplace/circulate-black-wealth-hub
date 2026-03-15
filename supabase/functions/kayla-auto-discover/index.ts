import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const TARGET_CITIES = [
  // Georgia
  { city: "Atlanta", state: "GA" }, { city: "Savannah", state: "GA" }, { city: "Augusta", state: "GA" }, { city: "Macon", state: "GA" }, { city: "Columbus", state: "GA" },
  { city: "Albany", state: "GA" }, { city: "Valdosta", state: "GA" }, { city: "Athens", state: "GA" }, { city: "Marietta", state: "GA" }, { city: "Decatur", state: "GA" },
  { city: "East Point", state: "GA" }, { city: "College Park", state: "GA" }, { city: "Stonecrest", state: "GA" },
  // California
  { city: "Los Angeles", state: "CA" }, { city: "Oakland", state: "CA" }, { city: "Sacramento", state: "CA" }, { city: "San Diego", state: "CA" }, { city: "San Francisco", state: "CA" },
  { city: "Compton", state: "CA" }, { city: "Inglewood", state: "CA" }, { city: "Long Beach", state: "CA" }, { city: "Fresno", state: "CA" }, { city: "San Jose", state: "CA" },
  { city: "Riverside", state: "CA" }, { city: "Stockton", state: "CA" }, { city: "Bakersfield", state: "CA" }, { city: "Vallejo", state: "CA" },
  { city: "Palmdale", state: "CA" }, { city: "Moreno Valley", state: "CA" }, { city: "Antioch", state: "CA" }, { city: "Lancaster", state: "CA" },
  // Illinois
  { city: "Chicago", state: "IL" }, { city: "Rockford", state: "IL" }, { city: "Springfield", state: "IL" }, { city: "East St. Louis", state: "IL" },
  { city: "Joliet", state: "IL" }, { city: "Aurora", state: "IL" }, { city: "Evanston", state: "IL" }, { city: "Champaign", state: "IL" },
  // DC / Maryland / Virginia
  { city: "Washington", state: "DC" }, { city: "Baltimore", state: "MD" }, { city: "Silver Spring", state: "MD" }, { city: "Prince George's County", state: "MD" },
  { city: "Richmond", state: "VA" }, { city: "Norfolk", state: "VA" }, { city: "Hampton", state: "VA" }, { city: "Newport News", state: "VA" }, { city: "Virginia Beach", state: "VA" },
  { city: "Bowie", state: "MD" }, { city: "Waldorf", state: "MD" }, { city: "Laurel", state: "MD" }, { city: "Hyattsville", state: "MD" },
  { city: "Petersburg", state: "VA" }, { city: "Chesapeake", state: "VA" }, { city: "Suffolk", state: "VA" }, { city: "Fredericksburg", state: "VA" },
  // Texas
  { city: "Houston", state: "TX" }, { city: "Dallas", state: "TX" }, { city: "San Antonio", state: "TX" }, { city: "Austin", state: "TX" }, { city: "Fort Worth", state: "TX" },
  { city: "Arlington", state: "TX" }, { city: "El Paso", state: "TX" }, { city: "Beaumont", state: "TX" }, { city: "Killeen", state: "TX" },
  { city: "Plano", state: "TX" }, { city: "Garland", state: "TX" }, { city: "Irving", state: "TX" }, { city: "DeSoto", state: "TX" },
  { city: "Cedar Hill", state: "TX" }, { city: "Lancaster", state: "TX" }, { city: "Missouri City", state: "TX" }, { city: "Sugar Land", state: "TX" },
  // Louisiana
  { city: "New Orleans", state: "LA" }, { city: "Baton Rouge", state: "LA" }, { city: "Shreveport", state: "LA" }, { city: "Lafayette", state: "LA" },
  { city: "Lake Charles", state: "LA" }, { city: "Monroe", state: "LA" }, { city: "Alexandria", state: "LA" },
  // Tennessee
  { city: "Nashville", state: "TN" }, { city: "Memphis", state: "TN" }, { city: "Chattanooga", state: "TN" }, { city: "Knoxville", state: "TN" },
  { city: "Clarksville", state: "TN" }, { city: "Murfreesboro", state: "TN" },
  // North Carolina
  { city: "Durham", state: "NC" }, { city: "Charlotte", state: "NC" }, { city: "Raleigh", state: "NC" }, { city: "Greensboro", state: "NC" }, { city: "Winston-Salem", state: "NC" }, { city: "Fayetteville", state: "NC" },
  { city: "Wilmington", state: "NC" }, { city: "High Point", state: "NC" }, { city: "Rocky Mount", state: "NC" }, { city: "Greenville", state: "NC" },
  // New York
  { city: "New York", state: "NY" }, { city: "Harlem", state: "NY" }, { city: "Brooklyn", state: "NY" }, { city: "Bronx", state: "NY" }, { city: "Queens", state: "NY" },
  { city: "Buffalo", state: "NY" }, { city: "Rochester", state: "NY" }, { city: "Syracuse", state: "NY" }, { city: "Albany", state: "NY" }, { city: "Mount Vernon", state: "NY" }, { city: "Hempstead", state: "NY" },
  { city: "Yonkers", state: "NY" }, { city: "White Plains", state: "NY" }, { city: "Jamaica", state: "NY" },
  // Michigan
  { city: "Detroit", state: "MI" }, { city: "Flint", state: "MI" }, { city: "Grand Rapids", state: "MI" }, { city: "Lansing", state: "MI" }, { city: "Saginaw", state: "MI" },
  { city: "Kalamazoo", state: "MI" }, { city: "Southfield", state: "MI" }, { city: "Pontiac", state: "MI" }, { city: "Ypsilanti", state: "MI" },
  // Pennsylvania
  { city: "Philadelphia", state: "PA" }, { city: "Pittsburgh", state: "PA" }, { city: "Harrisburg", state: "PA" },
  { city: "Chester", state: "PA" }, { city: "Reading", state: "PA" }, { city: "Allentown", state: "PA" },
  // Florida
  { city: "Miami", state: "FL" }, { city: "Tampa", state: "FL" }, { city: "Jacksonville", state: "FL" }, { city: "Orlando", state: "FL" }, { city: "Fort Lauderdale", state: "FL" },
  { city: "Tallahassee", state: "FL" }, { city: "St. Petersburg", state: "FL" }, { city: "West Palm Beach", state: "FL" },
  { city: "Gainesville", state: "FL" }, { city: "Miramar", state: "FL" }, { city: "Pompano Beach", state: "FL" }, { city: "Lauderhill", state: "FL" },
  { city: "Opa-locka", state: "FL" }, { city: "Riviera Beach", state: "FL" }, { city: "Pensacola", state: "FL" },
  // Alabama
  { city: "Birmingham", state: "AL" }, { city: "Montgomery", state: "AL" }, { city: "Mobile", state: "AL" }, { city: "Huntsville", state: "AL" }, { city: "Selma", state: "AL" },
  { city: "Tuscaloosa", state: "AL" }, { city: "Dothan", state: "AL" }, { city: "Tuskegee", state: "AL" }, { city: "Bessemer", state: "AL" },
  // Mississippi
  { city: "Jackson", state: "MS" }, { city: "Hattiesburg", state: "MS" }, { city: "Gulfport", state: "MS" }, { city: "Meridian", state: "MS" },
  { city: "Greenville", state: "MS" }, { city: "Vicksburg", state: "MS" }, { city: "Tupelo", state: "MS" }, { city: "Biloxi", state: "MS" },
  // Missouri
  { city: "St. Louis", state: "MO" }, { city: "Kansas City", state: "MO" }, { city: "Ferguson", state: "MO" },
  { city: "Florissant", state: "MO" }, { city: "University City", state: "MO" },
  // Ohio
  { city: "Cleveland", state: "OH" }, { city: "Columbus", state: "OH" }, { city: "Cincinnati", state: "OH" }, { city: "Dayton", state: "OH" }, { city: "Toledo", state: "OH" }, { city: "Akron", state: "OH" },
  { city: "Youngstown", state: "OH" }, { city: "Canton", state: "OH" }, { city: "Lorain", state: "OH" },
  // Indiana
  { city: "Indianapolis", state: "IN" }, { city: "Gary", state: "IN" }, { city: "Fort Wayne", state: "IN" }, { city: "South Bend", state: "IN" },
  { city: "Evansville", state: "IN" }, { city: "Anderson", state: "IN" },
  // Wisconsin
  { city: "Milwaukee", state: "WI" }, { city: "Madison", state: "WI" }, { city: "Racine", state: "WI" },
  { city: "Beloit", state: "WI" }, { city: "Kenosha", state: "WI" },
  // South Carolina
  { city: "Columbia", state: "SC" }, { city: "Charleston", state: "SC" }, { city: "Greenville", state: "SC" }, { city: "North Charleston", state: "SC" },
  { city: "Sumter", state: "SC" }, { city: "Florence", state: "SC" }, { city: "Orangeburg", state: "SC" }, { city: "Rock Hill", state: "SC" },
  // New Jersey
  { city: "Newark", state: "NJ" }, { city: "Jersey City", state: "NJ" }, { city: "Trenton", state: "NJ" }, { city: "Camden", state: "NJ" }, { city: "Paterson", state: "NJ" },
  { city: "East Orange", state: "NJ" }, { city: "Irvington", state: "NJ" }, { city: "Plainfield", state: "NJ" },
  // Connecticut
  { city: "Hartford", state: "CT" }, { city: "New Haven", state: "CT" }, { city: "Bridgeport", state: "CT" },
  { city: "Waterbury", state: "CT" }, { city: "Stamford", state: "CT" },
  // Massachusetts
  { city: "Boston", state: "MA" }, { city: "Springfield", state: "MA" }, { city: "Worcester", state: "MA" }, { city: "Brockton", state: "MA" },
  { city: "Randolph", state: "MA" }, { city: "Dorchester", state: "MA" }, { city: "Mattapan", state: "MA" },
  // Minnesota
  { city: "Minneapolis", state: "MN" }, { city: "St. Paul", state: "MN" }, { city: "Brooklyn Park", state: "MN" },
  // Colorado
  { city: "Denver", state: "CO" }, { city: "Aurora", state: "CO" }, { city: "Colorado Springs", state: "CO" },
  // Arizona
  { city: "Phoenix", state: "AZ" }, { city: "Tucson", state: "AZ" }, { city: "Mesa", state: "AZ" },
  { city: "Chandler", state: "AZ" }, { city: "Tempe", state: "AZ" },
  // Nevada
  { city: "Las Vegas", state: "NV" }, { city: "Henderson", state: "NV" }, { city: "North Las Vegas", state: "NV" }, { city: "Reno", state: "NV" },
  // Oregon
  { city: "Portland", state: "OR" }, { city: "Salem", state: "OR" }, { city: "Eugene", state: "OR" },
  // Washington
  { city: "Seattle", state: "WA" }, { city: "Tacoma", state: "WA" }, { city: "Spokane", state: "WA" }, { city: "Kent", state: "WA" },
  { city: "Federal Way", state: "WA" }, { city: "Renton", state: "WA" },
  // Kansas
  { city: "Wichita", state: "KS" }, { city: "Kansas City", state: "KS" }, { city: "Topeka", state: "KS" },
  // Oklahoma
  { city: "Oklahoma City", state: "OK" }, { city: "Tulsa", state: "OK" }, { city: "Lawton", state: "OK" },
  { city: "Midwest City", state: "OK" }, { city: "Norman", state: "OK" },
  // Arkansas
  { city: "Little Rock", state: "AR" }, { city: "Pine Bluff", state: "AR" }, { city: "Fort Smith", state: "AR" },
  { city: "North Little Rock", state: "AR" }, { city: "West Memphis", state: "AR" },
  // Kentucky
  { city: "Louisville", state: "KY" }, { city: "Lexington", state: "KY" }, { city: "Frankfort", state: "KY" },
  // Iowa
  { city: "Des Moines", state: "IA" }, { city: "Waterloo", state: "IA" }, { city: "Cedar Rapids", state: "IA" },
  // Nebraska
  { city: "Omaha", state: "NE" }, { city: "Lincoln", state: "NE" },
  // West Virginia
  { city: "Charleston", state: "WV" }, { city: "Huntington", state: "WV" },
  // Delaware
  { city: "Wilmington", state: "DE" }, { city: "Dover", state: "DE" },
  // Rhode Island
  { city: "Providence", state: "RI" },
  // Hawaii
  { city: "Honolulu", state: "HI" },
  // Alaska
  { city: "Anchorage", state: "AK" },
  // New Hampshire
  { city: "Manchester", state: "NH" },
  // Vermont
  { city: "Burlington", state: "VT" },
  // Maine
  { city: "Portland", state: "ME" },
  // Montana
  { city: "Billings", state: "MT" },
  // Wyoming
  { city: "Cheyenne", state: "WY" },
  // North Dakota
  { city: "Fargo", state: "ND" },
  // South Dakota
  { city: "Sioux Falls", state: "SD" },
  // Idaho
  { city: "Boise", state: "ID" },
  // Utah
  { city: "Salt Lake City", state: "UT" },
  // New Mexico
  { city: "Albuquerque", state: "NM" },
];

// === MASSIVELY EXPANDED CATEGORIES — ALL types of Black-owned businesses ===
// High-yield: common business types with high discovery rates
const HIGH_YIELD_CATEGORIES = [
  "Restaurant", "Barbershop", "Beauty Salon", "Hair Salon", "Bakery", "Clothing Boutique",
  "Catering", "Coffee Shop", "Fitness Studio", "Health & Wellness", "Home Services",
  "Auto Repair", "Day Spa", "Nail Salon", "Food Truck", "Soul Food Restaurant",
  "Caribbean Restaurant", "African Restaurant", "Vegan Restaurant", "Juice Bar",
  "Cleaning Service", "Landscaping", "Moving Company", "Plumbing", "Electrician",
  "HVAC Service", "Roofing Contractor", "Painting Contractor",
];

// Medium-yield: professional services and specialty businesses
const MEDIUM_YIELD_CATEGORIES = [
  "Real Estate Agent", "Consulting Firm", "Photography Studio", "Art Gallery", "Event Planning",
  "Technology Company", "Tattoo Studio", "Dance Studio", "Music Studio", "Recording Studio",
  "Graphic Design", "Web Development", "Marketing Agency", "PR Firm", "Staffing Agency",
  "Dental Office", "Chiropractic", "Optometrist", "Pharmacy", "Mental Health Counseling",
  "Therapy Practice", "Veterinarian", "Pet Grooming", "Dog Walking Service",
  "Daycare Center", "Tutoring Service", "Driving School", "Music Lessons",
  "Martial Arts Studio", "Yoga Studio", "Pilates Studio", "CrossFit Gym",
  "Print Shop", "Tailor", "Alterations Shop", "Dry Cleaner", "Laundromat",
  "Car Wash", "Auto Detailing", "Tire Shop", "Body Shop",
  "Florist", "Gift Shop", "Bookstore", "Thrift Store", "Vintage Shop",
  "Furniture Store", "Home Decor", "Interior Design",
  "Wedding Planner", "DJ Service", "Party Rental", "Photo Booth Rental",
  "Trucking Company", "Courier Service", "Logistics Company",
  "Security Company", "Private Investigation", "Bail Bonds",
];

// Low-yield but important: professional/niche businesses
const LOW_YIELD_CATEGORIES = [
  "Law Firm", "Accounting Firm", "Tax Preparation", "Insurance Agency", "Financial Advisor",
  "Mortgage Broker", "Investment Firm", "Notary Service",
  "Construction Company", "General Contractor", "Architect", "Engineering Firm",
  "Medical Practice", "Pediatrician", "Dermatologist", "Cardiologist", "OB/GYN",
  "Physical Therapy", "Acupuncture", "Massage Therapy", "Naturopathic Medicine",
  "IT Services", "Cybersecurity", "Software Development", "App Development",
  "E-commerce Store", "Subscription Box", "Online Marketplace",
  "Brewery", "Winery", "Distillery", "Cigar Lounge", "Hookah Lounge",
  "Bed and Breakfast", "Boutique Hotel", "Travel Agency", "Tour Company",
  "Tow Truck", "Pest Control", "Pressure Washing", "Window Cleaning",
  "Appliance Repair", "Computer Repair", "Cell Phone Repair",
  "Jewelry Store", "Watch Repair", "Shoe Repair", "Cobbler",
  "Smoke Shop", "CBD Store", "Dispensary",
  "Barbecue Restaurant", "Seafood Restaurant", "Breakfast & Brunch",
  "Ice Cream Shop", "Dessert Shop", "Candy Store",
  "Meat Market", "Grocery Store", "Specialty Foods", "Spice Shop",
  "Fashion Designer", "Sneaker Store", "Hat Shop", "Wig Shop", "Beauty Supply",
  "Candle Making", "Soap Making", "Cosmetics Brand", "Skincare Brand",
  "Media Production", "Video Production", "Podcast Studio", "Radio Station",
  "Newspaper", "Magazine", "Publishing Company",
  "Nonprofit Organization", "Community Center", "Youth Program",
  "Church", "Mosque", "Ministry",
  "Funeral Home", "Cemetery", "Memorial Service",
  "Pawn Shop", "Check Cashing", "Money Transfer",
  "Auto Dealership", "Used Car Lot", "Car Rental",
  "Real Estate Developer", "Property Management", "Commercial Real Estate",
  "Farm", "Urban Farm", "Nursery", "Garden Center",
  "Woodworking", "Welding", "Machine Shop", "Fabrication",
];

// Build weighted category pool
const CATEGORIES: string[] = [
  ...HIGH_YIELD_CATEGORIES, ...HIGH_YIELD_CATEGORIES, ...HIGH_YIELD_CATEGORIES,
  ...MEDIUM_YIELD_CATEGORIES, ...MEDIUM_YIELD_CATEGORIES,
  ...LOW_YIELD_CATEGORIES,
];

// Alternate search query patterns to avoid repetition and find more results
const QUERY_PATTERNS = [
  (cat: string, city: string, state: string) => 
    `Find ${PER_QUERY_LIMIT} real, currently operating Black-owned ${cat} businesses in ${city}, ${state}.`,
  (cat: string, city: string, state: string) => 
    `List Black-owned ${cat} businesses near ${city}, ${state} area with websites and contact info.`,
  (cat: string, city: string, state: string) => 
    `What are some popular African American owned ${cat} businesses in the ${city}, ${state} metropolitan area?`,
  (cat: string, city: string, state: string) => 
    `Find Black entrepreneurs running ${cat} businesses in and around ${city}, ${state}. Include newer and established businesses.`,
  (cat: string, city: string, state: string) => 
    `Discover lesser-known Black-owned ${cat} businesses in ${city}, ${state} that have their own website.`,
];

const PLACEHOLDER_OWNER_ID = "bd72a75e-1310-4f40-9c74-380443b09d9b";

// === OPTIMIZATION #3: Increased volume per cycle ===
const NUM_SEARCHES = 20;
const PER_QUERY_LIMIT = 8;
const MIN_CONFIDENCE = 0.55;
const SCRAPE_BATCH_SIZE = 10;

// === Category-specific stock banner pools ===
const CATEGORY_BANNER_POOLS: Record<string, string[]> = {
  // Scene-neutral: food/storefront only — no people
  "Restaurant": [
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",  // restaurant interior
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",  // elegant dining room
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80",  // restaurant facade
    "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=800&q=80",  // plated food
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",  // fine dining plate
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80",  // restaurant ambiance
  ],
  // Black barbers — verified Unsplash photos
  "Barbershop": [
    "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&q=80",  // Black barber at work
    "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800&q=80",  // Black barber cutting hair
    "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800&q=80",  // barbershop interior
    "https://images.unsplash.com/photo-1585747860019-8e3e5da3ab?w=800&q=80",  // barber tools
    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80",  // barbershop chair
  ],
  // Scene-neutral: salon interiors/products
  "Beauty Salon": [
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80",  // salon interior
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80",  // beauty products
    "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&q=80",  // salon station
    "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&q=80",  // hair styling tools
    "https://images.unsplash.com/photo-1596178060671-7a80dc8059ea?w=800&q=80",  // braids close-up
  ],
  // Scene-neutral: baked goods only
  "Bakery": [
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80",  // bread display
    "https://images.unsplash.com/photo-1486427944544-d2c246c4d340?w=800&q=80",  // pastries
    "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=800&q=80",  // bakery interior
    "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&q=80",  // cupcakes
    "https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=800&q=80",  // artisan bread
  ],
  // Scene-neutral: clothing racks/stores
  "Clothing": [
    "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=80",  // clothing rack
    "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800&q=80",  // boutique display
    "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80",  // fashion storefront
    "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&q=80",  // clothing store
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80",  // fashion display
  ],
  // Scene-neutral: coffee/cafe interiors
  "Coffee Shop": [
    "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80",  // coffee shop interior
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",  // latte art
    "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80",  // coffee beans
    "https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=800&q=80",  // espresso machine
    "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800&q=80",  // cafe atmosphere
  ],
  // Scene-neutral: gym equipment/spaces
  "Fitness": [
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",  // gym interior
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80",  // weights
    "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&q=80",  // fitness studio
    "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80",  // gym equipment
  ],
  // Scene-neutral: cars/garage
  "Auto Repair": [
    "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&q=80",  // auto shop
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80",  // mechanic tools
    "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&q=80",  // car repair
    "https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=800&q=80",  // garage
  ],
  // Scene-neutral: spa environment
  "Day Spa": [
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80",  // spa stones
    "https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=800&q=80",  // spa products
    "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&q=80",  // candles/oils
    "https://images.unsplash.com/photo-1531299204812-e6d44d9a185c?w=800&q=80",  // spa room
  ],
  // Scene-neutral: catered food
  "Catering": [
    "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80",  // catering setup
    "https://images.unsplash.com/photo-1530062845289-9109b2c9c868?w=800&q=80",  // buffet spread
    "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80",  // elegant food display
    "https://images.unsplash.com/photo-1562967914-608f82629710?w=800&q=80",  // event table
  ],
  // Scene-neutral: buildings/homes
  "Real Estate": [
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",  // house keys
    "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80",  // modern home
    "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800&q=80",  // house exterior
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",  // luxury home
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",  // modern architecture
  ],
  // Scene-neutral: cameras/studio
  "Photography": [
    "https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=800&q=80",  // camera setup
    "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&q=80",  // photo studio
    "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80",  // camera lens
    "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800&q=80",  // studio lighting
  ],
  // Scene-neutral: art/gallery
  "Art Gallery": [
    "https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=800&q=80",  // gallery wall
    "https://images.unsplash.com/photo-1577720643272-265f09367456?w=800&q=80",  // gallery space
    "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80",  // art display
    "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80",  // paint/canvas
  ],
  // Scene-neutral: tech/screens
  "Technology": [
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",  // circuit board
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80",  // tech workspace
    "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80",  // laptop
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",  // tech abstract
  ],
  // Scene-neutral: law books/gavel
  "Legal": [
    "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80",  // gavel
    "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=800&q=80",  // law library
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",  // legal documents
    "https://images.unsplash.com/photo-1521791055366-0d553872125f?w=800&q=80",  // courthouse
  ],
  // Scene-neutral: medical/stethoscope
  "Healthcare": [
    "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80",  // medical equipment
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80",  // hospital corridor
    "https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&q=80",  // stethoscope
    "https://images.unsplash.com/photo-1581056771107-24ca5f033842?w=800&q=80",  // medical supplies
  ],
  // Scene-neutral: documents/office
  "Insurance": [
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",  // signing documents
    "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80",  // financial charts
    "https://images.unsplash.com/photo-1553729459-afe8f2e2ed65?w=800&q=80",  // office desk
  ],
  // Scene-neutral: cleaning supplies
  "Cleaning": [
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80",  // cleaning supplies
    "https://images.unsplash.com/photo-1527515637462-cee1395c0c3f?w=800&q=80",  // clean space
    "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&q=80",  // cleaning products
  ],
  // Scene-neutral: classrooms/books
  "Education": [
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",  // classroom
    "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80",  // campus walkway
    "https://images.unsplash.com/photo-1523050854058-8df90110c476?w=800&q=80",  // library
    "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80",  // books stacked
  ],
  // Black professionals in business settings
  "Consulting": [
    "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80",  // Black businesswoman
    "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&q=80",  // Black professional smiling
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80",  // Black businesswoman at desk
    "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",  // diverse business meeting
  ],
  // Scene-neutral: construction sites/tools
  "Construction": [
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",  // construction site
    "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80",  // building under construction
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80",  // architecture plans
    "https://images.unsplash.com/photo-1590274853856-f22d5ee3d228?w=800&q=80",  // construction tools
  ],
  // Scene-neutral: charts/calculators
  "Accounting": [
    "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80",  // financial data
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",  // analytics dashboard
    "https://images.unsplash.com/photo-1543286386-713bdd548da4?w=800&q=80",  // calculator and reports
  ],
  // Scene-neutral: food trucks
  "Food Truck": [
    "https://images.unsplash.com/photo-1567129937968-cdad8f07e2f8?w=800&q=80",  // food truck exterior
    "https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=800&q=80",  // street food
    "https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?w=800&q=80",  // food truck window
  ],
  // Scene-neutral: brewery/craft beer
  "Brewery": [
    "https://images.unsplash.com/photo-1559526324-593bc073d938?w=800&q=80",  // brewing tanks
    "https://images.unsplash.com/photo-1532634922-8fe0b757fb13?w=800&q=80",  // craft beer taps
    "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=800&q=80",  // beer glasses
  ],
  // Scene-neutral: jewelry display
  "Jewelry": [
    "https://images.unsplash.com/photo-1515562141589-67f0d999b8f6?w=800&q=80",  // jewelry display
    "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80",  // rings
    "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&q=80",  // necklaces
  ],
  // Scene-neutral: flowers/memorial
  "Funeral": [
    "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800&q=80",  // flowers
    "https://images.unsplash.com/photo-1494972308805-463bc619d34e?w=800&q=80",  // memorial wreath
  ],
  // Scene-neutral: pets
  "Pet": [
    "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80",  // dogs running
    "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&q=80",  // pet grooming
    "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80",  // dog portrait
  ],
  // Scene-neutral: travel/destinations
  "Travel": [
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80",  // travel map
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80",  // road trip
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80",  // scenic destination
  ],
  // Scene-neutral: instruments/studio
  "Music": [
    "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80",  // piano keys
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",  // concert stage
    "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&q=80",  // recording studio
  ],
  // Scene-neutral: media equipment
  "Media": [
    "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&q=80",  // microphone
    "https://images.unsplash.com/photo-1598743400863-0e42df1e8507?w=800&q=80",  // podcast setup
    "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80",  // video production
  ],
  // Default: Black professionals and diverse business scenes
  "default": [
    "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80",  // Black businesswoman confident
    "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&q=80",  // Black professional smiling
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80",  // Black businesswoman at desk
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80",  // diverse team collaboration
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80",  // diverse business team
    "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80",  // team working together
    "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",  // diverse office meeting
    "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",  // team brainstorming
  ],
};

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function generateInitialsLogo(businessName: string): string {
  const colorSchemes = [
    { bg: "1a1a2e", fg: "e0a346" },
    { bg: "2d132c", fg: "ee4540" },
    { bg: "0c3547", fg: "42e6a4" },
    { bg: "3c1642", fg: "f7cb15" },
    { bg: "1b2a49", fg: "e8d5b7" },
    { bg: "2c3e50", fg: "e74c3c" },
    { bg: "1a472a", fg: "f0c929" },
    { bg: "4a1942", fg: "e6b422" },
  ];
  const scheme = colorSchemes[simpleHash(businessName) % colorSchemes.length];
  const initials = businessName.split(/\s+/).map(w => w[0]?.toUpperCase()).filter(Boolean).slice(0, 2).join("");
  return `https://placehold.co/400x400/${scheme.bg}/${scheme.fg}?text=${encodeURIComponent(initials)}&font=montserrat`;
}

function getCategoryBanner(category: string, businessId?: string): string {
  let pool: string[] | undefined;
  for (const [key, urls] of Object.entries(CATEGORY_BANNER_POOLS)) {
    if (key === "default") continue;
    if (category.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(category.toLowerCase())) {
      pool = urls;
      break;
    }
  }
  if (!pool) pool = CATEGORY_BANNER_POOLS["default"];
  const hashKey = businessId || category + Math.random().toString();
  const index = simpleHash(hashKey) % pool.length;
  return pool[index];
}

function isValidImageUrl(url: string | null): boolean {
  if (!url) return false;
  const lower = url.toLowerCase();
  if (lower.includes("data:") || lower.includes("pixel") || lower.includes("spacer")) return false;
  if (lower.includes("1x1") || lower.includes("tracking") || lower.includes("analytics")) return false;
  if (lower.includes("favicon.ico")) return false;
  if (lower.length < 15) return false;
  if (!lower.startsWith("http")) return false;
  return true;
}

async function scrapeWebsiteImages(websiteUrl: string, firecrawlKey: string): Promise<{ logo_url: string | null; banner_url: string | null }> {
  const result = { logo_url: null as string | null, banner_url: null as string | null };
  if (!websiteUrl || !firecrawlKey) return result;

  try {
    let url = websiteUrl.trim();
    if (!url.startsWith("http")) url = `https://${url}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${firecrawlKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        formats: ["markdown"],
        onlyMainContent: false,
        timeout: 7000,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text();
      console.log(`[Scrape] Failed for ${url}: ${response.status} - ${errText.substring(0, 100)}`);
      return result;
    }

    const data = await response.json();
    const metadata = data?.data?.metadata || {};
    const markdown = data?.data?.markdown || "";

    if (metadata.ogImage && isValidImageUrl(metadata.ogImage)) {
      result.banner_url = metadata.ogImage;
    }

    if (metadata.favicon && !metadata.favicon.includes(".ico") && isValidImageUrl(metadata.favicon)) {
      result.logo_url = metadata.favicon;
    }

    const imgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    let match;
    const allImages: { alt: string; src: string }[] = [];

    while ((match = imgRegex.exec(markdown)) !== null) {
      const alt = (match[1] || "").toLowerCase();
      const src = match[2];
      if (!isValidImageUrl(src)) continue;
      allImages.push({ alt, src });

      if (alt.includes("logo") || src.toLowerCase().includes("logo")) {
        result.logo_url = src;
      }
      if (!result.banner_url && (alt.includes("hero") || alt.includes("banner") || alt.includes("header") || src.includes("hero") || src.includes("banner"))) {
        result.banner_url = src;
      }
    }

    if (!result.banner_url && metadata.ogImage && isValidImageUrl(metadata.ogImage)) {
      result.banner_url = metadata.ogImage;
    }

    if (!result.banner_url && allImages.length > 0) {
      const contentImage = allImages.find(img =>
        !img.alt.includes("icon") && !img.src.includes("icon") &&
        !img.alt.includes("arrow") && !img.src.includes("arrow")
      );
      if (contentImage) {
        result.banner_url = contentImage.src;
      }
    }

    if (!result.logo_url && result.banner_url) {
      result.logo_url = result.banner_url;
    }

    console.log(`[Scrape] ${url} → logo: ${result.logo_url ? "✅" : "❌"}, banner: ${result.banner_url ? "✅" : "❌"}`);
  } catch (err) {
    console.log(`[Scrape] Error for ${websiteUrl}: ${err instanceof Error ? err.message : "unknown"}`);
  }

  return result;
}

async function geocodeAddress(address: string, city: string, state: string, zipCode: string, mapboxToken: string): Promise<{ latitude: number | null; longitude: number | null }> {
  const result = { latitude: null as number | null, longitude: null as number | null };
  if (!mapboxToken) return result;

  try {
    const fullAddress = [address, city, state, zipCode].filter(Boolean).join(", ");
    if (!fullAddress || fullAddress.length < 5) return result;

    const encoded = encodeURIComponent(fullAddress);
    const geoRes = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encoded}.json?access_token=${mapboxToken}&limit=1&country=us`
    );

    if (!geoRes.ok) {
      await geoRes.text();
      return result;
    }

    const geoData = await geoRes.json();
    const feature = geoData?.features?.[0];
    if (feature?.center) {
      result.longitude = feature.center[0];
      result.latitude = feature.center[1];
    }
  } catch (err) {
    console.log(`[Geocode] Error: ${err instanceof Error ? err.message : "unknown"}`);
  }

  return result;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    const perplexityKey = Deno.env.get("PERPLEXITY_API_KEY");
    const firecrawlKey = Deno.env.get("FIRECRAWL_API_KEY");
    const mapboxToken = Deno.env.get("MAPBOX_PUBLIC_TOKEN");

    if (!perplexityKey) {
      throw new Error("PERPLEXITY_API_KEY not configured");
    }
    if (!firecrawlKey) {
      throw new Error("FIRECRAWL_API_KEY required");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Pick unique city/category combos
    const searchCombos: { city: typeof TARGET_CITIES[0]; category: string; queryPattern: number }[] = [];
    const usedCombos = new Set<string>();

    while (searchCombos.length < NUM_SEARCHES) {
      const city = TARGET_CITIES[Math.floor(Math.random() * TARGET_CITIES.length)];
      const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
      const key = `${city.city}-${category}`;
      if (!usedCombos.has(key)) {
        usedCombos.add(key);
        // Rotate through query patterns for variety
        const queryPattern = Math.floor(Math.random() * QUERY_PATTERNS.length);
        searchCombos.push({ city, category, queryPattern });
      }
    }

    console.log(`[Kayla Auto-Discover] Running ${NUM_SEARCHES} parallel searches (requesting ${PER_QUERY_LIMIT} per query)`);

    // Fire all Perplexity searches in parallel
    const searchPromises = searchCombos.map(async (combo) => {
      const { city: targetCity, category: categoryFocus, queryPattern } = combo;
      const label = `${categoryFocus} in ${targetCity.city}, ${targetCity.state}`;

      try {
        // Use varied query patterns
        const userQuery = QUERY_PATTERNS[queryPattern](categoryFocus, targetCity.city, targetCity.state);

        const perplexityResponse = await fetch("https://api.perplexity.ai/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${perplexityKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "sonar",
            messages: [
              {
                role: "system",
                content: `You are a business research assistant specializing in finding Black-owned businesses across ALL industries and types. Find REAL, currently operating businesses with COMPLETE, ACCURATE information. Every field matters — provide the full street address, working phone number, actual website URL, business hours, and a rich 2-3 sentence description highlighting what makes the business special. Do NOT invent or fabricate any information. If you cannot verify a detail, omit that field rather than guessing. CRITICAL: Every business MUST have a working website URL — do not include businesses without websites. Look for businesses of ALL sizes — from solo entrepreneurs to large companies.`,
              },
              {
                role: "user",
                content: `${userQuery}

IMPORTANT: Only include businesses that have their OWN website (not just a Yelp or Facebook page). The website URL is MANDATORY.

For EACH business provide ALL of the following:
- Exact legal business name
- Rich 2-3 sentence description of what they offer and what makes them special
- Specific category (e.g. "Soul Food Restaurant" not just "Restaurant", "Personal Injury Attorney" not just "Law Firm")
- Complete street address (number and street name)
- City, State (2-letter code), ZIP code
- Phone number (with area code)
- Email address (if publicly available)
- Website URL (full URL including https:// — REQUIRED, must be the business's own website)
- Price range (one of: $, $$, $$$, $$$$)
- Your confidence level (0 to 1) that this business exists and is currently operating

Only include businesses you are highly confident (0.7+) are real and currently open WITH their own website. Quality over quantity.`,
              },
            ],
            temperature: 0.1,
            response_format: {
              type: "json_schema",
              json_schema: {
                name: "discovered_businesses",
                schema: {
                  type: "object",
                  properties: {
                    businesses: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          name: { type: "string", description: "Exact business name" },
                          description: { type: "string", description: "Rich 2-3 sentence description" },
                          category: { type: "string", description: "Specific business category" },
                          address: { type: "string", description: "Full street address" },
                          city: { type: "string" },
                          state: { type: "string", description: "2-letter state code" },
                          zip_code: { type: "string" },
                          phone: { type: "string", description: "Phone with area code" },
                          email: { type: "string" },
                          website: { type: "string", description: "Full website URL — REQUIRED" },
                          price_range: { type: "string", description: "One of: $, $$, $$$, $$$$" },
                          confidence: { type: "number", description: "0-1 confidence this is a real business" },
                        },
                        required: ["name", "description", "category", "address", "city", "state", "website"],
                      },
                    },
                  },
                  required: ["businesses"],
                },
              },
            },
          }),
        });

        if (!perplexityResponse.ok) {
          const errText = await perplexityResponse.text();
          console.error(`[Kayla Auto-Discover] Perplexity error for ${label}: ${perplexityResponse.status} - ${errText.substring(0, 200)}`);
          return { businesses: [], citations: [], label, targetCity, categoryFocus };
        }

        const perplexityData = await perplexityResponse.json();
        const content = perplexityData.choices?.[0]?.message?.content;
        const citations = perplexityData.citations || [];

        if (!content) {
          return { businesses: [], citations, label, targetCity, categoryFocus };
        }

        let discovered: any;
        try {
          discovered = JSON.parse(content);
        } catch {
          return { businesses: [], citations, label, targetCity, categoryFocus };
        }

        const bizList = discovered.businesses || [];
        console.log(`[Kayla Auto-Discover] Found ${bizList.length} candidates for ${label}`);
        return { businesses: bizList, citations, label, targetCity, categoryFocus };
      } catch (err) {
        console.error(`[Kayla Auto-Discover] Search error for ${label}: ${err instanceof Error ? err.message : "unknown"}`);
        return { businesses: [], citations: [], label, targetCity, categoryFocus };
      }
    });

    const searchResults = await Promise.all(searchPromises);

    // Flatten all candidates
    const allCandidates: { biz: any; targetCity: typeof TARGET_CITIES[0]; categoryFocus: string }[] = [];
    let allCitations: string[] = [];

    for (const result of searchResults) {
      allCitations = [...allCitations, ...result.citations];
      for (const biz of result.businesses) {
        allCandidates.push({ biz, targetCity: result.targetCity, categoryFocus: result.categoryFocus });
      }
    }

    console.log(`[Kayla Auto-Discover] Total candidates from ${NUM_SEARCHES} searches: ${allCandidates.length}`);

    if (allCandidates.length === 0) {
      console.log(`[Kayla Auto-Discover] No candidates found across all searches`);
    }

    // Filter basics first, then batch dedup
    let skippedLowConfidence = 0;
    let skippedNoWebsite = 0;
    const viableCandidates: typeof allCandidates = [];

    for (const candidate of allCandidates) {
      const { biz } = candidate;
      if (!biz.name || !biz.city) continue;

      const confidence = biz.confidence ?? 0.5;
      if (confidence < MIN_CONFIDENCE) {
        skippedLowConfidence++;
        continue;
      }

      const websiteUrl = biz.website && biz.website.match(/^https?:\/\/|^www\./) ? biz.website.trim() : null;
      if (!websiteUrl) {
        skippedNoWebsite++;
        continue;
      }

      viableCandidates.push(candidate);
    }

    console.log(`[Kayla Auto-Discover] Viable candidates after basic filter: ${viableCandidates.length}`);

    // BATCH DEDUPLICATION
    let skippedDuplicates = 0;
    const candidateCities = [...new Set(viableCandidates.map(c => c.biz.city.trim().toLowerCase()))];

    // Batch check businesses table
    const { data: existingBusinesses } = await supabase
      .from("businesses")
      .select("name, city")
      .in("city", candidateCities.map(c => c.charAt(0).toUpperCase() + c.slice(1)));

    const existingBizSet = new Set(
      (existingBusinesses || []).map(b => `${b.name?.toLowerCase()}|${b.city?.toLowerCase()}`)
    );

    // Batch check b2b_external_leads table
    const { data: existingLeads } = await supabase
      .from("b2b_external_leads")
      .select("business_name, city")
      .in("city", candidateCities.map(c => c.charAt(0).toUpperCase() + c.slice(1)));

    const existingLeadSet = new Set(
      (existingLeads || []).map(l => `${l.business_name?.toLowerCase()}|${l.city?.toLowerCase()}`)
    );

    const dedupedCandidates = viableCandidates.filter(c => {
      const key = `${c.biz.name.trim().toLowerCase()}|${c.biz.city.trim().toLowerCase()}`;
      if (existingBizSet.has(key) || existingLeadSet.has(key)) {
        skippedDuplicates++;
        return false;
      }
      return true;
    });

    console.log(`[Kayla Auto-Discover] After batch dedup: ${dedupedCandidates.length} (${skippedDuplicates} duplicates removed)`);

    // Parallel enrichment in batches
    let inserted = 0;
    let skippedNoImages = 0;
    const insertedNames: string[] = [];
    const enrichmentDetails: any[] = [];

    for (let i = 0; i < dedupedCandidates.length; i += SCRAPE_BATCH_SIZE) {
      const batch = dedupedCandidates.slice(i, i + SCRAPE_BATCH_SIZE);

      const enrichmentResults = await Promise.allSettled(
        batch.map(async ({ biz, targetCity, categoryFocus: catFocus }) => {
          const websiteUrl = biz.website.trim();

          const [images, coords] = await Promise.all([
            scrapeWebsiteImages(websiteUrl, firecrawlKey),
            biz.address && mapboxToken
              ? geocodeAddress(biz.address, biz.city, biz.state || targetCity.state, biz.zip_code || "", mapboxToken)
              : Promise.resolve({ latitude: null, longitude: null }),
          ]);

          return { biz, targetCity, catFocus, websiteUrl, images, coords };
        })
      );

      for (const result of enrichmentResults) {
        if (result.status === "rejected") {
          console.log(`[Kayla Auto-Discover] Enrichment failed: ${result.reason}`);
          continue;
        }

        const { biz, targetCity, catFocus, websiteUrl, images, coords } = result.value;

        // Tiered image fallback
        let finalLogoUrl = images.logo_url;
        let finalBannerUrl = images.banner_url;
        let imageSource = "website";

        if (!isValidImageUrl(finalLogoUrl)) {
          finalLogoUrl = generateInitialsLogo(biz.name);
          imageSource = "fallback";
        }
        if (!isValidImageUrl(finalBannerUrl)) {
          finalBannerUrl = getCategoryBanner(biz.category || catFocus, biz.name + (biz.city || '') + (biz.state || ''));
          imageSource = imageSource === "fallback" ? "fallback" : "mixed";
        }

        const businessRecord: Record<string, any> = {
          name: biz.name.trim(),
          business_name: biz.name.trim(),
          description: biz.description || `Black-owned ${biz.category || catFocus} business in ${biz.city}, ${biz.state}.`,
          category: biz.category || catFocus,
          address: biz.address || "",
          city: biz.city.trim(),
          state: biz.state?.trim() || targetCity.state,
          zip_code: biz.zip_code || "",
          phone: biz.phone || "",
          email: biz.email || "",
          website: websiteUrl,
          owner_id: PLACEHOLDER_OWNER_ID,
          is_verified: true,
          listing_status: 'live',
          logo_url: finalLogoUrl,
          banner_url: finalBannerUrl,
        };

        if (coords.latitude !== null) businessRecord.latitude = coords.latitude;
        if (coords.longitude !== null) businessRecord.longitude = coords.longitude;

        const { error: insertErr } = await supabase.from("businesses").insert(businessRecord);

        if (insertErr) {
          console.error(`[Kayla Auto-Discover] Insert error for "${biz.name}":`, insertErr.message);
          continue;
        }

        inserted++;
        insertedNames.push(biz.name);
        enrichmentDetails.push({
          name: biz.name,
          category: biz.category || catFocus,
          has_logo: isValidImageUrl(images.logo_url),
          has_banner: isValidImageUrl(images.banner_url),
          image_source: imageSource,
          has_coords: coords.latitude !== null,
          has_phone: !!biz.phone,
          has_website: true,
          confidence: biz.confidence ?? 0.5,
          verified: true,
        });

        console.log(`[Kayla Auto-Discover] ✅ Added "${biz.name}" (${biz.category || catFocus}) | imgs:${imageSource} coords:${coords.latitude ? "✅" : "❌"}`);
      }
    }

    // Log report
    const durationMs = Date.now() - startTime;
    const searchCombosSummary = searchCombos.map(s => `${s.category} in ${s.city.city}, ${s.city.state}`).join("; ");
    const uniqueCategories = [...new Set(searchCombos.map(s => s.category))];
    const reportData = {
      report_type: "auto_discover",
      status: "completed",
      summary: `Expanded discovery: ${NUM_SEARCHES} queries across ${uniqueCategories.length} unique categories. ${allCandidates.length} candidates total. Inserted: ${inserted}, Duplicates: ${skippedDuplicates}, Low confidence: ${skippedLowConfidence}, No website: ${skippedNoWebsite}. Duration: ${durationMs}ms.`,
      details: {
        searches: searchCombosSummary,
        num_searches: NUM_SEARCHES,
        per_query_limit: PER_QUERY_LIMIT,
        unique_categories: uniqueCategories.length,
        candidates_found: allCandidates.length,
        viable_after_filter: viableCandidates.length,
        after_dedup: dedupedCandidates.length,
        inserted,
        skipped_duplicates: skippedDuplicates,
        skipped_low_confidence: skippedLowConfidence,
        skipped_no_website: skippedNoWebsite,
        skipped_no_images: skippedNoImages,
        inserted_names: insertedNames,
        enrichment: enrichmentDetails,
        citations: allCitations,
        duration_ms: durationMs,
        min_confidence: MIN_CONFIDENCE,
        quality_gate: "tiered_image_fallback",
        total_category_pool: CATEGORIES.length,
        optimizations: ["expanded_categories", "query_variations", "parallel_enrichment", "batch_dedup", "tiered_images"],
      },
      issues_found: allCandidates.length,
      issues_fixed: inserted,
    };

    const { error: reportErr } = await supabase.from("kayla_agent_reports").insert(reportData);
    if (reportErr) console.error("[Kayla Auto-Discover] Report insert error:", reportErr.message);

    console.log(`[Kayla Auto-Discover] Complete: ${inserted}/${allCandidates.length} businesses added in ${durationMs}ms`);

    return new Response(
      JSON.stringify({
        success: true,
        searches: NUM_SEARCHES,
        perQueryLimit: PER_QUERY_LIMIT,
        uniqueCategories: uniqueCategories.length,
        candidates: allCandidates.length,
        viable: viableCandidates.length,
        afterDedup: dedupedCandidates.length,
        inserted,
        skippedDuplicates,
        skippedLowConfidence,
        skippedNoWebsite,
        skippedNoImages,
        insertedNames,
        enrichment: enrichmentDetails,
        durationMs,
        optimizations: ["expanded_categories", "query_variations", "parallel_enrichment", "batch_dedup", "tiered_images"],
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("[Kayla Auto-Discover] Error:", errMsg);

    try {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      await supabase.from("kayla_agent_reports").insert({
        report_type: "auto_discover",
        status: "error",
        summary: `Auto-discover failed: ${errMsg}`,
        details: { error: errMsg, duration_ms: Date.now() - startTime },
        issues_found: 0,
        issues_fixed: 0,
      });
    } catch {}

    return new Response(
      JSON.stringify({ success: false, error: errMsg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
