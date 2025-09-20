
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { createDatabaseFunctions } from './supabase/functions';
import { checkDatabaseHealth } from './utils/health-check';

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
    // First check if we can connect to the database at all
    const isHealthy = await checkDatabaseHealth();
    if (!isHealthy) {
      console.warn('Database health check failed, cannot verify initialization status');
      return false;
    }

    // Use secure check_function_exists function
    const { data, error } = await supabase.rpc('check_function_exists', {
      function_name: 'create_business_qr_code'
    });
    
    if (error) {
      console.error('Error checking database initialization:', error);
      return false;
    }
    
    console.log("Database initialization check response:", data);
    
    // data is already a boolean from the function
    return data === true;
  } catch (error) {
    console.error('Error checking database initialization:', error);
    return false;
  }
};
