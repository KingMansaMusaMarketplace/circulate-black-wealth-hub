import { z } from 'zod';

/**
 * Financial Validation Schemas
 * 
 * SECURITY: These schemas validate all financial data before database operations
 * to prevent SQL injection, data corruption, and invalid financial records.
 */

// Expense validation schema
export const expenseSchema = z.object({
  amount: z.coerce
    .number()
    .positive('Amount must be positive')
    .max(1000000, 'Amount cannot exceed $1,000,000')
    .finite('Amount must be a valid number'),
  category: z.enum([
    'Rent',
    'Utilities',
    'Supplies',
    'Marketing',
    'Salaries',
    'Insurance',
    'Equipment',
    'Software',
    'Professional Services',
    'Other'
  ], { errorMap: () => ({ message: 'Please select a valid category' }) }),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional()
    .transform(val => val?.trim()),
  expense_date: z.coerce.date({
    errorMap: () => ({ message: 'Please provide a valid date' })
  }),
  business_id: z.string().uuid('Invalid business ID'),
});

export type ExpenseInput = z.infer<typeof expenseSchema>;

// Invoice line item schema
const invoiceLineItemSchema = z.object({
  description: z
    .string()
    .min(1, 'Description is required')
    .max(200, 'Description must be less than 200 characters')
    .trim(),
  quantity: z.coerce
    .number()
    .int('Quantity must be a whole number')
    .positive('Quantity must be positive')
    .max(10000, 'Quantity cannot exceed 10,000'),
  unit_price: z.coerce
    .number()
    .nonnegative('Unit price cannot be negative')
    .max(1000000, 'Unit price cannot exceed $1,000,000')
    .finite('Unit price must be a valid number'),
  total: z.coerce
    .number()
    .nonnegative('Total cannot be negative')
    .max(10000000, 'Total cannot exceed $10,000,000')
    .finite('Total must be a valid number'),
});

// Invoice validation schema
export const invoiceSchema = z.object({
  business_id: z.string().uuid('Invalid business ID'),
  booking_id: z.string().uuid('Invalid booking ID').optional().nullable(),
  invoice_number: z
    .string()
    .min(1, 'Invoice number is required')
    .max(50, 'Invoice number must be less than 50 characters')
    .regex(/^[A-Z0-9-]+$/, 'Invoice number must contain only uppercase letters, numbers, and hyphens')
    .trim(),
  customer_name: z
    .string()
    .min(1, 'Customer name is required')
    .max(100, 'Customer name must be less than 100 characters')
    .trim(),
  customer_email: z
    .string()
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters')
    .toLowerCase()
    .trim(),
  amount: z.coerce
    .number()
    .nonnegative('Amount cannot be negative')
    .max(10000000, 'Amount cannot exceed $10,000,000')
    .finite('Amount must be a valid number'),
  tax_amount: z.coerce
    .number()
    .nonnegative('Tax amount cannot be negative')
    .max(1000000, 'Tax amount cannot exceed $1,000,000')
    .finite('Tax amount must be a valid number')
    .default(0),
  total_amount: z.coerce
    .number()
    .positive('Total amount must be positive')
    .max(10000000, 'Total amount cannot exceed $10,000,000')
    .finite('Total amount must be a valid number'),
  status: z.enum(['pending', 'paid', 'overdue', 'cancelled'], {
    errorMap: () => ({ message: 'Invalid invoice status' })
  }),
  due_date: z.coerce.date({
    errorMap: () => ({ message: 'Please provide a valid due date' })
  }),
  line_items: z
    .array(invoiceLineItemSchema)
    .min(1, 'At least one line item is required')
    .max(50, 'Cannot have more than 50 line items'),
  notes: z
    .string()
    .max(1000, 'Notes must be less than 1000 characters')
    .optional()
    .transform(val => val?.trim()),
}).refine(
  (data) => {
    // Verify total_amount matches amount + tax_amount
    const calculatedTotal = data.amount + data.tax_amount;
    return Math.abs(calculatedTotal - data.total_amount) < 0.01; // Allow 1 cent rounding difference
  },
  {
    message: 'Total amount must equal amount plus tax amount',
    path: ['total_amount'],
  }
).refine(
  (data) => {
    // Verify line items total matches amount
    const lineItemsTotal = data.line_items.reduce((sum, item) => sum + item.total, 0);
    return Math.abs(lineItemsTotal - data.amount) < 0.01; // Allow 1 cent rounding difference
  },
  {
    message: 'Line items total must match invoice amount',
    path: ['line_items'],
  }
);

export type InvoiceInput = z.infer<typeof invoiceSchema>;

/**
 * Validate expense data
 * @throws ZodError if validation fails
 */
export function validateExpense(data: unknown): ExpenseInput {
  return expenseSchema.parse(data);
}

/**
 * Validate invoice data
 * @throws ZodError if validation fails
 */
export function validateInvoice(data: unknown): InvoiceInput {
  return invoiceSchema.parse(data);
}

/**
 * Safe validate expense data (returns validation result instead of throwing)
 */
export function safeValidateExpense(data: unknown) {
  return expenseSchema.safeParse(data);
}

/**
 * Safe validate invoice data (returns validation result instead of throwing)
 */
export function safeValidateInvoice(data: unknown) {
  return invoiceSchema.safeParse(data);
}
