
import { User, Provider, Session } from '@supabase/supabase-js';

// Toast props type
export type ToastProps = {
  title: string;
  description: string;
  variant?: "default" | "destructive";
};

// MFA Factor type
export type Factor = {
  id: string;
  created_at: string;
  updated_at: string;
  factor_type: string;
  status: string;
  friendly_name?: string;
};

// MFA Challenge type
export type MFAChallenge = {
  id: string;
  factorId: string;
  expiresAt: string;
};

export type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  authInitialized: boolean; // Added this property
  signUp: (email: string, password: string, metadata?: any) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signInWithSocial: (provider: Provider) => Promise<any>;
  signOut: () => Promise<any>; // Updated return type from Promise<void>
  resetPassword: (email: string) => Promise<any>;
  updateUserPassword: (newPassword: string) => Promise<any>;
  userType: 'customer' | 'business' | null;
  initializingDatabase: boolean;
  databaseInitialized: boolean;
  checkSession: () => Promise<boolean>;
  mfaEnrolled: boolean;
  mfaFactors: Factor[];
  verifyMFA: (factorId: string, code: string, challengeId: string) => Promise<any>;
  getMFAFactors: () => Promise<Factor[]>;
  getCurrentMFAChallenge: () => MFAChallenge | null;
};
