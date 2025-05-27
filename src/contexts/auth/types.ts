
import { User, Session } from '@supabase/supabase-js';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  authInitialized: boolean;
  userType: string | null;
  checkSession: () => Promise<boolean>;
  signOut: () => Promise<void>;
}
