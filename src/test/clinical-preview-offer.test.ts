import { describe, expect, it } from 'vitest';
import { getClinicalPreviewOffer } from '@/pages/health/preview-offer';

describe('clinical preview offer', () => {
  it('has no invented price or active checkout in any country', () => {
    for (const country of ['US', 'GB', 'NG', 'JM', undefined]) {
      expect(getClinicalPreviewOffer(country).price).toBeNull();
      expect(getClinicalPreviewOffer(country).checkoutEnabled).toBe(false);
    }
  });
  it('requires owner approval before payment', () => {
    expect(getClinicalPreviewOffer().approvalRequired).toBe(true);
    expect(getClinicalPreviewOffer().paymentSequence).toBe('after-approval');
  });
});