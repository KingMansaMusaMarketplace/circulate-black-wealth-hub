import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// Deployment contract checks, not authenticated database execution.
const sql = readFileSync('supabase/migrations/20261018232142_93791a60-a5a1-483c-aa22-2d1f6cd20ff1.sql', 'utf8');
describe('clinical registration migration safety contract', () => {
  it('guards self-demotion before the membership update', () => {
    const guard = sql.indexOf('IF target=auth.uid()');
    const update = sql.indexOf('INSERT INTO public.hc_members(clinic_id,user_id,role,email) VALUES (_clinic');
    expect(guard).toBeGreaterThan(-1);
    expect(guard).toBeLessThan(update);
  });
  it('protects existing owner memberships at the conflict update', () => {
    expect(sql).toMatch(/DO UPDATE SET role=EXCLUDED\.role WHERE hc_members\.role <> 'owner' RETURNING id INTO saved/);
    expect(sql).toMatch(/IF saved IS NULL THEN RAISE EXCEPTION/);
    expect(sql).toContain('created_by=target');
  });
  it('seeds no medicines, dated events, appointments or billing records', () => {
    const seed = sql.slice(sql.indexOf('CREATE OR REPLACE FUNCTION public.hc_create_clinic'));
    const tables = [...seed.matchAll(/INSERT INTO public\.(\w+)/g)].map(match => match[1]);
    expect(tables).toEqual(['hc_clinics', 'hc_members', 'hc_patients']);
    expect(seed.match(/'Unknown','Source: visit-/g)).toHaveLength(3);
    expect(seed).not.toMatch(/current_date|date_trunc|'None known'/);
  });
});