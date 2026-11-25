import { describe, expect, it } from 'vitest';
import { videoPermission } from '../../supabase/functions/health-training-video/rules';

describe('approval-only training video', () => {
  it('refuses a doctor without active approval', () => {
    expect(videoPermission('watch', false, null).allowed).toBe(false);
  });
  it('allows an approved viewer only within their remaining viewing time', () => {
    expect(videoPermission('watch', false, { ok: true, remaining_ms: 45000 })).toEqual({ allowed: true, ttl: 45 });
  });
  it('refuses expired viewing', () => {
    expect(videoPermission('watch', false, { ok: true, remaining_ms: 0 }).allowed).toBe(false);
  });
  it('never permits an approved doctor to replace the video', () => {
    expect(videoPermission('upload', false, { ok: true, remaining_ms: 2400000 }).allowed).toBe(false);
  });
  it('permits a server-verified administrator to upload', () => {
    expect(videoPermission('upload', true, null).allowed).toBe(true);
  });
  it('caps playback links at ten minutes even for a longer approval', () => {
    expect(videoPermission('watch', false, { ok: true, remaining_ms: 2400000 }).ttl).toBe(600);
  });
});