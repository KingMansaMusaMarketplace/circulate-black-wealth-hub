import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { requireAuth, authErrorResponse } from "../_shared/auth-guard.ts";

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
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Require authentication — prevents SMS flooding & unauthenticated OTP minting
    const auth = await requireAuth(req, corsHeaders);
    if (!auth.authenticated) return authErrorResponse(auth, corsHeaders);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const twilioAccountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
    const twilioAuthToken = Deno.env.get("TWILIO_AUTH_TOKEN");
    const twilioPhoneNumber = Deno.env.get("TWILIO_PHONE_NUMBER");

    const supabase = createClient(supabaseUrl, supabaseServiceKey) as any;

    const { businessId, userId, phoneNumber }: OtpRequest = await req.json();

    if (!businessId || !userId || !phoneNumber) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Authenticated user must match userId in payload
    if (auth.userId !== userId) {
      return new Response(
        JSON.stringify({ success: false, error: "Forbidden: user mismatch" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify ownership of the business (or location-manager)
    const { data: ownedBiz } = await supabase
      .from("businesses")
      .select("id")
      .eq("id", businessId)
      .or(`owner_id.eq.${auth.userId},location_manager_id.eq.${auth.userId}`)
      .maybeSingle();
    if (!ownedBiz) {
      return new Response(
        JSON.stringify({ success: false, error: "Forbidden: not business owner" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash the OTP using SHA-256 before storing
    const encoder = new TextEncoder();
    const data = encoder.encode(otpCode);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const otpHash = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

    // Delete any existing OTPs for this business
    await supabase
      .from("phone_verification_otps")
      .delete()
      .eq("business_id", businessId);

    // Store hashed OTP in database
    const { error: insertError } = await supabase
      .from("phone_verification_otps")
      .insert({
        business_id: businessId,
        user_id: userId,
        phone_number: phoneNumber,
        otp_hash: otpHash,
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString()
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
      }
    } else {
      // Server-side log only — NEVER return OTP in HTTP response
      console.log(`[DEV MODE] OTP for ${phoneNumber}: ${otpCode}`);
    }

    // SECURITY: Never return the OTP in the response body
    return new Response(
      JSON.stringify({
        success: true,
        message: "Verification code sent",
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in send-phone-otp:", error);
    return new Response(
      JSON.stringify({ success: false, error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
