
import { AuthError, Session, User, UserResponse } from '@supabase/supabase-js';

export type AuthState = {
  initialized: boolean;
  user: User | null;
  session: Session | null;
  isMfaEnabled: boolean;
  isLoading: boolean;
};

export type AuthActions = {
  signInWithEmail: (email: string, password: string) => Promise<{ error?: AuthError }>;
  signInWithProvider: (provider: 'google' | 'facebook' | 'github') => Promise<void>;
  signUp: (
    email: string,
    password: string,
    metadata?: object
  ) => Promise<{ error?: AuthError; data?: UserResponse }>;
  signOut: () => Promise<void>;
  setupMFA: () => Promise<string>;
};

export type ToastProps = {
  title: string;
  description: string;
  variant?: "default" | "destructive";
};

export type Factor = {
  id: string;
  type: string;
  status: string;
  friendly_name?: string;
};

export type MFAChallenge = {
  id: string;
  factorId: string;
  expiresAt: string;
};
