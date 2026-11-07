import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ClinicSignIn, CreateSampleClinic } from '../pages/health/workspace/ClinicAccountForms';

const { signUp, register, resetPasswordForEmail } = vi.hoisted(() => ({ signUp: vi.fn(), register: vi.fn(), resetPasswordForEmail: vi.fn() }));
vi.mock('@/integrations/supabase/client', () => ({ supabase: { auth: { signUp, signInWithPassword: vi.fn(), resetPasswordForEmail } } }));
vi.mock('@/pages/health/workspace/clinic-registration', () => ({ registerSampleClinic: register }));
afterEach(() => { cleanup(); vi.resetAllMocks(); });
describe('clinic account journey', () => {
  it('waits for email confirmation without creating a clinic', async () => {
    signUp.mockResolvedValue({ data: { session: null }, error: null });
    render(<MemoryRouter><ClinicSignIn /></MemoryRouter>);
    fireEvent.click(screen.getByRole('button', { name: 'New here? Create an account' }));
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'clinic@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'fictional-test-password' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create account' }));
    await waitFor(() => expect(screen.getByRole('status')).toBeInTheDocument());
    expect(register).not.toHaveBeenCalled();
  });
  it('opens the exact clinic returned by the signed-in save', async () => {
    register.mockResolvedValue('clinic-saved');
    const onDone = vi.fn().mockResolvedValue(undefined);
    render(<CreateSampleClinic onDone={onDone} />);
    fireEvent.change(screen.getByLabelText('Clinic name'), { target: { value: 'Fictional Test Clinic' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create clinic & open workspace' }));
    await waitFor(() => expect(onDone).toHaveBeenCalledWith('clinic-saved'));
  });
  it('retries saved-clinic access without creating a duplicate after readback fails', async () => {
    register.mockResolvedValue('clinic-saved');
    const onDone = vi.fn().mockRejectedValueOnce(new Error('Access could not be confirmed')).mockResolvedValueOnce(undefined);
    render(<CreateSampleClinic onDone={onDone} />);
    fireEvent.change(screen.getByLabelText('Clinic name'), { target: { value: 'Fictional Test Clinic' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create clinic & open workspace' }));
    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: 'Retry opening saved clinic' }));
    await waitFor(() => expect(onDone).toHaveBeenCalledTimes(2));
    expect(register).toHaveBeenCalledTimes(1);
  });
  it('sends a password reset link to the typed email from the clinic sign-in', async () => {
    resetPasswordForEmail.mockResolvedValue({ error: null });
    render(<MemoryRouter><ClinicSignIn /></MemoryRouter>);
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'thomas@1325.ai' } });
    fireEvent.click(screen.getByRole('button', { name: 'Forgot password?' }));
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('thomas@1325.ai'));
    expect(resetPasswordForEmail).toHaveBeenCalledWith('thomas@1325.ai', expect.objectContaining({ redirectTo: expect.stringContaining('/reset-password') }));
  });
});
