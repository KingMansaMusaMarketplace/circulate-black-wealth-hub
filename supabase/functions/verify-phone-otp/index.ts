import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerifyRequest {
  businessId: string;
  userId: string;
  otpCode: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { businessId, userId, otpCode }: VerifyRequest = await req.json();

    if (!businessId || !userId || !otpCode) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get the OTP record
    const { data: otpRecord, error: fetchError } = await supabase
      .from("phone_verification_otps")
      .select("*")
      .eq("business_id", businessId)
      .eq("user_id", userId)
      .is("verified_at", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (fetchError || !otpRecord) {
      return new Response(
        JSON.stringify({ success: false, error: "No pending verification found" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if expired
    if (new Date(otpRecord.expires_at) < new Date()) {
      return new Response(
        JSON.stringify({ success: false, error: "Verification code has expired" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check max attempts
    if (otpRecord.attempts >= otpRecord.max_attempts) {
      return new Response(
        JSON.stringify({ success: false, error: "Maximum attempts exceeded. Please request a new code." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Increment attempts
    await supabase
      .from("phone_verification_otps")
      .update({ attempts: otpRecord.attempts + 1 })
      .eq("id", otpRecord.id);

    // Verify the code
    if (otpRecord.otp_code !== otpCode) {
      const remainingAttempts = otpRecord.max_attempts - otpRecord.attempts - 1;
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Invalid code. ${remainingAttempts} attempts remaining.` 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Mark OTP as verified
    await supabase
      .from("phone_verification_otps")
      .update({ verified_at: new Date().toISOString() })
      .eq("id", otpRecord.id);

    // Update business verification record
    const { error: updateError } = await supabase
      .from("business_verifications")
      .update({
        phone_verified: true,
        phone_verified_at: new Date().toISOString(),
        phone_verification_number: otpRecord.phone_number
      })
      .eq("business_id", businessId);

    // If no verification record exists, create one
    if (updateError) {
      await supabase
        .from("business_verifications")
        .insert({
          business_id: businessId,
          phone_verified: true,
          phone_verified_at: new Date().toISOString(),
          phone_verification_number: otpRecord.phone_number,
          verification_status: "pending",
          verification_method: "phone"
        });
    }

    return new Response(
      JSON.stringify({ success: true, message: "Phone verified successfully" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in verify-phone-otp:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
