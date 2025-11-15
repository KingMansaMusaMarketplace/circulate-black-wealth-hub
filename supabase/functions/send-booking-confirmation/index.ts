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

interface BookingConfirmationRequest {
  bookingId: string;
  recipientType: 'customer' | 'business';
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { bookingId, recipientType }: BookingConfirmationRequest = await req.json();
    console.log(`Sending ${recipientType} confirmation for booking:`, bookingId);

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch booking details
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select(`
        *,
        business:businesses(business_name, phone, email, address, city, state),
        service:business_services(name, description, price, duration_minutes)
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
      emailSubject = `Booking Confirmation - ${booking.business.business_name}`;
      emailHtml = generateCustomerEmailHTML({
        customerName: booking.customer_name,
        businessName: booking.business.business_name,
        serviceName: booking.service?.name || 'Service',
        date: formattedDate,
        time: formattedTime,
        duration: booking.duration_minutes,
        amount: booking.amount,
        businessPhone: booking.business.phone,
        businessAddress: `${booking.business.address}, ${booking.business.city}, ${booking.business.state}`,
        bookingId: booking.id
      });
    } else {
      emailTo = booking.business.email;
      emailSubject = `New Booking Received - ${booking.customer_name}`;
      emailHtml = generateBusinessEmailHTML({
        businessName: booking.business.business_name,
        customerName: booking.customer_name,
        customerEmail: booking.customer_email,
        customerPhone: booking.customer_phone || 'Not provided',
        serviceName: booking.service?.name || 'Service',
        date: formattedDate,
        time: formattedTime,
        duration: booking.duration_minutes,
        amount: booking.amount,
        notes: booking.notes || 'No notes provided',
        bookingId: booking.id
      });
    }

    const emailResponse = await resend.emails.send({
      from: "Mansa Musa Marketplace <bookings@mansamusamarketplace.com>",
      to: [emailTo],
      subject: emailSubject,
      html: emailHtml,
    });

    console.log("Email sent successfully:", emailResponse);

    // Log the email notification
    await supabase.from('email_notifications').insert({
      user_id: recipientType === 'customer' ? booking.customer_id : booking.business.owner_id,
      recipient_email: emailTo,
      email_type: `booking_confirmation_${recipientType}`,
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
    console.error("Error in send-booking-confirmation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

function generateCustomerEmailHTML(data: {
  customerName: string;
  businessName: string;
  serviceName: string;
  date: string;
  time: string;
  duration: number;
  amount: number;
  businessPhone: string;
  businessAddress: string;
  bookingId: string;
}): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmation</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #D4AF37 0%, #B8960F 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Booking Confirmed! 🎉</h1>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; margin-bottom: 20px;">Hello ${data.customerName},</p>
          
          <p style="font-size: 16px; margin-bottom: 30px;">Your booking with <strong>${data.businessName}</strong> has been confirmed!</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #D4AF37;">
            <h2 style="color: #D4AF37; margin-top: 0; font-size: 20px;">Booking Details</h2>
            
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
            
            <div style="margin: 15px 0;">
              <strong>Amount:</strong> $${data.amount.toFixed(2)}
            </div>
            
            <div style="margin: 15px 0;">
              <strong>Booking ID:</strong> <code style="background: #f5f5f5; padding: 2px 6px; border-radius: 3px;">${data.bookingId}</code>
            </div>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #333; margin-top: 0; font-size: 18px;">Business Information</h3>
            
            <div style="margin: 10px 0;">
              <strong>Phone:</strong> ${data.businessPhone}
            </div>
            
            <div style="margin: 10px 0;">
              <strong>Address:</strong> ${data.businessAddress}
            </div>
          </div>
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107;">
            <p style="margin: 0; font-size: 14px;">
              <strong>Need to make changes?</strong> Please contact the business directly using the phone number above.
            </p>
          </div>
          
          <p style="margin-top: 30px; font-size: 14px; color: #666;">
            Thank you for supporting Black-owned businesses!
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; font-size: 12px; color: #999;">
            <p>Mansa Musa Marketplace</p>
            <p>Empowering the Black Community</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

function generateBusinessEmailHTML(data: {
  businessName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceName: string;
  date: string;
  time: string;
  duration: number;
  amount: number;
  notes: string;
  bookingId: string;
}): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Booking Received</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">New Booking Received! 📅</h1>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; margin-bottom: 20px;">Hello ${data.businessName},</p>
          
          <p style="font-size: 16px; margin-bottom: 30px;">You have a new booking!</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #10B981;">
            <h2 style="color: #10B981; margin-top: 0; font-size: 20px;">Customer Information</h2>
            
            <div style="margin: 15px 0;">
              <strong>Name:</strong> ${data.customerName}
            </div>
            
            <div style="margin: 15px 0;">
              <strong>Email:</strong> ${data.customerEmail}
            </div>
            
            <div style="margin: 15px 0;">
              <strong>Phone:</strong> ${data.customerPhone}
            </div>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #10B981;">
            <h2 style="color: #10B981; margin-top: 0; font-size: 20px;">Booking Details</h2>
            
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
            
            <div style="margin: 15px 0;">
              <strong>Amount:</strong> $${data.amount.toFixed(2)}
            </div>
            
            <div style="margin: 15px 0;">
              <strong>Booking ID:</strong> <code style="background: #f5f5f5; padding: 2px 6px; border-radius: 3px;">${data.bookingId}</code>
            </div>
          </div>
          
          ${data.notes !== 'No notes provided' ? `
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #333; margin-top: 0; font-size: 18px;">Customer Notes</h3>
            <p style="margin: 0;">${data.notes}</p>
          </div>
          ` : ''}
          
          <div style="background: #d1fae5; padding: 15px; border-radius: 8px; border-left: 4px solid #10B981; text-align: center;">
            <p style="margin: 0; font-size: 14px;">
              <strong>Payment has been processed successfully</strong>
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
