
import { supabase } from './supabase';
import { initializeDatabase } from './supabase-schema';

// Interface for DB initialization state
export interface DbInitState {
  initializingDatabase: boolean;
  databaseInitialized: boolean;
}

// Initialize database and update state
export const setupDatabase = async (
  setInitializingDatabase: (state: boolean) => void,
  setDatabaseInitialized: (state: boolean) => void
): Promise<void> => {
  setInitializingDatabase(true);
  try {
    const result = await initializeDatabase();
    
    if (result.success) {
      setDatabaseInitialized(true);
      console.log('Database initialized successfully');
    } else if ('isDemo' in result && result.isDemo) {
      console.log('Running in demo mode with mock Supabase client');
    } else if ('error' in result) {
      console.error('Failed to initialize database:', result.error);
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    setInitializingDatabase(false);
  }
};
