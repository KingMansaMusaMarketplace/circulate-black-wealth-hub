import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import ClinicIntake from '../pages/health/workspace/ClinicIntake';

vi.mock('@/pages/health/workspace/PilotReadiness', () => ({ default: () => null }));
afterEach(cleanup);
describe('clinic intake upload permissions', () => {
  it('does not accept agreement or CME files from signed-out visitors', () => {
    const { container } = render(<MemoryRouter><ClinicIntake /></MemoryRouter>);
    expect(screen.getByRole('button', { name: 'Signed BAA upload locked' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'CME file upload locked' })).toBeDisabled();
    expect(container.querySelector('input[type="file"]')).toBeNull();
  });
  it('does not grant uploads to a registered clinic owner', () => {
    const { container } = render(<MemoryRouter><ClinicIntake clinicId="clinic-1" clinicName="Fictional Clinic" clinicRole="owner" signedIn /></MemoryRouter>);
    expect(screen.getByRole('button', { name: 'Signed BAA upload locked' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'CME file upload locked' })).toBeDisabled();
    expect(container.querySelector('input[type="file"]')).toBeNull();
  });
});