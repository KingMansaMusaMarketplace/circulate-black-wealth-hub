import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-csrf-token',
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[DELETE-ACCOUNT] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Account deletion request received");

    // Create Supabase client with service role key for admin operations
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

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Verify the user's JWT token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user) {
      logStep("Authentication failed", { error: userError });
      throw new Error('Unauthorized');
    }

    const userId = user.id;
    logStep("User authenticated", { userId });

    // Step 1: Delete user's profile
    logStep("Deleting user profile");
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', userId);
    
    if (profileError) {
      logStep("Error deleting profile", { error: profileError });
    }

    // Step 2: Delete user's businesses (owner_id is the correct column)
    logStep("Deleting user businesses");
    const { error: businessError } = await supabaseAdmin
      .from('businesses')
      .delete()
      .eq('owner_id', userId);

    if (businessError) {
      logStep("Error deleting businesses", { error: businessError });
    }

    // Step 3: Delete user's transactions (customer_id is the correct column)
    logStep("Deleting user transactions");
    const { error: transactionError } = await supabaseAdmin
      .from('transactions')
      .delete()
      .eq('customer_id', userId);

    if (transactionError) {
      logStep("Error deleting transactions", { error: transactionError });
    }

    // Step 3b: Delete additional PII-bearing records tied to this user
    const additionalTables: Array<{ table: string; column: string }> = [
      { table: 'bookings', column: 'customer_id' },
      { table: 'reviews', column: 'user_id' },
      { table: 'property_reviews', column: 'reviewer_id' },
      { table: 'business_reviews', column: 'customer_id' },
      { table: 'customers', column: 'user_id' },
      { table: 'notifications', column: 'user_id' },
      { table: 'user_preferences', column: 'user_id' },
      { table: 'user_roles', column: 'user_id' },
      { table: 'loyalty_points', column: 'customer_id' },
      { table: 'redeemed_rewards', column: 'customer_id' },
      { table: 'search_history', column: 'user_id' },
      { table: 'contact_submissions', column: 'user_id' },
      { table: 'tracked_visits', column: 'customer_id' },
    ];
    for (const { table, column } of additionalTables) {
      const { error } = await supabaseAdmin.from(table).delete().eq(column, userId);
      if (error) logStep(`Error deleting from ${table}`, { error: error.message });
    }


    // Step 4: Delete from auth.users using admin API
    logStep("Deleting auth user");
    const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    
    if (authDeleteError) {
      logStep("Error deleting auth user", { error: authDeleteError });
      throw new Error(`Failed to delete user account: ${authDeleteError.message}`);
    }

    logStep("Account deletion completed successfully", { userId });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Account deleted successfully' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? (error as Error).message : 'Unknown error';
    logStep("ERROR", { message: errorMessage });
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
