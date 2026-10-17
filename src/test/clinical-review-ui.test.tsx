import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import RecordReview from '../pages/health/workspace/RecordReview';

const invoke = vi.hoisted(() => vi.fn());
vi.mock('@/integrations/supabase/client', () => ({ supabase: { functions: { invoke } } }));
vi.mock('@/pages/health/workspace/hc', () => ({ useRows: (table: string) => ({ loading: false, reload: vi.fn(), rows: table === 'hc_documents' ? [{ id: 'doc-1', file_name: 'Fictional CME case', pages: 6, status: 'draft_ready' }] : table === 'hc_reviews' ? [{ id: 'review-1', document_id: 'doc-1', created_at: '2026-10-17T02:00:00Z', result: { sample_case_id: 'fictional-cme-v1', findings: [{ category: 'timeline', date: '2025-01-10', finding: 'Prior symptoms recorded', sources: [{ page: 1, quote: 'Intermittent low back pain documented.' }] }], source_pages: [{ page: 1, file: '01_Pre-incident.txt', text: 'FICTIONAL SAMPLE — Intermittent low back pain documented.' }], questions_for_exam: [], report_outline: [] } }] : [] }) }));

describe('source-linked review interactions', () => {
  afterEach(() => { cleanup(); invoke.mockReset(); });
  it('does not read case data or offer decisions to a non-clinic role', () => {
    render(<MemoryRouter><RecordReview clinicId="clinic-1" clinicRole="customer" /></MemoryRouter>);
    expect(screen.queryByRole('button', { name: /Fictional CME case/ })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Accept sample draft' })).toBeNull();
    expect(invoke).not.toHaveBeenCalled();
  });
  it('opens the cited source record instead of an unrelated page', () => {
    render(<MemoryRouter><RecordReview clinicId="clinic-1" clinicRole="staff" /></MemoryRouter>);
    fireEvent.click(screen.getByRole('button', { name: /Fictional CME case/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Source · page 1' }));
    expect(screen.getByRole('region', { name: 'Source page' })).toHaveTextContent('FICTIONAL SAMPLE — Intermittent low back pain documented.');
    expect(screen.queryByRole('button', { name: 'Accept sample draft' })).toBeNull();
  });
  it('sends a doctor decision for the selected clinic review', async () => {
    invoke.mockResolvedValue({ data: {}, error: null });
    render(<MemoryRouter><RecordReview clinicId="clinic-1" clinicRole="doctor" /></MemoryRouter>);
    fireEvent.click(screen.getByRole('button', { name: /Fictional CME case/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Accept sample draft' }));
    await waitFor(() => expect(invoke).toHaveBeenCalledWith('health-kayla-review', { body: { action: 'decision', review_id: 'review-1', decision: 'accepted' } }));
  });
});