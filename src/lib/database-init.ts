
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { createDatabaseFunctions } from './supabase/functions';

// Initialize all database tables and functions
export const setupDatabase = async (
  setInitializing?: (initializing: boolean) => void,
  setInitialized?: (initialized: boolean) => void
) => {
  if (setInitializing) setInitializing(true);
  
  try {
    console.log('Setting up database functions...');
    
    // Create QR code functions
    await createDatabaseFunctions();
    
    console.log('Database setup complete!');
    if (setInitialized) setInitialized(true);
    toast.success('Database initialized successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
    toast.error('Failed to initialize database');
  } finally {
    if (setInitializing) setInitializing(false);
  }
};

// Check if the database is initialized by checking if the QR code functions exist
export const checkDatabaseInitialized = async (): Promise<boolean> => {
  try {
    // Try to call a function that should exist if the database is initialized
    const { data, error } = await supabase.rpc('exec_sql', {
      query: "SELECT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'create_business_qr_code')"
    });
    
    if (error) {
      console.error('Error checking database initialization:', error);
      return false;
    }
    
    return data && data.length > 0 && data[0].exists;
  } catch (error) {
    console.error('Error checking database initialization:', error);
    return false;
  }
};
