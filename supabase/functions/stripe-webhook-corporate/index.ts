import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
});

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

  if (!signature || !webhookSecret) {
    return new Response("Missing signature or webhook secret", { status: 400 });
  }

  try {
    const body = await req.text();
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    console.log("Processing webhook event:", event.type);

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata;

        // Validate required metadata fields
        if (!metadata?.user_id || !metadata?.tier || !metadata?.company_name) {
          console.error("Missing required metadata in checkout session:", {
            has_user_id: !!metadata?.user_id,
            has_tier: !!metadata?.tier,
            has_company_name: !!metadata?.company_name
          });
          return new Response(
            JSON.stringify({ error: "Invalid metadata in checkout session" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }

        // Validate user_id format (UUID)
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(metadata.user_id)) {
          console.error("Invalid user_id format:", metadata.user_id);
          return new Response(
            JSON.stringify({ error: "Invalid user_id format" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }

        // Validate tier value
        const validTiers = ["bronze", "silver", "gold", "platinum"];
        if (!validTiers.includes(metadata.tier.toLowerCase())) {
          console.error("Invalid tier value:", metadata.tier);
          return new Response(
            JSON.stringify({ error: "Invalid tier value" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }

        // Validate company_name length
        if (metadata.company_name.length > 255 || metadata.company_name.length < 1) {
          console.error("Invalid company_name length:", metadata.company_name.length);
          return new Response(
            JSON.stringify({ error: "Invalid company_name length" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }

        // Validate optional URL fields if provided
        if (metadata.logo_url && metadata.logo_url.length > 2048) {
          console.error("Logo URL too long");
          return new Response(
            JSON.stringify({ error: "Logo URL exceeds maximum length" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }

        if (metadata.website_url && metadata.website_url.length > 2048) {
          console.error("Website URL too long");
          return new Response(
            JSON.stringify({ error: "Website URL exceeds maximum length" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }

        // Create or update corporate subscription using service role (bypasses RLS)
        const { error: subError } = await supabase
          .from("corporate_subscriptions")
          .upsert({
            user_id: metadata.user_id,
            tier: metadata.tier.toLowerCase(),
            company_name: metadata.company_name.substring(0, 255),
            logo_url: metadata.logo_url?.substring(0, 2048) || null,
            website_url: metadata.website_url?.substring(0, 2048) || null,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
            status: "active",
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          }, {
            onConflict: "user_id",
          });

        if (subError) {
          console.error("Error creating subscription:", subError);
          return new Response(
            JSON.stringify({ error: "Database error creating subscription" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
        
        console.log("Corporate subscription created for user:", metadata.user_id);

        // Get user email for welcome email
        const { data: userData } = await supabase.auth.admin.getUserById(metadata.user_id);
        if (userData?.user?.email) {
          // Send welcome email
          try {
            await supabase.functions.invoke("send-corporate-welcome", {
              body: {
                email: userData.user.email,
                companyName: metadata.company_name,
                tier: metadata.tier,
              },
            });
            console.log("Welcome email sent to:", userData.user.email);
          } catch (emailError) {
            console.error("Failed to send welcome email:", emailError);
            // Don't fail the webhook if email fails
          }
        }
        
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Find subscription by stripe_subscription_id
        const { data: existingSub } = await supabase
          .from("corporate_subscriptions")
          .select("*")
          .eq("stripe_subscription_id", subscription.id)
          .single();

        if (existingSub) {
          const { error: updateError } = await supabase
            .from("corporate_subscriptions")
            .update({
              status: subscription.status,
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              cancel_at_period_end: subscription.cancel_at_period_end,
            })
            .eq("stripe_subscription_id", subscription.id);

          if (updateError) {
            console.error("Error updating subscription:", updateError);
          } else {
            console.log("Subscription updated:", subscription.id);
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        const { error: deleteError } = await supabase
          .from("corporate_subscriptions")
          .update({ status: "cancelled" })
          .eq("stripe_subscription_id", subscription.id);

        if (deleteError) {
          console.error("Error cancelling subscription:", deleteError);
        } else {
          console.log("Subscription cancelled:", subscription.id);
        }
        break;
      }

      default:
        console.log("Unhandled event type:", event.type);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: error?.message || "Unknown error" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});
