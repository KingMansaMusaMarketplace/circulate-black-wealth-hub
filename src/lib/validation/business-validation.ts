/**
 * Business Data Validation
 * 
 * SECURITY: Validates all business-related inputs to prevent:
 * - SQL injection
 * - XSS attacks
 * - Data corruption
 * - Malicious content
 */

import { z } from 'zod';

// Email validation regex (RFC 5322 compliant)
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

// Phone validation (US format, can be extended)
const PHONE_REGEX = /^[\d\s\-\(\)\+\.]{10,20}$/;

// URL validation
const URL_REGEX = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

// Business creation schema
export const businessCreationSchema = z.object({
  business_name: z
    .string()
    .trim()
    .min(2, 'Business name must be at least 2 characters')
    .max(100, 'Business name must be less than 100 characters')
    .regex(/^[a-zA-Z0-9\s\-'&,.]+$/, 'Business name contains invalid characters'),
  
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  
  description: z
    .string()
    .trim()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
  
  category: z
    .string()
    .trim()
    .max(50, 'Category must be less than 50 characters')
    .optional(),
  
  address: z
    .string()
    .trim()
    .max(200, 'Address must be less than 200 characters')
    .optional(),
  
  city: z
    .string()
    .trim()
    .max(100, 'City must be less than 100 characters')
    .optional(),
  
  state: z
    .string()
    .trim()
    .max(50, 'State must be less than 50 characters')
    .optional(),
  
  zip_code: z
    .string()
    .trim()
    .max(20, 'ZIP code must be less than 20 characters')
    .optional(),
  
  phone: z
    .string()
    .trim()
    .regex(PHONE_REGEX, 'Invalid phone number format')
    .optional()
    .or(z.literal('')),
  
  email: z
    .string()
    .trim()
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters')
    .optional()
    .or(z.literal('')),
  
  website: z
    .string()
    .trim()
    .regex(URL_REGEX, 'Invalid website URL')
    .max(500, 'Website URL must be less than 500 characters')
    .optional()
    .or(z.literal('')),
});

// Business update schema (allows partial updates)
export const businessUpdateSchema = businessCreationSchema.partial();

// Business search schema
export const businessSearchSchema = z.object({
  searchTerm: z
    .string()
    .trim()
    .max(200, 'Search term must be less than 200 characters')
    .optional(),
  
  category: z
    .string()
    .trim()
    .max(50, 'Category must be less than 50 characters')
    .optional(),
  
  city: z
    .string()
    .trim()
    .max(100, 'City must be less than 100 characters')
    .optional(),
  
  state: z
    .string()
    .trim()
    .max(50, 'State must be less than 50 characters')
    .optional(),
  
  minRating: z
    .number()
    .min(0, 'Rating must be at least 0')
    .max(5, 'Rating must be at most 5')
    .optional(),
  
  limit: z
    .number()
    .int()
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit must be at most 100')
    .default(20),
  
  offset: z
    .number()
    .int()
    .min(0, 'Offset must be at least 0')
    .default(0),
});

// Invoice validation
export const invoiceSchema = z.object({
  customer_name: z
    .string()
    .trim()
    .min(2, 'Customer name must be at least 2 characters')
    .max(100, 'Customer name must be less than 100 characters'),
  
  customer_email: z
    .string()
    .trim()
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters'),
  
  amount: z
    .number()
    .positive('Amount must be positive')
    .max(1000000, 'Amount must be less than 1,000,000'),
  
  tax_amount: z
    .number()
    .min(0, 'Tax amount must be non-negative')
    .max(100000, 'Tax amount must be less than 100,000')
    .optional(),
  
  notes: z
    .string()
    .trim()
    .max(1000, 'Notes must be less than 1000 characters')
    .optional(),
});

// Expense validation
export const expenseSchema = z.object({
  category: z
    .string()
    .trim()
    .min(2, 'Category must be at least 2 characters')
    .max(50, 'Category must be less than 50 characters'),
  
  description: z
    .string()
    .trim()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  
  amount: z
    .number()
    .positive('Amount must be positive')
    .max(1000000, 'Amount must be less than 1,000,000'),
  
  expense_date: z
    .date()
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')),
});

/**
 * Validate business data before submission
 * Throws ZodError if validation fails
 */
export function validateBusinessData(data: unknown, isUpdate: boolean = false) {
  const schema = isUpdate ? businessUpdateSchema : businessCreationSchema;
  return schema.parse(data);
}

/**
 * Validate business search parameters
 */
export function validateBusinessSearch(params: unknown) {
  return businessSearchSchema.parse(params);
}

/**
 * Validate invoice data
 */
export function validateInvoice(data: unknown) {
  return invoiceSchema.parse(data);
}

/**
 * Validate expense data
 */
export function validateExpense(data: unknown) {
  return expenseSchema.parse(data);
}

/**
 * Sanitize text input by removing potentially dangerous characters
 * Use this before storing or displaying user-generated content
 * This provides defense-in-depth alongside parameterized queries
 */
export function sanitizeTextInput(text: string): string {
  if (!text || typeof text !== 'string') return '';
  
  return text
    .trim()
    .replace(/[<>]/g, '') // Remove HTML brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/data:/gi, '') // Remove data: protocol
    .replace(/vbscript:/gi, '') // Remove vbscript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .replace(/<!--[\s\S]*?-->/g, '') // Remove HTML comments
    .substring(0, 10000); // Enforce maximum length to prevent DoS
}

/**
 * Validate and sanitize search term
 */
export function sanitizeSearchTerm(term: string): string {
  if (!term || typeof term !== 'string') return '';
  
  return term
    .trim()
    .substring(0, 200) // Limit length
    .replace(/[<>'"]/g, '') // Remove potentially dangerous characters
    .replace(/\s+/g, ' '); // Normalize whitespace
}

/**
 * Validate UUID format
 * Use this to validate IDs before database queries
 */
export function isValidUUID(uuid: string): boolean {
  if (!uuid || typeof uuid !== 'string') return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Sanitize and validate an array of text inputs
 */
export function sanitizeTextArray(texts: string[]): string[] {
  if (!Array.isArray(texts)) return [];
  return texts
    .filter(t => typeof t === 'string')
    .map(t => sanitizeTextInput(t))
    .filter(t => t.length > 0);
}

/**
 * Sanitize numeric input - ensures a valid number within bounds
 */
export function sanitizeNumericInput(value: unknown, min = 0, max = Number.MAX_SAFE_INTEGER): number {
  const num = Number(value);
  if (isNaN(num)) return min;
  return Math.max(min, Math.min(max, num));
}
