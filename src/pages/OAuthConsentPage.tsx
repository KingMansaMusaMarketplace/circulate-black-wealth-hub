import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Loader2, ShieldCheck } from 'lucide-react';

// Minimal typed wrapper around the Supabase `auth.oauth` beta namespace so
// TypeScript doesn't complain if the SDK types don't expose it yet.
type OAuthApi = {
  getAuthorizationDetails: (id: string) => Promise<{ data: any; error: any }>;
  approveAuthorization: (id: string) => Promise<{ data: any; error: any }>;
  denyAuthorization: (id: string) => Promise<{ data: any; error: any }>;
};

function getOAuthApi(): OAuthApi | null {
  const anyAuth = (supabase.auth as any);
  return anyAuth?.oauth ?? null;
}

const OAuthConsentPage: React.FC = () => {
  const [params] = useSearchParams();
  const authorizationId = params.get('authorization_id') ?? '';
  const [details, setDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) {
        setError('Missing authorization_id in the URL.');
        return;
      }

      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        // Preserve the FULL consent URL so login returns the user here.
        const next = window.location.pathname + window.location.search;
        window.location.href = '/login?next=' + encodeURIComponent(next);
        return;
      }

      const api = getOAuthApi();
      if (!api) {
        setError(
          'This Supabase project does not expose the OAuth 2.1 authorization API yet. Please try again in a moment.',
        );
        return;
      }

      const { data, error: err } = await api.getAuthorizationDetails(
        authorizationId,
      );
      if (!active) return;
      if (err) {
        setError(err.message ?? 'Could not load this authorization request.');
        return;
      }

      const immediate = data?.redirect_url ?? data?.redirect_to;
      if (immediate && !data?.client) {
        window.location.href = immediate;
        return;
      }
      setDetails(data);
    })();
    return () => {
      active = false;
    };
  }, [authorizationId]);

  async function decide(approve: boolean) {
    setBusy(true);
    const api = getOAuthApi();
    if (!api) {
      setBusy(false);
      setError('Authorization API not available.');
      return;
    }
    const { data, error: err } = approve
      ? await api.approveAuthorization(authorizationId)
      : await api.denyAuthorization(authorizationId);
    if (err) {
      setBusy(false);
      setError(err.message ?? 'Something went wrong.');
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError('No redirect URL was returned by the authorization server.');
      return;
    }
    window.location.href = target;
  }

  const clientName = details?.client?.name ?? details?.client?.client_name ?? 'an assistant';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#000000] via-[#050a18] to-[#030712] px-4">
      <Helmet>
        <title>Connect to 1325.AI</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <ShieldCheck className="w-6 h-6 text-mansagold" aria-hidden="true" />
          <h1 className="text-xl md:text-2xl font-bold text-white">
            Connect to 1325.AI
          </h1>
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-red-200 text-sm">
            {error}
          </div>
        )}

        {!error && !details && (
          <div className="flex items-center gap-2 text-white/70">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading authorization request…</span>
          </div>
        )}

        {!error && details && (
          <>
            <p className="text-white/80 mb-2">
              <span className="font-semibold text-white">{clientName}</span>{' '}
              is asking to connect to your 1325.AI account.
            </p>
            <p className="text-white/60 text-sm mb-6">
              If you approve, this assistant will be able to use 1325.AI tools
              as you — browse the directory, view your loyalty points, and
              read your recent QR scans. You can revoke this at any time from
              your account settings.
            </p>

            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <Button
                variant="outline"
                className="flex-1"
                disabled={busy}
                onClick={() => decide(false)}
              >
                Deny
              </Button>
              <Button
                className="flex-1 bg-mansagold text-black hover:bg-mansagold/90"
                disabled={busy}
                onClick={() => decide(true)}
              >
                {busy ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Connecting…
                  </>
                ) : (
                  'Approve'
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OAuthConsentPage;
