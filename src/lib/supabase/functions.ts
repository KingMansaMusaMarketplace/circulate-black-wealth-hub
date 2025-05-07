
import { supabase } from '../supabase';

// Create functions for QR code generation and scanning
export const createDatabaseFunctions = async () => {
  return setupTableFunctions('qr_code_functions', `
    -- Function to create a new QR code for a business
    CREATE OR REPLACE FUNCTION create_business_qr_code(
      p_business_id UUID, 
      p_code_type VARCHAR, 
      p_discount_percentage INTEGER DEFAULT NULL,
      p_points_value INTEGER DEFAULT NULL
    )
    RETURNS UUID
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    DECLARE
      v_qr_id UUID;
    BEGIN
      INSERT INTO qr_codes (
        business_id, 
        code_type, 
        discount_percentage, 
        points_value
      ) VALUES (
        p_business_id, 
        p_code_type, 
        p_discount_percentage, 
        p_points_value
      )
      RETURNING id INTO v_qr_id;
      
      -- Update business with reference to this QR code
      UPDATE businesses
      SET qr_code_id = v_qr_id
      WHERE id = p_business_id;
      
      RETURN v_qr_id;
    END;
    $$;

    -- Function to process a QR code scan
    CREATE OR REPLACE FUNCTION process_qr_scan(
      p_qr_code_id UUID,
      p_customer_id UUID,
      p_lat DECIMAL(10,8) DEFAULT NULL,
      p_lng DECIMAL(11,8) DEFAULT NULL
    )
    RETURNS JSONB
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    DECLARE
      v_qr_code qr_codes%ROWTYPE;
      v_business_id UUID;
      v_points_awarded INTEGER;
      v_discount_applied INTEGER;
      v_scan_id UUID;
      v_result JSONB;
    BEGIN
      -- Get QR code info
      SELECT * INTO v_qr_code
      FROM qr_codes
      WHERE id = p_qr_code_id AND is_active = TRUE;
      
      IF NOT FOUND THEN
        RETURN jsonb_build_object('success', FALSE, 'message', 'QR code not found or inactive');
      END IF;
      
      -- Check if scan limit is reached
      IF v_qr_code.scan_limit IS NOT NULL AND v_qr_code.current_scans >= v_qr_code.scan_limit THEN
        RETURN jsonb_build_object('success', FALSE, 'message', 'QR code scan limit reached');
      END IF;
      
      -- Check if QR code is expired
      IF v_qr_code.expiration_date IS NOT NULL AND v_qr_code.expiration_date < NOW() THEN
        RETURN jsonb_build_object('success', FALSE, 'message', 'QR code has expired');
      END IF;
      
      -- Get business ID
      v_business_id := v_qr_code.business_id;
      
      -- Set points and discount based on QR code type
      v_points_awarded := COALESCE(v_qr_code.points_value, 10); -- Default 10 points if not specified
      v_discount_applied := v_qr_code.discount_percentage;
      
      -- Record the scan
      INSERT INTO qr_scans (
        qr_code_id,
        customer_id,
        business_id,
        points_awarded,
        discount_applied,
        location_lat,
        location_lng
      ) VALUES (
        p_qr_code_id,
        p_customer_id,
        v_business_id,
        v_points_awarded,
        v_discount_applied,
        p_lat,
        p_lng
      ) RETURNING id INTO v_scan_id;
      
      -- Update QR code scan count
      UPDATE qr_codes 
      SET current_scans = current_scans + 1
      WHERE id = p_qr_code_id;
      
      -- Add loyalty points
      INSERT INTO loyalty_points (customer_id, business_id, points) 
      VALUES (p_customer_id, v_business_id, v_points_awarded)
      ON CONFLICT (customer_id, business_id) 
      DO UPDATE SET points = loyalty_points.points + v_points_awarded,
                    updated_at = NOW();
      
      -- Create transaction record
      INSERT INTO transactions (
        customer_id,
        business_id,
        points_earned,
        discount_percentage,
        description,
        transaction_type,
        qr_scan_id
      ) VALUES (
        p_customer_id,
        v_business_id,
        v_points_awarded,
        v_discount_applied,
        'QR code scan',
        'scan',
        v_scan_id
      );
      
      -- Build result
      v_result := jsonb_build_object(
        'success', TRUE,
        'scan_id', v_scan_id,
        'business_id', v_business_id,
        'points_awarded', v_points_awarded,
        'discount_applied', v_discount_applied
      );
      
      RETURN v_result;
    END;
    $$;
  `);
};

// Helper function for setting up database functions
export const setupTableFunctions = async (tableName: string, createQuery: string) => {
  try {
    console.log(`Creating ${tableName}...`);
    const { error: createError } = await supabase.rpc('exec_sql', { query: createQuery });
    
    if (createError) {
      console.error(`Error creating ${tableName}:`, createError);
      throw createError;
    }
    
    console.log(`${tableName} created successfully`);
    return true;
  } catch (error) {
    console.error(`Error setting up ${tableName}:`, error);
    throw error;
  }
};
