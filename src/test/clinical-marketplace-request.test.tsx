import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { FunctionsHttpError } from '@supabase/supabase-js';
import ClinicalMarketplacePage from '@/pages/health/ClinicalMarketplacePage';

const { invoke } = vi.hoisted(() => ({ invoke: vi.fn() }));
vi.mock('@/integrations/supabase/client', () => ({ supabase: { functions: { invoke } } }));
beforeEach(() => {
  invoke.mockReset();
  vi.mocked(window.matchMedia).mockImplementation(query => ({ matches: false, media: query, onchange: null, addListener: vi.fn(), removeListener: vi.fn(), addEventListener: vi.fn(), removeEventListener: vi.fn(), dispatchEvent: vi.fn() }));
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

function submit() {
  render(<MemoryRouter><HelmetProvider><ClinicalMarketplacePage /></HelmetProvider></MemoryRouter>);
  const form = screen.getByRole('button', { name: 'Request private preview' }).closest('form');
  if (!form) throw new Error('Preview request form is missing');
  const request = within(form);
  fireEvent.change(request.getByLabelText('Full name'), { target: { value: 'Sample Representative' } });
  fireEvent.change(request.getByLabelText('Clinic / hospital / organization'), { target: { value: 'Sample Clinic' } });
  fireEvent.change(request.getByLabelText('Your role'), { target: { value: 'Hospital Leadership' } });
  fireEvent.change(request.getByLabelText('Work email'), { target: { value: 'sample@example.invalid' } });
  fireEvent.change(request.getByLabelText('Phone'), { target: { value: '5550101234' } });
  fireEvent.click(request.getByRole('checkbox'));
  fireEvent.click(request.getByRole('button', { name: 'Request private preview' }));
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