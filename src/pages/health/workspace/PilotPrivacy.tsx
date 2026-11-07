import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { EyeOff, Eye, Lock, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IDLE_LOCK_MINUTES, SAFEGUARD_LABEL, maskName } from '@/lib/clinical/pilot-visit-notes';
import type { Row } from './hc';

type PrivacyCtx = { privacy: boolean; setPrivacy: (v: boolean) => void; name: (p?: Row | null) => string };
const Ctx = createContext<PrivacyCtx>({ privacy: true, setPrivacy: () => {}, name: (p) => (p ? `${p.first_name} ${p.last_name}` : '—') });

export const usePilotPrivacy = () => useContext(Ctx);

const ACTIVITY = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'wheel'] as const;

/**
 * Pilot privacy shell: names start masked to initials, and the screen locks after
 * IDLE_LOCK_MINUTES of no activity. Content stays mounted (unsaved drafts survive)
 * but is hidden from view until the user deliberately resumes.
 */
export function PilotPrivacyShell({ children }: { children: React.ReactNode }) {
  const [privacy, setPrivacy] = useState(true);
  const [locked, setLocked] = useState(false);
  const timer = useRef<number | null>(null);
  const lockedRef = useRef(false);

  const arm = useCallback(() => {
    if (lockedRef.current) return;
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => { lockedRef.current = true; setLocked(true); }, IDLE_LOCK_MINUTES * 60_000);
  }, []);

  useEffect(() => {
    arm();
    ACTIVITY.forEach((e) => window.addEventListener(e, arm, { passive: true }));
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
      ACTIVITY.forEach((e) => window.removeEventListener(e, arm));
    };
  }, [arm]);

  const resume = () => { lockedRef.current = false; setLocked(false); arm(); };
  const name = useCallback((p?: Row | null) => (p ? (privacy ? maskName(p.first_name, p.last_name) : `${p.first_name} ${p.last_name}`) : '—'), [privacy]);

  return (
    <Ctx.Provider value={{ privacy, setPrivacy, name }}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card px-4 py-2 text-sm">
        <span className="flex items-center gap-2 text-muted-foreground"><ShieldCheck className="h-4 w-4 text-mansagold" /><b className="text-foreground">{SAFEGUARD_LABEL}</b> · clinic-only access · every chart open logged · no deletes · locks after {IDLE_LOCK_MINUTES} idle minutes</span>
        <Button size="sm" variant="outline" onClick={() => setPrivacy(!privacy)} aria-pressed={!privacy}>
          {privacy ? <><Eye className="mr-1 h-4 w-4" />Show full names</> : <><EyeOff className="mr-1 h-4 w-4" />Hide names</>}
        </Button>
      </div>
      <div className={locked ? 'invisible' : undefined} aria-hidden={locked || undefined}>{children}</div>
      {locked && (
        <div role="dialog" aria-modal="true" aria-labelledby="pilot-lock-title" className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 p-6 backdrop-blur-xl">
          <div className="max-w-sm space-y-4 rounded-xl border bg-card p-6 text-center shadow-lg">
            <Lock className="mx-auto h-10 w-10 text-mansagold" />
            <h2 id="pilot-lock-title" className="text-lg font-semibold">Screen locked for privacy</h2>
            <p className="text-sm text-muted-foreground">No activity for {IDLE_LOCK_MINUTES} minutes, so patient details are hidden. Unsaved drafts are kept.</p>
            <Button onClick={resume} className="w-full bg-mansagold text-mansablue hover:bg-mansagold-dark">I’m back — show the screen</Button>
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}
