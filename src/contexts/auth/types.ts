
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
  databaseInitialized: boolean;
}

export interface AuthActions {
  signInWithEmail: (email: string, password: string) => Promise<any>;
  signInWithProvider: (provider: 'google' | 'facebook' | 'github') => Promise<void>;
  signInWithSocial: (provider: 'google' | 'facebook' | 'github') => Promise<void>;
  signUp: (email: string, password: string, metadata?: object) => Promise<any>;
  signOut: () => Promise<void>;
  setupMFA: () => Promise<void>;
  checkSession?: () => Promise<boolean>;
  getMFAFactors?: () => Promise<any[]>;
  signIn?: (email: string, password: string) => Promise<any>;
  verifyMFA?: (factorId: string, code: string, challengeId: string) => Promise<any>;
  updateUserPassword?: (newPassword: string) => Promise<{ success: boolean; error?: any }>;
  resetPassword?: (email: string) => Promise<{ success: boolean; error?: any }>;
}

export interface AuthContextType extends AuthState, AuthActions {}

export interface ToastProps {
  title: string;
  description: string;
  variant?: "default" | "destructive";
}

export interface Factor {
  id: string;
  type: string;
  status: string;
  friendly_name?: string;
}

export interface MFAChallenge {
  id: string;
  factorId: string;
  expiresAt: string;
}
