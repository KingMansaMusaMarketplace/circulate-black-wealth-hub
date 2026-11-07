import { describe, it, expect } from 'vitest';
import { isViewerEmailMismatch } from '@/pages/health/ApprovedViewer';

describe('isViewerEmailMismatch', () => {
  it('flags a different signed-in email than the approved viewing email', () => {
    expect(isViewerEmailMismatch('partner@1325.ai', 'thomas@1325.ai')).toBe(true);
  });
  it('treats the same email with different capitals as a match', () => {
    expect(isViewerEmailMismatch('Thomas@1325.AI', 'thomas@1325.ai')).toBe(false);
  });
  it('does not flag when either email is unknown', () => {
    expect(isViewerEmailMismatch(undefined, 'thomas@1325.ai')).toBe(false);
    expect(isViewerEmailMismatch('thomas@1325.ai', null)).toBe(false);
  });
});
