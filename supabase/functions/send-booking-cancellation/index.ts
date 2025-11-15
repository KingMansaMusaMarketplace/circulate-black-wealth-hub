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

interface CancellationRequest {
  bookingId: string;
  recipientType: 'customer' | 'business';
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { bookingId, recipientType }: CancellationRequest = await req.json();
    console.log(`Sending ${recipientType} cancellation for booking:`, bookingId);

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select(`
        *,
        business:businesses(business_name, phone, email),
        service:business_services!service_id(name)
      `)
      .eq('id', bookingId)
      .single();

    if (bookingError || !booking) {
      throw new Error(`Booking not found: ${bookingError?.message}`);
    }

    const bookingDate = new Date(booking.booking_date);
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

    let emailTo: string;
    let emailSubject: string;
    let emailHtml: string;

    if (recipientType === 'customer') {
      emailTo = booking.customer_email;
      emailSubject = `Booking Cancelled - ${booking.business.business_name}`;
      emailHtml = generateCustomerCancellationHTML({
        customerName: booking.customer_name,
        businessName: booking.business.business_name,
        serviceName: booking.service?.name || 'Service',
        date: formattedDate,
        time: formattedTime,
        amount: booking.amount,
        businessPhone: booking.business.phone,
        cancellationReason: booking.cancellation_reason || 'No reason provided'
      });
    } else {
      emailTo = booking.business.email;
      emailSubject = `Booking Cancelled - ${booking.customer_name}`;
      emailHtml = generateBusinessCancellationHTML({
        businessName: booking.business.business_name,
        customerName: booking.customer_name,
        serviceName: booking.service?.name || 'Service',
        date: formattedDate,
        time: formattedTime,
        amount: booking.amount,
        cancellationReason: booking.cancellation_reason || 'No reason provided'
      });
    }

    const emailResponse = await resend.emails.send({
      from: "Mansa Musa Marketplace <bookings@mansamusamarketplace.com>",
      to: [emailTo],
      subject: emailSubject,
      html: emailHtml,
    });

    console.log("Cancellation email sent successfully:", emailResponse);

    await supabase.from('email_notifications').insert({
      user_id: recipientType === 'customer' ? booking.customer_id : booking.business.owner_id,
      recipient_email: emailTo,
      email_type: `booking_cancellation_${recipientType}`,
      subject: emailSubject,
      content: emailHtml,
      status: 'sent'
    });

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-booking-cancellation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

function generateCustomerCancellationHTML(data: {
  customerName: string;
  businessName: string;
  serviceName: string;
  date: string;
  time: string;
  amount: number;
  businessPhone: string;
  cancellationReason: string;
}): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Cancelled</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Booking Cancelled</h1>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; margin-bottom: 20px;">Hello ${data.customerName},</p>
          
          <p style="font-size: 16px; margin-bottom: 30px;">Your booking with <strong>${data.businessName}</strong> has been cancelled.</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #EF4444;">
            <h2 style="color: #EF4444; margin-top: 0; font-size: 20px;">Cancelled Booking Details</h2>
            
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
              <strong>Amount:</strong> $${data.amount.toFixed(2)}
            </div>
          </div>
          
          ${data.cancellationReason !== 'No reason provided' ? `
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #333; margin-top: 0; font-size: 18px;">Cancellation Reason</h3>
            <p style="margin: 0;">${data.cancellationReason}</p>
          </div>
          ` : ''}
          
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin-bottom: 20px;">
            <p style="margin: 0; font-size: 14px;">
              <strong>Refund Information:</strong> If you paid for this booking, a refund will be processed to your original payment method within 5-7 business days.
            </p>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #333; margin-top: 0; font-size: 18px;">Need to Reschedule?</h3>
            <p style="margin: 0;">Contact the business directly:</p>
            <div style="margin-top: 10px;">
              <strong>Phone:</strong> ${data.businessPhone}
            </div>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; font-size: 12px; color: #999;">
            <p>Mansa Musa Marketplace</p>
            <p>Supporting Our Community</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

function generateBusinessCancellationHTML(data: {
  businessName: string;
  customerName: string;
  serviceName: string;
  date: string;
  time: string;
  amount: number;
  cancellationReason: string;
}): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Cancelled</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Booking Cancelled</h1>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; margin-bottom: 20px;">Hello ${data.businessName},</p>
          
          <p style="font-size: 16px; margin-bottom: 30px;">A booking has been cancelled.</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #F59E0B;">
            <h2 style="color: #F59E0B; margin-top: 0; font-size: 20px;">Customer Information</h2>
            
            <div style="margin: 15px 0;">
              <strong>Name:</strong> ${data.customerName}
            </div>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #F59E0B;">
            <h2 style="color: #F59E0B; margin-top: 0; font-size: 20px;">Booking Details</h2>
            
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
              <strong>Amount:</strong> $${data.amount.toFixed(2)}
            </div>
          </div>
          
          ${data.cancellationReason !== 'No reason provided' ? `
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #333; margin-top: 0; font-size: 18px;">Cancellation Reason</h3>
            <p style="margin: 0;">${data.cancellationReason}</p>
          </div>
          ` : ''}
          
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
            <p style="margin: 0; font-size: 14px;">
              <strong>Note:</strong> The time slot is now available for other bookings.
            </p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; font-size: 12px; color: #999;">
            <p>Mansa Musa Marketplace</p>
            <p>Growing Black Businesses Together</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

serve(handler);
