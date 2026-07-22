import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-csrf-token",
};

const JOB_POST_PRICE_CENTS = 9900;
const JOB_POST_DURATION_DAYS = 30;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing authorization");
    const { data: { user } } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));
    if (!user?.email) throw new Error("Unauthorized");

    const body = await req.json();
    const {
      title, company_name, location, remote_ok, employment_type,
      salary_min, salary_max, salary_currency,
      description, apply_url, apply_email, business_id,
    } = body ?? {};

    if (!title || !company_name || !description) {
      throw new Error("title, company_name, and description are required");
    }
    if (!apply_url && !apply_email) {
      throw new Error("Provide an apply_url or apply_email");
    }

    // Insert pending posting (apply_email is stored in the private companion table only)
    const { data: posting, error: insErr } = await supabase
      .from("job_postings")
      .insert({
        poster_user_id: user.id,
        business_id: business_id ?? null,
        title,
        company_name,
        location: location ?? null,
        remote_ok: !!remote_ok,
        employment_type: employment_type ?? "full_time",
        salary_min: salary_min ?? null,
        salary_max: salary_max ?? null,
        salary_currency: salary_currency ?? "USD",
        description,
        apply_url: apply_url ?? null,
        status: "pending_payment",
        amount_cents: JOB_POST_PRICE_CENTS,
      })
      .select()
      .single();
    if (insErr || !posting) throw new Error(insErr?.message ?? "Failed to create posting");

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
      apiVersion: "2025-08-27.basil",
    });

    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    const customerId = customers.data[0]?.id;
    const origin = req.headers.get("origin") || "https://1325.ai";

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      mode: "payment",
      line_items: [{
        price_data: {
          currency: "usd",
          unit_amount: JOB_POST_PRICE_CENTS,
          product_data: {
            name: `Job Post: ${title}`,
            description: `${JOB_POST_DURATION_DAYS}-day listing on 1325.AI Job Board`,
          },
        },
        quantity: 1,
      }],
      success_url: `${origin}/jobs?posted=success`,
      cancel_url: `${origin}/jobs/post?cancelled=1`,
      metadata: {
        type: "job_post",
        jobPostingId: posting.id,
        userId: user.id,
        durationDays: String(JOB_POST_DURATION_DAYS),
      },
    });

    // Stripe session id + apply_email are stored in the private companion table (kept off public job_postings)
    await supabase.from("job_postings_private").upsert(
      {
        job_id: posting.id,
        poster_user_id: user.id,
        stripe_session_id: session.id,
        apply_email: apply_email ?? null,
      },
      { onConflict: "job_id" }
    );

    return new Response(JSON.stringify({ url: session.url, jobPostingId: posting.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
  }
});
