
// Import the main supabase client from integrations
export { supabase } from '@/integrations/supabase/client';

// Re-export auth functions from integrations
export {
  getCurrentUser,
  getSession,
  signUp,
  signIn,
  signOut
} from '@/integrations/supabase/client';
