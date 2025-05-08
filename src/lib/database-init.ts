
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
    
    // Type the response properly to handle the Supabase response structure
    type ExistsResponse = { exists: boolean }[];
    
    // Check if data exists, is an array, has at least one item, and that item has an 'exists' property
    if (data && Array.isArray(data) && data.length > 0) {
      const typedData = data as ExistsResponse;
      if (typedData[0] && 'exists' in typedData[0]) {
        return typedData[0].exists;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error checking database initialization:', error);
    return false;
  }
};
