
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
    // Use exec_sql instead of direct RPC call
    const { data: result, error } = await supabase.rpc('exec_sql', {
      query: `
        SELECT * FROM validate_input(
          '${JSON.stringify(data).replace(/'/g, "''")}', 
          '${schemaName}'
        )
      `
    });
    
    if (error) throw error;
    
    // Parse the result
    let validationResult: ValidationResult = { isValid: false };
    
    try {
      if (typeof result === 'string') {
        const parsedResult = JSON.parse(result);
        validationResult = {
          isValid: parsedResult.valid === true,
          errors: parsedResult.errors
        };
      }
    } catch (parseError) {
      console.error('Error parsing validation result:', parseError);
      throw parseError;
    }
    
    return validationResult;
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
