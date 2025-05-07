
import { supabase } from '../supabase';
import { InitDbResult } from './types';
import {
  createProfilesTable,
  createBusinessesTable,
  createProductImagesTable,
  createLoyaltyPointsTable,
  createTransactionsTable,
  createReviewsTable,
  createQrCodesTable,
  createQrScansTable,
  createRewardsTable,
  createRedeemedRewardsTable
} from './tables';
import { createDatabaseFunctions } from './functions';

// Create tables in Supabase
export const createTables = async (): Promise<InitDbResult> => {
  try {
    console.log('Setting up Supabase database tables...');
    
    // Create all tables
    await createProfilesTable();
    await createBusinessesTable();
    await createProductImagesTable();
    await createLoyaltyPointsTable();
    await createTransactionsTable();
    await createReviewsTable();
    await createQrCodesTable();
    await createQrScansTable();
    await createRewardsTable();
    await createRedeemedRewardsTable();
    
    // Create database functions
    await createDatabaseFunctions();

    console.log('All tables setup complete!');
    return { success: true };
  } catch (error) {
    console.error('Error setting up database tables:', error);
    return { success: false, error };
  }
};

// Helper function to initialize the database on application startup
export const initializeDatabase = async (): Promise<InitDbResult> => {
  try {
    // Check if we're connected to a real Supabase instance
    const { data, error } = await supabase.from('profiles').select('id').limit(1);
    
    if (error && error.message === 'Supabase not configured') {
      console.warn('Using mock Supabase client. Database initialization skipped.');
      return { success: false, isDemo: true };
    }
    
    // Create all tables
    return await createTables();
  } catch (error) {
    console.error('Database initialization error:', error);
    return { success: false, error };
  }
};
