
import { createTables } from '@/lib/supabase/init-database';
import { toast } from 'sonner';
import { InitDbResult } from '@/lib/supabase/types';

/**
 * This utility function initializes all tables in the Supabase database
 */
export const setupSupabaseTables = async (): Promise<boolean> => {
  try {
    toast.loading("Setting up database tables...");
    
    const result = await createTables();
    
    if (result.success) {
      toast.success("Database tables created successfully!");
      console.log("All tables were created successfully");
      return true;
    } else {
      if (result.error) {
        console.error("Error setting up database:", result.error);
        toast.error(`Failed to set up database: ${result.error.message}`);
      } else {
        toast.error("Failed to set up database");
      }
      return false;
    }
  } catch (error: any) {
    console.error("Unexpected error during database setup:", error);
    toast.error(`Database setup failed: ${error.message}`);
    return false;
  }
};
