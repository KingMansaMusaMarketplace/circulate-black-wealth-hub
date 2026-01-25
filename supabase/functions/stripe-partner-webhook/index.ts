import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-PARTNER-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Webhook received");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    
    // Get the raw body for signature verification
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");
    
    let event: Stripe.Event;
    
    // Verify webhook signature if secret is configured
    if (webhookSecret && signature) {
      try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        logStep("Webhook signature verified");
      } catch (err) {
        logStep("Webhook signature verification failed", { error: err.message });
        return new Response(JSON.stringify({ error: "Invalid signature" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    } else {
      // Parse without verification (for development)
      event = JSON.parse(body);
      logStep("Webhook parsed without signature verification (development mode)");
    }

    logStep("Processing event", { type: event.type, id: event.id });

    // Initialize Supabase client with service role for database operations
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Handle relevant payment events
    if (event.type === "checkout.session.completed" || 
        event.type === "invoice.payment_succeeded" ||
        event.type === "payment_intent.succeeded") {
      
      let customerEmail: string | null = null;
      let paymentAmount: number = 0;
      let customerId: string | null = null;

      // Extract customer info based on event type
      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        customerEmail = session.customer_email || session.customer_details?.email || null;
        customerId = session.customer as string;
        paymentAmount = (session.amount_total || 0) / 100; // Convert from cents
        logStep("Checkout session completed", { email: customerEmail, amount: paymentAmount });
      } else if (event.type === "invoice.payment_succeeded") {
        const invoice = event.data.object as Stripe.Invoice;
        customerEmail = invoice.customer_email;
        customerId = invoice.customer as string;
        paymentAmount = (invoice.amount_paid || 0) / 100;
        logStep("Invoice payment succeeded", { email: customerEmail, amount: paymentAmount });
      } else if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        customerId = paymentIntent.customer as string;
        paymentAmount = (paymentIntent.amount || 0) / 100;
        
        // Fetch customer email from Stripe if we have customer ID
        if (customerId) {
          const customer = await stripe.customers.retrieve(customerId);
          if (customer && !customer.deleted) {
            customerEmail = (customer as Stripe.Customer).email;
          }
        }
        logStep("Payment intent succeeded", { customerId, amount: paymentAmount });
      }

      // Look up if this customer has a pending partner referral
      if (customerEmail) {
        logStep("Looking up pending referral for email", { email: customerEmail });
        
        // Find pending referral by email
        const { data: referral, error: referralError } = await supabaseClient
          .from('partner_referrals')
          .select('id, partner_id, status, referred_business_first_payment_at')
          .eq('referred_email', customerEmail)
          .eq('status', 'pending')
          .is('referred_business_first_payment_at', null)
          .maybeSingle();

        if (referralError) {
          logStep("Error finding referral", { error: referralError.message });
        } else if (referral) {
          logStep("Found pending referral, crediting partner", { 
            referralId: referral.id, 
            partnerId: referral.partner_id 
          });

          // Call the credit function to mark referral as converted and credit earnings
          const { error: creditError } = await supabaseClient
            .rpc('credit_partner_referral_on_payment', {
              p_referral_id: referral.id,
              p_payment_amount: paymentAmount
            });

          if (creditError) {
            logStep("Error crediting referral", { error: creditError.message });
          } else {
            logStep("Successfully credited partner referral", { 
              referralId: referral.id,
              paymentAmount 
            });

            // Also try to look up and link the business
            const { data: business } = await supabaseClient
              .from('businesses')
              .select('id')
              .eq('email', customerEmail)
              .maybeSingle();

            if (business) {
              await supabaseClient
                .from('partner_referrals')
                .update({ 
                  referred_business_id: business.id,
                  updated_at: new Date().toISOString()
                })
                .eq('id', referral.id);
              
              logStep("Linked referral to business", { businessId: business.id });
            }
          }
        } else {
          logStep("No pending referral found for this customer");
        }
      } else {
        logStep("No customer email available for referral lookup");
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in webhook", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
