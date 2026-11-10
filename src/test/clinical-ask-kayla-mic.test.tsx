// Spoken Ask Kayla questions: microphone only in the clinic workspace, words fill the box
// (never auto-send), and the real-patient-detail rule still blocks sending.
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AskKayla from '@/pages/health/AskKayla';
import { KAYLA_QUESTION_MAX_SECONDS } from '@/lib/clinical/dictation';

const ask = vi.fn();
vi.mock('@/pages/health/ClinicalHelpConversation', () => ({ useClinicalHelpConversation: () => ({ messages: [], status: 'ready', problem: '', ask, clear: vi.fn(), previousTopics: () => [] }) }));

// Stand-in microphone: pressing it "hears" whatever the test sets in spoken.text.
const spoken = { text: '' };
const micProps: Array<Record<string, unknown>> = [];
vi.mock('@/pages/health/workspace/DictationButton', () => ({
  default: (props: { onText: (t: string) => void; purpose?: string; maxSeconds?: number }) => {
    micProps.push(props);
    return <button type="button" onClick={() => props.onText(spoken.text)}>Speak your question to Kayla</button>;
  },
}));

const CLINIC = '11111111-1111-4111-8111-111111111111';
const renderWorkspace = () => render(<MemoryRouter><AskKayla surface="workspace" clinicId={CLINIC} onNavigate={vi.fn()} /></MemoryRouter>);

afterEach(() => { cleanup(); ask.mockClear(); micProps.length = 0; });

describe('Ask Kayla microphone', () => {
  it('shows the microphone in the clinic workspace only, not on the public demo', () => {
    render(<MemoryRouter><AskKayla surface="demo" onNavigate={vi.fn()} /></MemoryRouter>);
    expect(screen.queryByRole('button', { name: 'Speak your question to Kayla' })).toBeNull();
    cleanup();
    renderWorkspace();
    expect(screen.getByRole('button', { name: 'Speak your question to Kayla' })).toBeTruthy();
  });

  it('limits each spoken question to 30 seconds', () => {
    expect(KAYLA_QUESTION_MAX_SECONDS).toBe(30);
    renderWorkspace();
    expect(micProps.at(-1)).toMatchObject({ purpose: 'question', maxSeconds: 30 });
  });

  it('puts spoken words in the question box without sending them', () => {
    renderWorkspace();
    spoken.text = 'How do I dictate a note?';
    fireEvent.click(screen.getByRole('button', { name: 'Speak your question to Kayla' }));
    expect((screen.getByRole('textbox', { name: 'Your product question' }) as HTMLTextAreaElement).value).toBe('How do I dictate a note?');
    expect(ask).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Ask Kayla' }));
    expect(ask).toHaveBeenCalledWith({ topics: ['notes'], intent: 'steps' }, 'workspace');
  });

  it('still refuses to send spoken patient details', () => {
    renderWorkspace();
    spoken.text = 'My patient Jane Smith has chest pain';
    fireEvent.click(screen.getByRole('button', { name: 'Speak your question to Kayla' }));
    fireEvent.click(screen.getByRole('button', { name: 'Ask Kayla' }));
    expect(ask).not.toHaveBeenCalled();
    expect(screen.getByRole('alert').textContent).toContain('This question was not sent');
  });
});
