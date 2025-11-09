import { createClient } from 'jsr:@supabase/supabase-js@2';
import QRCode from 'npm:qrcode@1.5.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface QRCodeRequest {
  data: string;
  size?: number;
  logoUrl?: string;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      data, 
      size = 512, 
      logoUrl = 'https://agoclnqfyinwjxdmjnns.supabase.co/storage/v1/object/public/mmm-logo.png',
      errorCorrectionLevel = 'H' 
    }: QRCodeRequest = await req.json();

    if (!data) {
      return new Response(
        JSON.stringify({ error: 'QR code data is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Generating branded QR code for data:', data);

    // Generate QR code with high error correction for logo overlay
    const qrCodeDataUrl = await QRCode.toDataURL(data, {
      width: size,
      margin: 2,
      errorCorrectionLevel: errorCorrectionLevel,
      color: {
        dark: '#1a1a1a',
        light: '#ffffff'
      }
    });

    console.log('Base QR code generated successfully');

    // For now, return the plain QR code
    // To properly overlay the logo, we'd need canvas manipulation which is better done client-side
    // or with a more robust server-side solution using image processing libraries
    
    return new Response(
      JSON.stringify({ 
        qrCodeUrl: qrCodeDataUrl,
        message: 'QR code generated. Logo overlay should be done client-side for best results.',
        logoUrl: logoUrl
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating branded QR code:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate branded QR code',
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
