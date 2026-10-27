import React, { lazy, Suspense } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';

vi.mock('@/hooks/use-capacitor', () => ({ useCapacitor: () => ({ isNative: false }) }));
vi.mock('@/components/navbar/Navbar', () => ({ default: () => {
  const navigate = useNavigate();
  return <button onClick={() => navigate('/about-1325')}>Navigate during loading</button>;
} }));
vi.mock('@/components/Footer', () => ({ default: () => null }));
vi.mock('@/components/mobile/BottomTabBar', () => ({ default: () => null }));
vi.mock('@/components/ui/BackToButton', () => ({ default: () => null }));
vi.mock('@/components/homepage/HolidayAnnouncementBar', () => ({ default: () => null }));

describe('navigation while a page is still loading', () => {
  it('can leave an unresolved lazy route using the shared navigation', async () => {
    const PendingPage = lazy(() => new Promise<{ default: React.ComponentType }>(() => {}));
    const reachedDestination = vi.fn();
    function Destination() {
      React.useEffect(() => { reachedDestination(); }, []);
      return null;
    }
    render(<MemoryRouter initialEntries={['/contact']}>
      <Layout><Suspense fallback={null}><Routes>
        <Route path="/contact" element={<PendingPage />} />
        <Route path="/about-1325" element={<Destination />} />
      </Routes></Suspense></Layout>
    </MemoryRouter>);
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Navigate during loading' })); });
    expect(reachedDestination).toHaveBeenCalledTimes(1);
  });
});