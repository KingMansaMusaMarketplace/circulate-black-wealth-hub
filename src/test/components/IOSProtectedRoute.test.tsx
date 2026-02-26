import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import IOSProtectedRoute from '@/components/routing/IOSProtectedRoute';

// Mock the useCapacitor hook
const mockUseCapacitor = vi.fn();
vi.mock('@/hooks/use-capacitor', () => ({
  useCapacitor: () => mockUseCapacitor(),
}));

const TestChild = () => <div data-testid="protected-content">Protected Content</div>;

describe('IOSProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders children on web platform', () => {
    mockUseCapacitor.mockReturnValue({ isCapacitor: false, platform: 'web', isNative: false });

    render(
      <MemoryRouter>
        <IOSProtectedRoute>
          <TestChild />
        </IOSProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });

  it('renders children on Android platform', () => {
    mockUseCapacitor.mockReturnValue({ isCapacitor: true, platform: 'android', isNative: true });

    render(
      <MemoryRouter>
        <IOSProtectedRoute>
          <TestChild />
        </IOSProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });

  it('redirects on iOS platform', () => {
    mockUseCapacitor.mockReturnValue({ isCapacitor: true, platform: 'ios', isNative: true });

    render(
      <MemoryRouter initialEntries={['/subscription']}>
        <IOSProtectedRoute>
          <TestChild />
        </IOSProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('redirects to custom path on iOS', () => {
    mockUseCapacitor.mockReturnValue({ isCapacitor: true, platform: 'ios', isNative: true });

    render(
      <MemoryRouter initialEntries={['/subscription']}>
        <IOSProtectedRoute redirectTo="/home">
          <TestChild />
        </IOSProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });
});
