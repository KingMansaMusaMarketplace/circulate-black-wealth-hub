// Ask Kayla "Read answers aloud": when on, each new finished answer is spoken; when off, nothing is spoken;
// answers already on screen are not re-read when the doctor turns it on.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AskKayla, { spokenText } from '@/pages/health/AskKayla';

type Msg = { id: string; role: 'user' | 'assistant'; parts: Array<{ type: string; text?: string }> };
const state: { messages: Msg[]; status: string } = { messages: [], status: 'ready' };
vi.mock('@/pages/health/ClinicalHelpConversation', () => ({ useClinicalHelpConversation: () => ({ ...state, problem: '', ask: vi.fn(), clear: vi.fn(), previousTopics: () => [] }) }));
vi.mock('@/pages/health/workspace/DictationButton', () => ({ default: () => null }));

const answer = (id: string, text: string): Msg => ({ id, role: 'assistant', parts: [{ type: 'text', text }, { type: 'data-receipt' }] });
const spoken: string[] = [];
const view = () => <MemoryRouter><AskKayla surface="workspace" clinicId="11111111-1111-4111-8111-111111111111" onNavigate={vi.fn()} /></MemoryRouter>;

beforeEach(() => {
  spoken.length = 0; state.messages = []; state.status = 'ready';
  class Utterance { text: string; volume = 1; lang = ''; voice: unknown = null; onend: (() => void) | null = null; onerror: (() => void) | null = null; constructor(t: string) { this.text = t; } }
  vi.stubGlobal('SpeechSynthesisUtterance', Utterance);
  Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: { speak: (u: Utterance) => { if (u.volume > 0) spoken.push(u.text); }, cancel: vi.fn(), getVoices: () => [] } });
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe('Ask Kayla reads answers aloud', () => {
  it('speaks each new answer after the doctor turns it on', () => {
    const { rerender } = render(view());
    fireEvent.click(screen.getByRole('button', { name: /Read answers aloud/ }));
    state.messages = [answer('a1', 'Press Speak to dictate a note.')];
    rerender(view());
    expect(spoken).toEqual(['Press Speak to dictate a note.']);
  });

  it('stays silent when it is off', () => {
    const { rerender } = render(view());
    state.messages = [answer('a1', 'Press Speak to dictate a note.')];
    rerender(view());
    expect(spoken).toEqual([]);
  });

  it('does not re-read an answer already on screen when turned on', () => {
    state.messages = [answer('a1', 'Old answer.')];
    const { rerender } = render(view());
    fireEvent.click(screen.getByRole('button', { name: /Read answers aloud/ }));
    expect(spoken).toEqual([]);
    state.messages = [...state.messages, answer('a2', 'New answer.')];
    rerender(view());
    expect(spoken).toEqual(['New answer.']);
  });

  it('waits until the answer is finished before speaking', () => {
    const { rerender } = render(view());
    fireEvent.click(screen.getByRole('button', { name: /Read answers aloud/ }));
    state.status = 'streaming'; state.messages = [answer('a1', 'Half an ans')];
    rerender(view());
    expect(spoken).toEqual([]);
    state.status = 'ready'; state.messages = [answer('a1', 'Half an answer, now complete.')];
    rerender(view());
    expect(spoken).toEqual(['Half an answer, now complete.']);
  });

  it('says the brand the approved way and skips formatting symbols', () => {
    expect(spokenText('**Welcome** to 1325.AI — see [the guide](https://health.1325.ai)')).toBe('Welcome to thirteen twenty-five dot A I — see the guide');
  });
});
