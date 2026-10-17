import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import RecordReview from '../pages/health/workspace/RecordReview';

const invoke = vi.hoisted(() => vi.fn());
vi.mock('@/integrations/supabase/client', () => ({ supabase: { functions: { invoke } } }));
vi.mock('@/pages/health/workspace/hc', () => ({ useRows: (table: string) => ({ loading: false, reload: vi.fn(), rows: table === 'hc_documents' ? [{ id: 'doc-1', file_name: 'Fictional CME case', pages: 6, status: 'draft_ready' }] : table === 'hc_reviews' ? [{ id: 'review-1', document_id: 'doc-1', created_at: '2026-10-17T02:00:00Z', result: { sample_case_id: 'fictional-cme-v1', findings: [{ category: 'timeline', date: '2025-01-10', finding: 'Prior symptoms recorded', sources: [{ page: 1, quote: 'Intermittent low back pain documented.' }] }], source_pages: [{ page: 1, file: '01_Pre-incident.txt', text: 'FICTIONAL SAMPLE — Intermittent low back pain documented.' }], questions_for_exam: [], report_outline: [] } }] : [] }) }));

describe('source-linked review interactions', () => {
  it('opens the cited source record instead of an unrelated page', () => {
    render(<MemoryRouter><RecordReview clinicId="clinic-1" clinicRole="staff" /></MemoryRouter>);
    fireEvent.click(screen.getByRole('button', { name: /Fictional CME case/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Source · page 1' }));
    expect(screen.getByRole('region', { name: 'Source page' })).toHaveTextContent('FICTIONAL SAMPLE — Intermittent low back pain documented.');
  });
});