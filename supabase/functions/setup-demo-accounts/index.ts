import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DemoUser {
  email: string;
  password: string;
  role: string;
  fullName: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    console.log('Starting demo accounts setup...');

    // Define demo users
    const demoUsers: DemoUser[] = [
      {
        email: 'customer.demo@mansamusa.com',
        password: 'CustomerDemo123!',
        role: 'customer',
        fullName: 'Demo Customer'
      },
      {
        email: 'demo@mansamusa.com',
        password: 'Demo123!',
        role: 'business',
        fullName: 'Demo Business Owner'
      }
    ];

    const createdUsers: any = {};

    // Create or get users
    for (const demoUser of demoUsers) {
      console.log(`Processing user: ${demoUser.email}`);
      
      // Check if user exists
      const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
      const existingUser = existingUsers?.users.find(u => u.email === demoUser.email);

      if (existingUser) {
        console.log(`User ${demoUser.email} already exists`);
        createdUsers[demoUser.role] = existingUser;
      } else {
        console.log(`Creating user ${demoUser.email}`);
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: demoUser.email,
          password: demoUser.password,
          email_confirm: true,
          user_metadata: {
            full_name: demoUser.fullName,
            role: demoUser.role
          }
        });

        if (createError) {
          console.error(`Error creating user ${demoUser.email}:`, createError);
          throw createError;
        }

        createdUsers[demoUser.role] = newUser.user;
      }

      // Create or update profile
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .upsert({
          id: createdUsers[demoUser.role].id,
          email: demoUser.email,
          full_name: demoUser.fullName,
          role: demoUser.role,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        });

      if (profileError) {
        console.error(`Error creating profile for ${demoUser.email}:`, profileError);
      }
    }

    const customerUserId = createdUsers.customer.id;
    const businessUserId = createdUsers.business.id;

    console.log('Customer ID:', customerUserId);
    console.log('Business ID:', businessUserId);

    // Create demo business
    console.log('Creating demo business...');
    const { data: business, error: businessError } = await supabaseAdmin
      .from('businesses')
      .upsert({
        owner_id: businessUserId,
        business_name: 'Mansa Musa Demo Restaurant',
        name: 'Mansa Musa Demo Restaurant',
        description: 'A premier African fusion dining experience showcasing the rich culinary heritage of West Africa with modern twists.',
        category: 'Restaurant',
        address: '123 Heritage Boulevard',
        city: 'Atlanta',
        state: 'GA',
        zip_code: '30303',
        phone: '(404) 555-0100',
        email: 'demo@mansamusa.com',
        website: 'https://mansamusa.com',
        is_verified: true,
        average_rating: 4.8,
        review_count: 127,
        location_type: 'single',
        created_at: new Date().toISOString()
      }, {
        onConflict: 'owner_id',
        ignoreDuplicates: false
      })
      .select()
      .single();

    if (businessError) {
      console.error('Error creating business:', businessError);
      throw businessError;
    }

    const businessId = business.id;
    console.log('Business created:', businessId);

    // Create QR code for business
    console.log('Creating QR code...');
    await supabaseAdmin
      .from('qr_codes')
      .upsert({
        business_id: businessId,
        qr_type: 'loyalty',
        is_active: true,
        scan_count: 245,
        created_at: new Date().toISOString()
      }, {
        onConflict: 'business_id'
      });

    // Create business hours
    console.log('Creating business hours...');
    const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    for (const day of daysOfWeek) {
      await supabaseAdmin
        .from('business_hours')
        .upsert({
          business_id: businessId,
          day_of_week: day,
          open_time: day === 'sunday' ? '10:00' : '09:00',
          close_time: day === 'sunday' ? '22:00' : '23:00',
          is_closed: false
        }, {
          onConflict: 'business_id,day_of_week'
        });
    }

    // Create analytics data
    console.log('Creating analytics data...');
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      await supabaseAdmin
        .from('business_analytics')
        .upsert({
          business_id: businessId,
          date_recorded: date.toISOString().split('T')[0],
          metric_type: 'profile_views',
          metric_value: Math.floor(Math.random() * 50) + 20
        }, {
          onConflict: 'business_id,date_recorded,metric_type'
        });

      await supabaseAdmin
        .from('business_analytics')
        .upsert({
          business_id: businessId,
          date_recorded: date.toISOString().split('T')[0],
          metric_type: 'qr_scans',
          metric_value: Math.floor(Math.random() * 30) + 10
        }, {
          onConflict: 'business_id,date_recorded,metric_type'
        });
    }

    // Create customer loyalty data
    console.log('Creating customer loyalty data...');
    await supabaseAdmin
      .from('loyalty_points')
      .upsert({
        customer_id: customerUserId,
        business_id: businessId,
        points: 250,
        created_at: new Date().toISOString()
      }, {
        onConflict: 'customer_id,business_id'
      });

    // Create some transactions
    console.log('Creating transaction history...');
    for (let i = 0; i < 5; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - (i * 7));
      
      await supabaseAdmin
        .from('transactions')
        .insert({
          customer_id: customerUserId,
          business_id: businessId,
          points_earned: 50,
          description: `Dine-in purchase - ${date.toLocaleDateString()}`,
          transaction_type: 'purchase',
          created_at: date.toISOString()
        });
    }

    // Create customer favorites
    console.log('Adding business to customer favorites...');
    await supabaseAdmin
      .from('customer_favorites')
      .upsert({
        customer_id: customerUserId,
        business_id: businessId,
        created_at: new Date().toISOString()
      }, {
        onConflict: 'customer_id,business_id'
      });

    // Create a sample review
    console.log('Creating sample review...');
    await supabaseAdmin
      .from('business_reviews')
      .insert({
        business_id: businessId,
        customer_id: customerUserId,
        rating: 5,
        comment: 'Amazing experience! The food was authentic and delicious. The staff was incredibly welcoming.',
        created_at: new Date().toISOString()
      });

    console.log('Demo accounts setup completed successfully!');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Demo accounts created successfully',
        accounts: {
          customer: {
            email: 'customer.demo@mansamusa.com',
            password: 'CustomerDemo123!',
            userId: customerUserId
          },
          business: {
            email: 'demo@mansamusa.com',
            password: 'Demo123!',
            userId: businessUserId,
            businessId: businessId
          }
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in setup-demo-accounts:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
