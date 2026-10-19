import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AskKayla from '@/pages/health/AskKayla';
import { HELP_POLICY, PRODUCT_HELP, resolveHelpTarget } from '@/pages/health/product-help';
import { narrationCatalog } from '@/pages/health/clinical-narration';

afterEach(cleanup);
describe('clinical product guidance boundaries', () => {
  it('covers every demo and clinic navigation destination without invented tabs', () => {
    const demo = ['doctor-day','sample-chart','medication-review','data-explorer','dashboard','inbox','patients','labs','rx','video','portal','cme','rpm','careplans','voice','referrals','auth','billing','reliability','evaluation','revenue','impact','specialties','quality','interop','audit','compliance'];
    const workspace = ['doctor-day','sample-chart','medication-review','data-explorer','connections','portal','intake','dashboard','patients','schedule','prep','chronology','review','notes','care','doccheck','auth','impact','specialties','billing','reliability','evaluation','quality','team'];
    expect(new Set(PRODUCT_HELP.map(item => item.demo).filter(value => value && !value.startsWith('/')))).toEqual(new Set(demo));
    expect(new Set(PRODUCT_HELP.map(item => item.workspace).filter(value => value && !value.startsWith('/')))).toEqual(new Set(workspace));
  });
  it('does not accept patient questions, microphone input, execute actions or persist questions', () => {
    expect(HELP_POLICY).toEqual({ acceptsPatientText: false, microphoneInput: false, performsClinicalActions: false, persistsQuestions: false });
    render(<MemoryRouter><AskKayla surface="demo" onNavigate={vi.fn()} /></MemoryRouter>);
    expect(screen.queryByRole('textbox')).toBeNull();
  });
  it('resolves only known surface-specific navigation', () => {
    expect(resolveHelpTarget('review', 'demo')).toBe('cme');
    expect(resolveHelpTarget('review', 'workspace')).toBe('review');
    expect(resolveHelpTarget('notes', 'demo')).toBeUndefined();
    expect(resolveHelpTarget('notes', 'workspace')).toBe('notes');
    expect(resolveHelpTarget('unknown', 'workspace')).toBeUndefined();
  });
  it('uses available prerecorded clips rather than creating a second voice engine', () => {
    const clips = new Set(narrationCatalog().map(clip => clip.id));
    for (const topic of PRODUCT_HELP) expect(clips.has(topic.narration)).toBe(true);
  });
  it('opens sample note-taking only after an explicit navigation action', () => {
    const navigate = vi.fn();
    render(<MemoryRouter><AskKayla surface="workspace" onNavigate={navigate} /></MemoryRouter>);
    fireEvent.click(screen.getByRole('button', { name: 'Records & documentation' }));
    fireEvent.click(screen.getByRole('button', { name: 'How do I create a source-linked note?' }));
    expect(navigate).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Open related screen' }));
    expect(navigate).toHaveBeenCalledExactlyOnceWith('notes');
  });
});