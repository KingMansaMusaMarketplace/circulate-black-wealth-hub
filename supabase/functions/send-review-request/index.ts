import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@4.0.0";

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { bookingId } = await req.json();

    if (!bookingId) {
      throw new Error('Booking ID is required');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch booking details
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select(`
        *,
        businesses:business_id (
          business_name,
          logo_url,
          category
        )
      `)
      .eq('id', bookingId)
      .single();

    if (bookingError) throw bookingError;
    if (!booking) throw new Error('Booking not found');

    // Only send review requests for completed bookings
    if (booking.status !== 'completed') {
      return new Response(
        JSON.stringify({ message: 'Booking not completed yet' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if review already exists
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('id')
      .eq('business_id', booking.business_id)
      .eq('customer_id', booking.customer_id)
      .single();

    if (existingReview) {
      return new Response(
        JSON.stringify({ message: 'Review already submitted' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const business = booking.businesses;
    const reviewUrl = `${Deno.env.get('SITE_URL')}/business/${booking.business_id}?review=true`;

    // Create email HTML
    const emailHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #1a365d 0%, #2563eb 100%);
              color: white;
              padding: 30px;
              border-radius: 10px 10px 0 0;
              text-align: center;
            }
            .logo {
              width: 60px;
              height: 60px;
              border-radius: 50%;
              margin-bottom: 15px;
            }
            .content {
              background: #ffffff;
              padding: 30px;
              border: 1px solid #e5e7eb;
              border-top: none;
            }
            .business-card {
              background: #f9fafb;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .rating-buttons {
              display: flex;
              justify-content: center;
              gap: 10px;
              margin: 25px 0;
            }
            .star-btn {
              width: 50px;
              height: 50px;
              border: 2px solid #fbbf24;
              background: white;
              border-radius: 8px;
              font-size: 24px;
              cursor: pointer;
              transition: all 0.3s;
              text-decoration: none;
              display: inline-flex;
              align-items: center;
              justify-content: center;
            }
            .star-btn:hover {
              background: #fbbf24;
              transform: scale(1.1);
            }
            .cta-button {
              display: inline-block;
              background: #10b981;
              color: white;
              padding: 14px 30px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              padding: 20px;
              color: #6b7280;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            ${business.logo_url ? `<img src="${business.logo_url}" alt="${business.business_name}" class="logo" />` : ''}
            <h1 style="margin: 0;">How was your experience?</h1>
          </div>
          
          <div class="content">
            <p>Hi ${booking.customer_name},</p>
            
            <p>Thank you for choosing <strong>${business.business_name}</strong>! We hope you had a great experience.</p>
            
            <div class="business-card">
              <h3 style="margin-top: 0;">${business.business_name}</h3>
              <p style="color: #6b7280; margin: 5px 0;">${business.category}</p>
              <p style="margin: 5px 0;"><strong>Service Date:</strong> ${new Date(booking.booking_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            
            <p><strong>Your feedback helps other customers discover great Black-owned businesses like this one!</strong></p>
            
            <p style="text-align: center; margin-top: 30px;">
              <a href="${reviewUrl}" class="cta-button">Write a Review</a>
            </p>
            
            <p style="font-size: 14px; color: #6b7280; text-align: center;">
              It only takes a minute and makes a big difference for the business.
            </p>
          </div>
          
          <div class="footer">
            <p>Mansa Musa Marketplace - Supporting Black-Owned Businesses</p>
            <p>
              <a href="${Deno.env.get('SITE_URL')}/unsubscribe" style="color: #6b7280;">Unsubscribe</a> | 
              <a href="${Deno.env.get('SITE_URL')}/privacy" style="color: #6b7280;">Privacy Policy</a>
            </p>
          </div>
        </body>
      </html>
    `;

    // Send email via Resend
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'Mansa Musa Marketplace <reviews@mansamusamarketplace.com>',
      to: [booking.customer_email],
      subject: `How was your experience at ${business.business_name}?`,
      html: emailHTML,
    });

    if (emailError) {
      console.error('Error sending email:', emailError);
      throw emailError;
    }

    console.log('Review request email sent:', emailData);

    // Log the review request
    await supabase.from('email_notifications').insert({
      user_id: booking.customer_id,
      recipient_email: booking.customer_email,
      email_type: 'review_request',
      subject: `How was your experience at ${business.business_name}?`,
      content: emailHTML,
      status: 'sent'
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Review request sent successfully',
        emailId: emailData.id 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in send-review-request:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});