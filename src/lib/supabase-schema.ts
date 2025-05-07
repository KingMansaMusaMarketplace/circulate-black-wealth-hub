
import { supabase } from './supabase';

// Define the return type for the initialization functions
interface InitDbSuccessResult {
  success: true;
}

interface InitDbErrorResult {
  success: false;
  error: any;
}

interface InitDbDemoResult {
  success: false;
  isDemo: true;
}

type InitDbResult = InitDbSuccessResult | InitDbErrorResult | InitDbDemoResult;

// Create tables in Supabase
export const createTables = async (): Promise<InitDbResult> => {
  try {
    console.log('Setting up Supabase database tables...');
    
    // This function checks if a table exists, and if not, creates it
    const setupTable = async (tableName: string, createQuery: string) => {
      // Check if table exists
      const { data: existingTable, error: checkError } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);
      
      if (checkError && checkError.code === '42P01') { // Table doesn't exist error code
        console.log(`Creating ${tableName} table...`);
        const { error: createError } = await supabase.rpc('exec_sql', { query: createQuery });
        
        if (createError) {
          console.error(`Error creating ${tableName} table:`, createError);
          throw createError;
        }
        
        console.log(`${tableName} table created successfully`);
      } else if (checkError) {
        console.error(`Error checking ${tableName} table:`, checkError);
        throw checkError;
      } else {
        console.log(`${tableName} table already exists`);
      }
    };

    // Create users table (extends Supabase auth.users)
    await setupTable('profiles', `
      CREATE TABLE profiles (
        id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
        user_type VARCHAR NOT NULL CHECK (user_type IN ('customer', 'business')),
        full_name VARCHAR,
        avatar_url VARCHAR,
        phone VARCHAR,
        email VARCHAR,
        address VARCHAR,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Setup RLS policies
      ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
      
      -- Policy for users to view their own profile
      CREATE POLICY "Users can view their own profile"
        ON profiles FOR SELECT
        USING (auth.uid() = id);
      
      -- Policy for users to update their own profile
      CREATE POLICY "Users can update their own profile"
        ON profiles FOR UPDATE
        USING (auth.uid() = id);
    `);

    // Create businesses table
    await setupTable('businesses', `
      CREATE TABLE businesses (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        business_name VARCHAR NOT NULL,
        description TEXT,
        category VARCHAR,
        address VARCHAR,
        city VARCHAR,
        state VARCHAR,
        zip_code VARCHAR,
        phone VARCHAR,
        email VARCHAR,
        website VARCHAR,
        logo_url VARCHAR,
        banner_url VARCHAR,
        is_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Setup RLS policies
      ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
      
      -- Policy for public to view businesses
      CREATE POLICY "Businesses are viewable by everyone"
        ON businesses FOR SELECT
        USING (true);
      
      -- Policy for business owners to update their business
      CREATE POLICY "Business owners can update their own business"
        ON businesses FOR UPDATE
        USING (auth.uid() = owner_id);
        
      -- Policy for business owners to delete their business
      CREATE POLICY "Business owners can delete their own business"
        ON businesses FOR DELETE
        USING (auth.uid() = owner_id);
    `);

    // Create loyalty_points table
    await setupTable('loyalty_points', `
      CREATE TABLE loyalty_points (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
        points INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(customer_id, business_id)
      );

      -- Setup RLS policies
      ALTER TABLE loyalty_points ENABLE ROW LEVEL SECURITY;
      
      -- Policy for customers to view their own points
      CREATE POLICY "Customers can view their own points"
        ON loyalty_points FOR SELECT
        USING (auth.uid() = customer_id);
      
      -- Policy for businesses to view points related to them
      CREATE POLICY "Businesses can view points related to their business"
        ON loyalty_points FOR SELECT
        USING (auth.uid() IN (
          SELECT owner_id FROM businesses WHERE id = loyalty_points.business_id
        ));
    `);

    // Create transactions table
    await setupTable('transactions', `
      CREATE TABLE transactions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        customer_id UUID NOT NULL REFERENCES auth.users(id),
        business_id UUID NOT NULL REFERENCES businesses(id),
        points_earned INTEGER NOT NULL DEFAULT 0,
        points_redeemed INTEGER NOT NULL DEFAULT 0,
        amount DECIMAL(10,2),
        description VARCHAR,
        transaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Setup RLS policies
      ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
      
      -- Policy for customers to view their own transactions
      CREATE POLICY "Customers can view their own transactions"
        ON transactions FOR SELECT
        USING (auth.uid() = customer_id);
      
      -- Policy for businesses to view transactions related to them
      CREATE POLICY "Businesses can view transactions related to their business"
        ON transactions FOR SELECT
        USING (auth.uid() IN (
          SELECT owner_id FROM businesses WHERE id = transactions.business_id
        ));
    `);

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
