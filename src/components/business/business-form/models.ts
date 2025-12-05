
import * as z from "zod";

// Form validation schema
export const businessFormSchema = z.object({
  businessName: z.string().min(2, {
    message: "Business name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  category: z.string().min(2, {
    message: "Category must be at least 2 characters.",
  }),
  address: z.string().min(5, {
    message: "Address is required and must be at least 5 characters.",
  }),
  city: z.string().min(2, {
    message: "City must be at least 2 characters.",
  }),
  state: z.string().min(2, {
    message: "State must be at least 2 characters.",
  }),
  zipCode: z.string().min(5, {
    message: "Zip code must be at least 5 characters.",
  }),
  phone: z.string()
    .min(10, { message: "Phone number must be at least 10 digits." })
    .regex(/^[\d\s\-\(\)\+]+$/, { message: "Please enter a valid phone number (digits, spaces, dashes, parentheses allowed)." })
    .refine((val) => val.replace(/\D/g, '').length >= 10, {
      message: "Phone number must contain at least 10 digits.",
    }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  website: z.string().url({
    message: "Please enter a valid URL.",
  }).optional().or(z.literal('')),
});

export type BusinessFormValues = z.infer<typeof businessFormSchema>;

// Default form values
export const defaultFormValues: BusinessFormValues = {
  businessName: "",
  description: "",
  category: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  phone: "",
  email: "",
  website: "",
};

// Product image form schema
export const productImageSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.string().optional(),
  isActive: z.boolean().default(true),
  altText: z.string().optional(),
  metaDescription: z.string().optional(),
  category: z.string().optional(),
  tags: z.string().optional(),
});

export type ProductImageFormValues = z.infer<typeof productImageSchema>;

export const defaultProductImageValues: ProductImageFormValues = {
  title: "",
  description: "",
  price: "",
  isActive: true,
  altText: "",
  metaDescription: "",
  category: "",
  tags: "",
};
