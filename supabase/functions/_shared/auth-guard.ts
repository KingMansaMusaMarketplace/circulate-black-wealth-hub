/**
 * Shared Authentication & Authorization Guard for Edge Functions
 * 
 * Provides reusable auth patterns:
 * - requireAuth: Validates JWT and returns user ID
 * - requireAdmin: Validates JWT + admin role
 * - requireBusinessOwner: Validates JWT + business ownership
 * - requireAdminOrCron: Validates admin JWT or CRON_SECRET header
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

export interface AuthResult {
  authenticated: boolean;
  userId?: string;
  error?: string;
  status?: number;
}

const JSON_HEADERS = { 'Content-Type': 'application/json' };

/**
 * Validate JWT and return authenticated user ID.
 */
export async function requireAuth(req: Request, corsHeaders: Record<string, string>): Promise<AuthResult & { supabaseAuth?: any }> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return { authenticated: false, error: 'Unauthorized', status: 401 };
  }

  const supabaseAuth = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } }
  );

  const token = authHeader.replace('Bearer ', '');
  const { data: claimsData, error: claimsError } = await supabaseAuth.auth.getClaims(token);
  if (claimsError || !claimsData?.claims?.sub) {
    return { authenticated: false, error: 'Invalid token', status: 401 };
  }

  return { authenticated: true, userId: claimsData.claims.sub as string, supabaseAuth };
}

/**
 * Validate JWT + admin role. Returns 401/403 on failure.
 */
export async function requireAdmin(req: Request, corsHeaders: Record<string, string>): Promise<AuthResult> {
  const authResult = await requireAuth(req, corsHeaders);
  if (!authResult.authenticated) return authResult;

  const { data: isAdmin } = await authResult.supabaseAuth!.rpc('is_admin_secure');
  if (!isAdmin) {
    return { authenticated: false, error: 'Forbidden: admin access required', status: 403 };
  }

  return { authenticated: true, userId: authResult.userId };
}

/**
 * True when the caller presents the project's service-role key (server-to-server calls
 * from other edge functions, webhooks, or pg_net jobs).
 */
export function isServiceRoleCaller(req: Request): boolean {
  const authHeader = req.headers.get('Authorization') || '';
  const token = authHeader.replace('Bearer ', '').trim();
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  return !!key && token.length > 0 && token === key;
}

/**
 * Escape untrusted text before interpolating it into email HTML.
 */
export function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Validate JWT + admin role OR CRON_SECRET header (for scheduled jobs) OR service-role key.
 */
export async function requireAdminOrCron(req: Request, corsHeaders: Record<string, string>): Promise<AuthResult> {
  // Internal server-to-server callers
  if (isServiceRoleCaller(req)) {
    return { authenticated: true, userId: 'service' };
  }

  // Check for cron secret first
  const cronSecret = Deno.env.get('CRON_SECRET');
  const providedSecret = req.headers.get('x-cron-secret');
  if (cronSecret && providedSecret && providedSecret === cronSecret) {
    return { authenticated: true, userId: 'cron' };
  }

  // Fall back to admin JWT auth
  return requireAdmin(req, corsHeaders);
}


/**
 * Validate JWT + business ownership for the given businessId.
 */
export async function requireBusinessOwner(
  req: Request,
  businessId: string,
  corsHeaders: Record<string, string>
): Promise<AuthResult> {
  const authResult = await requireAuth(req, corsHeaders);
  if (!authResult.authenticated) return authResult;

  // Check if user is admin (admins can access any business)
  const { data: isAdmin } = await authResult.supabaseAuth!.rpc('is_admin_secure');
  if (isAdmin) {
    return { authenticated: true, userId: authResult.userId };
  }

  // Check business ownership
  const serviceClient = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );
  const { data: business } = await serviceClient
    .from('businesses')
    .select('id')
    .eq('id', businessId)
    .eq('owner_id', authResult.userId!)
    .maybeSingle();

  if (!business) {
    // Also check location manager
    const { data: managed } = await serviceClient
      .from('businesses')
      .select('id')
      .eq('id', businessId)
      .eq('location_manager_id', authResult.userId!)
      .maybeSingle();

    if (!managed) {
      return { authenticated: false, error: 'Forbidden: not business owner', status: 403 };
    }
  }

  return { authenticated: true, userId: authResult.userId };
}

/**
 * Build an error response from AuthResult.
 */
export function authErrorResponse(result: AuthResult, corsHeaders: Record<string, string>): Response {
  return new Response(
    JSON.stringify({ error: result.error }),
    { status: result.status || 401, headers: { ...corsHeaders, ...JSON_HEADERS } }
  );
}
