import React, { createContext, useContext } from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const PRIVATE_SESSION_ENDED = 'hc_preview_session_closed';
export const PRIVATE_SESSION_END = 'hc_preview_session_end';
export const PrivateSessionContext = createContext<(() => void) | null>(null);

export function closePrivateSession(storage: Pick<Storage, 'setItem' | 'removeItem'>) {
  storage.setItem(PRIVATE_SESSION_ENDED, 'true');
  storage.removeItem(PRIVATE_SESSION_END);
}

export function EndPrivateSessionButton({ className = '' }: { className?: string }) {
  const endSession = useContext(PrivateSessionContext);
  if (!endSession) return null;
  return <Button variant="ghost" onClick={endSession} className={`gap-2 text-muted-foreground hover:text-foreground ${className}`}>
    <LogOut className="h-4 w-4 shrink-0" />End private session
  </Button>;
}