import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const PENDING_CLAIM_KEY = 'pendingClaimUrl';

/** Saves a claim link so owners return to it after signing in or creating an account. */
export const savePendingClaim = (url: string) => {
  try { localStorage.setItem(PENDING_CLAIM_KEY, JSON.stringify({ url, at: Date.now() })); } catch { /* ignore */ }
};

export const clearPendingClaim = () => {
  try { localStorage.removeItem(PENDING_CLAIM_KEY); } catch { /* ignore */ }
};

const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

const PendingClaimRedirect = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) return;
    if (location.pathname === '/claim-business') return;
    let saved: { url?: string; at?: number } | null = null;
    try { saved = JSON.parse(localStorage.getItem(PENDING_CLAIM_KEY) || 'null'); } catch { saved = null; }
    if (!saved?.url || !saved.url.startsWith('/claim-business')) return;
    if (!saved.at || Date.now() - saved.at > MAX_AGE_MS) { clearPendingClaim(); return; }
    // One-shot: clear before redirecting so owners can leave the claim page freely.
    clearPendingClaim();
    navigate(saved.url, { replace: true });
  }, [user, location.pathname, navigate]);

  return null;
};

export default PendingClaimRedirect;
