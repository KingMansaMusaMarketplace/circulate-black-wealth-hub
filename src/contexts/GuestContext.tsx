import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface GuestSession {
  sessionId: string;
  zipCode: string | null;
  viewedBusinesses: string[];
  attemptedActions: string[];
  createdAt: string;
}

interface AttemptedAction {
  action: string;
  businessName?: string;
  timestamp: string;
}

interface GuestContextType {
  isGuest: boolean;
  guestSession: GuestSession | null;
  setZipCode: (zip: string) => void;
  trackBusinessView: (businessId: string) => void;
  trackAttemptedAction: (action: string) => void;
  getViewedBusinessCount: () => number;
  clearGuestSession: () => void;
  // Additional properties for signup prompts
  recordBusinessView: (businessId: string) => void;
  recordAttemptedAction: (action: string, businessName?: string) => void;
  showSignupPrompt: boolean;
  setShowSignupPrompt: (show: boolean) => void;
  lastAttemptedAction: AttemptedAction | null;
}

const GuestContext = createContext<GuestContextType | undefined>(undefined);

const GUEST_SESSION_KEY = 'mansa_guest_session';

export const GuestProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [guestSession, setGuestSession] = useState<GuestSession | null>(null);
  const [isGuest, setIsGuest] = useState(true);
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  const [lastAttemptedAction, setLastAttemptedAction] = useState<AttemptedAction | null>(null);

  // Initialize guest session from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(GUEST_SESSION_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setGuestSession(parsed);
      } catch (e) {
        console.error('Failed to parse guest session:', e);
        initializeNewSession();
      }
    } else {
      initializeNewSession();
    }
  }, []);

  const initializeNewSession = () => {
    const newSession: GuestSession = {
      sessionId: uuidv4(),
      zipCode: null,
      viewedBusinesses: [],
      attemptedActions: [],
      createdAt: new Date().toISOString(),
    };
    setGuestSession(newSession);
    localStorage.setItem(GUEST_SESSION_KEY, JSON.stringify(newSession));
  };

  const updateSession = useCallback((updates: Partial<GuestSession>) => {
    setGuestSession(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      localStorage.setItem(GUEST_SESSION_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const setZipCode = useCallback((zip: string) => {
    updateSession({ zipCode: zip });
  }, [updateSession]);

  const trackBusinessView = useCallback((businessId: string) => {
    setGuestSession(prev => {
      if (!prev) return prev;
      if (prev.viewedBusinesses.includes(businessId)) return prev;
      const updated = {
        ...prev,
        viewedBusinesses: [...prev.viewedBusinesses, businessId].slice(-50), // Keep last 50
      };
      localStorage.setItem(GUEST_SESSION_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const trackAttemptedAction = useCallback((action: string) => {
    setGuestSession(prev => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        attemptedActions: [...prev.attemptedActions, action].slice(-20), // Keep last 20
      };
      localStorage.setItem(GUEST_SESSION_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Alias for trackBusinessView
  const recordBusinessView = useCallback((businessId: string) => {
    trackBusinessView(businessId);
  }, [trackBusinessView]);

  // Enhanced version that triggers signup prompt
  const recordAttemptedAction = useCallback((action: string, businessName?: string) => {
    trackAttemptedAction(action);
    setLastAttemptedAction({
      action,
      businessName,
      timestamp: new Date().toISOString(),
    });
    setShowSignupPrompt(true);
  }, [trackAttemptedAction]);

  const getViewedBusinessCount = useCallback(() => {
    return guestSession?.viewedBusinesses.length ?? 0;
  }, [guestSession]);

  const clearGuestSession = useCallback(() => {
    localStorage.removeItem(GUEST_SESSION_KEY);
    setGuestSession(null);
    setIsGuest(false);
  }, []);

  return (
    <GuestContext.Provider
      value={{
        isGuest,
        guestSession,
        setZipCode,
        trackBusinessView,
        trackAttemptedAction,
        getViewedBusinessCount,
        clearGuestSession,
        recordBusinessView,
        recordAttemptedAction,
        showSignupPrompt,
        setShowSignupPrompt,
        lastAttemptedAction,
      }}
    >
      {children}
    </GuestContext.Provider>
  );
};

export const useGuest = (): GuestContextType => {
  const context = useContext(GuestContext);
  if (!context) {
    throw new Error('useGuest must be used within a GuestProvider');
  }
  return context;
};

export default GuestContext;
