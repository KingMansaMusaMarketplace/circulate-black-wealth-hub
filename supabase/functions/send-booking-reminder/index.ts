import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Processing booking reminders...");
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Find bookings happening in the next 24 hours
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const { data: upcomingBookings, error: bookingsError } = await supabase
      .from('bookings')
      .select(`
        *,
        business:businesses(business_name, phone, email, address, city, state),
        service:business_services!service_id(name)
      `)
      .eq('status', 'confirmed')
      .gte('booking_date', now.toISOString())
      .lte('booking_date', tomorrow.toISOString());

    if (bookingsError) {
      throw new Error(`Failed to fetch bookings: ${bookingsError.message}`);
    }

    if (!upcomingBookings || upcomingBookings.length === 0) {
      console.log("No upcoming bookings found");
      return new Response(
        JSON.stringify({ message: "No reminders to send", count: 0 }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log(`Found ${upcomingBookings.length} upcoming bookings`);

    const results = await Promise.allSettled(
      upcomingBookings.map(async (booking) => {
        const bookingDate = new Date(booking.booking_date);
        const hoursUntil = Math.round((bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60));
        
        const formattedDate = bookingDate.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        const formattedTime = bookingDate.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });

        const emailHtml = generateReminderHTML({
          customerName: booking.customer_name,
          businessName: booking.business.business_name,
          serviceName: booking.service?.name || 'Service',
          date: formattedDate,
          time: formattedTime,
          duration: booking.duration_minutes,
          hoursUntil,
          businessPhone: booking.business.phone,
          businessAddress: `${booking.business.address}, ${booking.business.city}, ${booking.business.state}`
        });

        const emailResponse = await resend.emails.send({
          from: "Mansa Musa Marketplace <bookings@mansamusamarketplace.com>",
          to: [booking.customer_email],
          subject: `Reminder: Appointment with ${booking.business.business_name} in ${hoursUntil} hours`,
          html: emailHtml,
        });

        // Log the email
        await supabase.from('email_notifications').insert({
          user_id: booking.customer_id,
          recipient_email: booking.customer_email,
          email_type: 'booking_reminder',
          subject: `Reminder: Appointment in ${hoursUntil} hours`,
          content: emailHtml,
          status: 'sent'
        });

        return emailResponse;
      })
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    console.log(`Sent ${successful} reminders, ${failed} failed`);

    return new Response(
      JSON.stringify({ 
        message: "Reminders processed",
        sent: successful,
        failed: failed,
        total: upcomingBookings.length
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-booking-reminder function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

function generateReminderHTML(data: {
  customerName: string;
  businessName: string;
  serviceName: string;
  date: string;
  time: string;
  duration: number;
  hoursUntil: number;
  businessPhone: string;
  businessAddress: string;
}): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Appointment Reminder</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">⏰ Appointment Reminder</h1>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; margin-bottom: 20px;">Hello ${data.customerName},</p>
          
          <div style="background: #8B5CF6; color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
            <h2 style="margin: 0; font-size: 24px;">Your appointment is in ${data.hoursUntil} hour${data.hoursUntil !== 1 ? 's' : ''}!</h2>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #8B5CF6;">
            <h2 style="color: #8B5CF6; margin-top: 0; font-size: 20px;">Appointment Details</h2>
            
            <div style="margin: 15px 0;">
              <strong>Business:</strong> ${data.businessName}
            </div>
            
            <div style="margin: 15px 0;">
              <strong>Service:</strong> ${data.serviceName}
            </div>
            
            <div style="margin: 15px 0;">
              <strong>Date:</strong> ${data.date}
            </div>
            
            <div style="margin: 15px 0;">
              <strong>Time:</strong> ${data.time}
            </div>
            
            <div style="margin: 15px 0;">
              <strong>Duration:</strong> ${data.duration} minutes
            </div>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #333; margin-top: 0; font-size: 18px;">Location</h3>
            <p style="margin: 0;">${data.businessAddress}</p>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #333; margin-top: 0; font-size: 18px;">Contact</h3>
            <p style="margin: 5px 0;"><strong>Phone:</strong> ${data.businessPhone}</p>
          </div>
          
          <div style="background: #dbeafe; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6; margin-bottom: 20px;">
            <p style="margin: 0; font-size: 14px;">
              <strong>💡 Tip:</strong> Please arrive 5-10 minutes early to ensure you get the full appointment time!
            </p>
          </div>
          
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
            <p style="margin: 0; font-size: 14px;">
              <strong>Need to cancel or reschedule?</strong> Please contact the business directly as soon as possible at ${data.businessPhone}
            </p>
          </div>
          
          <p style="margin-top: 30px; font-size: 14px; color: #666;">
            We look forward to serving you!
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; font-size: 12px; color: #999;">
            <p>Mansa Musa Marketplace</p>
            <p>Supporting Our Community</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

serve(handler);
