import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Auth Rate Guard - Server-side brute-force protection for auth endpoints.
 * 
 * Checks rate limits before allowing login/signup/password-reset attempts.
 * Uses the database-level `check_auth_rate_limit_v2` function.
 * 
 * POST /auth-rate-guard
 * Body: { identifier: string, attempt_type: 'login' | 'signup' | 'password_reset' }
 * 
 * Returns: { allowed: boolean, remaining_attempts: number, retry_after_seconds: number }
 */
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { identifier, attempt_type = 'login', success = false } = await req.json();

    if (!identifier || typeof identifier !== 'string') {
      return new Response(
        JSON.stringify({ error: 'identifier is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sanitize identifier (lowercase email, trim)
    const sanitizedId = identifier.toLowerCase().trim().slice(0, 255);
    
    // Validate attempt_type
    const validTypes = ['login', 'signup', 'password_reset'];
    const safeType = validTypes.includes(attempt_type) ? attempt_type : 'login';

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // If this is a success signal, reset the rate limit
    if (success === true) {
      await supabaseAdmin.rpc('reset_auth_rate_limit', {
        p_identifier: sanitizedId,
        p_attempt_type: safeType,
      });
      return new Response(
        JSON.stringify({ allowed: true, remaining_attempts: 5, retry_after_seconds: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check rate limit
    const { data, error } = await supabaseAdmin.rpc('check_auth_rate_limit_v2', {
      p_identifier: sanitizedId,
      p_attempt_type: safeType,
      p_max_attempts: safeType === 'signup' ? 3 : 5,
      p_window_minutes: 15,
    });

    if (error) {
      console.error('Rate limit check error:', error);
      // Fail open — don't block users if the rate limit check itself fails
      return new Response(
        JSON.stringify({ allowed: true, remaining_attempts: 5, retry_after_seconds: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = data as { allowed: boolean; remaining_attempts: number; retry_after_seconds: number; blocked_until: string | null };

    // Add security headers to response
    const headers = {
      ...corsHeaders,
      'Content-Type': 'application/json',
      ...(result.retry_after_seconds > 0 ? { 'Retry-After': String(result.retry_after_seconds) } : {}),
    };

    return new Response(JSON.stringify(result), {
      status: result.allowed ? 200 : 429,
      headers,
    });
  } catch (err) {
    console.error('Auth rate guard error:', err);
    return new Response(
      JSON.stringify({ allowed: true, remaining_attempts: 5, retry_after_seconds: 0 }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
