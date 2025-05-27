
import { User, Session } from '@supabase/supabase-js';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  authInitialized: boolean;
  userType: string | null;
  checkSession: () => Promise<boolean>;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, metadata?: any) => Promise<any>;
  signInWithSocial: (provider: 'google' | 'facebook' | 'github') => Promise<void>;
  verifyMFA: (factorId: string, code: string, challengeId: string) => Promise<any>;
  getMFAFactors: () => Promise<Factor[]>;
  updateUserPassword: (password: string) => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
  databaseInitialized?: boolean;
}

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
