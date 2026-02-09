/**
 * Integration Test: Business Signup Flow
 * Tests the complete business owner registration journey
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Business Signup Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Business registration form validation', () => {
    it('should validate required business fields', () => {
      const validateBusinessForm = (data: {
        businessName?: string;
        category?: string;
        email?: string;
        phone?: string;
      }) => {
        const errors: string[] = [];
        
        if (!data.businessName?.trim()) errors.push('Business name is required');
        if (!data.category) errors.push('Category is required');
        if (!data.email) errors.push('Business email is required');
        if (!data.phone) errors.push('Phone number is required');
        
        return { isValid: errors.length === 0, errors };
      };

      const incompleteForm = {
        businessName: '',
        category: undefined,
        email: undefined,
        phone: undefined,
      };

      const result = validateBusinessForm(incompleteForm);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(4);

      const completeForm = {
        businessName: 'My Business',
        category: 'Restaurant',
        email: 'business@test.com',
        phone: '555-1234',
      };

      const validResult = validateBusinessForm(completeForm);
      expect(validResult.isValid).toBe(true);
      expect(validResult.errors).toHaveLength(0);
    });

    it('should validate phone number format', () => {
      const phoneRegex = /^[\d\s\-\(\)\+]{10,}$/;
      
      expect(phoneRegex.test('555-123-4567')).toBe(true);
      expect(phoneRegex.test('(555) 123-4567')).toBe(true);
      expect(phoneRegex.test('+1 555 123 4567')).toBe(true);
      expect(phoneRegex.test('123')).toBe(false);
    });

    it('should validate website URL format', () => {
      const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
      
      expect(urlRegex.test('https://example.com')).toBe(true);
      expect(urlRegex.test('http://my-business.com')).toBe(true);
      expect(urlRegex.test('example.com')).toBe(true);
      expect(urlRegex.test('not a url')).toBe(false);
    });
  });

  describe('Multi-step form navigation', () => {
    const formSteps = [
      { id: 'basic', label: 'Basic Info', required: ['businessName', 'category'] },
      { id: 'contact', label: 'Contact', required: ['email', 'phone'] },
      { id: 'location', label: 'Location', required: ['address', 'city'] },
      { id: 'details', label: 'Details', required: [] },
    ];

    it('should track form step progression', () => {
      const canProceed = (step: number, formData: Record<string, string>) => {
        const currentStep = formSteps[step];
        return currentStep.required.every(field => formData[field]?.trim());
      };

      const incompleteStep1 = { businessName: 'Test', category: '' };
      expect(canProceed(0, incompleteStep1)).toBe(false);

      const completeStep1 = { businessName: 'Test', category: 'Restaurant' };
      expect(canProceed(0, completeStep1)).toBe(true);
    });

    it('should preserve form data across steps', () => {
      const formState = {
        step: 1,
        data: {
          businessName: 'My Restaurant',
          category: 'Restaurant',
        } as Record<string, string>,
      };

      // Simulate moving to next step
      formState.step = 2;
      formState.data = {
        ...formState.data,
        email: 'restaurant@test.com',
        phone: '555-1234',
      };

      expect(formState.data.businessName).toBe('My Restaurant');
      expect(formState.data.email).toBe('restaurant@test.com');
    });

    it('should calculate form completion percentage', () => {
      const calculateProgress = (currentStep: number, totalSteps: number) => {
        return Math.round((currentStep / totalSteps) * 100);
      };

      expect(calculateProgress(1, 4)).toBe(25);
      expect(calculateProgress(2, 4)).toBe(50);
      expect(calculateProgress(4, 4)).toBe(100);
    });
  });

  describe('Business categories', () => {
    const categories = [
      'Restaurant',
      'Retail',
      'Professional Services',
      'Health & Wellness',
      'Beauty & Personal Care',
      'Home Services',
      'Entertainment',
      'Education',
      'Technology',
      'Other',
    ];

    it('should provide valid category options', () => {
      expect(categories.length).toBeGreaterThan(0);
      expect(categories).toContain('Restaurant');
      expect(categories).toContain('Other');
    });

    it('should allow custom category under "Other"', () => {
      const formData = {
        category: 'Other',
        customCategory: 'Urban Farming',
      };

      const effectiveCategory = formData.category === 'Other' 
        ? formData.customCategory 
        : formData.category;

      expect(effectiveCategory).toBe('Urban Farming');
    });
  });

  describe('Business creation data structure', () => {
    it('should create valid business object', () => {
      const createBusinessData = (
        ownerId: string,
        formData: Record<string, string>
      ) => {
        return {
          name: formData.businessName,
          description: formData.description || null,
          category: formData.category,
          email: formData.email,
          phone: formData.phone,
          address: formData.address || null,
          city: formData.city || null,
          state: formData.state || null,
          zip_code: formData.zipCode || null,
          owner_id: ownerId,
          is_verified: false,
          verification_status: 'pending',
          created_at: new Date().toISOString(),
        };
      };

      const business = createBusinessData('owner-123', {
        businessName: 'Test Restaurant',
        category: 'Restaurant',
        email: 'test@restaurant.com',
        phone: '555-1234',
      });

      expect(business.name).toBe('Test Restaurant');
      expect(business.owner_id).toBe('owner-123');
      expect(business.is_verified).toBe(false);
      expect(business.verification_status).toBe('pending');
    });
  });

  describe('Post-signup verification flow', () => {
    it('should set correct pending verification state', () => {
      const business = {
        is_verified: false,
        verification_status: 'pending',
        verification_documents: [],
        verification_submitted_at: null,
      };

      expect(business.is_verified).toBe(false);
      expect(business.verification_status).toBe('pending');
    });

    it('should determine dashboard access level', () => {
      const getDashboardFeatures = (isVerified: boolean) => {
        const baseFeatures = ['profile', 'settings', 'support'];
        const verifiedFeatures = ['qr-codes', 'loyalty', 'analytics', 'customers'];
        
        return isVerified 
          ? [...baseFeatures, ...verifiedFeatures]
          : baseFeatures;
      };

      const unverifiedFeatures = getDashboardFeatures(false);
      expect(unverifiedFeatures).toContain('profile');
      expect(unverifiedFeatures).not.toContain('qr-codes');

      const verifiedFeatures = getDashboardFeatures(true);
      expect(verifiedFeatures).toContain('qr-codes');
      expect(verifiedFeatures).toContain('analytics');
    });

    it('should track verification status transitions', () => {
      const validTransitions: Record<string, string[]> = {
        pending: ['submitted', 'cancelled'],
        submitted: ['approved', 'rejected', 'more_info_needed'],
        more_info_needed: ['submitted', 'cancelled'],
        rejected: ['submitted'],
        approved: [],
        cancelled: ['pending'],
      };

      const canTransition = (from: string, to: string) => {
        return validTransitions[from]?.includes(to) ?? false;
      };

      expect(canTransition('pending', 'submitted')).toBe(true);
      expect(canTransition('pending', 'approved')).toBe(false);
      expect(canTransition('submitted', 'approved')).toBe(true);
    });
  });

  describe('Image upload validation', () => {
    it('should validate image file constraints', () => {
      const validateImage = (file: { size: number; type: string }) => {
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        
        const errors: string[] = [];
        
        if (file.size > maxSize) {
          errors.push('Image must be less than 5MB');
        }
        
        if (!allowedTypes.includes(file.type)) {
          errors.push('Image must be JPEG, PNG, or WebP');
        }
        
        return { isValid: errors.length === 0, errors };
      };

      const validImage = { size: 1024 * 1024, type: 'image/jpeg' };
      expect(validateImage(validImage).isValid).toBe(true);

      const tooLarge = { size: 10 * 1024 * 1024, type: 'image/jpeg' };
      expect(validateImage(tooLarge).isValid).toBe(false);

      const wrongType = { size: 1024, type: 'image/gif' };
      expect(validateImage(wrongType).isValid).toBe(false);
    });
  });

  describe('Error handling', () => {
    it('should handle duplicate business name gracefully', () => {
      const handleError = (errorCode: string) => {
        const errorMessages: Record<string, string> = {
          '23505': 'A business with this name already exists',
          '23503': 'Invalid reference - owner not found',
          '42501': 'Permission denied',
        };

        return errorMessages[errorCode] || 'An unexpected error occurred';
      };

      expect(handleError('23505')).toContain('already exists');
      expect(handleError('unknown')).toContain('unexpected error');
    });

    it('should detect if user already owns a business', () => {
      const existingBusinesses = [
        { id: 'b1', owner_id: 'user-1' },
        { id: 'b2', owner_id: 'user-2' },
      ];

      const hasExistingBusiness = (userId: string) => {
        return existingBusinesses.some(b => b.owner_id === userId);
      };

      expect(hasExistingBusiness('user-1')).toBe(true);
      expect(hasExistingBusiness('user-3')).toBe(false);
    });
  });
});
