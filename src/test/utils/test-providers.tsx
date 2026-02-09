/**
 * Test Providers Wrapper
 * Provides all necessary context providers for integration testing
 */

import React, { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';

// Create a fresh query client for each test
export const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0,
      staleTime: 0,
    },
    mutations: {
      retry: false,
    },
  },
});

// Mock user types for testing
export interface MockUser {
  id: string;
  email: string;
  role?: 'user' | 'business_owner' | 'admin' | 'sales_agent';
  user_metadata?: Record<string, unknown>;
}

export const mockUsers = {
  customer: {
    id: 'test-user-123',
    email: 'customer@test.com',
    role: 'user' as const,
    user_metadata: { full_name: 'Test Customer' },
  },
  businessOwner: {
    id: 'test-business-owner-456',
    email: 'business@test.com',
    role: 'business_owner' as const,
    user_metadata: { full_name: 'Business Owner' },
  },
  admin: {
    id: 'test-admin-789',
    email: 'admin@test.com',
    role: 'admin' as const,
    user_metadata: { full_name: 'Admin User' },
  },
  salesAgent: {
    id: 'test-agent-101',
    email: 'agent@test.com',
    role: 'sales_agent' as const,
    user_metadata: { full_name: 'Sales Agent' },
  },
};

// Mock Auth Context
export interface MockAuthContextValue {
  user: MockUser | null;
  loading: boolean;
  signIn: ReturnType<typeof vi.fn>;
  signUp: ReturnType<typeof vi.fn>;
  signOut: ReturnType<typeof vi.fn>;
  isAuthenticated: boolean;
}

export const createMockAuthContext = (user: MockUser | null = null): MockAuthContextValue => ({
  user,
  loading: false,
  signIn: vi.fn().mockResolvedValue({ user, error: null }),
  signUp: vi.fn().mockResolvedValue({ user, error: null }),
  signOut: vi.fn().mockResolvedValue({ error: null }),
  isAuthenticated: !!user,
});

// Mock Analytics Context
export const createMockAnalyticsContext = () => ({
  trackEvent: vi.fn(),
  identifyUser: vi.fn(),
  trackPageView: vi.fn(),
  trackConversion: vi.fn(),
  trackWebVital: vi.fn(),
  resetUser: vi.fn(),
});

// Mock Supabase client
export const createMockSupabaseClient = () => ({
  auth: {
    getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
  },
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn().mockResolvedValue({ data: null, error: null }),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      })),
      order: vi.fn(() => ({
        limit: vi.fn().mockResolvedValue({ data: [], error: null }),
      })),
    })),
    insert: vi.fn().mockResolvedValue({ data: null, error: null }),
    update: vi.fn(() => ({
      eq: vi.fn().mockResolvedValue({ data: null, error: null }),
    })),
    delete: vi.fn(() => ({
      eq: vi.fn().mockResolvedValue({ data: null, error: null }),
    })),
  })),
  rpc: vi.fn().mockResolvedValue({ data: null, error: null }),
});

// Test fixtures for common data
export const testFixtures = {
  qrCode: {
    valid: {
      id: 'qr-123',
      code: 'abc123def456',
      business_id: 'business-123',
      points_value: 100,
      is_active: true,
      scan_limit: 10,
      current_scans: 0,
      expires_at: new Date(Date.now() + 86400000).toISOString(), // 24 hours from now
    },
    expired: {
      id: 'qr-expired',
      code: 'expired123',
      business_id: 'business-123',
      points_value: 50,
      is_active: true,
      scan_limit: 10,
      current_scans: 0,
      expires_at: new Date(Date.now() - 86400000).toISOString(), // 24 hours ago
    },
    maxScans: {
      id: 'qr-maxed',
      code: 'maxed123',
      business_id: 'business-123',
      points_value: 75,
      is_active: true,
      scan_limit: 5,
      current_scans: 5,
      expires_at: new Date(Date.now() + 86400000).toISOString(),
    },
  },
  business: {
    verified: {
      id: 'business-123',
      name: 'Test Business',
      description: 'A test business for testing',
      category: 'Restaurant',
      is_verified: true,
      owner_id: mockUsers.businessOwner.id,
    },
    unverified: {
      id: 'business-456',
      name: 'Unverified Business',
      description: 'Not yet verified',
      category: 'Retail',
      is_verified: false,
      owner_id: 'other-owner-id',
    },
  },
  loyaltyPoints: {
    bronze: { total_points: 500, tier: 'Bronze' },
    silver: { total_points: 1500, tier: 'Silver' },
    gold: { total_points: 3500, tier: 'Gold' },
    platinum: { total_points: 7500, tier: 'Platinum' },
  },
};

interface TestProvidersProps {
  children: ReactNode;
  queryClient?: QueryClient;
}

/**
 * Wrapper component that provides all necessary contexts for testing
 */
export const TestProviders: React.FC<TestProvidersProps> = ({
  children,
  queryClient = createTestQueryClient(),
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

/**
 * Custom render function that wraps component with test providers
 */
export const renderWithProviders = (
  ui: React.ReactElement,
  options?: { queryClient?: QueryClient }
) => {
  const { render } = require('@testing-library/react');
  const queryClient = options?.queryClient || createTestQueryClient();
  
  return {
    ...render(
      <TestProviders queryClient={queryClient}>
        {ui}
      </TestProviders>
    ),
    queryClient,
  };
};

export default TestProviders;
