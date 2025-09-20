
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Type for validation errors
export interface ValidationError {
  field: string;
  message: string;
}

// Type for validation result
export interface ValidationResult {
  isValid: boolean;
  errors?: ValidationError[];
}

// Validate data against a schema stored in the database
export const validateData = async (
  data: Record<string, any>,
  schemaName: string
): Promise<ValidationResult> => {
  try {
    // Use secure validate_input function
    const { data: result, error } = await supabase.rpc('validate_input', {
      input_data: data,
      schema_name: schemaName
    });
    
    if (error) throw error;
    
    // The result is already a structured JSONB object
    if (result) {
      return {
        isValid: result.valid === true,
        errors: result.errors && Array.isArray(result.errors) ? result.errors : undefined
      };
    }
    
    return { isValid: false };
  } catch (error) {
    console.error('Validation error:', error);
    return {
      isValid: false,
      errors: [{ field: 'general', message: 'Validation failed' }]
    };
  }
};

// Helper function for required fields
export const validateRequiredFields = (
  data: Record<string, any>, 
  requiredFields: string[]
): ValidationResult => {
  const errors: ValidationError[] = [];
  
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      errors.push({
        field,
        message: `${field} is required`
      });
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  };
};

// Display validation errors in the UI
export const showValidationErrors = (result: ValidationResult): void => {
  if (!result.isValid && result.errors) {
    result.errors.forEach(error => {
      toast.error(`${error.field}: ${error.message}`);
    });
  }
};
