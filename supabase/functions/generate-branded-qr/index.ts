import { createClient } from 'jsr:@supabase/supabase-js@2';
import QRCode from 'npm:qrcode@1.5.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface QRCodeRequest {
  data: string;
  size?: number;
  logoSize?: number;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data, size = 512, logoSize = 100, errorCorrectionLevel = 'H' }: QRCodeRequest = await req.json();

    if (!data) {
      return new Response(
        JSON.stringify({ error: 'QR code data is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Generating branded QR code for data:', data);

    // Generate QR code as data URL with high error correction for logo overlay
    const qrCodeDataUrl = await QRCode.toDataURL(data, {
      width: size,
      margin: 2,
      errorCorrectionLevel: errorCorrectionLevel,
      color: {
        dark: '#1a1a1a',
        light: '#ffffff'
      }
    });

    console.log('QR code base generated');

    // Fetch the MMM logo from storage or use a default
    // For now, we'll use a simple overlay approach
    // In production, you'd fetch the actual logo and composite it

    // Since we can't easily do image manipulation in Deno without additional libraries,
    // we'll use the AI image generation to create a branded version
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    
    if (!OPENAI_API_KEY) {
      console.warn('OPENAI_API_KEY not set, returning plain QR code');
      return new Response(
        JSON.stringify({ 
          qrCodeUrl: qrCodeDataUrl,
          message: 'Plain QR code generated (no logo - API key missing)'
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use AI to enhance the QR code with branding
    console.log('Enhancing QR code with AI branding...');
    
    const aiResponse = await fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: `Add the Mansa Musa Marketplace logo (a gold crown with 'MMM' text) centered at the top of this QR code. 
                 The logo should be elegant, professional, and not interfere with the QR code scanning functionality. 
                 Keep the QR code pattern intact and scannable. Background should be white.`,
        image: qrCodeDataUrl,
        background: 'opaque',
        output_format: 'png',
        quality: 'high',
        size: `${size}x${size}`
      })
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI image generation failed:', errorText);
      return new Response(
        JSON.stringify({ 
          qrCodeUrl: qrCodeDataUrl,
          message: 'Plain QR code generated (AI enhancement failed)'
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await aiResponse.json();
    const brandedImageUrl = aiData.data?.[0]?.b64_json 
      ? `data:image/png;base64,${aiData.data[0].b64_json}`
      : qrCodeDataUrl;

    console.log('Branded QR code generated successfully');

    return new Response(
      JSON.stringify({ 
        qrCodeUrl: brandedImageUrl,
        plainQrCodeUrl: qrCodeDataUrl,
        message: 'Branded QR code generated successfully'
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
