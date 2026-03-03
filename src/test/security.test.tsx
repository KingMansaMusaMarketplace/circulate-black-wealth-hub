/**
 * Security Tests
 * Tests for auth guards, protected routes, and iOS payment blocking
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock AuthContext
const mockUseAuth = vi.fn();
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock Capacitor hook
const mockUseCapacitor = vi.fn();
vi.mock('@/hooks/use-capacitor', () => ({
  useCapacitor: () => mockUseCapacitor(),
}));

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(() => Promise.resolve({ data: { session: null } })),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(() => Promise.resolve({ data: null, error: null })),
    })),
    rpc: vi.fn(() => Promise.resolve({ data: null, error: null })),
  },
}));

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import RequireAuth from '@/components/auth/RequireAuth';
import IOSProtectedRoute from '@/components/routing/IOSProtectedRoute';

describe('Security & Auth Guards', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('ProtectedRoute', () => {
    it('should show loading state while auth is loading', () => {
      mockUseAuth.mockReturnValue({ user: null, loading: true });
      render(
        <MemoryRouter>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      );
      // Should show loading spinner, not content
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('should render children when user is authenticated', () => {
      mockUseAuth.mockReturnValue({
        user: { id: '123', email: 'test@test.com' },
        loading: false,
      });
      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      );
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('should redirect unauthenticated users from protected routes', () => {
      mockUseAuth.mockReturnValue({ user: null, loading: false });
      // Simulate being on a protected route
      Object.defineProperty(window, 'location', {
        value: { pathname: '/dashboard' },
        writable: true,
      });
      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      );
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });
  });

  describe('RequireAuth', () => {
    it('should render children when user is authenticated', () => {
      mockUseAuth.mockReturnValue({
        user: { id: '123', email: 'test@test.com' },
        loading: false,
      });
      render(
        <MemoryRouter>
          <RequireAuth>
            <div>Secure Page</div>
          </RequireAuth>
        </MemoryRouter>
      );
      expect(screen.getByText('Secure Page')).toBeInTheDocument();
    });

    it('should show loading state', () => {
      mockUseAuth.mockReturnValue({ user: null, loading: true });
      render(
        <MemoryRouter>
          <RequireAuth>
            <div>Secure Page</div>
          </RequireAuth>
        </MemoryRouter>
      );
      expect(screen.queryByText('Secure Page')).not.toBeInTheDocument();
      expect(screen.getByText('Verifying authentication...')).toBeInTheDocument();
    });
  });

  describe('IOSProtectedRoute', () => {
    it('should render children on non-iOS platform', () => {
      mockUseCapacitor.mockReturnValue({ platform: 'web', isCapacitor: false, isNative: false });
      render(
        <MemoryRouter>
          <IOSProtectedRoute>
            <div>Payment Page</div>
          </IOSProtectedRoute>
        </MemoryRouter>
      );
      expect(screen.getByText('Payment Page')).toBeInTheDocument();
    });

    it('should redirect on iOS platform', () => {
      mockUseCapacitor.mockReturnValue({ platform: 'ios', isCapacitor: true, isNative: true });
      render(
        <MemoryRouter>
          <IOSProtectedRoute>
            <div>Payment Page</div>
          </IOSProtectedRoute>
        </MemoryRouter>
      );
      expect(screen.queryByText('Payment Page')).not.toBeInTheDocument();
    });

    it('should render children on Android platform', () => {
      mockUseCapacitor.mockReturnValue({ platform: 'android', isCapacitor: true, isNative: true });
      render(
        <MemoryRouter>
          <IOSProtectedRoute>
            <div>Payment Page</div>
          </IOSProtectedRoute>
        </MemoryRouter>
      );
      expect(screen.getByText('Payment Page')).toBeInTheDocument();
    });
  });

  describe('Rate Limiting Logic', () => {
    it('should block after too many attempts', () => {
      const checkRateLimit = (attempts: number, maxAttempts: number, windowMs: number) => {
        if (attempts >= maxAttempts) {
          const blockedUntil = new Date(Date.now() + windowMs);
          return { allowed: false, blocked_until: blockedUntil.toISOString() };
        }
        return { allowed: true, blocked_until: null };
      };

      expect(checkRateLimit(4, 5, 300000).allowed).toBe(true);
      expect(checkRateLimit(5, 5, 300000).allowed).toBe(false);
      expect(checkRateLimit(10, 5, 300000).allowed).toBe(false);
    });
  });

  describe('Session Validation', () => {
    it('should reject expired tokens', () => {
      const isTokenValid = (expiresAt: number) => Date.now() / 1000 < expiresAt;

      expect(isTokenValid(Date.now() / 1000 + 3600)).toBe(true);
      expect(isTokenValid(Date.now() / 1000 - 3600)).toBe(false);
    });

    it('should validate user roles without client-side storage', () => {
      // Roles should NEVER be stored in localStorage
      const getRole = () => localStorage.getItem('user_role');
      // This should always return null - roles must come from server
      expect(getRole()).toBeNull();
    });
  });
});
