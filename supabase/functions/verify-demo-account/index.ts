import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("[VERIFY-DEMO] Starting demo account verification");

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false, autoRefreshToken: false } }
    );

    const demoEmail = "demo@mansamusa.com";
    const demoPassword = "Demo123!";

    // Check if demo user exists
    console.log("[VERIFY-DEMO] Checking for existing demo user");
    const { data: existingUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError) {
      console.error("[VERIFY-DEMO] Error listing users:", listError);
      throw listError;
    }

    const demoUser = existingUsers.users.find(u => u.email === demoEmail);

    if (demoUser) {
      console.log("[VERIFY-DEMO] Demo user exists:", demoUser.id);
      
      // Check if profile exists
      const { data: profile, error: profileError } = await supabaseAdmin
        .from("profiles")
        .select("*")
        .eq("id", demoUser.id)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        console.error("[VERIFY-DEMO] Error checking profile:", profileError);
      }

      if (!profile) {
        console.log("[VERIFY-DEMO] Creating profile for demo user");
        const { error: insertError } = await supabaseAdmin
          .from("profiles")
          .insert({
            id: demoUser.id,
            email: demoEmail,
            user_type: "business",
            full_name: "Demo Business Owner",
          });

        if (insertError) {
          console.error("[VERIFY-DEMO] Error creating profile:", insertError);
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          exists: true,
          userId: demoUser.id,
          message: "Demo account exists and is ready for Apple review",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create demo user if it doesn't exist
    console.log("[VERIFY-DEMO] Creating demo user");
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: demoEmail,
      password: demoPassword,
      email_confirm: true,
      user_metadata: {
        full_name: "Demo Business Owner",
        user_type: "business",
      },
    });

    if (createError) {
      console.error("[VERIFY-DEMO] Error creating user:", createError);
      throw createError;
    }

    console.log("[VERIFY-DEMO] Demo user created:", newUser.user.id);

    // Create profile for new demo user
    const { error: profileInsertError } = await supabaseAdmin
      .from("profiles")
      .insert({
        id: newUser.user.id,
        email: demoEmail,
        user_type: "business",
        full_name: "Demo Business Owner",
      });

    if (profileInsertError) {
      console.error("[VERIFY-DEMO] Error creating profile:", profileInsertError);
      // Don't throw - user is created, profile can be created later
    }

    return new Response(
      JSON.stringify({
        success: true,
        exists: false,
        userId: newUser.user.id,
        message: "Demo account created successfully for Apple review",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("[VERIFY-DEMO] Fatal error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});