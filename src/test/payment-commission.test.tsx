import { describe, it, expect } from 'vitest';

// Commission constants (mirrors actual business logic)
const PLATFORM_COMMISSION_RATE = 0.075; // 7.5%
const AGENT_COMMISSION_RATE = 0.10; // 10% of platform commission
const MIN_COMMISSION = 0.50; // Minimum $0.50 commission

// Commission calculation functions
function calculatePlatformCommission(transactionAmount: number): number {
  return Math.round(transactionAmount * PLATFORM_COMMISSION_RATE * 100) / 100;
}

function calculateBusinessPayout(transactionAmount: number): number {
  const commission = calculatePlatformCommission(transactionAmount);
  return Math.round((transactionAmount - commission) * 100) / 100;
}

function calculateAgentCommission(platformCommission: number): number {
  const agentAmount = platformCommission * AGENT_COMMISSION_RATE;
  return Math.round(Math.max(agentAmount, MIN_COMMISSION) * 100) / 100;
}

function prorateAmount(
  fullAmount: number,
  daysUsed: number,
  totalDays: number
): number {
  if (totalDays <= 0) return 0;
  const prorated = (fullAmount / totalDays) * daysUsed;
  return Math.round(prorated * 100) / 100;
}

function calculateRefundAmount(
  originalAmount: number,
  daysUsed: number,
  totalDays: number
): number {
  const usedAmount = prorateAmount(originalAmount, daysUsed, totalDays);
  return Math.round((originalAmount - usedAmount) * 100) / 100;
}

interface CommissionBreakdown {
  transactionAmount: number;
  platformCommission: number;
  businessPayout: number;
  agentCommission: number;
}

function getFullCommissionBreakdown(transactionAmount: number): CommissionBreakdown {
  const platformCommission = calculatePlatformCommission(transactionAmount);
  const businessPayout = calculateBusinessPayout(transactionAmount);
  const agentCommission = calculateAgentCommission(platformCommission);

  return {
    transactionAmount,
    platformCommission,
    businessPayout,
    agentCommission,
  };
}

describe('Payment & Commission System', () => {
  describe('Platform Commission (7.5%)', () => {
    it('should calculate 7.5% commission correctly', () => {
      expect(calculatePlatformCommission(100)).toBe(7.50);
      expect(calculatePlatformCommission(1000)).toBe(75.00);
      expect(calculatePlatformCommission(50)).toBe(3.75);
    });

    it('should round to 2 decimal places', () => {
      // $33.33 * 7.5% = $2.49975 → $2.50
      expect(calculatePlatformCommission(33.33)).toBe(2.50);
      // $66.66 * 7.5% = $4.9995 → $5.00
      expect(calculatePlatformCommission(66.66)).toBe(5.00);
    });

    it('should handle small amounts', () => {
      expect(calculatePlatformCommission(1)).toBe(0.08);
      expect(calculatePlatformCommission(0.50)).toBe(0.04);
    });

    it('should handle zero amount', () => {
      expect(calculatePlatformCommission(0)).toBe(0);
    });

    it('should handle large amounts', () => {
      expect(calculatePlatformCommission(10000)).toBe(750);
      expect(calculatePlatformCommission(100000)).toBe(7500);
    });
  });

  describe('Business Payout Calculation', () => {
    it('should subtract commission from transaction amount', () => {
      expect(calculateBusinessPayout(100)).toBe(92.50); // 100 - 7.50
      expect(calculateBusinessPayout(1000)).toBe(925.00); // 1000 - 75
    });

    it('should be exactly transaction amount minus commission', () => {
      const amounts = [50, 100, 250, 500, 1000, 5000];
      amounts.forEach(amount => {
        const commission = calculatePlatformCommission(amount);
        const payout = calculateBusinessPayout(amount);
        expect(payout).toBe(Math.round((amount - commission) * 100) / 100);
      });
    });

    it('should handle edge cases', () => {
      expect(calculateBusinessPayout(0)).toBe(0);
      expect(calculateBusinessPayout(1)).toBe(0.92);
    });
  });

  describe('Agent Commission (10% of Platform)', () => {
    it('should calculate 10% of platform commission', () => {
      // $100 transaction → $7.50 platform → $0.75 agent
      const platformComm = calculatePlatformCommission(100);
      expect(calculateAgentCommission(platformComm)).toBe(0.75);
    });

    it('should apply minimum commission of $0.50', () => {
      // Small platform commission should still yield $0.50
      expect(calculateAgentCommission(2)).toBe(0.50); // 2 * 10% = 0.20 → min $0.50
      expect(calculateAgentCommission(4)).toBe(0.50); // 4 * 10% = 0.40 → min $0.50
      expect(calculateAgentCommission(5)).toBe(0.50); // 5 * 10% = 0.50 → exactly min
    });

    it('should exceed minimum for larger commissions', () => {
      expect(calculateAgentCommission(10)).toBe(1.00); // 10 * 10% = 1.00
      expect(calculateAgentCommission(75)).toBe(7.50); // 75 * 10% = 7.50
    });
  });

  describe('Full Commission Breakdown', () => {
    it('should provide complete breakdown for $100 transaction', () => {
      const breakdown = getFullCommissionBreakdown(100);
      
      expect(breakdown.transactionAmount).toBe(100);
      expect(breakdown.platformCommission).toBe(7.50);
      expect(breakdown.businessPayout).toBe(92.50);
      expect(breakdown.agentCommission).toBe(0.75);
    });

    it('should provide complete breakdown for $1000 transaction', () => {
      const breakdown = getFullCommissionBreakdown(1000);
      
      expect(breakdown.transactionAmount).toBe(1000);
      expect(breakdown.platformCommission).toBe(75);
      expect(breakdown.businessPayout).toBe(925);
      expect(breakdown.agentCommission).toBe(7.50);
    });

    it('should verify all parts sum correctly', () => {
      const amounts = [25, 50, 100, 250, 500, 1000, 2500, 5000, 10000];
      
      amounts.forEach(amount => {
        const breakdown = getFullCommissionBreakdown(amount);
        const sum = breakdown.businessPayout + breakdown.platformCommission;
        expect(sum).toBe(amount);
      });
    });
  });

  describe('Proration Logic', () => {
    it('should calculate prorated amount correctly', () => {
      // Full month subscription
      expect(prorateAmount(30, 30, 30)).toBe(30);
      
      // Half month
      expect(prorateAmount(30, 15, 30)).toBe(15);
      
      // One day of 30
      expect(prorateAmount(30, 1, 30)).toBe(1);
    });

    it('should handle different billing periods', () => {
      // Annual subscription, used 6 months
      expect(prorateAmount(120, 6, 12)).toBe(60);
      
      // Weekly, used 3 days
      expect(prorateAmount(7, 3, 7)).toBe(3);
    });

    it('should handle zero days used', () => {
      expect(prorateAmount(100, 0, 30)).toBe(0);
    });

    it('should handle zero total days (edge case)', () => {
      expect(prorateAmount(100, 10, 0)).toBe(0);
    });

    it('should round to 2 decimal places', () => {
      // 100 / 3 = 33.333...
      expect(prorateAmount(100, 1, 3)).toBe(33.33);
    });
  });

  describe('Refund Calculation', () => {
    it('should calculate refund for unused portion', () => {
      // $30 subscription, used 10 of 30 days → $20 refund
      expect(calculateRefundAmount(30, 10, 30)).toBe(20);
      
      // $100 subscription, used 1 of 30 days → ~$96.67 refund
      expect(calculateRefundAmount(100, 1, 30)).toBe(96.67);
    });

    it('should return zero refund when fully used', () => {
      expect(calculateRefundAmount(100, 30, 30)).toBe(0);
    });

    it('should return full amount when nothing used', () => {
      expect(calculateRefundAmount(100, 0, 30)).toBe(100);
    });

    it('should handle annual subscription refunds', () => {
      // Annual $120 subscription, canceled after 3 months
      expect(calculateRefundAmount(120, 3, 12)).toBe(90);
    });
  });

  describe('Real-World Scenarios', () => {
    it('should handle a typical restaurant transaction', () => {
      // Customer pays $47.50 for dinner
      const breakdown = getFullCommissionBreakdown(47.50);
      
      expect(breakdown.platformCommission).toBe(3.56);
      expect(breakdown.businessPayout).toBe(43.94);
      // Agent commission on $3.56: 0.356 → min $0.50
      expect(breakdown.agentCommission).toBe(0.50);
    });

    it('should handle a large catering order', () => {
      // $2,500 catering order
      const breakdown = getFullCommissionBreakdown(2500);
      
      expect(breakdown.platformCommission).toBe(187.50);
      expect(breakdown.businessPayout).toBe(2312.50);
      expect(breakdown.agentCommission).toBe(18.75);
    });

    it('should handle monthly subscription refund mid-cycle', () => {
      // $99/month subscription, canceled on day 15 of 30
      const originalAmount = 99;
      const daysUsed = 15;
      const totalDays = 30;
      
      const refund = calculateRefundAmount(originalAmount, daysUsed, totalDays);
      expect(refund).toBe(49.50);
    });
  });
});
