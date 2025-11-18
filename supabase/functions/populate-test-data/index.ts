import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Starting test data population...');

    // Create test user profile first
    const testUserId = crypto.randomUUID();
    
    // Sample businesses data
    const businesses = [
      {
        id: crypto.randomUUID(),
        business_name: "Soul Food Kitchen",
        name: "Soul Food Kitchen",
        owner_id: testUserId,
        category: "Food & Beverage",
        description: "Authentic Southern soul food with family recipes passed down for generations. Experience the taste of home with our famous fried chicken, collard greens, and sweet potato pie.",
        address: "123 Martin Luther King Jr Blvd",
        city: "Atlanta",
        state: "GA",
        zip_code: "30303",
        phone: "(404) 555-0123",
        email: "info@soulfoodkitchen.com",
        website: "https://soulfoodkitchen.com",
        is_verified: true,
        average_rating: 4.8,
        review_count: 127,
        logo_url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=400&fit=crop",
        banner_url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=400&fit=crop"
      },
      {
        id: crypto.randomUUID(),
        business_name: "Royal Hair Salon",
        name: "Royal Hair Salon",
        owner_id: testUserId,
        category: "Beauty & Personal Care",
        description: "Premium hair care services specializing in natural hair, braids, locs, and protective styles. We celebrate and enhance your natural beauty.",
        address: "456 Peachtree Street NE",
        city: "Atlanta",
        state: "GA",
        zip_code: "30308",
        phone: "(404) 555-0456",
        email: "book@royalhairsalon.com",
        website: "https://royalhairsalon.com",
        is_verified: true,
        average_rating: 4.9,
        review_count: 89,
        logo_url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=400&fit=crop",
        banner_url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&h=400&fit=crop"
      },
      {
        id: crypto.randomUUID(),
        business_name: "Urban Tech Solutions",
        name: "Urban Tech Solutions",
        owner_id: testUserId,
        category: "Technology",
        description: "Innovative tech solutions and consulting services. We help small businesses leverage technology to grow and compete in the digital age.",
        address: "789 Tech Park Drive",
        city: "San Francisco",
        state: "CA",
        zip_code: "94102",
        phone: "(415) 555-0789",
        email: "hello@urbantechsolutions.com",
        website: "https://urbantechsolutions.com",
        is_verified: true,
        average_rating: 4.7,
        review_count: 56,
        logo_url: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=400&fit=crop",
        banner_url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=400&fit=crop"
      },
      {
        id: crypto.randomUUID(),
        business_name: "Heritage Bookstore",
        name: "Heritage Bookstore",
        owner_id: testUserId,
        category: "Retail",
        description: "Independent bookstore featuring African American literature, history, and culture. Supporting Black authors and voices since 1995.",
        address: "321 Malcolm X Avenue",
        city: "New York",
        state: "NY",
        zip_code: "10027",
        phone: "(212) 555-0321",
        email: "info@heritagebooks.com",
        website: "https://heritagebooks.com",
        is_verified: true,
        average_rating: 4.9,
        review_count: 234,
        logo_url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop",
        banner_url: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200&h=400&fit=crop"
      },
      {
        id: crypto.randomUUID(),
        business_name: "Green Thumb Gardens",
        name: "Green Thumb Gardens",
        owner_id: testUserId,
        category: "Home & Garden",
        description: "Urban gardening supplies and landscaping services. We help city dwellers create beautiful green spaces and grow their own food.",
        address: "654 Garden Way",
        city: "Chicago",
        state: "IL",
        zip_code: "60614",
        phone: "(312) 555-0654",
        email: "grow@greenthumbgardens.com",
        website: "https://greenthumbgardens.com",
        is_verified: true,
        average_rating: 4.6,
        review_count: 78,
        logo_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop",
        banner_url: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1200&h=400&fit=crop"
      }
    ];

    // Insert businesses
    const { error: businessError } = await supabase
      .from('businesses')
      .insert(businesses);

    if (businessError) {
      console.error('Error inserting businesses:', businessError);
      throw businessError;
    }
    console.log('✓ Businesses inserted');

    // Corporate subscriptions
    const subscriptions = [
      {
        id: crypto.randomUUID(),
        company_name: "Delta Airlines",
        tier: "platinum",
        status: "active",
        logo_url: "https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=200&h=200&fit=crop",
        website_url: "https://delta.com",
        contact_email: "partnerships@delta.com",
        contact_phone: "(800) 555-0001"
      },
      {
        id: crypto.randomUUID(),
        company_name: "Coca-Cola",
        tier: "gold",
        status: "active",
        logo_url: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=200&h=200&fit=crop",
        website_url: "https://coca-cola.com",
        contact_email: "community@coca-cola.com",
        contact_phone: "(800) 555-0002"
      }
    ];

    const { error: subsError } = await supabase
      .from('corporate_subscriptions')
      .insert(subscriptions);

    if (subsError) {
      console.error('Error inserting subscriptions:', subsError);
    } else {
      console.log('✓ Corporate subscriptions inserted');
    }

    // Transactions
    const transactions = [
      {
        id: crypto.randomUUID(),
        customer_id: testUserId,
        business_id: businesses[0].id,
        amount: 45.50,
        status: "completed",
        payment_method: "card",
        description: "Soul food dinner order"
      },
      {
        id: crypto.randomUUID(),
        customer_id: testUserId,
        business_id: businesses[1].id,
        amount: 85.00,
        status: "completed",
        payment_method: "card",
        description: "Hair styling service"
      },
      {
        id: crypto.randomUUID(),
        customer_id: testUserId,
        business_id: businesses[3].id,
        amount: 67.99,
        status: "completed",
        payment_method: "card",
        description: "Book purchase"
      }
    ];

    const { error: transError } = await supabase
      .from('transactions')
      .insert(transactions);

    if (transError) {
      console.error('Error inserting transactions:', transError);
    } else {
      console.log('✓ Transactions inserted');
    }

    // Business reviews
    const reviews = [
      {
        id: crypto.randomUUID(),
        business_id: businesses[0].id,
        user_id: testUserId,
        rating: 5,
        comment: "Best soul food in Atlanta! The fried chicken is absolutely amazing and the service is wonderful. Highly recommend!",
        helpful_count: 12
      },
      {
        id: crypto.randomUUID(),
        business_id: businesses[1].id,
        user_id: testUserId,
        rating: 5,
        comment: "Royal Hair Salon is incredible! They really know how to work with natural hair. I've been coming here for 2 years and won't go anywhere else.",
        helpful_count: 8
      },
      {
        id: crypto.randomUUID(),
        business_id: businesses[3].id,
        user_id: testUserId,
        rating: 5,
        comment: "Amazing selection of books celebrating Black culture and history. The staff are knowledgeable and passionate. A treasure in our community!",
        helpful_count: 15
      }
    ];

    const { error: reviewError } = await supabase
      .from('reviews')
      .insert(reviews);

    if (reviewError) {
      console.error('Error inserting reviews:', reviewError);
    } else {
      console.log('✓ Reviews inserted');
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Test data populated successfully',
        data: {
          businesses: businesses.length,
          subscriptions: subscriptions.length,
          transactions: transactions.length,
          reviews: reviews.length,
          testUserId
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error populating test data:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});