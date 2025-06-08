
import { User, Session } from '@supabase/supabase-js';

export interface AuthState {
  initialized: boolean;
  user: User | null;
  session: Session | null;
  isMfaEnabled: boolean;
  isLoading: boolean;
  userType?: string;
  authInitialized?: boolean;
  loading?: boolean;
}

export interface AuthActions {
  signInWithEmail: (email: string, password: string) => Promise<any>;
  signInWithProvider: (provider: 'google' | 'facebook' | 'github') => Promise<void>;
  signUp: (email: string, password: string, metadata?: object) => Promise<any>;
  signOut: () => Promise<void>;
  setupMFA: () => Promise<void>;
  checkSession?: () => Promise<boolean>;
  getMFAFactors?: () => Promise<any[]>;
  signIn?: (email: string, password: string) => Promise<any>;
}

export interface AuthContextType extends AuthState, AuthActions {}

export interface ToastProps {
  title: string;
  description: string;
  variant?: "default" | "destructive";
}
