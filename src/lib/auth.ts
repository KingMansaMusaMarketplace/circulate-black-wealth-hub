
import { supabase } from '@/integrations/supabase/client';
import { User, Provider } from '@supabase/supabase-js';
import { toast } from 'sonner';

// Re-export from the new location for backwards compatibility
export * from './auth/index';
