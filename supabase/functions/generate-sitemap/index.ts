import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/xml',
};

const BASE_URL = 'https://1325.ai';

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Generating dynamic sitemap...');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all verified/active businesses
    const { data: businesses, error } = await supabase
      .from('businesses')
      .select('id, business_name, updated_at, category')
      .eq('is_verified', true)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching businesses:', error);
      throw error;
    }

    console.log(`Found ${businesses?.length || 0} verified businesses`);

    // Get unique categories
    const categories = [...new Set(businesses?.map(b => b.category).filter(Boolean) || [])];

    // Static pages with priorities
    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'daily' },
      { url: '/directory', priority: '0.9', changefreq: 'daily' },
      { url: '/about', priority: '0.7', changefreq: 'monthly' },
      { url: '/how-it-works', priority: '0.7', changefreq: 'monthly' },
      { url: '/register', priority: '0.6', changefreq: 'monthly' },
      { url: '/login', priority: '0.5', changefreq: 'monthly' },
      { url: '/sponsor', priority: '0.7', changefreq: 'weekly' },
      { url: '/ambassador', priority: '0.7', changefreq: 'weekly' },
    ];

    const today = new Date().toISOString().split('T')[0];

    // Build XML sitemap
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

    // Add static pages
    for (const page of staticPages) {
      xml += `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
    }

    // Add category pages
    for (const category of categories) {
      const slug = category.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      xml += `  <url>
    <loc>${BASE_URL}/directory?category=${encodeURIComponent(category)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
    }

    // Add business pages
    for (const business of businesses || []) {
      const lastmod = business.updated_at 
        ? new Date(business.updated_at).toISOString().split('T')[0] 
        : today;
      
      xml += `  <url>
    <loc>${BASE_URL}/business/${business.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
    }

    xml += `</urlset>`;

    console.log('Sitemap generated successfully');

    return new Response(xml, {
      headers: corsHeaders,
    });

  } catch (error) {
    console.error('Sitemap generation error:', error);
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}/</loc>
    <priority>1.0</priority>
  </url>
</urlset>`,
      { headers: corsHeaders }
    );
  }
});
