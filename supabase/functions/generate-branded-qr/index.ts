import { createClient } from 'jsr:@supabase/supabase-js@2';
import QRCode from 'npm:qrcode@1.5.3';
import { z } from 'npm:zod@3.23.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting store (in-memory, resets on function cold start)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string, maxRequests = 10, windowMs = 60000): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);
  
  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (entry.count >= maxRequests) return false;
  entry.count++;
  return true;
}

// Zod schema for input validation
const QRCodeRequestSchema = z.object({
  data: z.string().min(1, 'QR code data is required').max(2048, 'QR code data too long'),
  size: z.number().int().min(64).max(2048).optional().default(512),
  logoUrl: z.string().url().max(500).optional().default('https://agoclnqfyinwjxdmjnns.supabase.co/storage/v1/object/public/mmm-logo.png'),
  errorCorrectionLevel: z.enum(['L', 'M', 'Q', 'H']).optional().default('H'),
});

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Apply rate limiting
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    
    if (!checkRateLimit(clientIP, 10, 60000)) { // 10 requests per minute
      console.log(`Rate limit exceeded for IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please wait a moment before trying again.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse and validate input
    const rawBody = await req.json();
    const parseResult = QRCodeRequestSchema.safeParse(rawBody);
    
    if (!parseResult.success) {
      const errors = parseResult.error.issues.map(i => i.message).join(', ');
      console.log('Validation error:', errors);
      return new Response(
        JSON.stringify({ error: `Validation error: ${errors}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data, size, logoUrl, errorCorrectionLevel } = parseResult.data;

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
