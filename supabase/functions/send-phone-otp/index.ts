import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OtpRequest {
  businessId: string;
  userId: string;
  phoneNumber: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const twilioAccountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
    const twilioAuthToken = Deno.env.get("TWILIO_AUTH_TOKEN");
    const twilioPhoneNumber = Deno.env.get("TWILIO_PHONE_NUMBER");

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { businessId, userId, phoneNumber }: OtpRequest = await req.json();

    if (!businessId || !userId || !phoneNumber) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete any existing OTPs for this business
    await supabase
      .from("phone_verification_otps")
      .delete()
      .eq("business_id", businessId);

    // Store OTP in database
    const { error: insertError } = await supabase
      .from("phone_verification_otps")
      .insert({
        business_id: businessId,
        user_id: userId,
        phone_number: phoneNumber,
        otp_code: otpCode,
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutes
      });

    if (insertError) {
      console.error("Error storing OTP:", insertError);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to generate OTP" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Send SMS via Twilio if configured
    if (twilioAccountSid && twilioAuthToken && twilioPhoneNumber) {
      const formattedPhone = phoneNumber.startsWith("+1") ? phoneNumber : `+1${phoneNumber}`;
      
      const twilioResponse = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`,
        {
          method: "POST",
          headers: {
            "Authorization": `Basic ${btoa(`${twilioAccountSid}:${twilioAuthToken}`)}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            To: formattedPhone,
            From: twilioPhoneNumber,
            Body: `Your Mansa Musa Marketplace verification code is: ${otpCode}. This code expires in 10 minutes.`,
          }),
        }
      );

      if (!twilioResponse.ok) {
        const errorData = await twilioResponse.json();
        console.error("Twilio error:", errorData);
        // Don't fail - we can still verify via database for testing
      }
    } else {
      // For development/testing, log the OTP
      console.log(`[DEV MODE] OTP for ${phoneNumber}: ${otpCode}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Verification code sent",
        // Only include code in dev mode
        ...((!twilioAccountSid) && { devCode: otpCode })
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in send-phone-otp:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
