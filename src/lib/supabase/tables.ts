
import { supabase } from '../supabase';

// This function checks if a table exists, and if not, creates it
export const setupTable = async (tableName: string, createQuery: string) => {
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
export const createProfilesTable = async () => {
  return setupTable('profiles', `
    CREATE TABLE profiles (
      id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      user_type VARCHAR NOT NULL CHECK (user_type IN ('customer', 'business')),
      full_name VARCHAR,
      avatar_url VARCHAR,
      phone VARCHAR,
      email VARCHAR,
      address VARCHAR,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      subscription_status VARCHAR DEFAULT 'active',
      subscription_start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      subscription_end_date TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '1 month'
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
};

// Create businesses table
export const createBusinessesTable = async () => {
  return setupTable('businesses', `
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
      qr_code_id VARCHAR,
      qr_code_url VARCHAR,
      average_rating DECIMAL(3,2) DEFAULT 0,
      review_count INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      subscription_status VARCHAR DEFAULT 'trial',
      subscription_start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      subscription_end_date TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '30 days'
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
};

// Create product_images table
export const createProductImagesTable = async () => {
  return setupTable('product_images', `
    CREATE TABLE product_images (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
      title VARCHAR NOT NULL,
      description TEXT,
      price VARCHAR,
      image_url VARCHAR NOT NULL,
      is_active BOOLEAN DEFAULT TRUE,
      alt_text VARCHAR,
      meta_description TEXT,
      category VARCHAR,
      tags VARCHAR,
      original_size INTEGER,
      compressed_size INTEGER,
      compression_savings DECIMAL(5,2),
      view_count INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Setup RLS policies
    ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
    
    -- Policy for public to view product images
    CREATE POLICY "Product images are viewable by everyone"
      ON product_images FOR SELECT
      USING (true);
    
    -- Policy for business owners to manage their product images
    CREATE POLICY "Business owners can manage their product images"
      ON product_images FOR ALL
      USING (auth.uid() IN (
        SELECT owner_id FROM businesses WHERE id = product_images.business_id
      ));
  `);
};

// Create loyalty_points table
export const createLoyaltyPointsTable = async () => {
  return setupTable('loyalty_points', `
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
};

// Create transactions table
export const createTransactionsTable = async () => {
  return setupTable('transactions', `
    CREATE TABLE transactions (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      customer_id UUID NOT NULL REFERENCES auth.users(id),
      business_id UUID NOT NULL REFERENCES businesses(id),
      points_earned INTEGER NOT NULL DEFAULT 0,
      points_redeemed INTEGER NOT NULL DEFAULT 0,
      amount DECIMAL(10,2),
      discount_applied DECIMAL(10,2) DEFAULT 0,
      discount_percentage INTEGER DEFAULT 0,
      description VARCHAR,
      transaction_type VARCHAR NOT NULL CHECK (transaction_type IN ('purchase', 'scan', 'review', 'referral', 'redemption')),
      qr_scan_id UUID,
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
};

// Create reviews table
export const createReviewsTable = async () => {
  return setupTable('reviews', `
    CREATE TABLE reviews (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
      customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
      review_text TEXT,
      is_verified BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(business_id, customer_id)
    );

    -- Setup RLS policies
    ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
    
    -- Policy for public to view reviews
    CREATE POLICY "Reviews are viewable by everyone"
      ON reviews FOR SELECT
      USING (true);
    
    -- Policy for customers to create/update their own reviews
    CREATE POLICY "Customers can manage their own reviews"
      ON reviews FOR ALL
      USING (auth.uid() = customer_id);
  `);
};

// Create QR codes table
export const createQrCodesTable = async () => {
  return setupTable('qr_codes', `
    CREATE TABLE qr_codes (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
      code_type VARCHAR NOT NULL CHECK (code_type IN ('discount', 'loyalty', 'info')),
      discount_percentage INTEGER,
      points_value INTEGER,
      is_active BOOLEAN DEFAULT TRUE,
      expiration_date TIMESTAMP WITH TIME ZONE,
      scan_limit INTEGER,
      current_scans INTEGER DEFAULT 0,
      qr_image_url VARCHAR,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Setup RLS policies
    ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;
    
    -- Policy for public to view active QR codes
    CREATE POLICY "Active QR codes are viewable by everyone"
      ON qr_codes FOR SELECT
      USING (is_active = TRUE);
    
    -- Policy for business owners to manage their QR codes
    CREATE POLICY "Business owners can manage their QR codes"
      ON qr_codes FOR ALL
      USING (auth.uid() IN (
        SELECT owner_id FROM businesses WHERE id = qr_codes.business_id
      ));
  `);
};

// Create QR scans table
export const createQrScansTable = async () => {
  return setupTable('qr_scans', `
    CREATE TABLE qr_scans (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      qr_code_id UUID NOT NULL REFERENCES qr_codes(id) ON DELETE CASCADE,
      customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
      points_awarded INTEGER DEFAULT 0,
      discount_applied INTEGER DEFAULT 0,
      scan_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      location_lat DECIMAL(10,8),
      location_lng DECIMAL(11,8),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Setup RLS policies
    ALTER TABLE qr_scans ENABLE ROW LEVEL SECURITY;
    
    -- Policy for customers to view their own scans
    CREATE POLICY "Customers can view their own QR scans"
      ON qr_scans FOR SELECT
      USING (auth.uid() = customer_id);
    
    -- Policy for businesses to view scans related to them
    CREATE POLICY "Businesses can view QR scans related to their business"
      ON qr_scans FOR SELECT
      USING (auth.uid() IN (
        SELECT owner_id FROM businesses WHERE id = qr_scans.business_id
      ));
  `);
};

// Create rewards table
export const createRewardsTable = async () => {
  return setupTable('rewards', `
    CREATE TABLE rewards (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      title VARCHAR NOT NULL,
      description TEXT,
      points_cost INTEGER NOT NULL,
      image_url VARCHAR,
      is_global BOOLEAN DEFAULT FALSE,
      business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Setup RLS policies
    ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
    
    -- Policy for public to view rewards
    CREATE POLICY "Active rewards are viewable by everyone"
      ON rewards FOR SELECT
      USING (is_active = TRUE);
    
    -- Policy for business owners to manage their rewards
    CREATE POLICY "Business owners can manage their rewards"
      ON rewards FOR ALL
      USING (auth.uid() IN (
        SELECT owner_id FROM businesses WHERE id = rewards.business_id
      ));
  `);
};

// Create redeemed_rewards table
export const createRedeemedRewardsTable = async () => {
  return setupTable('redeemed_rewards', `
    CREATE TABLE redeemed_rewards (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      reward_id UUID NOT NULL REFERENCES rewards(id) ON DELETE CASCADE,
      customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
      points_used INTEGER NOT NULL,
      redemption_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      expiration_date TIMESTAMP WITH TIME ZONE,
      is_used BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Setup RLS policies
    ALTER TABLE redeemed_rewards ENABLE ROW LEVEL SECURITY;
    
    -- Policy for customers to view their own redeemed rewards
    CREATE POLICY "Customers can view their own redeemed rewards"
      ON redeemed_rewards FOR SELECT
      USING (auth.uid() = customer_id);
    
    -- Policy for businesses to view redemptions related to them
    CREATE POLICY "Businesses can view redemptions related to their business"
      ON redeemed_rewards FOR SELECT
      USING (auth.uid() IN (
        SELECT owner_id FROM businesses WHERE id = redeemed_rewards.business_id
      ));
  `);
};
