import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
});

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  const body = await req.text();

  try {
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!webhookSecret) {
      throw new Error("Webhook secret not configured");
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature!,
      webhookSecret
    );

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    console.log(`Processing webhook event: ${event.type}`);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata;
        
        console.log(`Checkout completed: ${session.id}`, metadata);

        // Handle corporate subscriptions
        if (metadata?.userType === 'corporate' && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
          const customer = await stripe.customers.retrieve(session.customer as string);
          
          // Get user by email
          const customerEmail = typeof customer === 'string' ? null : customer.email;
          if (!customerEmail) {
            console.error('No customer email found');
            break;
          }

          const { data: users } = await supabaseClient.auth.admin.listUsers();
          const user = users.users.find(u => u.email === customerEmail);
          
          if (!user) {
            console.error(`No user found with email: ${customerEmail}`);
            break;
          }

          // Create corporate subscription record
          const { data: corporateSubscription, error: subError } = await supabaseClient
            .from('corporate_subscriptions')
            .insert({
              user_id: user.id,
              company_name: metadata.businessName || metadata.name || 'Corporate Sponsor',
              tier: metadata.tier || 'bronze',
              stripe_subscription_id: subscription.id,
              stripe_customer_id: session.customer as string,
              status: 'active',
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              cancel_at_period_end: false,
            })
            .select()
            .single();

          if (subError) {
            console.error('Error creating corporate subscription:', subError);
            break;
          }

          console.log(`Corporate subscription created: ${corporateSubscription.id}`);

          // Set up initial benefits based on tier
          const tier = metadata.tier || 'bronze';
          const benefits = tier === 'gold' ? [
            { benefit_type: 'logo_footer', benefit_value: { enabled: true } },
            { benefit_type: 'logo_homepage', benefit_value: { enabled: true } },
            { benefit_type: 'impact_reports', benefit_value: { frequency: 'monthly' } },
            { benefit_type: 'executive_briefings', benefit_value: { frequency: 'quarterly' } },
            { benefit_type: 'cobranded_marketing', benefit_value: { enabled: true } },
          ] : [
            { benefit_type: 'logo_footer', benefit_value: { enabled: true } },
            { benefit_type: 'impact_reports', benefit_value: { frequency: 'monthly' } },
          ];

          for (const benefit of benefits) {
            await supabaseClient
              .from('sponsor_benefits')
              .insert({
                subscription_id: corporateSubscription.id,
                ...benefit,
              });
          }

          console.log(`Benefits created for tier: ${tier}`);

          // Initialize impact metrics
          await supabaseClient
            .from('sponsor_impact_metrics')
            .insert({
              subscription_id: corporateSubscription.id,
              metric_date: new Date().toISOString().split('T')[0],
              businesses_supported: 0,
              total_transactions: 0,
              community_reach: 0,
              economic_impact: 0,
            });

          console.log(`Impact metrics initialized`);

          // Send welcome email
          try {
            await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/send-corporate-welcome`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
              },
              body: JSON.stringify({
                email: customerEmail,
                companyName: corporateSubscription.company_name,
                tier: corporateSubscription.tier,
              }),
            });
            console.log('Welcome email triggered');
          } catch (emailError) {
            console.error('Failed to send welcome email:', emailError);
            // Don't fail the webhook if email fails
          }
        }

        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Update corporate subscription status
        await supabaseClient
          .from('corporate_subscriptions')
          .update({
            status: subscription.status as string,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
          })
          .eq('stripe_subscription_id', subscription.id);

        console.log(`Subscription updated: ${subscription.id}`);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Mark subscription as cancelled
        await supabaseClient
          .from('corporate_subscriptions')
          .update({
            status: 'cancelled',
          })
          .eq('stripe_subscription_id', subscription.id);

        console.log(`Subscription deleted: ${subscription.id}`);
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        await supabaseClient
          .from("platform_transactions")
          .update({
            status: "succeeded",
            stripe_charge_id: paymentIntent.latest_charge as string,
          })
          .eq("stripe_payment_intent_id", paymentIntent.id);

        console.log(`Payment succeeded: ${paymentIntent.id}`);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        await supabaseClient
          .from("platform_transactions")
          .update({
            status: "failed",
          })
          .eq("stripe_payment_intent_id", paymentIntent.id);

        console.log(`Payment failed: ${paymentIntent.id}`);
        break;
      }

      case "account.updated": {
        const account = event.data.object as Stripe.Account;
        
        await supabaseClient
          .from("business_payment_accounts")
          .update({
            account_status: account.charges_enabled && account.payouts_enabled ? "active" : "restricted",
            charges_enabled: account.charges_enabled,
            payouts_enabled: account.payouts_enabled,
            requirements_due: account.requirements?.currently_due || [],
          })
          .eq("stripe_account_id", account.id);

        console.log(`Account updated: ${account.id}`);
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        
        await supabaseClient
          .from("platform_transactions")
          .update({
            status: "refunded",
          })
          .eq("stripe_charge_id", charge.id);

        console.log(`Charge refunded: ${charge.id}`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Webhook error" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});
