
import { User, Session } from '@supabase/supabase-js';

export interface AuthState {
  initialized: boolean;
  user: User | null;
  session: Session | null;
  isMfaEnabled: boolean;
  isLoading: boolean;
  userType?: string;
  authInitialized: boolean;
  loading: boolean;
  databaseInitialized: boolean;
}

export interface ToastProps {
  title: string;
  description: string;
  variant?: 'default' | 'destructive';
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
