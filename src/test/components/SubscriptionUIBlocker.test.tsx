import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SubscriptionUIBlocker } from '@/components/subscription/SubscriptionUIBlocker';

// Mock platform utils
vi.mock('@/utils/platform-utils', () => ({
  shouldHideStripePayments: vi.fn(),
}));

import { shouldHideStripePayments } from '@/utils/platform-utils';

describe('SubscriptionUIBlocker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders children when not on iOS', () => {
    (shouldHideStripePayments as any).mockReturnValue(false);

    render(
      <SubscriptionUIBlocker>
        <div data-testid="subscription-ui">Subscription Plans</div>
      </SubscriptionUIBlocker>
    );

    expect(screen.getByTestId('subscription-ui')).toBeInTheDocument();
  });

  it('hides children on iOS', () => {
    (shouldHideStripePayments as any).mockReturnValue(true);

    render(
      <SubscriptionUIBlocker>
        <div data-testid="subscription-ui">Subscription Plans</div>
      </SubscriptionUIBlocker>
    );

    expect(screen.queryByTestId('subscription-ui')).not.toBeInTheDocument();
  });
});
