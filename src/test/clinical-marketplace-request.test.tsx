import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { FunctionsHttpError } from '@supabase/supabase-js';
import ClinicalMarketplacePage from '@/pages/health/ClinicalMarketplacePage';

const { invoke } = vi.hoisted(() => ({ invoke: vi.fn() }));
vi.mock('@/integrations/supabase/client', () => ({ supabase: { functions: { invoke } } }));
beforeEach(() => invoke.mockReset());
afterEach(cleanup);

function submit() {
  render(<MemoryRouter><HelmetProvider><ClinicalMarketplacePage /></HelmetProvider></MemoryRouter>);
  fireEvent.change(screen.getByLabelText('Full name'), { target: { value: 'Sample Representative' } });
  fireEvent.change(screen.getByLabelText('Clinic / hospital / organization'), { target: { value: 'Sample Clinic' } });
  fireEvent.change(screen.getByLabelText('Your role'), { target: { value: 'Hospital Leadership' } });
  fireEvent.change(screen.getByLabelText('Work email'), { target: { value: 'sample@example.invalid' } });
  fireEvent.change(screen.getByLabelText('Phone'), { target: { value: '5550101234' } });
  fireEvent.click(screen.getByRole('checkbox'));
  fireEvent.click(screen.getByRole('button', { name: 'Request private preview' }));
}

describe('marketplace preview requests', () => {
  it('submits only an access request, not payment or membership', async () => {
    invoke.mockResolvedValue({ data: { ok: true }, error: null });
    submit();
    await screen.findByRole('status');
    expect(invoke).toHaveBeenCalledExactlyOnceWith('health-access', { body: {
      action: 'request', full_name: 'Sample Representative', organization: 'Sample Clinic',
      role: 'Hospital Leadership', work_email: 'sample@example.invalid', phone: '5550101234', nda: true,
    } });
  });
  it('does not treat a rejected request as saved', async () => {
    invoke.mockResolvedValue({ data: null, error: new FunctionsHttpError(new Response(JSON.stringify({ error: 'Too many requests. Please try again tomorrow.' }), { status: 429 })) });
    submit();
    await screen.findByRole('alert');
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Request private preview' })).toBeEnabled();
  });
});