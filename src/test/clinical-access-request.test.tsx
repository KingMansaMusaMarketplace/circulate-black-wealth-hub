import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { FunctionsHttpError } from '@supabase/supabase-js';
import HealthAccessGate from '@/pages/health/HealthAccessGate';

const { invoke } = vi.hoisted(() => ({ invoke: vi.fn() }));
vi.mock('@/integrations/supabase/client', () => ({ supabase: {
  auth: { getSession: vi.fn(async () => ({ data: { session: null } })) },
  functions: { invoke },
} }));
vi.mock('@/pages/health/ClinicalVoice', () => ({ ClinicalVoiceProvider: ({ children }: { children: React.ReactNode }) => children }));
vi.mock('@/pages/health/ClinicalHelpConversation', () => ({ ClinicalHelpConversationProvider: ({ children }: { children: React.ReactNode }) => children }));

beforeEach(() => { localStorage.clear(); invoke.mockReset(); });
afterEach(cleanup);

async function submitRequest() {
  render(<HelmetProvider><HealthAccessGate><p>Private content</p></HealthAccessGate></HelmetProvider>);
  await screen.findByRole('button', { name: 'Request private access' });
  fireEvent.change(screen.getByPlaceholderText('Full name *'), { target: { value: 'Fictional Visitor' } });
  fireEvent.change(screen.getByPlaceholderText('Clinic / hospital / organization *'), { target: { value: 'Fictional Organization' } });
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Investor' } });
  fireEvent.change(screen.getByPlaceholderText('Work email *'), { target: { value: 'visitor@example.invalid' } });
  fireEvent.change(screen.getByPlaceholderText('Phone *'), { target: { value: '5550101234' } });
  fireEvent.click(screen.getByRole('checkbox'));
  fireEvent.click(screen.getByRole('button', { name: 'Request private access' }));
}

describe('clinical access request outcomes', () => {
  it.each([
    [429, 'Too many requests. Please try again tomorrow.'],
    [500, 'Could not save your request.'],
    [400, 'Please fill every required field and accept the confidentiality terms.'],
  ])('shows the server rejection for HTTP %s without claiming receipt', async (status, error) => {
    invoke.mockResolvedValue({ data: null, error: new FunctionsHttpError(new Response(JSON.stringify({ error }), { status })) });
    await submitRequest();
    expect(await screen.findByText(error)).toBeInTheDocument();
    expect(screen.queryByText('Request received')).not.toBeInTheDocument();
    expect(screen.queryByText('Private content')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Request private access' })).toBeEnabled();
  });

  it('handles a non-JSON failure without crashing or claiming success', async () => {
    invoke.mockResolvedValue({ data: null, error: new FunctionsHttpError(new Response('Unavailable', { status: 503 })) });
    await submitRequest();
    expect(await screen.findByText('Your request could not be confirmed. Please try again.')).toBeInTheDocument();
    expect(screen.queryByText('Request received')).not.toBeInTheDocument();
  });

  it('confirms a saved request without granting private access', async () => {
    invoke.mockResolvedValue({ data: { ok: true }, error: null });
    await submitRequest();
    expect(await screen.findByText('Request received')).toBeInTheDocument();
    expect(screen.queryByText('Private content')).not.toBeInTheDocument();
    expect(invoke).toHaveBeenCalledExactlyOnceWith('health-access', { body: {
      action: 'request', full_name: 'Fictional Visitor', organization: 'Fictional Organization',
      role: 'Investor', work_email: 'visitor@example.invalid', phone: '5550101234', nda: true,
    } });
  });
});