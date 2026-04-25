import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { businessId, action } = await req.json();
    if (!businessId) throw new Error("businessId is required");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") as any!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: business } = await supabase
      .from("businesses")
      .select("business_name, category")
      .eq("id", businessId)
      .single();

    if (!business) throw new Error("Business not found");

    if (action === "setup_defaults") {
      // Create default reminder rules
      const defaults = [
        {
          business_id: businessId,
          reminder_type: "appointment",
          hours_before: 24,
          message_template: `Hi {customer_name}, this is a reminder about your appointment at ${business.business_name} tomorrow. We look forward to seeing you!`,
          channel: "email",
          is_active: true,
        },
        {
          business_id: businessId,
          reminder_type: "follow_up",
          hours_before: 48,
          message_template: `Hi {customer_name}, thank you for visiting ${business.business_name}! We'd love to hear about your experience. Would you mind leaving us a review?`,
          channel: "email",
          is_active: true,
        },
        {
          business_id: businessId,
          reminder_type: "renewal",
          hours_before: 168,
          message_template: `Hi {customer_name}, it's been a while since your last visit to ${business.business_name}. We miss you! Book your next appointment today.`,
          channel: "email",
          is_active: false,
        },
      ];

      for (const rule of defaults) {
        await supabase.from("kayla_reminder_rules").insert(rule);
      }

      return new Response(JSON.stringify({ success: true, rules: defaults }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "process_reminders") {
      // Get active rules
      const { data: rules } = await supabase
        .from("kayla_reminder_rules")
        .select("*")
        .eq("business_id", businessId)
        .eq("is_active", true);

      if (!rules || rules.length === 0) {
        return new Response(JSON.stringify({ success: true, message: "No active rules" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Get upcoming bookings
      const now = new Date();
      const { data: bookings } = await supabase
        .from("bookings")
        .select("id, customer_name, customer_email, booking_date, booking_time")
        .eq("business_id", businessId)
        .eq("status", "confirmed")
        .gte("booking_date", now.toISOString().split("T")[0]);

      let sentCount = 0;
      for (const rule of rules) {
        if (rule.reminder_type !== "appointment" || !bookings) continue;

        for (const booking of bookings) {
          const bookingDateTime = new Date(`${booking.booking_date}T${booking.booking_time || "09:00"}`);
          const reminderTime = new Date(bookingDateTime.getTime() - rule.hours_before * 3600000);

          if (now >= reminderTime && now < bookingDateTime) {
            // Check if already sent
            const { count } = await supabase
              .from("kayla_reminders_sent")
              .select("id", { count: "exact", head: true })
              .eq("rule_id", rule.id)
              .eq("booking_id", booking.id);

            if (!count || count === 0) {
              const message = (rule.message_template || "")
                .replace("{customer_name}", booking.customer_name || "Valued Customer");

              await supabase.from("kayla_reminders_sent").insert({
                business_id: businessId,
                rule_id: rule.id,
                booking_id: booking.id,
                customer_email: booking.customer_email,
                customer_name: booking.customer_name,
                message_content: message,
                status: "sent",
              });
              sentCount++;
            }
          }
        }
      }

      return new Response(JSON.stringify({ success: true, sent: sentCount }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Reminder engine error:", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
