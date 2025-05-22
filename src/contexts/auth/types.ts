
import { User, Session, AuthError } from '@supabase/supabase-js';

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

export type ToastProps = {
  title: string;
  description: string;
  variant?: "default" | "destructive";
};

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  userType: 'customer' | 'business' | null;
  loading: boolean;
  authInitialized: boolean;
  initializingDatabase: boolean;
  databaseInitialized: boolean;
  signUp: (email: string, password: string, metadata?: any) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signInWithEmail: (email: string, password: string) => Promise<any>;
  signInWithSocial: (provider: 'google' | 'facebook' | 'github') => Promise<void>;
  signOut: () => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
  updateUserPassword: (newPassword: string) => Promise<any>;
  checkSession: () => Promise<boolean>;
  mfaEnrolled: boolean;
  mfaFactors: Factor[];
  verifyMFA: (factorId: string, code: string, challengeId: string) => Promise<any>;
  getMFAFactors: () => Promise<Factor[]>;
  getCurrentMFAChallenge: () => MFAChallenge | null;
}

export interface SocialLoginProps {
  type?: 'signup' | 'login';
}
